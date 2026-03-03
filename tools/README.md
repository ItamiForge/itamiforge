# 🛠 Dev Utils (ItamiForge)

A collection of developer utilities designed for the 2026 workflow: AI-augmented, local-first, and deeply integrated with macOS.

---

## 🧭 Navigation & Shell

*Optimizing the environment and moving at the speed of thought.*

- [x] **goto** - Navigate to projects using namespace-based paths (`goto gh/project`). Source moved to standalone repo: <https://github.com/ItamiForge/goto>
- [ ] **shush** - CLI wrapper that silences build noise into a background buffer; progress bar in macOS Menu Bar.
- [ ] **path-shrink** - Analyzes `$PATH` for dead links, duplicates, and slow network drives to optimize shell startup.

## 🌿 Git & Flow

*Higher quality version control with less cognitive load.*

- [ ] **git-fixup-ai** - Smart fixups and semantic commit message generation based on staged diffs.
- [ ] **git-who** - Instant attribution: who last touched each function/section in a file.
- [ ] **git-standup** - Automated summary of yesterday/today's work across all local repos.
- [ ] **git-nuke** - Aggressive cleanup for merged branches, remote pruning, and `gc`.
- [ ] **wip** - Manage and sync work-in-progress branches/stashes across different dev machines.

## 🏥 Project Health & Intel

*Deep analysis to keep the codebase lean and correct.*

- [ ] **vibe-check** - LLM-powered linting and codebase hygiene. Packages modular services like `slop-hunter` (to flag conversational residue and stale AI patterns) and architectural "vibe" analysis for consistency.
- [ ] **GhostCode** - Static analysis to find "zombie" exports that are reachable but never invoked in production.
- [ ] **proj-health** - Quick scan for outdated deps, missing `.env` keys, and stale `TODO`s.
- [x] **kirei** - macOS system cleaner (Xcode, Node, Cargo, Caches).
- [ ] **dep-tree** - Visualize project dependency graph in the terminal.

## 🧠 Productivity & Context

*Managing mental state and knowledge.*

- [ ] **ctx** - Mental state snapshots: saves file positions, terminal tabs, and a "what was I doing?" note.
- [ ] **link-meta** - Daemon that monitors clipboard for Jira/GH/Linear links and appends context to `README.md`.
- [ ] **note** - Timestamped, searchable CLI notes with markdown support.
- [ ] **todo-scan** - Find all `TODO`/`FIXME` comments with surrounding code context.
- [ ] **timer** - Pomodoro/task timer integrated with terminal and macOS notifications.

## 🔌 Network & Systems

*Observability and system-level control.*

- [x] **port-finder** - Find and kill processes on a port (Rust CLI with interactive TUI). Source moved to standalone repo: <https://github.com/ItamiForge/port-finder>
- [ ] **sniff** - Instant network condition simulation (Latency, High Packet Loss) for testing sync engines.
- [ ] **env-key** - Secure enclave storage: moves `.env` secrets into **macOS Keychain** for injection.
- [ ] **req** - Streamlined HTTP client with per-project saved requests (Local-first).
- [ ] **webhook-test** - Receive and inspect webhooks locally without public tunnels.

## 📂 Data & Files

*Handling the bytes.*

- [ ] **csv-peek** - Lightning-fast stats/preview for CSV and Parquet files.
- [ ] **bulk-rename** - Batch rename files using regex/patterns.
- [ ] **dupe-find** - Detect duplicate files by content hash across the workspace.
- [ ] **size-tree** - Visual disk usage treemap (TUI).

## 🎮 Game Dev Specific

*Assets and pipeline optimizations.*

- [ ] **asset-watch** - Watch folder to auto-convert/optimize assets (png→webp, wav→ogg).
- [ ] **sprite-pack** - CLI-based sprite atlas generation.
- [ ] **build-multi** - Parallel builds for multiple targets (macOS, iOS, Linux).
- [ ] **playtest-log** - Real-time filtered log capture during playtesting sessions.

---

## 🛸 Dashboards (Control Planes)

- [ ] **ForgeBox** - Unified `ratatui` dashboard for services (logs, health, resource usage, restarts).
- [ ] **ItamiSense** - Real-time visual architecture map showing data flows between APIs and services.
