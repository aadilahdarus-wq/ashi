"use client";

import { useEffect, useState } from "react";
import { useClient } from "@/lib/client-context";

type CampaignStatus = "Active" | "Paused";

type Campaign = {
  name: string;
  status: CampaignStatus;
  spend: string;
  leads: string;
  cpl: string;
  roas: string;
};

type CampaignTableProps = {
  embedded?: boolean;
};

const statusStyles: Record<CampaignStatus, string> = {
  Active: "bg-green-pale text-green-text",
  Paused: "bg-surface-2 text-text-3",
};

export function CampaignTable({ embedded = false }: CampaignTableProps) {
  const { selectedClient } = useClient();
  const customerId = selectedClient?.google_ads_customer_id ?? null;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setCampaigns([]);
      setLoading(false);
      setError("No Google Ads account linked to this client yet.");
      return;
    }

    let cancelled = false;

    fetch(`/api/google-ads/campaign-overview?customerId=${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
        } else {
          setCampaigns(data.campaigns ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load campaigns");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const wrapperClassName = embedded
    ? "overflow-hidden"
    : "overflow-hidden rounded-xl border border-border bg-surface";

  return (
    <div className={wrapperClassName}>
      {!embedded && (
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-[15px] font-semibold text-text">Campaigns</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/60">
              <th className="px-5 py-3 font-medium text-text-3">Campaign</th>
              <th className="px-5 py-3 font-medium text-text-3">Status</th>
              <th className="px-5 py-3 font-medium text-text-3">Spend</th>
              <th className="px-5 py-3 font-medium text-text-3">Leads</th>
              <th className="px-5 py-3 font-medium text-text-3">CPL</th>
              <th className="px-5 py-3 font-medium text-text-3">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-text-3">
                  Loading campaigns…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-red-text">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && campaigns.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-text-3">
                  No campaign data.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              campaigns.map((campaign) => (
                <tr
                  key={campaign.name}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-5 py-4 font-medium text-text">
                    {campaign.name}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${statusStyles[campaign.status]}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-2">{campaign.spend}</td>
                  <td className="px-5 py-4 text-text-2">{campaign.leads}</td>
                  <td className="px-5 py-4 text-text-2">{campaign.cpl}</td>
                  <td className="px-5 py-4 text-text-2">{campaign.roas}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
