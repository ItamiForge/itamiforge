"use client";

import { GitBranch, Lock, Star, Unlock } from "lucide-react";
import { useState } from "react";
import { GitHubYearlyGrid } from "@/components/github-yearly-grid";
import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { GitHubRepo, YearlyMonthlyData } from "@/lib/github";

type Props = {
  years: number[];
  yearTotals: Record<string, number>;
  contributionsByYear: Record<number, Activity[]>;
  yearlyMonthlyData: YearlyMonthlyData[];
  publicCount: number;
  privateCount: number;
  languageMap: Record<string, number>;
  recentRepos: GitHubRepo[];
};

const EARTHY_FILL: Record<number, string> = {
  0: "fill-muted/60 dark:fill-muted/40",
  1: "fill-[#a3b18a] dark:fill-[#4a6741]",
  2: "fill-[#709050] dark:fill-[#607840]",
  3: "fill-[#607840] dark:fill-[#789050]",
  4: "fill-[#486030] dark:fill-[#879a39]",
};

const EARTHY_BG: Record<number, string> = {
  0: "bg-muted/60 dark:bg-muted/40",
  1: "bg-[#a3b18a] dark:bg-[#4a6741]",
  2: "bg-[#709050] dark:bg-[#607840]",
  3: "bg-[#607840] dark:bg-[#789050]",
  4: "bg-[#486030] dark:bg-[#879a39]",
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  MDX: "#fcb32c",
  Swift: "#fa7343",
  Kotlin: "#7f52ff",
  Dart: "#00b4ab",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type TooltipState = { x: number; y: number; activity: Activity } | null;

function CalendarView({
  contributions,
  total,
}: {
  contributions: Activity[];
  total: number;
}) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  if (contributions.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground font-mono">
        No contributions recorded for this year.
      </div>
    );
  }

  return (
    <div className="relative overflow-visible">
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 rounded border border-border/60 bg-card px-2.5 py-1.5 shadow-md text-[11px] font-mono whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 48,
            transform: "translateX(-50%)",
          }}
        >
          <span className="text-foreground/60">
            {formatDate(tooltip.activity.date)}
          </span>
          {" · "}
          <span className="font-semibold text-foreground">
            {tooltip.activity.count.toLocaleString()} contribution
            {tooltip.activity.count !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <ContributionGraph
        data={contributions}
        totalCount={total}
        blockSize={11}
        blockMargin={3}
        blockRadius={2}
      >
        <ContributionGraphCalendar className="text-[11px] text-muted-foreground/60 font-mono">
          {({ activity, dayIndex, weekIndex }) => {
            const lvl = Math.min(activity.level, 4) as 0 | 1 | 2 | 3 | 4;
            const isPeak = lvl === 4;
            return (
              <ContributionGraphBlock
                activity={activity}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
                className={[
                  EARTHY_FILL[lvl],
                  isPeak && "animate-pulse [animation-duration:2000ms]",
                  "transition-opacity hover:opacity-70 cursor-default",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseEnter={(e) => {
                  const wrapEl = (e.target as SVGRectElement).closest(
                    ".relative",
                  );
                  if (!wrapEl) return;
                  const rect = (
                    e.target as SVGRectElement
                  ).getBoundingClientRect();
                  const parentRect = wrapEl.getBoundingClientRect();
                  setTooltip({
                    x: rect.left - parentRect.left + rect.width / 2,
                    y: rect.top - parentRect.top,
                    activity,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          }}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="mt-2 items-center justify-between">
          <ContributionGraphTotalCount>
            {({ totalCount: count, year }) => (
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <GitBranch className="w-3 h-3 shrink-0" />
                <span>
                  <span className="text-foreground/80 font-semibold">
                    {count.toLocaleString()}
                  </span>{" "}
                  contributions in {year}
                </span>
              </div>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/60">
            {({ level }) => (
              <div
                className={[
                  "h-[11px] w-[11px] rounded-[2px] border border-border/20",
                  EARTHY_BG[Math.min(level, 4) as 0 | 1 | 2 | 3 | 4],
                ].join(" ")}
              />
            )}
          </ContributionGraphLegend>
        </ContributionGraphFooter>
      </ContributionGraph>
    </div>
  );
}

function StatsBar({
  publicCount,
  privateCount,
  languageMap,
}: {
  publicCount: number;
  privateCount: number;
  languageMap: Record<string, number>;
}) {
  const total = publicCount + privateCount;
  const publicPct = total > 0 ? Math.round((publicCount / total) * 100) : 0;
  const topLangs = Object.entries(languageMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const langTotal = topLangs.reduce((s, [, n]) => s + n, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/30">
      <div className="space-y-2">
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60">
          Repositories
        </p>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-foreground/70">
            <Unlock className="w-3 h-3 text-[#709050] dark:text-[#879a39]" />
            <span className="font-semibold text-foreground/90">
              {publicCount}
            </span>{" "}
            public
          </span>
          <span className="flex items-center gap-1.5 text-foreground/70">
            <Lock className="w-3 h-3 text-muted-foreground/50" />
            <span className="font-semibold text-foreground/90">
              {privateCount}
            </span>{" "}
            private
          </span>
        </div>
        {total > 0 && (
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full rounded-full bg-[#709050] dark:bg-[#879a39] transition-all duration-700"
              style={{ width: `${publicPct}%` }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60">
          Top languages
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {topLangs.map(([lang, count]) => (
            <span
              key={lang}
              className="flex items-center gap-1.5 text-xs font-mono text-foreground/70"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: LANG_COLORS[lang] ?? "#8b949e" }}
              />
              {lang}
              <span className="text-muted-foreground/50">
                {langTotal > 0
                  ? `${Math.round((count / langTotal) * 100)}%`
                  : ""}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RepoCards({ repos }: { repos: GitHubRepo[] }) {
  if (repos.length === 0) return null;
  return (
    <div className="space-y-3 pt-4 border-t border-border/30">
      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60">
        Recent public repos
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {repos.map((repo) => (
          <a
            key={repo.full_name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1.5 rounded-md border border-border/40 bg-secondary/20 px-3 py-2.5 hover:border-border/80 hover:bg-secondary/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-medium text-foreground/80 group-hover:text-foreground truncate">
                <span className="text-muted-foreground/50">
                  {repo.owner.login}/
                </span>
                {repo.name}
              </span>
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60 shrink-0">
                  <Star className="w-2.5 h-2.5" />
                  {repo.stargazers_count}
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-[11px] text-muted-foreground/70 leading-tight line-clamp-1">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50 font-mono mt-0.5">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: LANG_COLORS[repo.language] ?? "#8b949e",
                    }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="ml-auto">{timeAgo(repo.updated_at)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function GitHubActivity({
  years,
  yearTotals,
  contributionsByYear,
  yearlyMonthlyData,
  publicCount,
  privateCount,
  languageMap,
  recentRepos,
}: Props) {
  const currentYear = new Date().getFullYear();
  const defaultYear = years.includes(currentYear)
    ? currentYear
    : (years[0] ?? currentYear);
  const [selectedYear, setSelectedYear] = useState<number | "all">(defaultYear);

  return (
    <div className="space-y-6">
      {/* Header + year selector pills */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <p className="eyebrow text-muted-foreground">
          GitHub Activity · JordanRex + ItamiForge
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={[
                "px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all duration-150",
                selectedYear === year
                  ? "bg-[#709050] dark:bg-[#879a39] text-white shadow-sm"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/30",
              ].join(" ")}
            >
              {year}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedYear("all")}
            className={[
              "px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all duration-150",
              selectedYear === "all"
                ? "bg-[#709050] dark:bg-[#879a39] text-white shadow-sm"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/30",
            ].join(" ")}
          >
            All time
          </button>
        </div>
      </div>

      {/* Calendar or small-multiples */}
      {selectedYear === "all" ? (
        <GitHubYearlyGrid
          data={yearlyMonthlyData}
          onYearClick={(year) => setSelectedYear(year)}
        />
      ) : (
        <CalendarView
          contributions={contributionsByYear[selectedYear] ?? []}
          total={yearTotals[String(selectedYear)] ?? 0}
        />
      )}

      {/* Stats bar */}
      <StatsBar
        publicCount={publicCount}
        privateCount={privateCount}
        languageMap={languageMap}
      />

      {/* Repo cards */}
      <RepoCards repos={recentRepos} />
    </div>
  );
}
