# device-finder

Cross-platform device discovery CLI/TUI for developers. Find iOS simulators, Android devices/emulators, and web containers instantly.

## Features

- **iOS**: Detect Xcode simulators via `xcrun simctl`
- **Android**: Detect physical devices and emulators via `adb`
- **Web**: Detect available browsers and Docker web containers
- **CLI**: Fast command-line interface with filtering and JSON output
- **TUI**: Interactive terminal UI for browsing devices

## Installation

### Pre-built Binary

```bash
# Download from releases or copy from local build
cp /path/to/device-finder/target/release/device-finder /usr/local/bin/
chmod +x /usr/local/bin/device-finder
```

### From Source

```bash
cd tools/device-finder
cargo build --release
cargo install --path .
```

## Usage

### CLI Commands

```bash
# List all devices
device-finder list

# Filter by platform
device-finder list --platform ios
device-finder list --platform android
device-finder list --platform web

# Verbose output with details
device-finder list --verbose

# JSON output
device-finder list --json

# Find device by name or ID
device-finder find "iPhone"
device-finder find "emulator"

# Get device details
device-finder info <device-id>

# Interactive TUI
device-finder tui
```

### TUI Controls

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate devices |
| `Tab` | Filter by platform |
| `v` | Toggle verbose view |
| `r` | Refresh devices |
| `Enter` | Show device info |
| `q` | Quit |

## Requirements

| Platform | Required Tools |
|----------|---------------|
| macOS | Xcode (for iOS simctl) |
| Android | `adb` in PATH |
| All | `cargo` (build from source) |

## Configuration

No configuration required. Device detection uses system tools:
- `xcrun simctl` (macOS only)
- `adb devices`
- `emulator -list-avds`

## Building

```bash
# Debug build
cargo build

# Release build (optimized)
cargo build --release

# Binary location
./target/release/device-finder
```

## License

MIT
