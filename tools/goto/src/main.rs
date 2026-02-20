use anyhow::{bail, Context, Result};
use clap::{CommandFactory, Parser, Subcommand};
use directories::ProjectDirs;
use serde::Deserialize;
use shellexpand::full;
use std::{
    collections::{BTreeMap, BTreeSet},
    env, fs,
    io::Write,
    path::{Path, PathBuf},
};

const DEFAULT_CONFIG: &str = include_str!("../default_config.toml");
const ZSH_INTEGRATION: &str = include_str!("../shell/goto.zsh");
const ZSH_MARKER_START: &str = "# >>> goto integration (managed by goto) >>>";

#[derive(Parser)]
#[command(name = "goto")]
#[command(version)]
#[command(about = "Navigate to projects using namespace-based paths.")]
#[command(
    override_usage = "goto <namespace>/<path>\n    goto list [namespace]\n    goto setup\n    goto uninstall"
)]
#[command(allow_external_subcommands = true)]
struct Goto {
    #[command(subcommand)]
    command: Option<Command>,
}

#[derive(Subcommand)]
enum Command {
    /// List available namespaces and projects
    List {
        /// Optional namespace to scope the list
        #[arg(value_name = "NAMESPACE")]
        namespace: Option<String>,
    },

    /// Set up shell integration (zsh)
    Setup,
    /// Remove shell integration (zsh)
    Uninstall,

    /// Generate dynamic completions for the current target (internal)
    #[command(name = "__complete", hide = true)]
    CompleteTargets {
        /// Current word to complete
        #[arg(value_name = "PARTIAL")]
        partial: Option<String>,
    },

    #[command(external_subcommand)]
    External(Vec<String>),
}

fn print_help_with_setup_hint() {
    Goto::command().print_help().unwrap();
    println!();

    // Only show setup hint if not already configured
    let zshrc = zshrc_path().ok();
    let needs_setup = zshrc
        .and_then(|path| fs::read_to_string(path).ok())
        .map(|content| !content.contains(ZSH_MARKER_START))
        .unwrap_or(true);

    if needs_setup {
        println!("\x1b[1;33m⚠ Shell integration not detected\x1b[0m");
        println!();
        println!("Run \x1b[1mgoto setup\x1b[0m to enable:");
        println!("  • Automatic directory navigation (cd to resolved paths)");
        println!("  • Tab completion for namespaces and projects");
        println!();
        println!("Without setup, goto only prints paths to stdout.");
    }
}

fn main() -> Result<()> {
    let cli = Goto::parse();
    let namespaces = NamespaceMap::load()?;

    match cli.command {
        Some(Command::CompleteTargets { partial }) => {
            let entries = namespaces.complete(partial.as_deref().unwrap_or(""))?;
            for entry in entries {
                println!("{entry}");
            }
            Ok(())
        }
        Some(Command::List { namespace }) => {
            namespaces.list(namespace.as_deref())?;
            Ok(())
        }
        Some(Command::Setup) => setup_zsh(),
        Some(Command::Uninstall) => uninstall_zsh(),
        Some(Command::External(args)) => {
            let target = match args.as_slice() {
                [single] => single,
                [] => {
                    print_help_with_setup_hint();
                    return Ok(());
                }
                _ => bail!("expected a single target like <namespace> or <namespace>/<path>"),
            };
            let path = namespaces.resolve(target)?;
            println!("{}", path.display());
            Ok(())
        }
        None => {
            print_help_with_setup_hint();
            Ok(())
        }
    }
}

fn setup_zsh() -> Result<()> {
    let zshrc = zshrc_path()?;
    let existing = fs::read_to_string(&zshrc).unwrap_or_default();
    if existing.contains(ZSH_MARKER_START) {
        println!("goto already configured in {}", zshrc.display());
        return Ok(());
    }

    if let Some(parent) = zshrc.parent() {
        fs::create_dir_all(parent)?;
    }

    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&zshrc)?;
    if !existing.is_empty() && !existing.ends_with('\n') {
        writeln!(file)?;
    }
    let last_line_blank = existing
        .lines()
        .last()
        .map(|line| line.trim().is_empty())
        .unwrap_or(true);
    if !existing.is_empty() && !last_line_blank {
        writeln!(file)?;
    }
    writeln!(file, "{ZSH_INTEGRATION}")?;
    println!(
        "Added goto helper to {}. Restart your shell.",
        zshrc.display()
    );
    Ok(())
}

fn uninstall_zsh() -> Result<()> {
    let zshrc = zshrc_path()?;
    let existing = fs::read_to_string(&zshrc).unwrap_or_default();
    if !existing.contains(ZSH_MARKER_START) {
        println!("goto helper not found in {}", zshrc.display());
        return Ok(());
    }

    let mut output = Vec::new();
    let mut in_block = false;
    for line in existing.lines() {
        if line.trim_end() == ZSH_MARKER_START {
            in_block = true;
            continue;
        }
        if in_block {
            if line.trim_end() == "# <<< goto integration (managed by goto) <<<" {
                in_block = false;
            }
            continue;
        }
        output.push(line);
    }

    let mut rendered = output.join("\n");
    if !rendered.is_empty() {
        rendered.push('\n');
    }
    fs::write(&zshrc, rendered)?;
    println!("Removed goto helper from {}", zshrc.display());
    Ok(())
}

fn zshrc_path() -> Result<PathBuf> {
    let home = env::var_os("HOME")
        .or_else(|| env::var_os("USERPROFILE"))
        .map(PathBuf::from)
        .context("HOME is not set")?;
    let zdotdir = env::var_os("ZDOTDIR").map(PathBuf::from).unwrap_or(home);
    Ok(zdotdir.join(".zshrc"))
}

#[derive(Debug)]
struct NamespaceEntry {
    name: String,
    path: PathBuf,
    aliases: Vec<String>,
}

#[derive(Debug)]
struct NamespaceMap {
    primary: BTreeMap<String, NamespaceEntry>,
}

impl NamespaceMap {
    fn load() -> Result<Self> {
        let config_path = config_file();
        let raw = if config_path.exists() {
            fs::read_to_string(&config_path)
                .with_context(|| format!("failed to read {}", config_path.display()))?
        } else {
            DEFAULT_CONFIG.to_string()
        };

        let parsed: ConfigFile = toml::from_str(&raw).context("invalid config TOML")?;

        Ok(Self::from_defs(parsed.namespace))
    }

    fn resolve(&self, target: &str) -> Result<PathBuf> {
        let (namespace, remainder) = match target.split_once('/') {
            Some((ns, rest)) => (ns, Some(rest)),
            None => (target, None),
        };
        let entry = self.lookup_namespace(namespace)?;
        let mut candidate = entry.path.clone();
        if let Some(rest) = remainder {
            candidate = candidate.join(rest);
        }

        if candidate.exists() {
            Ok(candidate.canonicalize().unwrap_or(candidate))
        } else {
            bail!("path does not exist: {}", candidate.display());
        }
    }

    fn list(&self, namespace: Option<&str>) -> Result<()> {
        if let Some(ns) = namespace {
            let entry = self.lookup_namespace(ns)?;
            self.list_dir(&entry.name, &entry.path)?;
        } else {
            for entry in self.primary.values() {
                self.list_dir(&entry.name, &entry.path)?;
            }
        }
        Ok(())
    }

    fn list_dir(&self, namespace: &str, root: &Path) -> Result<()> {
        let mut entries = Vec::new();
        if root.exists() && root.is_dir() {
            for item in fs::read_dir(root)? {
                let entry = item?;
                if entry.file_type()?.is_dir() {
                    entries.push(entry.file_name().to_string_lossy().into_owned());
                }
            }
            entries.sort();
        }

        for child in &entries {
            println!("{}/{}", namespace, child);
        }

        if entries.is_empty() {
            println!("{}", namespace);
        }

        Ok(())
    }

    fn complete(&self, partial: &str) -> Result<Vec<String>> {
        let trimmed = partial.trim();
        if trimmed.is_empty() {
            return Ok(self.complete_namespaces(""));
        }

        if let Some((namespace, rest)) = trimmed.split_once('/') {
            let entry = match self.lookup_namespace(namespace) {
                Ok(entry) => entry,
                Err(_) => return Ok(Vec::new()),
            };
            return Ok(self.complete_namespace_path(entry, namespace, rest));
        }

        Ok(self.complete_namespaces(trimmed))
    }

    fn complete_namespaces(&self, prefix: &str) -> Vec<String> {
        let mut entries = BTreeSet::new();
        let needle = prefix.to_lowercase();
        for entry in self.primary.values() {
            for name in std::iter::once(&entry.name).chain(entry.aliases.iter()) {
                if needle.is_empty() || name.to_lowercase().starts_with(&needle) {
                    entries.insert(format!("{}/", name));
                }
            }
        }
        entries.into_iter().collect()
    }

    fn complete_namespace_path(
        &self,
        entry: &NamespaceEntry,
        namespace_input: &str,
        rest: &str,
    ) -> Vec<String> {
        let (dir_part, prefix) = if rest.is_empty() {
            (String::new(), String::new())
        } else if rest.ends_with('/') {
            (rest.trim_end_matches('/').to_string(), String::new())
        } else if let Some((parent, leaf)) = rest.rsplit_once('/') {
            (parent.to_string(), leaf.to_string())
        } else {
            (String::new(), rest.to_string())
        };

        let mut base = entry.path.clone();
        if !dir_part.is_empty() {
            base = base.join(&dir_part);
        }

        let mut entries = BTreeSet::new();
        if base.exists() && base.is_dir() {
            let needle = prefix.to_lowercase();
            if let Ok(read_dir) = fs::read_dir(&base) {
                for item in read_dir.flatten() {
                    if let Ok(file_type) = item.file_type() {
                        if !file_type.is_dir() {
                            continue;
                        }
                    }
                    let name = item.file_name().to_string_lossy().into_owned();
                    if !needle.is_empty() && !name.to_lowercase().starts_with(&needle) {
                        continue;
                    }
                    let mut candidate = String::new();
                    candidate.push_str(namespace_input);
                    candidate.push('/');
                    if !dir_part.is_empty() {
                        candidate.push_str(&dir_part);
                        candidate.push('/');
                    }
                    candidate.push_str(&name);
                    entries.insert(candidate);
                }
            }
        }

        entries.into_iter().collect()
    }

    fn lookup_namespace(&self, lookup: &str) -> Result<&NamespaceEntry> {
        let normalized = lookup.to_lowercase();
        if let Some(entry) = self.primary.get(&normalized) {
            return Ok(entry);
        }

        for entry in self.primary.values() {
            if entry
                .aliases
                .iter()
                .any(|alias| alias.eq_ignore_ascii_case(lookup))
            {
                return Ok(entry);
            }
        }

        bail!("unknown namespace: {}", lookup);
    }

    fn from_defs(defs: Vec<NamespaceDef>) -> Self {
        let mut primary = BTreeMap::new();
        for ns in defs {
            let entry = NamespaceEntry {
                name: ns.name.clone(),
                path: expand_path(&ns.path),
                aliases: ns.aliases.unwrap_or_default(),
            };
            primary.insert(ns.name.to_lowercase(), entry);
        }

        Self { primary }
    }
}

fn config_file() -> PathBuf {
    if let Some(dirs) = ProjectDirs::from("goto", "ItamiForge", "goto") {
        dirs.config_dir().join("config.toml")
    } else {
        PathBuf::from("goto-config.toml")
    }
}

fn expand_path(value: &str) -> PathBuf {
    let expanded = full(value).unwrap_or_else(|_| value.into());
    PathBuf::from(expanded.as_ref())
}

#[derive(Deserialize)]
struct ConfigFile {
    #[serde(rename = "namespace")]
    namespace: Vec<NamespaceDef>,
}

#[derive(Deserialize)]
struct NamespaceDef {
    name: String,
    path: String,
    aliases: Option<Vec<String>>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn resolves_alias_and_project() {
        let dir = tempdir().unwrap();
        fs::create_dir(dir.path().join("alpha")).unwrap();

        let defs = vec![NamespaceDef {
            name: "gh".to_string(),
            path: dir.path().to_string_lossy().into_owned(),
            aliases: Some(vec!["github".to_string()]),
        }];

        let map = NamespaceMap::from_defs(defs);
        let resolved = map.resolve("github/alpha").unwrap();
        assert!(resolved.ends_with("alpha"));
    }

    #[test]
    fn resolve_missing_namespace_errors() {
        let defs = vec![NamespaceDef {
            name: "gh".to_string(),
            path: "/tmp".to_string(),
            aliases: None,
        }];

        let map = NamespaceMap::from_defs(defs);
        let err = map.resolve("work").unwrap_err();
        assert!(err.to_string().contains("unknown namespace"));
    }
}
