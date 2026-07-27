"use client";

import { useEffect, useState } from "react";
import { useClient } from "@/lib/client-context";

type ChangeType = "positive" | "negative" | "neutral";

type DashboardSummary = {
  totalSpend: number;
  totalLeads: number;
  blendedRoas: number;
  avgCpl: number;
  spendChangePct: number | null;
  leadsChangePct: number | null;
  roasChangePct: number | null;
  cplChangeAbs: number;
};

function fmtMYR(n: number, decimals = 0) {
  return `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function pctBadge(pct: number | null, upIsGood: boolean): { text: string; type: ChangeType } {
  if (pct === null || Math.abs(pct) < 1) return { text: "stable", type: "neutral" };
  const arrow = pct >= 0 ? "↑" : "↓";
  const isGood = upIsGood ? pct >= 0 : pct < 0;
  return { text: `${arrow}${Math.abs(pct).toFixed(1)}%`, type: isGood ? "positive" : "negative" };
}

function absBadge(delta: number, upIsGood: boolean): { text: string; type: ChangeType } {
  if (Math.abs(delta) < 0.5) return { text: "stable", type: "neutral" };
  const arrow = delta >= 0 ? "↑" : "↓";
  const isGood = upIsGood ? delta >= 0 : delta < 0;
  return { text: `${arrow}RM${Math.abs(delta).toFixed(1)}`, type: isGood ? "positive" : "negative" };
}

function ChangeBadge({ change, changeType }: { change: string; changeType: ChangeType }) {
  const styles: Record<ChangeType, string> = {
    positive: "bg-green-pale text-green-text",
    negative: "bg-red-pale text-red-text",
    neutral: "bg-surface-2 text-text-3",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${styles[changeType]}`}
    >
      {change}
    </span>
  );
}

export function StatCards() {
  const { selectedClient } = useClient();
  const customerId = selectedClient?.google_ads_customer_id ?? null;

  const [data, setData] = useState<DashboardSummary | null>(null);
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

    fetch(`/api/google-ads/dashboard-summary?customerId=${customerId}`)
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
          setError(err instanceof Error ? err.message : "Failed to load stats");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-5">
            <p className="text-[13px] font-medium text-text-3">Loading…</p>
            <p className="mt-3 text-[26px] font-semibold leading-none tracking-tight text-text">
              …
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 text-[13px] text-red-text">
        {error ?? "Unknown error"}
      </div>
    );
  }

  const stats = [
    { label: "Total Spend", value: fmtMYR(data.totalSpend), ...pctBadge(data.spendChangePct, true) },
    { label: "Total Leads", value: String(data.totalLeads), ...pctBadge(data.leadsChangePct, true) },
    { label: "Blended ROAS", value: `${data.blendedRoas.toFixed(1)}×`, ...pctBadge(data.roasChangePct, true) },
    { label: "Avg CPL", value: fmtMYR(data.avgCpl, 1), ...absBadge(data.cplChangeAbs, false) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <p className="text-[13px] font-medium text-text-3">{stat.label}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-[26px] font-semibold leading-none tracking-tight text-text">
              {stat.value}
            </p>
            <ChangeBadge change={stat.text} changeType={stat.type} />
          </div>
        </div>
      ))}
    </div>
  );
}
