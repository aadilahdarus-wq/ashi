import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("ENV CHECK:", {
      token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN ? "found" : "MISSING",
      clientId: process.env.GOOGLE_ADS_CLIENT_ID ? "found" : "MISSING",
      secret: process.env.GOOGLE_ADS_CLIENT_SECRET ? "found" : "MISSING",
      refresh: process.env.GOOGLE_ADS_REFRESH_TOKEN ? "found" : "MISSING",
      customerId: process.env.GOOGLE_ADS_CUSTOMER_ID ? "found" : "MISSING",
    });
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("dateRange") ?? "LAST_14_DAYS";

    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
    const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;

    if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId) {
      return NextResponse.json(
        { error: "Google Ads credentials not configured" },
        { status: 500 }
      );
    }

    const { GoogleAdsApi } = await import("google-ads-api");

    const client = new GoogleAdsApi({
      client_id: clientId,
      client_secret: clientSecret,
      developer_token: developerToken,
    });

    const customer = client.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
      login_customer_id: loginCustomerId,
    });

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
