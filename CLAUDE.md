# CLAUDE.md — ItamiForge

Project context and conventions for AI-assisted development.

## Project Overview

**ItamiForge** is a personal build log and documentation hub for a game and app studio. It's a statically exported Next.js site deployed to GitHub Pages at `https://itamiforge.github.io/itamiforge/`.

The site has two main content areas:
- **Docs** — technical documentation, project pages, and field notes
- **Blog** — authored posts with frontmatter metadata

## Tech Stack

| Area | Tool |
|------|------|
| Framework | Next.js (App Router, static export) |
| Language | TypeScript (strict mode) |
| Content | Fumadocs + MDX |
| Styling | Tailwind CSS v4 |
| Linting/Formatting | Biome |
| Runtime/Package Manager | Bun |
| Search | Orama (static indexing) |
| Animations | Framer Motion, Animate UI |
| Icons | Lucide React |

## Key Commands

```bash
bun run dev               # Start dev server on localhost:3000 (no basePath, hot reload)
bun run build             # Build static site export (runs generate:projects first)
bun run build:pages       # Alias for GitHub Pages build (same output as CI)
bun run preview:prod      # Build + serve Pages-parity preview at localhost:3000/itamiforge/
bun run serve:prod        # Alias for preview:prod
bun run generate:projects # Auto-generate content/docs/projects.mdx from project dirs
bun run compile           # TypeScript type check
bun run lint              # Biome format check + auto-fix
bun run check             # compile + lint
bun run check:fix         # compile + lint with unsafe fixes
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

components/                 # Shared React components
  project-card.tsx          # Project display card
  blog-card.tsx             # Blog post card
  search.tsx                # Orama search dialog
  provider.tsx              # Fumadocs RootProvider

content/
  docs/                     # MDX documentation
    projects/               # One subdir per project (auto-indexed)
    notes/                  # Field notes
  blog/                     # Blog posts (.mdx with frontmatter)

lib/
  projects.ts               # Project metadata array (source of truth for project list)
  site.ts                   # Site-wide config (name, description, links)
  source.ts                 # Fumadocs source loaders for docs + blog
  layout.shared.tsx         # Shared nav/theme options across layouts

scripts/
  generate-projects-index.ts # Bun script: scans content/docs/projects/ → projects.mdx

tools/                      # Separate external tool directories (excluded from build)
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

### Project Docs (`content/docs/projects/<slug>/index.mdx`)

Each project gets its own directory. The `generate:projects` script auto-generates `content/docs/projects.mdx` from these directories. Run `bun run generate:projects` after adding or removing a project.

### Project Metadata (`lib/projects.ts`)

The `ProjectMeta` array is the **source of truth** for project cards on the landing page and projects listing. Each entry has:
- `id`, `title`, `summary`, `description`
- `status`: `"active"` | `"experimental"` | `"concept"`
- `category`: `"tool"` | `"game"` | `"app"` | `"experiment"`
- `tags`: string array
- `featured`: boolean (shown on home page if true)
- `sourcePath`: path under `content/docs/` for the docs page
- Optional: `links` (github, live, docs)

## Architecture Notes

- **Static export only**: `output: "export"` in next.config.mjs. No server-side APIs at runtime.
- **basePath**: `/itamiforge` for production builds (including CI and local `next build`), empty in `next dev`.
- **Search**: Orama indexes are pre-built at build time. The search dialog is custom (`components/search.tsx`), registered as the Fumadocs search component via `provider.tsx`.
- **Fonts**: Three local custom fonts — Satoshi (sans), Synonym (display), Quicksand (mono). Defined in `app/layout.tsx` using `next/font/local`.
- **Layout pattern**: `HomeLayout` and `DocsLayout` (Fumadocs wrappers) share config via `baseOptions()` in `lib/layout.shared.tsx`.

## Code Style

- **Formatter/Linter**: Biome (2-space indent). Run `bun run lint` before committing.
- **TypeScript**: Strict mode. Use `InferPageType` from Fumadocs for typed page data.
- **No `any`**: Avoid untyped code.
- **Biome exclusions**: `tools/`, `node_modules/`, `.next/`, `dist/`, `build/`, `out/`, `.source/`

## Deployment

- Hosted on **GitHub Pages** via GitHub Actions.
- Production URL: `https://itamiforge.github.io/itamiforge/`
- Build command: `bun run build:pages`
- Output directory: `out/`

## Common Tasks

**Add a new blog post**: Create `content/blog/<slug>.mdx` with required frontmatter.

**Add a new project**:
1. Add entry to `lib/projects.ts`
2. Create `content/docs/projects/<slug>/index.mdx`
3. Run `bun run generate:projects` to update `content/docs/projects.mdx`

**Add a new docs page**: Create `.mdx` file under `content/docs/` — Fumadocs picks it up automatically.

**Test deployed output locally**: `bun run preview:prod` (builds then serves at `/itamiforge/`).
