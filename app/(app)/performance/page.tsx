"use client";

import { useEffect, useState } from "react";
import { PerformanceChart } from "@/components/performance/PerformanceChart";
import {
  PerformanceDateRangeBar,
  type DateRangeValue,
} from "@/components/performance/PerformanceDateRangeBar";
import { PerformanceAskAI } from "@/components/performance/PerformanceAskAI";
import { BudgetPacing } from "@/components/performance/BudgetPacing";
import { PerformanceSummaryCards } from "@/components/performance/PerformanceSummaryCards";
import { PerformanceTable } from "@/components/performance/PerformanceTable";
import type { PerformancePoint, PerformanceRow } from "@/lib/performance";

function getGoogleAdsDateRange(range: DateRangeValue): string {
  if (range.preset === "7d") return "LAST_7_DAYS";
  if (range.preset === "14d") return "LAST_14_DAYS";
  if (range.preset === "30d") return "LAST_30_DAYS";
  // Custom ranges aren't supported by the DURING-enum table route yet; fall back to 30d.
  return "LAST_30_DAYS";
}

function getRangeLabel(range: DateRangeValue): string {
  if (range.preset === "7d") return "Last 7 days";
  if (range.preset === "14d") return "Last 14 days";
  if (range.preset === "30d") return "Last 30 days";
  if (range.preset === "custom" && range.customStart && range.customEnd) {
    return `${range.customStart} – ${range.customEnd}`;
  }
  return "selected period";
}

/** Maps the selected preset/custom range to explicit ISO start/end dates,
 * used by the endpoints that need exact date windows (timeseries, summary). */
function getWindow(range: DateRangeValue): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  if (range.preset === "custom" && range.customStart && range.customEnd) {
    return { start: range.customStart, end: range.customEnd };
  }

  const days = range.preset === "7d" ? 7 : range.preset === "30d" ? 30 : 14;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const start = new Date(yesterday);
  start.setDate(start.getDate() - (days - 1));

  return { start: fmt(start), end: fmt(yesterday) };
}

export default function PerformancePage() {
  const [range, setRange] = useState<DateRangeValue>({ preset: "14d" });
  const [compareEnabled, setCompareEnabled] = useState(false);

  const [currentData, setCurrentData] = useState<PerformancePoint[]>([]);
  const [previousData, setPreviousData] = useState<PerformancePoint[] | undefined>(undefined);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  const [campaignRows, setCampaignRows] = useState<PerformanceRow[]>([]);

  const rangeLabel = getRangeLabel(range);
  const window = getWindow(range);

  // Fetch the daily time series for the chart whenever the window or the
  // compare toggle changes.
  useEffect(() => {
    let cancelled = false;
    setChartLoading(true);
    setChartError(null);

    const params = new URLSearchParams({
      start: window.start,
      end: window.end,
      compare: String(compareEnabled),
    });

    fetch(`/api/google-ads/timeseries?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setChartError(data.error);
          setCurrentData([]);
          setPreviousData(undefined);
        } else {
          setCurrentData(data.series ?? []);
          setPreviousData(data.previousSeries);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setChartError(err instanceof Error ? err.message : "Failed to load chart data");
        }
      })
      .finally(() => {
        if (!cancelled) setChartLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.start, window.end, compareEnabled]);

  // Fetch campaign rows once per range change, shared with Ask ASHI so its
  // answers reflect the same period the user is looking at.
  useEffect(() => {
    let cancelled = false;

    fetch(`/api/google-ads?dateRange=${getGoogleAdsDateRange(range)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.error) setCampaignRows(data.campaigns ?? []);
      })
      .catch(() => {
        // Ask ASHI just won't have campaign context; PerformanceTable below
        // surfaces the real error to the user already.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.preset, range.customStart, range.customEnd]);

  return (
    <div className="space-y-5">
      <PerformanceSummaryCards start={window.start} end={window.end} />

      <BudgetPacing />

      <PerformanceAskAI campaigns={campaignRows} rangeLabel={rangeLabel} />

      <PerformanceDateRangeBar
        value={range}
        onChange={setRange}
        compareEnabled={compareEnabled}
        onCompareChange={setCompareEnabled}
      />

      {chartLoading && (
        <p className="text-[12px] text-text-3">Loading chart…</p>
      )}

      {chartError ? (
        <div className="rounded-xl border border-border bg-surface p-5 text-[13px] text-red-text">
          Failed to load chart data: {chartError}
        </div>
      ) : (
        <PerformanceChart data={currentData} previousData={previousData} />
      )}

      <PerformanceTable dateRange={getGoogleAdsDateRange(range)} />
    </div>
  );
}
