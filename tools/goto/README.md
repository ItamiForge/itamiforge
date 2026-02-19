# goto

Navigate to projects using namespace-based paths.

## Install

```bash
cargo install --path tools/goto
```

Or from the project root:

```bash
cargo install --path .
```

## Usage

```bash
goto gh/project
goto gh/project/src
goto work/my-app
```

## Configuration

Create `~/.config/goto/config.toml`:

```toml
[[namespace]]
name = "gh"
path = "~/Documents/GitHub"
aliases = ["github"]

[[namespace]]
name = "work"
path = "~/Projects"
```

## Commands

- `goto resolve <namespace>/<path>` — prints the absolute path
- `goto list [namespace]` — lists available namespaces and projects
- `goto complete --shell=zsh|bash|fish|powershell` — emits shell completion

## Testing

```bash
cargo fmt
cargo test
```
