# devnav

Cross-platform CLI for namespace-based project navigation. The `goto` shell helper sources this CLI to resolve paths, list namespaces, and emit completions.

## Installation

### From source (recommended for now)

```bash
cd utils/devnav
cargo install --path .
```

### Future distro installs

- Homebrew tap: `brew install itamiforge/devnav/devnav`
- Scoop bucket / winget manifest for Windows
- Prebuilt releases (Linux/macos/windows) via `cargo install --path .` or downloaded artifact

## Configuration

`devnav` looks for `config.toml` under:

- macOS/Linux: `~/.config/devnav/config.toml`
- Windows: `%LOCALAPPDATA%\devnav\config.toml`

If the file is missing, a built-in default (with the `gh` namespace) is used.

Example:

```toml
[[namespace]]
name = "gh"
path = "~/Documents/GitHub"
aliases = ["github"]

[[namespace]]
name = "work"
path = "~/Projects"
```

Paths support `~` and `$HOME`.

## Commands

- `devnav resolve <namespace>/<path>` — prints the absolute path or errors if missing.
- `devnav list [namespace]` — lists available namespaces and projects.
- `devnav complete --shell=zsh|bash|fish|powershell` — emits a shell completion script.

The `utils/zsh-dev-nav/dev.zsh` wrapper keeps `goto` unchanged while delegating lookup and completion to `devnav`.

## Completion installation

To install the completion script for Zsh:

```bash
eval "$(devnav complete --shell=zsh)"
```

Add the same line in Bash/Fish/PowerShell by switching the `--shell` flag.

## Testing

```bash
cargo fmt
cargo test
```
