// Mock performance data for the Performance page.
// This mirrors the shape we'll eventually pull from Supabase / Google Ads,
// so swapping this out later won't require changing the chart or table components.

export type PerformancePoint = {
  /** ISO date string, e.g. "2026-06-01". Used internally for filtering by range. */
  isoDate: string;
  /** Human-readable label for the chart axis, e.g. "Jun 1". */
  date: string;
  spend: number; // MYR
  conversions: number;
};

/**
 * Generates mock daily performance data ending today, going back `days` days.
 * Using a generator function (instead of a hand-typed array) means we can
 * support "Last 7 days" / "Last 30 days" / custom ranges without manually
 * writing out dozens of fake rows. A gentle upward trend + a bit of
 * pseudo-randomness keeps it visually realistic.
 */
function generateMockSeries(days: number, seedOffset = 0): PerformancePoint[] {
  const points: PerformancePoint[] = [];12
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i - seedOffset);

    const dayIndex = days - i;
    const wave = Math.sin(dayIndex / 3) * 40;
    const trend = dayIndex * 6;
    const spend = Math.round(380 + trend + wave);
    const conversions = Math.max(
      4,
      Math.round(9 + dayIndex * 0.4 + Math.sin(dayIndex / 2.5) * 3)
    );

    points.push({
      isoDate: d.toISOString().slice(0, 10),
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      spend,
      conversions,
    });
  }

  return points;
}

// 90 days of "current" mock history. Date-range filtering (7d/14d/30d/custom)
// slices into this array rather than regenerating data each time.
export const performanceTimeSeries: PerformancePoint[] = generateMockSeries(90);

// A second series representing "the period before" each respective day,
// offset 90 days further back. Used for period-over-period comparison.
// In a real implementation this would instead be a second database query
// for the prior date range — here it's just shifted mock data.
export const performancePreviousPeriodSeries: PerformancePoint[] = generateMockSeries(
  90,
  90
);

/**
 * Filters a performance series down to a specific range.
 * - "7d" / "14d" / "30d" take the most recent N days.
 * - "custom" filters by the given start/end ISO dates (inclusive).
 */
export function filterByRange(
  series: PerformancePoint[],
  range: { preset: "7d" | "14d" | "30d" | "custom"; customStart?: string; customEnd?: string }
): PerformancePoint[] {
  if (range.preset === "7d") return series.slice(-7);
  if (range.preset === "14d") return series.slice(-14);
  if (range.preset === "30d") return series.slice(-30);

  if (range.preset === "custom" && range.customStart && range.customEnd) {
    return series.filter(
      (p) => p.isoDate >= range.customStart! && p.isoDate <= range.customEnd!
    );
  }

  return series;
}

export type PerformanceRow = {
  campaign: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  spend: string;
  conversions: string;
  cpa: string;
};

export const performanceRows: PerformanceRow[] = [
  {
    campaign: "Brand Search",
    impressions: "18,420",
    clicks: "1,240",
    ctr: "6.7%",
    cpc: "RM 3.40",
    spend: "RM 4,210",
    conversions: "234",
    cpa: "RM 18.00",
  },
  {
    campaign: "PMax General",
    impressions: "62,180",
    clicks: "2,910",
    ctr: "4.7%",
    cpc: "RM 1.32",
    spend: "RM 3,840",
    conversions: "72",
    cpa: "RM 53.30",
  },
  {
    campaign: "Certified Translation",
    impressions: "9,640",
    clicks: "410",
    ctr: "4.3%",
    cpc: "RM 5.34",
    spend: "RM 2,190",
    conversions: "34",
    cpa: "RM 64.40",
  },
  {
    campaign: "Display Retargeting",
    impressions: "84,300",
    clicks: "980",
    ctr: "1.2%",
    cpc: "RM 2.29",
    spend: "RM 2,240",
    conversions: "8",
    cpa: "RM 280.00",
  },
];

export const performanceSummary = {
  totalSpend: "RM 12,480",
  totalConversions: "348",
  avgCpa: "RM 35.86",
  ctrChange: "+8.2%",
};

export type BudgetPacingRow = {
  campaign: string;
  monthlyBudget: number;
  spentToDate: number;
  daysElapsed: number;
  daysInMonth: number;
};

export function getPacingStatus(row: BudgetPacingRow): {
  expectedSpendPct: number;
  actualSpendPct: number;
  status: "on-pace" | "underpacing" | "overspending";
  statusLabel: string;
  remainingBudget: number;
  projectedMonthEnd: number;
} {
  const expectedSpendPct = (row.daysElapsed / row.daysInMonth) * 100;
  const actualSpendPct = (row.spentToDate / row.monthlyBudget) * 100;
  const remainingBudget = row.monthlyBudget - row.spentToDate;
  const dailyRate = row.spentToDate / row.daysElapsed;
  const projectedMonthEnd = dailyRate * row.daysInMonth;
  let status: "on-pace" | "underpacing" | "overspending";
  let statusLabel: string;
  if (actualSpendPct > 100) { status = "overspending"; statusLabel = "Overspending"; }
  else if (actualSpendPct < expectedSpendPct - 20) { status = "underpacing"; statusLabel = "Underpacing"; }
  else { status = "on-pace"; statusLabel = "On Pace"; }
  return { expectedSpendPct, actualSpendPct, status, statusLabel, remainingBudget, projectedMonthEnd };
}

const now = new Date();
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const daysElapsed = now.getDate();

export const budgetPacingRows: BudgetPacingRow[] = [
  { campaign: "Brand Search", monthlyBudget: 5000, spentToDate: 4210, daysElapsed, daysInMonth },
  { campaign: "PMax General", monthlyBudget: 4000, spentToDate: 1980, daysElapsed, daysInMonth },
  { campaign: "Certified Translation", monthlyBudget: 2500, spentToDate: 2190, daysElapsed, daysInMonth },
  { campaign: "Display Retargeting", monthlyBudget: 2000, spentToDate: 2240, daysElapsed, daysInMonth },
];
