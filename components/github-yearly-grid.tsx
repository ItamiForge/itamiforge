"use client";

import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "next-themes";
import type { YearlyMonthlyData } from "@/lib/github";

// Earthy palette cycling per year
const YEAR_COLORS = [
  "#709050", // earthy-sage
  "#a06828", // earthy-amber
  "#486030", // earthy-moss
  "#904820", // earthy-terra
  "#5a3010", // earthy-bark
  "#9a6038", // wood-tone-a
  "#c09828", // wood-tone-c
];

type Props = {
  data: YearlyMonthlyData[];
  onYearClick: (year: number) => void;
};

function MiniYearChart({
  yearData,
  color,
  onYearClick,
  isDark,
  globalMax,
}: {
  yearData: YearlyMonthlyData;
  color: string;
  onYearClick: (year: number) => void;
  isDark: boolean;
  globalMax: number;
}) {
  const nivoData = [
    {
      id: String(yearData.year),
      data: yearData.monthly,
    },
  ];

  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const textColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const tooltipBg = isDark ? "#1c1b1a" : "#fffcf0";
  const tooltipText = isDark ? "#fffcf0" : "#100f0f";

  return (
    <button
      type="button"
      className="group flex flex-col gap-3 rounded-lg border border-border/40 bg-secondary/20 p-4 text-left hover:border-border/80 hover:bg-secondary/40 transition-all duration-200 cursor-pointer"
      onClick={() => onYearClick(yearData.year)}
      title={`View ${yearData.year} contribution calendar`}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
          {yearData.year}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {yearData.total.toLocaleString()} <span className="opacity-60">contributions</span>
        </span>
      </div>

      {/* Mini chart */}
      <div className="h-16 w-full">
        <ResponsiveLine
          data={nivoData}
          margin={{ top: 4, right: 0, bottom: 4, left: 0 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: Math.max(globalMax, 1) }}
          curve="monotoneX"
          enablePoints={false}
          enableGridX={false}
          enableGridY={true}
          gridYValues={3}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          colors={[color]}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.15}
          isInteractive={true}
          useMesh={true}
          tooltip={({ point }) => (
            <div
              className="rounded border border-border/40 px-2 py-1 shadow-sm text-[11px] font-mono"
              style={{ background: tooltipBg, color: tooltipText }}
            >
              <span className="opacity-60">{String(point.data.x)}</span>
              {" · "}
              <span className="font-semibold">{Number(point.data.y).toLocaleString()}</span>
            </div>
          )}
          theme={{
            grid: {
              line: { stroke: gridColor, strokeWidth: 1 },
            },
            crosshair: {
              line: { stroke: color, strokeWidth: 1, strokeOpacity: 0.5 },
            },
            tooltip: {
              container: {
                background: "transparent",
                boxShadow: "none",
                padding: 0,
              },
            },
            text: { fill: textColor, fontSize: 10 },
          }}
        />
      </div>
    </button>
  );
}

export function GitHubYearlyGrid({ data, onYearClick }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (data.length === 0) return null;

  // Shared Y-axis max across all years so relative heights are comparable
  const globalMax = Math.max(...data.flatMap((d) => d.monthly.map((m) => m.y)), 1);

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60">
        All time · click a year to view its calendar
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {data.map((yearData, i) => (
          <MiniYearChart
            key={yearData.year}
            yearData={yearData}
            color={YEAR_COLORS[i % YEAR_COLORS.length] ?? "#709050"}
            onYearClick={onYearClick}
            isDark={isDark}
            globalMax={globalMax}
          />
        ))}
      </div>
    </div>
  );
}
