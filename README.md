# ItamiForge

Game and App studio blogging and docs site with integrated developer tools.

## Tech stack

- **Framework**: Next.js 16 with App Router
- **Docs**: Fumadocs (MDX-based)
- **Styling**: Tailwind CSS v4
- **Package manager**: Bun
- **Search**: Orama
- **Animation**: Framer Motion

## Commands

| Command | Description |
| --------- | ------------- |
| `bun run dev` | Start development server at localhost:3000 |
| `bun run build` | Build static site to `out/` |
| `bun run preview:prod` | Build and serve Pages output at `localhost:3000/itamiforge/` |
| `bun run check` | Lint + format check + typecheck + build |
| `bun run check:fix` | Lint auto-fix + format + typecheck + build |
| `bun run lint` | Run Oxlint |
| `bun run generate:projects` | Regenerate projects index |
| `bun run generate:notes` | Regenerate notes index + notes sidebar metadata |

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

### Analytics

- Production (GitHub Pages, static): set `NEXT_PUBLIC_ANALYTICS_ENDPOINT` to your Worker `/collect` URL in repo variables.
- Local dev: defaults to `/api/analytics` (Next dev server proxy route). To test against a local Worker, set `NEXT_PUBLIC_ANALYTICS_ENDPOINT=http://localhost:8787/collect`.
- If you ever run a serverful deployment, use `ANALYTICS_ENDPOINT` and `SITESTATS_KEY` on the server side; do not use `NEXT_PUBLIC_*` for secrets.

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
