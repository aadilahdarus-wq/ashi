"use client";
// This page now holds interactive state (selected date range, comparison
// toggle), so it needs "use client". Everything that depends on that state
// is computed here and passed down as props to the chart.

import { useState } from "react";
import { PerformanceChart } from "@/components/performance/PerformanceChart";
import {
  PerformanceDateRangeBar,
  type DateRangeValue,
} from "@/components/performance/PerformanceDateRangeBar";
import { PerformanceSummaryCards } from "@/components/performance/PerformanceSummaryCards";
import { PerformanceTable } from "@/components/performance/PerformanceTable";
import {
  filterByRange,
  performancePreviousPeriodSeries,
  performanceTimeSeries,
} from "@/lib/performance";

export default function PerformancePage() {
  const [range, setRange] = useState<DateRangeValue>({ preset: "14d" });
  const [compareEnabled, setCompareEnabled] = useState(false);

  const currentData = filterByRange(performanceTimeSeries, range);
  const previousData = compareEnabled
    ? filterByRange(performancePreviousPeriodSeries, range)
    : undefined;

  return (
    <div className="space-y-5">
      <PerformanceSummaryCards />

      <PerformanceDateRangeBar
        value={range}
        onChange={setRange}
        compareEnabled={compareEnabled}
        onCompareChange={setCompareEnabled}
      />

      <PerformanceChart data={currentData} previousData={previousData} />

      <PerformanceTable />
    </div>
  );
}
