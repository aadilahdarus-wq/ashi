import { NextResponse } from "next/server";
import { getGoogleAdsCustomer } from "@/lib/google-ads-client";
import { getPreviousWindow } from "@/lib/date-range";

function aggregate(rows: any[]) {
  let spend = 0;
  let conversions = 0;
  let clicks = 0;
  let impressions = 0;

  for (const row of rows) {
    spend += row.metrics.cost_micros / 1_000_000;
    conversions += row.metrics.conversions ?? 0;
    clicks += row.metrics.clicks ?? 0;
    impressions += row.metrics.impressions ?? 0;
  }

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  return { spend, conversions, ctr };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json({ error: "start and end date params are required" }, { status: 400 });
    }

    const customer = await getGoogleAdsCustomer();
    const prevWindow = getPreviousWindow(start, end);

    const buildQuery = (s: string, e: string) => `
      SELECT metrics.cost_micros, metrics.conversions, metrics.clicks, metrics.impressions
      FROM campaign
      WHERE segments.date BETWEEN '${s}' AND '${e}'
        AND campaign.status = 'ENABLED'
    `;

    const [currentRows, previousRows] = await Promise.all([
      customer.query(buildQuery(start, end)),
      customer.query(buildQuery(prevWindow.start, prevWindow.end)),
    ]);

    const cur = aggregate(currentRows);
    const prev = aggregate(previousRows);

    const avgCpa = cur.conversions > 0 ? cur.spend / cur.conversions : 0;
    const ctrChangePct = prev.ctr > 0 ? ((cur.ctr - prev.ctr) / prev.ctr) * 100 : 0;

    return NextResponse.json({
      totalSpend: `RM ${cur.spend.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`,
      totalConversions: Math.round(cur.conversions).toString(),
      avgCpa: `RM ${avgCpa.toFixed(2)}`,
      ctrChange: `${ctrChangePct >= 0 ? "+" : ""}${ctrChangePct.toFixed(1)}%`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch performance summary";
    console.error("Google Ads summary error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
