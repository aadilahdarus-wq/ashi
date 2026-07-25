import { NextResponse } from "next/server";
import { getGoogleAdsCustomer } from "@/lib/google-ads-client";

export async function GET() {
  try {
    const customer = await getGoogleAdsCustomer();

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = now.getDate();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const today = now.toISOString().slice(0, 10);

    const rows = await customer.query(`
      SELECT
        campaign.name,
        campaign_budget.amount_micros,
        metrics.cost_micros
      FROM campaign
      WHERE segments.date BETWEEN '${monthStart}' AND '${today}'
        AND campaign.status = 'ENABLED'
    `);

    const byCampaign = new Map<string, { dailyBudget: number; spentToDate: number }>();
    for (const row of rows as any[]) {
      const name: string = row.campaign.name;
      const entry = byCampaign.get(name) ?? {
        dailyBudget: row.campaign_budget.amount_micros / 1_000_000,
        spentToDate: 0,
      };
      entry.spentToDate += row.metrics.cost_micros / 1_000_000;
      byCampaign.set(name, entry);
    }

    // Google Ads only exposes a daily budget cap, not a native "monthly
    // budget" concept. We approximate a monthly target as
    // daily budget x days in month — an estimate, not a value Google sets.
    const budgetPacingRows = Array.from(byCampaign.entries()).map(([campaign, v]) => ({
      campaign,
      monthlyBudget: Math.round(v.dailyBudget * daysInMonth),
      spentToDate: Math.round(v.spentToDate),
      daysElapsed,
      daysInMonth,
    }));

    return NextResponse.json({ rows: budgetPacingRows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch budget pacing";
    console.error("Google Ads budget pacing error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
