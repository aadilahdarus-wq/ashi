"use client";

import { useEffect, useState } from "react";

type SummaryData = {
  totalSpend: string;
  totalConversions: string;
  avgCpa: string;
  ctrChange: string;
};

type Props = {
  start: string;
  end: string;
};

export function PerformanceSummaryCards({ start, end }: Props) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/google-ads/summary?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load summary");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [start, end]);

  const stats: { label: string; value?: string }[] = [
    { label: "Total Spend", value: data?.totalSpend },
    { label: "Total Conversions", value: data?.totalConversions },
    { label: "Avg. CPA", value: data?.avgCpa },
    { label: "CTR vs last period", value: data?.ctrChange },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <p className="text-[13px] font-medium text-text-3">{stat.label}</p>
            <p className="mt-3 text-[26px] font-semibold leading-none tracking-tight text-text">
              {loading ? "…" : error ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-[12px] text-red-text">
          Failed to load summary: {error}
        </p>
      )}
    </div>
  );
}
