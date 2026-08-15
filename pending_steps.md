# Pending steps — itamiforge

Open work after the Theme Lab docs landing. Split by who needs to act.

## You (human)

1. **Confirm Theme Lab docs** after this site deploys: `/docs/projects/theme-lab` (and `/technical`).
2. **Confirm Theme Lab Pages demo** is enabled on `ItamiForge/shadcn-theme-builder` (Settings → Pages → GitHub Actions). Docs already link there.
3. **If the demo URL changes** (repo rename or custom domain), update `content/docs/projects/theme-lab/*.mdx`.
4. **Optional:** add a Theme Lab card or mention on the home page, not only under Docs → Projects.
5. Review the ASCII landing tone — keep, tighten, or replace with a screenshot once the demo is live.

## Agent / next coding session

1. After Theme Lab Pages is live, drop a screenshot into `public/` and embed it on the Theme Lab index.
2. Keep `bun run generate:projects` in the same change whenever project dirs or frontmatter change.
3. Do not expand Theme Lab docs into a block catalog or changelog dump — landing + technical is the intended surface.
4. If `shadcn-theme-builder` is renamed, update links in `content/docs/projects/theme-lab/`.

## Done in this pass

- Renamed project docs from `shadcn-theme-builder` → `theme-lab`
- Product landing (ASCII hero + features) and technical overview
- Projects index regenerated
- Quality gate remains `bun check` (lint + format + typecheck + build)
