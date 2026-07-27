import { NextResponse } from "next/server";
import { formatGoogleAdsError, getGoogleAdsCustomer } from "@/lib/google-ads-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get("days") ?? "30");
    const customerId = searchParams.get("customerId");

    const customer = await getGoogleAdsCustomer(customerId);

    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startDate = new Date(yesterday);
    startDate.setDate(startDate.getDate() - (days - 1));

    const rows = await customer.query(`
      SELECT
        campaign.name,
        campaign.status,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE segments.date BETWEEN '${fmt(startDate)}' AND '${fmt(yesterday)}'
        AND campaign.status IN ('ENABLED', 'PAUSED')
      ORDER BY metrics.cost_micros DESC
      LIMIT 20
    `);

    const campaigns = (rows as any[]).map((row) => {
      const spend = row.metrics.cost_micros / 1_000_000;
      const leads = row.metrics.conversions ?? 0;
      const conversionsValue = row.metrics.conversions_value ?? 0;
      const cpl = leads > 0 ? spend / leads : 0;
      const roas = spend > 0 ? conversionsValue / spend : 0;
      const status: "Active" | "Paused" = row.campaign.status === "PAUSED" ? "Paused" : "Active";

      return {
        name: row.campaign.name,
        status,
        spend: `RM ${spend.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`,
        leads: `${Math.round(leads)} leads`,
        cpl: leads > 0 ? `RM ${cpl.toFixed(0)} CPL` : "—",
        roas: `${roas.toFixed(1)}× ROAS`,
      };
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    const message = formatGoogleAdsError(error);
    console.error("Google Ads campaign overview error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
