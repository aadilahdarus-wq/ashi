"use client";

import { useState } from "react";
import { PerformanceChart } from "@/components/performance/PerformanceChart";
import {
  PerformanceDateRangeBar,
  type DateRangeValue,
} from "@/components/performance/PerformanceDateRangeBar";
import { PerformanceAskAI } from "@/components/performance/PerformanceAskAI";
import { BudgetPacing } from "@/components/performance/BudgetPacing";
import { PerformanceSummaryCards } from "@/components/performance/PerformanceSummaryCards";
import { PerformanceTable } from "@/components/performance/PerformanceTable";
import {
  filterByRange,
  performancePreviousPeriodSeries,
  performanceTimeSeries,
  performanceRows,
} from "@/lib/performance";

function getGoogleAdsDateRange(range: DateRangeValue): string {
  if (range.preset === "7d") return "LAST_7_DAYS";
  if (range.preset === "14d") return "LAST_14_DAYS";
  if (range.preset === "30d") return "LAST_30_DAYS";
  // Custom ranges aren't supported by the API route yet; fall back to 30d.
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

export default function PerformancePage() {
  const [range, setRange] = useState<DateRangeValue>({ preset: "14d" });
  const [compareEnabled, setCompareEnabled] = useState(false);

  const currentData = filterByRange(performanceTimeSeries, range);
  const previousData = compareEnabled
    ? filterByRange(performancePreviousPeriodSeries, range)
    : undefined;

  const rangeLabel = getRangeLabel(range);

  return (
    <div className="space-y-5">
      <PerformanceSummaryCards />

      <BudgetPacing />

      <PerformanceAskAI campaigns={performanceRows} rangeLabel={rangeLabel} />

      <PerformanceDateRangeBar
        value={range}
        onChange={setRange}
        compareEnabled={compareEnabled}
        onCompareChange={setCompareEnabled}
      />

      <PerformanceChart data={currentData} previousData={previousData} />

      <PerformanceTable dateRange={getGoogleAdsDateRange(range)} />
    </div>
  );
}
