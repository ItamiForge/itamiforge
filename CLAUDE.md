# CLAUDE.md — ItamiForge

Project context and conventions for AI-assisted development.

## Project Overview

**ItamiForge** is a portfolio and documentation hub for a game and app studio. It's a statically exported Next.js site deployed to GitHub Pages at `https://itamiforge.github.io/itamiforge/`.

The site has two main content areas:
- **Docs** — catalog, field notes, and operational guides
- **Blog** — authored posts with frontmatter metadata

## Tech Stack

| Area | Tool |
|------|------|
| Framework | Next.js (App Router, static export) |
| Language | TypeScript (strict mode) |
| Content | Fumadocs + MDX |
| Styling | Tailwind CSS v4 |
| Linting/Formatting | Oxlint + Oxfmt |
| Runtime/Package Manager | Bun |
| Search | Orama (static indexing) |
| Animations | Framer Motion |
| Icons | Lucide React |

## Key Commands

```bash
bun run dev               # Start dev server on localhost:3000 (no basePath, hot reload)
bun run build             # Build static site export (runs generate:notes first)
bun run preview:prod      # Build + serve Pages-parity preview at localhost:3000/itamiforge/
bun run sync:catalog      # Refresh catalog/snapshot.json from GitHub + .itamiforge.yml contracts
bun run generate:notes    # Auto-generate content/docs/notes.mdx + content/docs/notes/meta.json
bun run typecheck         # TypeScript type check
bun run lint              # Oxlint
bun run format            # Oxfmt write
bun run check             # lint + format check + typecheck + build
bun run check:fix         # lint fix + format + typecheck + build
```

### Local vs Prod Testing

| Command | URL | basePath | Use when |
|---|---|---|---|
| `bun run dev` | `localhost:3000/` | none | Day-to-day development |
| `bun run preview:prod` | `localhost:3000/itamiforge/` | `/itamiforge` | Full prod parity check before deploying |

> **Why `preview:prod` is different**: The production export sets `basePath: /itamiforge` (matching GitHub Pages), so assets are prefixed with `/itamiforge/`. The preview command mirrors this by serving a `.serve-prod/itamiforge/` directory.

## Project Structure

```
app/                        # Next.js App Router
  (home)/                   # Home layout group
    page.tsx                # Landing page
    about/, blog/, ai-erp/ # Section pages
  docs/[[...slug]]/         # Docs catch-all route
  api/search/, api/og/      # Search and OG image routes
  layout.tsx                # Root layout (fonts, metadata, providers)

catalog/
  policy.yml                # Hub orgs, allowlist, denylist
  snapshot.json             # Committed catalog facts (build input)
  README.md                 # Membership precedence

components/                 # Shared React components
  catalog-table.tsx         # Catalog index table
  project-card.tsx          # Featured project card
  blog-card.tsx             # Blog post card
  search.tsx                # Orama search dialog
  provider.tsx              # Fumadocs RootProvider

content/
  docs/                     # MDX documentation
    projects.mdx            # Catalog index
    notes/                  # Field notes
  blog/                     # Blog posts (.mdx with frontmatter)

lib/
  catalog/                  # Contract schema, membership, GitHub fetch
  projects.ts               # Snapshot → ProjectMeta
  site.ts                   # Site-wide config (name, description, links)
  source.ts                 # Fumadocs source loaders for docs + blog
  layout.shared.tsx         # Shared nav/theme options across layouts

scripts/
  sync-catalog.ts           # GitHub + YAML → catalog/snapshot.json
  generate-notes-index.ts   # Scans content/docs/notes/ → notes.mdx + notes/meta.json
```

## Content Conventions

### Blog Posts (`content/blog/*.mdx`)

```yaml
---
title: Post Title
description: Short description
author: Author Name
date: YYYY-MM-DD
tags: [tag1, tag2]
draft: false   # true to hide from production
---
```

### Project catalog

Facts live in each source repo's `.itamiforge.yml` plus GitHub metadata. The hub policy is `catalog/policy.yml`. `bun run sync:catalog` writes `catalog/snapshot.json`. The public index is `content/docs/projects.mdx`.

Membership precedence is documented in `catalog/README.md`. First match wins: hub denylist → unallowlisted fork → invalid contract → `catalog: false` → `catalog: true` → hub allowlist → skip.

`lib/projects.ts` reads the committed snapshot. Do not hand-edit the project list.

### Project Metadata (`lib/projects.ts`)

`ProjectMeta` is derived from the snapshot. Each included entry has:
- `slug`, `title`, `summary`
- `status`: `"active"` | `"experimental"` | `"concept"` | `"archived"`
- `category`: `"cli"` | `"desktop"` | `"shell"` | `"app"` | `"concept"` | `"library"` | `"game"`
- `tags`: string array
- `featured`: boolean (shown on the home page if true and public)
- `visibility`: `"public"` | `"stub"`
- Optional: `github`, `live`, `install`

## Architecture Notes

- **Static export only**: `output: "export"` in next.config.mjs. No server-side APIs at runtime.
- **basePath**: `/itamiforge` for production builds (including CI and local `next build`), empty in `next dev`.
- **Analytics**: browser tracking uses the canonical Worker script (`GET /tracker.js`) via `components/analytics-tracker.tsx`. Set `NEXT_PUBLIC_SITESTATS_WORKER_ORIGIN` to the Worker origin. Do not use browser-exposed analytics secrets.
- **Search**: Orama indexes are pre-built at build time. The search dialog is custom (`components/search.tsx`), registered as the Fumadocs search component via `provider.tsx`.
- **Fonts**: Three local custom fonts — Satoshi (sans), Synonym (display), Quicksand (mono). Defined in `app/layout.tsx` using `next/font/local`.
- **Layout pattern**: `HomeLayout` and `DocsLayout` (Fumadocs wrappers) share config via `baseOptions()` in `lib/layout.shared.tsx`.

## Code Style

- **Formatter/Linter**: OXC suite (`oxlint` + `oxfmt`, 2-space indent). Run `bun run lint` before committing.
- **TypeScript**: Strict mode. Use `InferPageType` from Fumadocs for typed page data.
- **No `any`**: Avoid untyped code.
- **OXC exclusions**: `tools/`, `node_modules/`, `.next/`, `dist/`, `build/`, `out/`, `.source/`

### Import Conventions

- Use `import type { Foo }` (top-level) instead of `import { type Foo }` (inline specifier).
- Order imports by syntax: side-effect (`import './x'`), then multiple-member (`import { a, b }`), then single-member (`import X`).
- Sort specifiers alphabetically within each import: `import { Alpha, Beta }` not `import { Beta, Alpha }`.
- Separate `import type` and `import` for the same module — `no-duplicate-imports` is intentionally disabled to support this.

### Style Rules

The oxlint config (`.oxlintrc.json`) intentionally disables these style rules as noise:
- `sort-keys`, `no-magic-numbers`, `func-style`, `no-ternary`, `no-nested-ternary`, `no-continue`, `yoda`
- `group-exports`, `exports-last`, `no-unassigned-import` (incompatible with Next.js patterns)

## Deployment

- Hosted on **GitHub Pages** via GitHub Actions.
- Production URL: `https://itamiforge.github.io/itamiforge/`
- Build command: `bun run build`
- Output directory: `out/`

## Common Tasks

**Add a new blog post**: Create `content/blog/<slug>.mdx` with required frontmatter.

**Add a new project**:
1. Add `.itamiforge.yml` with `catalog: true` in the source repo
2. If the repo is outside scanned orgs, add it to `catalog/policy.yml` allowlist
3. Run `bun run sync:catalog` (or wait for the scheduled workflow PR)

**Add a new docs page**: Create `.mdx` file under `content/docs/` — Fumadocs picks it up automatically.

**Add or edit a note**:
1. Create or edit `content/docs/notes/<slug>.mdx`
2. Run `bun run generate:notes` to refresh `content/docs/notes.mdx` and `content/docs/notes/meta.json`

**Test deployed output locally**: `bun run preview:prod` (builds then serves at `/itamiforge/`).
