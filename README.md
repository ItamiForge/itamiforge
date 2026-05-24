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

- This site uses the canonical SiteStats loader (`GET /tracker.js`) from `components/analytics-tracker.tsx`.
- Configure only `NEXT_PUBLIC_SITESTATS_WORKER_ORIGIN` (for example `https://sitestats.varunrajan.workers.dev`).
- The browser sends no shared secret header. Do not set analytics secrets in `NEXT_PUBLIC_*` variables.
- `NEXT_PUBLIC_SITESTATS_KEY` is removed and must stay unset.
- Keep `GH_PAT` only as a GitHub Actions secret when build-time GitHub API access is required.

## Security Notes

- Public env vars are non-secret configuration only.
- Secrets belong in GitHub Actions secrets or Cloudflare Worker secrets, not in browser bundles.
- Rotate any leaked or previously used PATs and remove stale analytics secrets from repo settings.
- Run `bun audit --audit-level=high` before deployment and in CI.

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
