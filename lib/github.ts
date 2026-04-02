// lib/github.ts
// All functions run server-side (build time) only. Never imported by client components.

export type Activity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  updated_at: string;
  stargazers_count: number;
  private: boolean;
  owner: { login: string };
};

export type ContributionData = {
  contributions: Activity[];
  total: Record<string, number>;
  years: number[];
};

export type RepoStats = {
  repos: GitHubRepo[];
  publicCount: number;
  privateCount: number;
  languageMap: Record<string, number>;
};

export type MonthlyPoint = {
  x: string; // "Jan" … "Dec"
  y: number;
};

export type YearlyMonthlyData = {
  year: number;
  total: number;
  monthly: MonthlyPoint[];
};

// ── helpers ────────────────────────────────────────────────────────────────────

function ghHeaders(token: string | undefined): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function paginatedFetch<T>(baseUrl: string, token: string | undefined): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  const isDev = process.env.NODE_ENV === "development";
  while (true) {
    const url = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: ghHeaders(token),
      ...(isDev ? { next: { revalidate: 120 } } : { cache: "force-cache" }),
    });
    if (!res.ok) break;
    const data: T[] = await res.json();
    if (data.length === 0) break;
    results.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return results;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ── public API ─────────────────────────────────────────────────────────────────

/**
 * Fetch ALL contribution history for a GitHub user (every year).
 */
export async function fetchAllContributions(username: string): Promise<ContributionData> {
  try {
    const url = `https://github-contributions-api.jogruber.de/v4/${username}?y=all`;
    const isDev = process.env.NODE_ENV === "development";
    const res = await fetch(url, {
      ...(isDev ? { next: { revalidate: 120 } } : { cache: "force-cache" }),
    });
    if (!res.ok) throw new Error(`contributions API ${res.status}`);
    const data = (await res.json()) as {
      total: Record<string, number>;
      contributions: Activity[];
    };

    const years = Object.keys(data.total)
      .map(Number)
      .filter((y) => !Number.isNaN(y) && y > 2000)
      .sort((a, b) => b - a); // newest first

    return { contributions: data.contributions, total: data.total, years };
  } catch {
    return { contributions: [], total: {}, years: [] };
  }
}

/**
 * Fetch all repos the authenticated user has access to (public + private).
 * Reads GH_PAT from env.
 */
export async function fetchAllUserRepos(token: string | undefined): Promise<RepoStats> {
  try {
    const repos = await paginatedFetch<GitHubRepo>(
      "https://api.github.com/user/repos?sort=updated&affiliation=owner,organization_member",
      token
    );

    let publicCount = 0;
    let privateCount = 0;
    const languageMap: Record<string, number> = {};

    for (const repo of repos) {
      if (repo.private) privateCount++;
      else publicCount++;
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] ?? 0) + 1;
      }
    }

    return { repos, publicCount, privateCount, languageMap };
  } catch {
    return { repos: [], publicCount: 0, privateCount: 0, languageMap: {} };
  }
}

/**
 * Fetch all public repos for the ItamiForge org.
 */
export async function fetchOrgRepos(org: string, token: string | undefined): Promise<GitHubRepo[]> {
  try {
    return await paginatedFetch<GitHubRepo>(
      `https://api.github.com/orgs/${org}/repos?sort=updated&type=public`,
      token
    );
  } catch {
    return [];
  }
}

/**
 * Given all contributions, derive per-year monthly totals for the small-multiples chart.
 */
export function buildYearlyMonthlyData(
  contributions: Activity[],
  yearTotals: Record<string, number>,
  years: number[]
): YearlyMonthlyData[] {
  // Build a lookup map: date -> count
  const byDate = new Map<string, number>();
  for (const c of contributions) {
    byDate.set(c.date, c.count);
  }

  return years.map((year) => {
    const monthly: MonthlyPoint[] = MONTH_LABELS.map((label, monthIdx) => {
      let total = 0;
      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        total += byDate.get(key) ?? 0;
      }
      return { x: label, y: total };
    });

    return {
      year,
      total: yearTotals[String(year)] ?? 0,
      monthly,
    };
  });
}

/** Split contributions array into per-year slices (for client-side year switching). */
export function splitByYear(contributions: Activity[]): Record<number, Activity[]> {
  const result: Record<number, Activity[]> = {};
  for (const c of contributions) {
    const year = Number(c.date.slice(0, 4));
    if (!result[year]) result[year] = [];
    result[year].push(c);
  }
  return result;
}

/**
 * Pad the current year's contributions to Dec 31 so the calendar SVG
 * renders a full 52-week grid instead of truncating at today's date.
 */
export function padCurrentYearToDecember(
  contributionsByYear: Record<number, Activity[]>
): Record<number, Activity[]> {
  const currentYear = new Date().getFullYear();
  const activities = contributionsByYear[currentYear];
  if (!activities || activities.length === 0) return contributionsByYear;

  const lastDateStr = [...activities].sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.date;
  if (!lastDateStr) return contributionsByYear;

  const last = new Date(lastDateStr);
  const dec31 = new Date(currentYear, 11, 31);
  if (last >= dec31) return contributionsByYear;

  const padding: Activity[] = [];
  const cur = new Date(last);
  cur.setDate(cur.getDate() + 1);
  while (cur <= dec31) {
    const iso = cur.toISOString().split("T")[0] as string;
    padding.push({ date: iso, count: 0, level: 0 });
    cur.setDate(cur.getDate() + 1);
  }

  return { ...contributionsByYear, [currentYear]: [...activities, ...padding] };
}
