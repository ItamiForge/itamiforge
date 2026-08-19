# AGENTS.md

Operational guidance for contributors and coding agents in `itamiforge`.

## Canonical Quality Commands

- `bun run lint`: Run Oxlint checks
- `bun run lint:fix`: Apply Oxlint auto-fixes
- `bun run format:check`: Verify Oxfmt formatting
- `bun run format`: Apply Oxfmt formatting
- `bun run typecheck`: Run TypeScript checks (`tsc --noEmit`)
- `bun run check`: `lint` + `format:check` + `typecheck` + `build`
- `bun run check:fix`: `lint:fix` + `format` + `typecheck` + `build`
- `bun audit --audit-level=high`: Security audit for high/critical dependency advisories

Repo-specific content generation:

- `bun run sync:catalog`: Refresh `catalog/snapshot.json` from GitHub + `.itamiforge.yml`
- `bun run generate:notes`: Regenerate `content/docs/notes.mdx` and `content/docs/notes/meta.json`

## Source Of Truth

- `package.json` scripts are the source of truth for command behavior and sequencing.
- If docs and scripts disagree, update docs to match scripts in the same change.

## Doc Maintenance Rule

When changing commands, tooling, or quality gates, update these files in the same PR if affected:

- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `pending_steps.md` when leftover human/agent work changes
- Relevant operational notes under `content/docs/notes/` (for example checks/process notes)

## Workflow Posture

- Keep CI/workflow updates minimal and correctness-focused.
- Current repo workflows: `.github/workflows/deploy-pages.yml` and `.github/workflows/catalog-sync.yml`.
- Do not refactor workflow structure for style parity unless correctness requires it.

## Code Conventions

- Imports: `import type { X }` not `import { type X }`. Sort by syntax (side-effect → multiple → single), specifiers alphabetical.
- Run `bun run lint` after writing code — target 0 warnings, 0 errors.
- See `.oxlintrc.json` for the full rule config and intentional suppressions.
