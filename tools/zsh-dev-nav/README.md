# zsh-dev-nav

`zsh-dev-nav` keeps the `goto` experience you already know but powered by the new `devnav` CLI so it works across OSes and stays portable.

## Install

1. Install `devnav` (Rust):
   ```bash
   cargo install --path ../devnav
   ```
   Or use Homebrew/Scoop/winget packages once published.
2. Run the installer:
   ```bash
   ./install.sh
   source ~/.zshrc
   ```

`install.sh` just sources `dev.zsh`; `devnav` supplies the namespace data and completions so the script no longer hardcodes paths.

## Usage

```bash
goto gh/project
goto gh/project/src
```

Completions work the same way (`goto` + Tab) because `devnav complete --shell=zsh` is evaluated every time `dev.zsh` loads.

## Configuring namespaces

`devnav` reads `~/.config/devnav/config.toml`. Example:

```toml
[[namespace]]
name = "gh"
path = "~/Documents/GitHub"
aliases = ["github"]

[[namespace]]
name = "work"
path = "~/Projects"
```

Paths may include `~` or `$HOME`. The shell wrapper stays the same; just update the TOML whenever you add a new base.

## Cross-shell notes

- The CLI ships completions via `devnav complete --shell=<shell>` so you can enable `goto` in Bash, Fish, or PowerShell by adding the eval line from the completion script.
- The CLI exports `devnav resolve|list|complete` so alternative workflows can consume the same namespace data without re-implementing it.
