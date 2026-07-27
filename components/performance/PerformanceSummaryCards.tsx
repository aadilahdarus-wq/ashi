"use client";

import { useEffect, useState } from "react";
import { useClient } from "@/lib/client-context";

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
  const { selectedClient } = useClient();
  const customerId = selectedClient?.google_ads_customer_id ?? null;

  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setData(null);
      setLoading(false);
      setError("No Google Ads account linked to this client yet. Add one in Client Profile.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/google-ads/summary?start=${start}&end=${end}&customerId=${customerId}`)
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
  }, [start, end, customerId]);

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
        <p className="mt-2 text-[12px] text-red-text">{error}</p>
      )}
    </div>
  );
}
