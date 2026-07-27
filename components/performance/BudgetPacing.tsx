"use client";

import { useEffect, useState } from "react";
import { getPacingStatus, type BudgetPacingRow } from "@/lib/performance";
import { useClient } from "@/lib/client-context";

const statusStyles = {
  "on-pace": { badge: "bg-green-pale text-green border border-green", bar: "#16a34a" },
  underpacing: { badge: "bg-orange-pale text-orange border border-orange-border", bar: "#e07000" },
  overspending: { badge: "bg-red-pale text-red border border-red", bar: "#dc2626" },
};

function fmt(n: number) {
  return `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function BudgetPacing() {
  const { selectedClient } = useClient();
  const customerId = selectedClient?.google_ads_customer_id ?? null;

  const [rawRows, setRawRows] = useState<BudgetPacingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setRawRows([]);
      setLoading(false);
      setError("No Google Ads account linked to this client yet. Add one in Client Profile.");
      return;
    }

    let cancelled = false;

    fetch(`/api/google-ads/budget-pacing?customerId=${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
        } else {
          setRawRows(data.rows ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load budget pacing");
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
      <div className="rounded-xl border border-border bg-surface p-5 text-[13px] text-text-3">
        Loading budget pacing…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 text-[13px] text-red-text">
        {error}
      </div>
    );
  }

  if (rawRows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 text-[13px] text-text-3">
        No active campaigns with spend this month.
      </div>
    );
  }

  const rows = rawRows.map((row) => ({ ...row, ...getPacingStatus(row) }));
  const flagged = rows.filter((r) => r.status !== "on-pace").length;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold text-text">Budget Pacing</h2>
          <p className="text-[12px] text-text-3">
            Day {rows[0].daysElapsed} of {rows[0].daysInMonth} —{" "}
            {flagged === 0 ? "All campaigns on pace" : `${flagged} campaign${flagged > 1 ? "s" : ""} need attention`}
          </p>
        </div>
        {flagged > 0 && (
          <span className="rounded-full bg-red-pale px-3 py-1 text-[11px] font-bold text-red border border-red">{flagged} flagged</span>
        )}
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => {
          const sty = statusStyles[row.status];
          const barPct = Math.min(row.actualSpendPct, 100);
          const expectedMarkerPct = Math.min(row.expectedSpendPct, 100);
          return (
            <div key={row.campaign} className="px-5 py-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-text">{row.campaign}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-text-3">{fmt(row.spentToDate)} / {fmt(row.monthlyBudget)}</span>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${sty.badge}`}>{row.statusLabel}</span>
                </div>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${barPct}%`, background: sty.bar }} />
                <div className="absolute inset-y-0 w-[2px] bg-white/80" style={{ left: `${expectedMarkerPct}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-text-3">
                <span>{row.actualSpendPct.toFixed(0)}% spent</span>
                <span className="flex items-center gap-2">
                  <span>{row.expectedSpendPct.toFixed(0)}% expected</span>
                  <span>Remaining: {fmt(row.remainingBudget)}</span>
                  <span>Projected: {fmt(row.projectedMonthEnd)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
