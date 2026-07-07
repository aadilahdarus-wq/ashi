import { NextResponse } from "next/server";
import {
  CLAUDE_MODEL,
  extractTextContent,
  getAnthropicClient,
} from "@/lib/anthropic";
import type { PerformanceRow } from "@/lib/performance";

type AnalyzeRequest = {
  question: string;
  campaigns: PerformanceRow[];
  rangeLabel: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const question = body.question?.trim();
    const campaigns = body.campaigns ?? [];
    const rangeLabel = body.rangeLabel ?? "selected period";

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const campaignSummary = campaigns
      .map(
        (c) =>
          `• ${c.campaign}: ${c.impressions} impressions, ${c.clicks} clicks, CTR ${c.ctr}, CPC ${c.cpc}, Spend ${c.spend}, ${c.conversions} conversions, CPA ${c.cpa}`
      )
      .join("\n");

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: `You are ASHI, an AI marketing analyst specialising in Google Ads performance for Malaysian SME clients.

Your job is to analyse paid media data and give clear, specific, actionable recommendations.

Rules:
- Be direct and specific — reference actual campaign names and numbers from the data.
- Keep recommendations practical for a small marketing team with limited budget.
- Use MYR currency when discussing costs.
- Format your response with short paragraphs or bullet points — no walls of text.
- Do not make up data that isn't in the context. If the data is insufficient to answer, say so clearly.`,

      messages: [
        {
          role: "user",
          content: `Here is the campaign performance data for ${rangeLabel}:

${campaignSummary}

Question: ${question}`,
        },
      ],
    });

    const analysis = extractTextContent(response.content);

    return NextResponse.json({ analysis });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to analyse performance";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
