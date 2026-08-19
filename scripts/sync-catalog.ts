#!/usr/bin/env bun

import type { AllowlistEntry, CatalogPolicy, CatalogSnapshot } from "@/lib/catalog/schema";
import type { CatalogGithubRepo, ContractParse } from "@/lib/catalog/decide";
import { POLICY_PATH, SNAPSHOT_PATH } from "@/lib/catalog/policy";
import { catalogSnapshotSchema, policySchema, repoContractSchema } from "@/lib/catalog/schema";
import {
  decideMembership,
  isOptedInContract,
  mergeProject,
  toExcluded,
} from "@/lib/catalog/decide";
import { fetchRepo, fetchRepoTextFile, listOrgRepos, syntheticRepo } from "@/lib/catalog/github";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

type CliOptions = {
  dryRun: boolean;
  localDir: string | null;
};

async function loadPolicy(): Promise<CatalogPolicy> {
  const raw = await readFile(POLICY_PATH, "utf8");
  const parsed: unknown = Bun.YAML.parse(raw);
  return policySchema.parse(parsed);
}

function parseArgs(argv: string[]): CliOptions {
  let dryRun = false;
  let localDir: string | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--local-dir") {
      localDir = argv[i + 1] ?? null;
      i += 1;
    }
  }

  return { dryRun, localDir };
}

function parseContract(raw: string, origin: string): ContractParse {
  try {
    const parsed: unknown = Bun.YAML.parse(raw);
    return { ok: true, data: repoContractSchema.parse(parsed) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `${origin}: ${message}` };
  }
}

async function readLocalContract(
  localDir: string,
  repoName: string,
  contractFile: string
): Promise<string | null> {
  const path = join(localDir, repoName, contractFile);
  try {
    return await readFile(path, "utf8");
  } catch {
    return null;
  }
}

async function loadContract(input: {
  contractFile: string;
  github: CatalogGithubRepo;
  localDir: string | null;
  token: string | undefined;
}): Promise<ContractParse> {
  if (input.localDir) {
    const local = await readLocalContract(input.localDir, input.github.name, input.contractFile);
    if (local) {
      return parseContract(local, `${input.localDir}/${input.github.name}/${input.contractFile}`);
    }
  }

  const remote = await fetchRepoTextFile({
    fullName: input.github.full_name,
    path: input.contractFile,
    ref: input.github.default_branch,
    token: input.token,
  });

  if (!remote) {
    return null;
  }

  return parseContract(remote, `${input.github.full_name}@${input.github.default_branch}`);
}

async function discoverRepos(input: {
  allowlist: AllowlistEntry[];
  orgs: string[];
  token: string | undefined;
}): Promise<Map<string, CatalogGithubRepo>> {
  const repos = new Map<string, CatalogGithubRepo>();

  for (const org of input.orgs) {
    const listed = await listOrgRepos(org, input.token);
    for (const repo of listed) {
      repos.set(repo.full_name, repo);
    }
  }

  for (const entry of input.allowlist) {
    if (repos.has(entry.repo)) {
      continue;
    }
    const fetched = await fetchRepo(entry.repo, input.token);
    repos.set(entry.repo, fetched ?? syntheticRepo(entry.repo));
  }

  return repos;
}

function compareProjects(
  left: CatalogSnapshot["included"][number],
  right: CatalogSnapshot["included"][number]
): number {
  if (left.featured !== right.featured) {
    return left.featured ? -1 : 1;
  }
  return left.title.localeCompare(right.title);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const policy = await loadPolicy();
  const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
  const denylist = new Set(policy.denylist);
  const allowlistByRepo = new Map(policy.allowlist.map((entry) => [entry.repo, entry]));

  const discovered = await discoverRepos({
    allowlist: policy.allowlist,
    orgs: policy.orgs,
    token,
  });

  const snapshot: CatalogSnapshot = {
    generatedAt: new Date().toISOString(),
    source: options.localDir ? "github+local" : "github",
    included: [],
    excluded: [],
  };

  const sortedNames = [...discovered.keys()].sort((a, b) => a.localeCompare(b));

  for (const fullName of sortedNames) {
    const github = discovered.get(fullName);
    if (!github) {
      continue;
    }

    const allowlist = allowlistByRepo.get(fullName);
    const contract = await loadContract({
      contractFile: policy.contractFile,
      github,
      localDir: options.localDir,
      token,
    });

    const decision = decideMembership({
      allowlisted: Boolean(allowlist),
      contract,
      denylisted: denylist.has(fullName),
      fork: github.fork,
      isPrivate: github.private,
    });

    if (!decision.include) {
      if (github.private) {
        console.log(`omitted ${fullName} (${decision.reason})`);
        continue;
      }

      const excluded = toExcluded(fullName, decision);
      if (excluded) {
        snapshot.excluded.push(excluded);
      }
      continue;
    }

    const yaml = contract?.ok && isOptedInContract(contract.data) ? contract.data : undefined;
    const merged = mergeProject({
      allowlist,
      github,
      reason: decision.reason === "allowlist" ? "allowlist" : "yaml",
      yaml,
    });

    if ("error" in merged) {
      snapshot.excluded.push({
        repo: fullName,
        reason: "invalid_contract",
        detail: merged.error,
      });
      continue;
    }

    snapshot.included.push(merged);
  }

  snapshot.included.sort(compareProjects);
  snapshot.excluded.sort((a, b) => a.repo.localeCompare(b.repo));

  const parsed = catalogSnapshotSchema.parse(snapshot);
  const serialized = `${JSON.stringify(parsed, null, 2)}\n`;

  console.log(`included ${parsed.included.length}, excluded ${parsed.excluded.length}`);
  for (const project of parsed.included) {
    console.log(`  + ${project.slug}  ${project.repo}  [${project.reason}]`);
  }
  for (const skipped of parsed.excluded) {
    console.log(`  - ${skipped.repo}  [${skipped.reason}]`);
  }

  if (options.dryRun) {
    return;
  }

  await mkdir(join(process.cwd(), "catalog"), { recursive: true });
  await writeFile(SNAPSHOT_PATH, serialized);
  console.log(`wrote ${SNAPSHOT_PATH}`);
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
