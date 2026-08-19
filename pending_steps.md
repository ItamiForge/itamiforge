# Pending steps — itamiforge

Open work after the studio catalog landing.

## You (human)

1. Merge the hub PR: https://github.com/ItamiForge/itamiforge/pull/3
2. Merge the per-repo contract PRs (see below).
3. One more GitHub CLI grant so the scheduled sync workflow can be pushed:

```bash
gh auth refresh -s workflow
```

Then an agent can add `.github/workflows/catalog-sync.yml` to this repo. The current `gh` token has `repo` and `read:org` but not `workflow`.

4. Confirm Actions secret `GH_PAT` can read private org repos so BrewKogu stays a stub in CI sync.

## Agent / next coding session

1. After `gh auth refresh -s workflow`, commit and PR `.github/workflows/catalog-sync.yml`.
2. Keep `catalog/snapshot.json` generated. Do not hand-edit `lib/projects.ts` project lists.
3. Do not ingest private repo file contents onto GitHub Pages.

## Done in this pass

- Hub catalog sync + table (PR #3)
- Contract PRs opened on opted-in and opted-out repos
