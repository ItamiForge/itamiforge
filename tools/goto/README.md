# goto

Navigate to projects using namespace-based paths with a single command.

## Overview

`goto` is a lightweight CLI tool that provides quick navigation to frequently accessed directories. Instead of typing long `cd` commands, you can jump directly to projects using short namespace aliases.

**Key features:**
- Single binary, zero runtime dependencies
- Cross-platform (macOS, Linux, Windows)
- Tab completion support for all major shells
- Namespace-based organization with aliases
- Path expansion with `~` and `$HOME` support

## Install

### From source

```bash
cargo install --path tools/goto
```

Or from the project root:

```bash
cargo install --path .
```

### Verify installation

```bash
goto --version
```

## Usage

```bash
# Jump to a project
goto gh/project

# Jump to a subdirectory within a project
goto gh/project/src

# Jump to a different namespace
goto work/my-app

# List all namespaces and projects
goto list

# List projects within a specific namespace
goto list work
```

## Shell integration (zsh)

Run `goto setup` once after install. It appends a small helper to `~/.zshrc` so `goto gh/project` will `cd` directly into that directory and tab completion will list repos dynamically. Restart your shell after running setup.

The shell integration provides:
- **Automatic directory navigation**: `goto gh/project` changes your current directory
- **Tab completion**: Press Tab after `goto` to see namespace and project suggestions

To verify setup worked, run `goto` without arguments - you should see a help message. If you see a warning about shell integration not being detected, run `goto setup` again.

To remove it later, run `goto uninstall` before `cargo uninstall goto`.

## Configuration

`goto` reads configuration from `~/.config/goto/config.toml` on macOS/Linux and `%LOCALAPPDATA%\goto\config.toml` on Windows.

### Example config

```toml
[[namespace]]
name = "gh"
path = "~/Documents/GitHub"
aliases = ["github"]

[[namespace]]
name = "work"
path = "~/Projects"
aliases = ["work", "projects"]

[[namespace]]
name = "lab"
path = "~/Lab"
```

### Configuration options

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique namespace identifier (lowercase) |
| `path` | Yes | Base directory path (supports `~` and `$HOME`) |
| `aliases` | No | Alternative names for the namespace |

### Default configuration

If no config file exists, `goto` uses a built-in default with the `gh` namespace pointing to `~/Documents/GitHub`.

## Path resolution

- Namespaces are case-insensitive
- Aliases are checked after exact namespace matches
- Paths are canonicalized (symlinks resolved) when possible
- Non-existent paths return an error

### Examples

```bash
# Using namespace
goto gh/myproject

# Using alias
goto github/myproject

# Case-insensitive
goto GH/myproject

# Subdirectory
goto gh/myproject/src/components
```

## Project structure

```
tools/goto/
├── Cargo.toml          # Rust package configuration
├── default_config.toml # Built-in default configuration
├── README.md           # This file
└── src/
    └── main.rs         # CLI implementation
```

## Development

### Build

```bash
cargo build --release
```

### Test

```bash
cargo test
```

### Lint

```bash
cargo fmt      # Format code
cargo clippy   # Run linter
```

## License

MIT
