import { NextResponse } from "next/server";
import { getGoogleAdsCustomer } from "@/lib/google-ads-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("dateRange") ?? "LAST_14_DAYS";

    const customer = await getGoogleAdsCustomer();

    const campaigns = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.cost_per_conversion
      FROM campaign
      WHERE segments.date DURING ${dateRange}
        AND campaign.status = 'ENABLED'
      ORDER BY metrics.cost_micros DESC
      LIMIT 20
    `);

    const rows = campaigns.map((row: any) => {
      const spend = row.metrics.cost_micros / 1_000_000;
      const conversions = row.metrics.conversions ?? 0;
      const cpa = conversions > 0 ? spend / conversions : 0;
      const ctr = row.metrics.impressions > 0
        ? (row.metrics.clicks / row.metrics.impressions) * 100
        : 0;
      const cpc = row.metrics.clicks > 0 ? spend / row.metrics.clicks : 0;

      return {
        campaign: row.campaign.name,
        impressions: row.metrics.impressions.toLocaleString(),
        clicks: row.metrics.clicks.toLocaleString(),
        ctr: `${ctr.toFixed(1)}%`,
        cpc: `RM ${cpc.toFixed(2)}`,
        spend: `RM ${spend.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        conversions: Math.round(conversions).toString(),
        cpa: `RM ${cpa.toFixed(2)}`,
      };
    });

    return NextResponse.json({ campaigns: rows, dateRange });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Google Ads data";
    console.error("Google Ads API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
