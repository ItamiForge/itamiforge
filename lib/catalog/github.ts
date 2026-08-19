import type { CatalogGithubRepo } from "@/lib/catalog/decide";

type GithubRepoResponse = {
  archived?: boolean;
  default_branch?: string;
  description?: string | null;
  fork?: boolean;
  full_name?: string;
  homepage?: string | null;
  html_url?: string;
  language?: string | null;
  name?: string;
  private?: boolean;
  pushed_at?: string | null;
  topics?: string[];
  updated_at?: string | null;
};

type GithubContentResponse = {
  content?: string;
  encoding?: string;
  type?: string;
};

function headers(token: string | undefined): HeadersInit {
  const requestHeaders: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "itamiforge-catalog-sync",
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  return requestHeaders;
}

async function githubJson<T>(
  url: string,
  token: string | undefined
): Promise<{
  ok: boolean;
  status: number;
  data: T | null;
}> {
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (!res.ok) {
    return { ok: false, status: res.status, data: null };
  }

  return { ok: true, status: res.status, data: (await res.json()) as T };
}

function toCatalogRepo(
  raw: GithubRepoResponse,
  fallbackFullName?: string
): CatalogGithubRepo | null {
  const fullName = raw.full_name ?? fallbackFullName;
  const name = raw.name ?? fullName?.split("/")[1];
  if (!fullName || !name) {
    return null;
  }

  return {
    full_name: fullName,
    name,
    html_url: raw.html_url ?? `https://github.com/${fullName}`,
    description: raw.description ?? null,
    language: raw.language ?? null,
    homepage: raw.homepage ?? null,
    default_branch: raw.default_branch ?? "main",
    private: Boolean(raw.private),
    fork: Boolean(raw.fork),
    archived: Boolean(raw.archived),
    pushed_at: raw.pushed_at ?? null,
    updated_at: raw.updated_at ?? null,
    topics: raw.topics ?? [],
  };
}

export function syntheticRepo(fullName: string): CatalogGithubRepo {
  const name = fullName.split("/")[1] ?? fullName;
  return {
    full_name: fullName,
    name,
    html_url: `https://github.com/${fullName}`,
    description: null,
    language: null,
    homepage: null,
    default_branch: "main",
    private: true,
    fork: false,
    archived: false,
    pushed_at: null,
    updated_at: null,
    topics: [],
  };
}

export async function listOrgRepos(
  org: string,
  token: string | undefined
): Promise<CatalogGithubRepo[]> {
  const repos: CatalogGithubRepo[] = [];
  let page = 1;
  const visibility = token ? "all" : "public";

  while (true) {
    const url = `https://api.github.com/orgs/${org}/repos?type=${visibility}&sort=updated&per_page=100&page=${page}`;
    const { ok, data } = await githubJson<GithubRepoResponse[]>(url, token);
    if (!ok || !data || 0 === data.length) {
      break;
    }

    for (const raw of data) {
      const repo = toCatalogRepo(raw);
      if (repo) {
        repos.push(repo);
      }
    }

    if (100 > data.length) {
      break;
    }
    page += 1;
  }

  return repos;
}

export async function fetchRepo(
  fullName: string,
  token: string | undefined
): Promise<CatalogGithubRepo | null> {
  const { data } = await githubJson<GithubRepoResponse>(
    `https://api.github.com/repos/${fullName}`,
    token
  );
  return data ? toCatalogRepo(data, fullName) : null;
}

export async function fetchRepoTextFile(input: {
  fullName: string;
  path: string;
  ref: string;
  token: string | undefined;
}): Promise<string | null> {
  const url = `https://api.github.com/repos/${input.fullName}/contents/${input.path}?ref=${encodeURIComponent(input.ref)}`;
  const { data } = await githubJson<GithubContentResponse>(url, input.token);
  if (!data?.content || "base64" !== data.encoding) {
    return null;
  }

  return Buffer.from(data.content.replaceAll("\n", ""), "base64").toString("utf8");
}
