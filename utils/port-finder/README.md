# port-finder

Cross-platform port management CLI with interactive TUI.

## Features

- List listening ports with process info
- Kill processes by port
- Check port availability
- Scan port ranges
- Color-coded interactive interface
- Cross-platform (macOS, Linux, Windows)

## Usage

```bash
pf              # interactive mode
pf list         # list all ports
pf find 3000    # who's using port 3000
pf kill 3000    # kill process on port
pf check 8080   # is port available
pf scan 3000-4000
```

## Install

```bash
cargo install --path .
```
