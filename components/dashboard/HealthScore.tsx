"use client";

import { useEffect, useState } from "react";

type DashboardSummary = {
  healthScore: number;
  healthSummary: string;
};

export function HealthScore() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/google-ads/dashboard-summary")
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
          setError(err instanceof Error ? err.message : "Failed to load account health");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-[13px] text-text-3">
        Loading account health…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-[13px] text-red-text">
        Failed to load account health: {error ?? "Unknown error"}
      </div>
    );
  }

  const score = data.healthScore;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
        <div className="relative flex h-[140px] w-[140px] shrink-0 items-center justify-center">
          <svg
            className="-rotate-90"
            width="140"
            height="140"
            viewBox="0 0 140 140"
            aria-hidden="true"
          >
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="var(--surface-2)"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="var(--orange)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[32px] font-semibold leading-none text-text">
              {score}
            </span>
            <span className="mt-1 text-[13px] text-text-3">/100</span>
          </div>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-text">Account Health</p>
          <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-text-3">
            {data.healthSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
