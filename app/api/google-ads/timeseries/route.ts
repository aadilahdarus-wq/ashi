import { NextResponse } from "next/server";
import { formatGoogleAdsError, getGoogleAdsCustomer } from "@/lib/google-ads-client";
import { getPreviousWindow } from "@/lib/date-range";

type SeriesPoint = {
  isoDate: string;
  date: string;
  spend: number;
  conversions: number;
};

function aggregateByDate(rows: any[]): Map<string, { spend: number; conversions: number }> {
  const map = new Map<string, { spend: number; conversions: number }>();
  for (const row of rows) {
    const date: string = row.segments.date;
    const entry = map.get(date) ?? { spend: 0, conversions: 0 };
    entry.spend += row.metrics.cost_micros / 1_000_000;
    entry.conversions += row.metrics.conversions ?? 0;
    map.set(date, entry);
  }
  return map;
}

// Fills in every day of the window (even zero-spend days) so the chart
// doesn't skip gaps where no campaign had activity.
function toSeries(
  map: Map<string, { spend: number; conversions: number }>,
  start: string,
  end: string
): SeriesPoint[] {
  const series: SeriesPoint[] = [];
  const cur = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);

  while (cur <= endDate) {
    const iso = cur.toISOString().slice(0, 10);
    const entry = map.get(iso) ?? { spend: 0, conversions: 0 };
    series.push({
      isoDate: iso,
      date: cur.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      spend: Math.round(entry.spend),
      conversions: Math.round(entry.conversions),
    });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  return series;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const compare = searchParams.get("compare") === "true";
    const customerId = searchParams.get("customerId");

    if (!start || !end) {
      return NextResponse.json({ error: "start and end date params are required" }, { status: 400 });
    }

    const customer = await getGoogleAdsCustomer(customerId);

    const buildQuery = (s: string, e: string) => `
      SELECT segments.date, metrics.cost_micros, metrics.conversions
      FROM campaign
      WHERE segments.date BETWEEN '${s}' AND '${e}'
        AND campaign.status = 'ENABLED'
    `;

    const currentRows = await customer.query(buildQuery(start, end));
    const series = toSeries(aggregateByDate(currentRows), start, end);

    let previousSeries: SeriesPoint[] | undefined;
    if (compare) {
      const prevWindow = getPreviousWindow(start, end);
      const previousRows = await customer.query(buildQuery(prevWindow.start, prevWindow.end));
      previousSeries = toSeries(aggregateByDate(previousRows), prevWindow.start, prevWindow.end);
    }

    return NextResponse.json({ series, previousSeries });
  } catch (error) {
    const message = formatGoogleAdsError(error);
    console.error("Google Ads timeseries error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
