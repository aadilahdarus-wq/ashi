import { getGoogleAdsCustomer } from "@/lib/google-ads-client";
import { CLAUDE_MODEL, extractTextContent, getAnthropicClient } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { sendTelegramMessage } from "@/lib/telegram";

type GoogleAdsCustomer = Awaited<ReturnType<typeof getGoogleAdsCustomer>>;

type WeeklyMetrics = {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
};

type SearchTermRow = {
  term: string;
  clicks: number;
  impressions: number;
  cost: number;
  conversions: number;
};

/** Last 7 full days, ending yesterday — so a Monday-morning run covers the
 * previous Mon–Sun. */
function getLastWeekWindow(): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return { start: fmt(start), end: fmt(end) };
}

async function fetchWeeklyMetrics(
  customer: GoogleAdsCustomer,
  start: string,
  end: string,
): Promise<WeeklyMetrics> {
  const rows = await customer.query(`
    SELECT metrics.impressions, metrics.clicks, metrics.conversions, metrics.cost_micros
    FROM campaign
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND campaign.status = 'ENABLED'
  `);

  let impressions = 0;
  let clicks = 0;
  let conversions = 0;
  let spend = 0;

  for (const row of rows as any[]) {
    impressions += row.metrics.impressions ?? 0;
    clicks += row.metrics.clicks ?? 0;
    conversions += row.metrics.conversions ?? 0;
    spend += (row.metrics.cost_micros ?? 0) / 1_000_000;
  }

  return { impressions, clicks, conversions: Math.round(conversions), spend };
}

async function fetchTopSearchTerms(
  customer: GoogleAdsCustomer,
  start: string,
  end: string,
): Promise<SearchTermRow[]> {
  const rows = await customer.query(`
    SELECT
      search_term_view.search_term,
      metrics.clicks,
      metrics.impressions,
      metrics.cost_micros,
      metrics.conversions
    FROM search_term_view
    WHERE segments.date BETWEEN '${start}' AND '${end}'
    ORDER BY metrics.clicks DESC
    LIMIT 40
  `);

  return (rows as any[]).map((row) => ({
    term: row.search_term_view.search_term,
    clicks: row.metrics.clicks ?? 0,
    impressions: row.metrics.impressions ?? 0,
    cost: (row.metrics.cost_micros ?? 0) / 1_000_000,
    conversions: row.metrics.conversions ?? 0,
  }));
}

async function generateInsightBullets(
  clientName: string,
  searchTerms: SearchTermRow[],
): Promise<string[]> {
  if (searchTerms.length === 0) return [];

  const termsList = searchTerms
    .slice(0, 30)
    .map((t) => `${t.term} — ${t.clicks} clicks, RM${t.cost.toFixed(0)} spent, ${t.conversions} conversions`)
    .join("\n");

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      system: `You write short, plain-English performance insights for a weekly client report. The reader is a non-technical business owner, not a marketer — never use jargon like "CTR", "impression share", or "match type". Output ONLY bullet lines, each starting with "• ", no preamble, no markdown, no headers. Write 1 to 2 bullets maximum. Focus on the single most useful pattern in the data — e.g. which theme, topic, or language of search term is driving the most clicks or conversions, or something notably early-stage or underperforming worth watching. If nothing stands out, it's fine to skip and return nothing.`,
      messages: [
        {
          role: "user",
          content: `Client: ${clientName}\n\nTop search terms this week (term — clicks, spend, conversions):\n${termsList}\n\nWrite 1-2 bullet insights a client would find useful, matching this style exactly:\n"The Arabic keywords are performing well and driving most of the results"\n"English keywords are still early and not many clicks yet — we'll keep an eye on these next month"`,
        },
      ],
    });

    const text = extractTextContent(response.content);
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("•"));
  } catch {
    // If Claude is unavailable, ship the numeric bullets anyway rather than
    // failing the whole report.
    return [];
  }
}

export async function buildWeeklyReport(clientName: string, customerId: string): Promise<string> {
  const { start, end } = getLastWeekWindow();
  const customer = await getGoogleAdsCustomer(customerId);

  const metrics = await fetchWeeklyMetrics(customer, start, end);
  const searchTerms = await fetchTopSearchTerms(customer, start, end);
  const insightBullets = await generateInsightBullets(clientName, searchTerms);

  const today = new Date();
  const dateLabel = `${today.getDate()}/${today.getMonth() + 1}`;

  const cpaLine =
    metrics.conversions > 0
      ? `• Total spend: RM${Math.round(metrics.spend)} — that's about RM${Math.round(metrics.spend / metrics.conversions)} per enquiry`
      : `• Total spend: RM${Math.round(metrics.spend)} — no enquiries recorded this week`;

  const lines = [
    `${clientName} Report - ${dateLabel}`,
    "",
    `• Your ad appeared ${metrics.impressions.toLocaleString()} times on Google`,
    `• ${metrics.clicks.toLocaleString()} people clicked on it`,
    `• You received ${metrics.conversions} enquiries via WhatsApp / contact form`,
    cpaLine,
    ...insightBullets,
  ];

  return lines.join("\n");
}

export type WeeklyReportRunResult = {
  client: string;
  status: "sent" | "failed";
  error?: string;
};

/** Builds and sends a weekly report to Telegram for every client that has a
 * Google Ads account linked. Shared by the cron endpoint and the in-app
 * "send now" test button. */
export async function runWeeklyReports(): Promise<WeeklyReportRunResult[]> {
  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, google_ads_customer_id")
    .not("google_ads_customer_id", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  const results: WeeklyReportRunResult[] = [];

  for (const client of clients ?? []) {
    if (!client.google_ads_customer_id || !client.name) continue;

    try {
      const report = await buildWeeklyReport(client.name, client.google_ads_customer_id);
      await sendTelegramMessage(report);
      results.push({ client: client.name, status: "sent" });
    } catch (err) {
      results.push({
        client: client.name,
        status: "failed",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return results;
}
