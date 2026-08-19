# Pending steps — itamiforge

Open work after the studio catalog landing.

## You (human)

1. Commit `.itamiforge.yml` (and README catalog links) in each source repo, then push or open PRs. Local clones were updated; remotes were not, because this machine has no GitHub SSH key.
2. Confirm `GH_PAT` can read private org repos so BrewKogu stays a stub instead of dropping out of sync.
3. Merge catalog-sync PRs after checking facts. Do not treat them as literature rewrites.

## Agent / next coding session

1. Keep `catalog/snapshot.json` generated. Do not hand-edit `lib/projects.ts` project lists.
2. Optional literature pages can be added later under `content/docs/projects/<slug>/` without changing the contract.
3. Do not ingest private repo file contents onto GitHub Pages.

## Done in this pass

- Hub policy, YAML contracts, snapshot sync, scheduled PR workflow
- Single catalog table at `/docs/projects`
- LLM-generated per-project doc trees removed
