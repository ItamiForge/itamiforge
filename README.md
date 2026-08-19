# ItamiForge

Studio site for documentation, notes, and the project catalog.

> Catalog: [ItamiForge](https://itamiforge.github.io/itamiforge/docs/projects/#itamiforge)

## Tech stack

- **Framework**: Next.js 16 with App Router
- **Docs**: Fumadocs (MDX-based)
- **Styling**: Tailwind CSS v4
- **Package manager**: Bun

## Commands

| Command | Description |
| --------- | ------------- |
| `bun run dev` | Start development server at localhost:3000 |
| `bun run build` | Build static site to `out/` |
| `bun run preview:prod` | Build and serve Pages output at `localhost:3000/itamiforge/` |
| `bun run sync:catalog` | Refresh `catalog/snapshot.json` from GitHub + repo contracts |
| `bun run generate:notes` | Regenerate notes index + notes sidebar metadata |
| `bun run check` | Single quality gate: lint + format check + typecheck + build |
| `bun run check:fix` | Auto-fix lint/format, then typecheck + build |

## Project structure

```
├── app/              # Next.js app router pages
├── catalog/          # Hub policy + committed catalog snapshot
├── content/          # MDX content (blog, docs, notes)
├── lib/              # Shared utilities and catalog types
├── components/       # React components
├── scripts/          # Catalog sync and notes generation
├── public/           # Static assets
└── out/              # Build output (gitignored)
```

## Catalog

Projects are listed from GitHub using each repo's `.itamiforge.yml` plus `catalog/policy.yml`.

- Contract file: `.itamiforge.yml` (`catalog: true` or `catalog: false`)
- Hub policy: `catalog/policy.yml` (orgs, allowlist, denylist)
- Snapshot: `catalog/snapshot.json` (committed facts; build does not call GitHub)
- Public index: `/docs/projects`

See `catalog/README.md` for membership precedence.

## Deployment

GitHub Pages to `itamiforge.github.io/itamiforge/` with base path `/itamiforge`.

### Analytics

- This site uses the canonical SiteStats loader (`GET /tracker.js`) from `components/analytics-tracker.tsx`.
- Configure only `NEXT_PUBLIC_SITESTATS_WORKER_ORIGIN` (for example `https://sitestats.varunrajan.workers.dev`).
- The browser sends no shared secret header. Do not set analytics secrets in `NEXT_PUBLIC_*` variables.
- Keep `GH_PAT` only as a GitHub Actions secret when GitHub API access is required (catalog sync and About page).

## Local development

```bash
bun install
bun run sync:catalog -- --local-dir /Users/varunv/Documents/GitHub
bun run dev
```

Open <http://localhost:3000>.

## Pre-deploy parity check

```bash
bun run preview:prod
```

Open <http://localhost:3000/itamiforge/>. This mirrors GitHub Pages routing and asset paths.
