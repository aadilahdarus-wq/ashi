import { NextResponse } from "next/server";
import { formatGoogleAdsError, getGoogleAdsCustomer } from "@/lib/google-ads-client";
import { getPreviousWindow } from "@/lib/date-range";

function aggregate(rows: any[]) {
  let spend = 0;
  let conversions = 0;
  let conversionsValue = 0;

  for (const row of rows) {
    spend += row.metrics.cost_micros / 1_000_000;
    conversions += row.metrics.conversions ?? 0;
    conversionsValue += row.metrics.conversions_value ?? 0;
  }

  const roas = spend > 0 ? conversionsValue / spend : 0;
  const cpl = conversions > 0 ? spend / conversions : 0;
  return { spend, conversions, roas, cpl };
}

function pctChange(cur: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

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
    const start = fmt(startDate);
    const end = fmt(yesterday);
    const prevWindow = getPreviousWindow(start, end);

    const buildQuery = (s: string, e: string) => `
      SELECT metrics.cost_micros, metrics.conversions, metrics.conversions_value
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

    const spendChangePct = pctChange(cur.spend, prev.spend);
    const leadsChangePct = pctChange(cur.conversions, prev.conversions);
    const roasChangePct = pctChange(cur.roas, prev.roas);
    const cplChangePct = pctChange(cur.cpl, prev.cpl);

    // Rough heuristic score (not an official Google Ads metric): baseline 50,
    // nudged by lead growth, ROAS trend, and CPL trend vs the prior period.
    let healthScore = 50;
    healthScore += clamp(leadsChangePct ?? 0, -20, 20) * 0.75;
    healthScore += clamp(roasChangePct ?? 0, -20, 20) * 0.5;
    healthScore -= clamp(cplChangePct ?? 0, -20, 20) * 0.75;
    healthScore = Math.round(clamp(healthScore, 0, 100));

    let healthSummary: string;
    if (healthScore >= 75) {
      healthSummary =
        "Your account is performing well. Lead volume and efficiency are trending in the right direction.";
    } else if (healthScore >= 50) {
      healthSummary =
        "Your account is holding steady this period. A few metrics are worth keeping an eye on.";
    } else {
      healthSummary =
        "Performance is trending down this period — rising CPL or falling leads/ROAS need attention.";
    }

    return NextResponse.json({
      totalSpend: cur.spend,
      totalLeads: Math.round(cur.conversions),
      blendedRoas: cur.roas,
      avgCpl: cur.cpl,
      spendChangePct,
      leadsChangePct,
      roasChangePct,
      cplChangePct,
      cplChangeAbs: cur.cpl - prev.cpl,
      healthScore,
      healthSummary,
    });
  } catch (error) {
    const message = formatGoogleAdsError(error);
    console.error("Google Ads dashboard summary error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
