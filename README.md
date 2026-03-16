# ItamiForge

Game and App studio blogging and docs site with integrated developer tools.

## Tech stack

- **Framework**: Next.js 16 with App Router
- **Docs**: Fumadocs (MDX-based)
- **Styling**: Tailwind CSS v4
- **Package manager**: Bun
- **Search**: Orama
- **Animation**: Framer Motion, Animate UI

## Commands

| Command | Description |
| --------- | ------------- |
| `bun run dev` | Start development server at localhost:3000 |
| `bun run build` | Build static site to `out/` |
| `bun run build:pages` | Build the exact GitHub Pages output |
| `bun run preview:prod` | Build and serve Pages output at `localhost:3000/itamiforge/` |
| `bun run check` | Type check + lint |
| `bun run lint` | Run Biome linter |
| `bun run generate:projects` | Regenerate projects index |

## Project structure

```
├── app/              # Next.js app router pages
├── content/          # MDX content (blog, docs)
├── tools/            # Developer utilities (Rust CLIs)
├── lib/              # Shared utilities
├── components/       # React components
├── public/           # Static assets
└── out/              # Build output (gitignored)
```

## Developer tools

Located in `tools/`:

- `goto/` - Namespace-based project navigation with tab completion (requires `goto setup` for full functionality)
- `port-finder/` - Find and reclaim ports
- `device-finder/` - Cross-platform device discovery
- `kirei/` - macOS system cleaner
- And more...

## Deployment

GitHub Pages to `itamiforge.github.io/itamiforge/` with base path `/itamiforge`.

## Local development

```bash
bun install
bun run dev
```

Open <http://localhost:3000>.

## Pre-deploy parity check

```bash
bun run preview:prod
```

Open <http://localhost:3000/itamiforge/>. This mirrors GitHub Pages routing and asset paths.
