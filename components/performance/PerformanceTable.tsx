"use client";

import { useEffect, useState } from "react";
import type { PerformanceRow } from "@/lib/performance";
import { useClient } from "@/lib/client-context";

type Props = {
  /** Google Ads date range enum, e.g. "LAST_14_DAYS". */
  dateRange?: string;
};

export function PerformanceTable({ dateRange = "LAST_14_DAYS" }: Props) {
  const { selectedClient } = useClient();
  const customerId = selectedClient?.google_ads_customer_id ?? null;

  const [rows, setRows] = useState<PerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setRows([]);
      setLoading(false);
      setError("No Google Ads account linked to this client yet. Add one in Client Profile.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/google-ads?dateRange=${dateRange}&customerId=${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setRows([]);
        } else {
          setRows(data.campaigns ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load campaign data");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dateRange, customerId]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold text-text">
          Campaign breakdown
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/60">
              <th className="px-5 py-3 font-medium text-text-3">Campaign</th>
              <th className="px-5 py-3 font-medium text-text-3">
                Impressions
              </th>
              <th className="px-5 py-3 font-medium text-text-3">Clicks</th>
              <th className="px-5 py-3 font-medium text-text-3">CTR</th>
              <th className="px-5 py-3 font-medium text-text-3">CPC</th>
              <th className="px-5 py-3 font-medium text-text-3">Spend</th>
              <th className="px-5 py-3 font-medium text-text-3">
                Conversions
              </th>
              <th className="px-5 py-3 font-medium text-text-3">CPA</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-5 py-6 text-center text-text-3">
                  Loading campaign data…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-5 py-6 text-center text-red-text">
                  Failed to load campaign data: {error}
                </td>
              </tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-6 text-center text-text-3">
                  No campaign data for this period.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              rows.map((row) => (
                <tr
                  key={row.campaign}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-5 py-4 font-medium text-text">
                    {row.campaign}
                  </td>
                  <td className="px-5 py-4 text-text-2">{row.impressions}</td>
                  <td className="px-5 py-4 text-text-2">{row.clicks}</td>
                  <td className="px-5 py-4 text-text-2">{row.ctr}</td>
                  <td className="px-5 py-4 text-text-2">{row.cpc}</td>
                  <td className="px-5 py-4 text-text-2">{row.spend}</td>
                  <td className="px-5 py-4 text-text-2">{row.conversions}</td>
                  <td className="px-5 py-4 text-text-2">{row.cpa}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
