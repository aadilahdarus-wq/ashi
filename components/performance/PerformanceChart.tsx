"use client";
// "use client" is required here because Recharts draws the SVG using browser
// APIs that only exist in the browser, not on the server.

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PerformancePoint } from "@/lib/performance";

type ChartRow = {
  date: string;
  spend: number;
  conversions: number;
  prevSpend?: number;
  prevConversions?: number;
};

type Props = {
  data: PerformancePoint[];
  previousData?: PerformancePoint[];
};

export function PerformanceChart({ data, previousData }: Props) {
  const rows: ChartRow[] = data.map((point, i) => ({
    date: point.date,
    spend: point.spend,
    conversions: point.conversions,
    prevSpend: previousData?.[i]?.spend,
    prevConversions: previousData?.[i]?.conversions,
  }));

  const tickInterval = Math.max(1, Math.floor(rows.length / 6));

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-text">
          Performance over time
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-3">
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-4 rounded-full bg-orange" />
            Spend (MYR)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-4 rounded-full border-t-2 border-dashed border-green" />
            Conversions
          </span>
          {previousData && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-[2px] w-4 rounded-full border-t-2 border-dashed border-orange opacity-50" />
                Spend (previous)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-[2px] w-4 rounded-full border-t-2 border-dotted border-green opacity-50" />
                Conversions (previous)
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--orange)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--orange)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-3)", fontSize: 12 }}
              interval={tickInterval}
            />

            <YAxis yAxisId="spend" hide />
            <YAxis yAxisId="conversions" hide />

            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--text-2)", fontWeight: 600 }}
            />

            <Area
              yAxisId="spend"
              type="monotone"
              dataKey="spend"
              stroke="var(--orange)"
              strokeWidth={2}
              fill="url(#spendGradient)"
              name="Spend (MYR)"
            />

            <Line
              yAxisId="conversions"
              type="monotone"
              dataKey="conversions"
              stroke="var(--green)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              name="Conversions"
            />

            {previousData && (
              <>
                <Line
                  yAxisId="spend"
                  type="monotone"
                  dataKey="prevSpend"
                  stroke="var(--orange)"
                  strokeWidth={1.5}
                  strokeOpacity={0.45}
                  strokeDasharray="4 3"
                  dot={false}
                  name="Spend (previous)"
                />
                <Line
                  yAxisId="conversions"
                  type="monotone"
                  dataKey="prevConversions"
                  stroke="var(--green)"
                  strokeWidth={1.5}
                  strokeOpacity={0.45}
                  strokeDasharray="2 2"
                  dot={false}
                  name="Conversions (previous)"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
