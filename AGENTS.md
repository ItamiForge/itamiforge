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

Repo-specific content generation:

- `bun run generate:projects`: Regenerate `content/docs/projects.mdx`
- `bun run generate:notes`: Regenerate `content/docs/notes.mdx` and `content/docs/notes/meta.json`

## Source Of Truth

- `package.json` scripts are the source of truth for command behavior and sequencing.
- If docs and scripts disagree, update docs to match scripts in the same change.

## Doc Maintenance Rule

When changing commands, tooling, or quality gates, update these files in the same PR if affected:

- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- Relevant operational notes under `content/docs/notes/` (for example checks/process notes)

## Workflow Posture

- Keep CI/workflow updates minimal and correctness-focused.
- Current repo workflow is `.github/workflows/deploy-pages.yml`.
- Do not refactor workflow structure for style parity unless correctness requires it.
