use anyhow::{bail, Context, Result};
use clap::{ArgAction, CommandFactory, Parser, ValueEnum};
use clap_complete::{generate, shells::Shell as ClapShell};
use directories::ProjectDirs;
use serde::Deserialize;
use shellexpand::full;
use std::{
    collections::BTreeMap,
    fs, io,
    path::{Path, PathBuf},
};

const DEFAULT_CONFIG: &str = include_str!("../default_config.toml");

#[derive(Parser)]
#[command(name = "goto")]
#[command(version)]
#[command(about = "Navigate to projects using namespace-based paths.")]
struct Goto {
    /// Target in the format <namespace> or <namespace>/<path>
    #[arg(value_name = "TARGET")]
    target: Option<String>,

    /// List available namespaces and projects
    #[arg(long, action = ArgAction::SetTrue)]
    list: bool,

    /// Optional namespace to scope the list
    #[arg(long, value_name = "NAMESPACE")]
    namespace: Option<String>,

    /// Generate shell completion script
    #[arg(long, value_enum)]
    complete: Option<ShellVariant>,

    /// Print help
    #[arg(short, long)]
    help: bool,
}

#[derive(ValueEnum, Clone)]
enum ShellVariant {
    Bash,
    Zsh,
    Fish,
    PowerShell,
}

impl ShellVariant {
    fn to_clap_shell(&self) -> ClapShell {
        match self {
            ShellVariant::Bash => ClapShell::Bash,
            ShellVariant::Zsh => ClapShell::Zsh,
            ShellVariant::Fish => ClapShell::Fish,
            ShellVariant::PowerShell => ClapShell::PowerShell,
        }
    }
}

fn main() -> Result<()> {
    let cli = Goto::parse();
    let namespaces = NamespaceMap::load()?;

    // Handle completion first
    if let Some(shell) = cli.complete {
        let mut cmd = Goto::command();
        generate(shell.to_clap_shell(), &mut cmd, "goto", &mut io::stdout());
        return Ok(());
    }

    // Handle list
    if cli.list {
        namespaces.list(cli.namespace.as_deref())?;
        return Ok(());
    }

    // Handle target (resolve)
    if let Some(target) = cli.target {
        let path = namespaces.resolve(&target)?;
        println!("{}", path.display());
        return Ok(());
    }

    // No arguments provided, show help
    Goto::command().print_help()?;
    println!();
    Ok(())
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