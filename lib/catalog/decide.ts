import type {
  AllowlistEntry,
  CatalogExcluded,
  CatalogProject,
  MembershipReason,
  OptedInContract,
  ProjectCategory,
  ProjectStatus,
  ProjectVisibility,
  RepoContract,
} from "@/lib/catalog/schema";

export type CatalogGithubRepo = {
  archived: boolean;
  default_branch: string;
  description: string | null;
  fork: boolean;
  full_name: string;
  homepage: string | null;
  html_url: string;
  language: string | null;
  name: string;
  private: boolean;
  pushed_at: string | null;
  topics: string[];
  updated_at: string | null;
};

export type ContractParse = { ok: true; data: RepoContract } | { ok: false; error: string } | null;

export function isOptedInContract(contract: RepoContract): contract is OptedInContract {
  return contract.catalog;
}

export type MembershipDecision = {
  include: boolean;
  reason: MembershipReason;
  detail?: string;
};

/**
 * Membership precedence (first match wins):
 * 1. hub denylist
 * 2. unallowlisted fork
 * 3. invalid contract
 * 4. repo catalog: false
 * 5. repo catalog: true
 * 6. hub allowlist
 * 7. default skip (private names are omitted from the public snapshot)
 */
export function decideMembership(input: {
  allowlisted: boolean;
  contract: ContractParse;
  denylisted: boolean;
  fork: boolean;
  isPrivate: boolean;
}): MembershipDecision {
  if (input.denylisted) {
    return { include: false, reason: "denylist" };
  }

  if (input.fork && !input.allowlisted) {
    return { include: false, reason: "fork" };
  }

  if (input.contract && !input.contract.ok) {
    return { include: false, reason: "invalid_contract", detail: input.contract.error };
  }

  if (input.contract?.ok && !input.contract.data.catalog) {
    return { include: false, reason: "opted_out" };
  }

  if (input.contract?.ok && input.contract.data.catalog) {
    return { include: true, reason: "yaml" };
  }

  if (input.allowlisted) {
    return { include: true, reason: "allowlist" };
  }

  if (input.isPrivate) {
    return { include: false, reason: "private_omitted" };
  }

  return { include: false, reason: "no_contract" };
}

export function toExcluded(repo: string, decision: MembershipDecision): CatalogExcluded | null {
  if (
    decision.reason === "yaml" ||
    decision.reason === "allowlist" ||
    decision.reason === "private_omitted"
  ) {
    return null;
  }

  return {
    repo,
    reason: decision.reason,
    ...(decision.detail ? { detail: decision.detail } : {}),
  };
}

export function mergeProject(input: {
  allowlist?: AllowlistEntry;
  github: CatalogGithubRepo;
  reason: "yaml" | "allowlist";
  yaml?: OptedInContract;
}): CatalogProject | { error: string } {
  const overlay = input.allowlist;
  const yaml = input.yaml;
  const github = input.github;

  const slug = yaml?.slug ?? overlay?.slug ?? slugFromRepo(github.full_name);
  const title = yaml?.title ?? overlay?.title ?? github.name;
  const summary = yaml?.summary ?? overlay?.summary ?? github.description?.trim() ?? "";

  if (!slug || !title || !summary) {
    return {
      error: `missing slug/title/summary for ${github.full_name}`,
    };
  }

  const visibility: ProjectVisibility = github.private
    ? "stub"
    : (yaml?.visibility ?? overlay?.visibility ?? "public");
  const status: ProjectStatus = github.archived
    ? "archived"
    : (yaml?.status ?? overlay?.status ?? "experimental");
  const category: ProjectCategory = yaml?.category ?? overlay?.category ?? "app";
  const tags = yaml?.tags ?? overlay?.tags ?? github.topics;
  const live = yaml?.live ?? overlay?.live ?? emptyToUndefined(github.homepage);
  const install = visibility === "stub" ? undefined : (yaml?.install ?? overlay?.install);
  const githubUrl = visibility === "stub" ? undefined : github.html_url;

  return {
    repo: github.full_name,
    slug,
    title,
    summary,
    status,
    category,
    featured: yaml?.featured ?? overlay?.featured ?? false,
    visibility,
    public: visibility === "public" && !github.private,
    tags,
    language: github.language,
    ...(githubUrl ? { github: githubUrl } : {}),
    ...(live ? { live } : {}),
    ...(install ? { install } : {}),
    pushedAt: github.pushed_at,
    archived: github.archived,
    reason: input.reason,
  };
}

function slugFromRepo(fullName: string): string {
  const name = fullName.split("/")[1] ?? fullName;
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
}

function emptyToUndefined(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}
