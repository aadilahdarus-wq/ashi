import { NextResponse } from "next/server";
import {
  CLAUDE_MODEL,
  extractTextContent,
  getAnthropicClient,
} from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import type { PerformanceRow } from "@/lib/performance";

type AnalyzeRequest = {
  question: string;
  campaigns: PerformanceRow[];
  rangeLabel: string;
};

type Practice = {
  topic: string;
  rule: string;
  why: string | null;
  severity: "must" | "should" | "watch";
};

const SEV_LABELS = {
  must: "MUST FOLLOW",
  should: "RECOMMENDED",
  watch: "WATCH OUT",
};

async function fetchPracticesContext(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("practices")
      .select("topic, rule, why, severity")
      .eq("platform", "google")
      .order("severity")
      .order("topic");

    if (error || !data || data.length === 0) return "";

    const practices = data as Practice[];
    const byTopic: Record<string, Practice[]> = {};
    for (const p of practices) {
      if (!byTopic[p.topic]) byTopic[p.topic] = [];
      byTopic[p.topic].push(p);
    }

    const lines: string[] = [
      "ACCOUNT MANAGER'S METHODOLOGY — follow these rules when analysing campaigns:",
      "",
    ];

    for (const [topic, topicPractices] of Object.entries(byTopic)) {
      lines.push(`${topic.toUpperCase()}:`);
      for (const p of topicPractices) {
        lines.push(`[${SEV_LABELS[p.severity]}] ${p.rule}`);
        if (p.why) lines.push(`  → Why: ${p.why}`);
      }
      lines.push("");
    }

    return lines.join("\n");
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const question = body.question?.trim();
    const campaigns = body.campaigns ?? [];
    const rangeLabel = body.rangeLabel ?? "selected period";

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const practicesContext = await fetchPracticesContext();

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
      system: `You are ASHI, a personal AI marketing analyst for Dila — a Senior Digital Media Manager with 8 years of B2B paid media experience managing Google Ads for Malaysian SME clients.

Your job is to analyse paid media data and give clear, specific, actionable recommendations that reflect Dila's own methodology and experience.

${practicesContext ? practicesContext : ""}
GENERAL RULES:
- Be direct and specific — reference actual campaign names and numbers from the data.
- Keep recommendations practical for a small marketing team with limited budget.
- Use MYR currency when discussing costs.
- Format your response with short paragraphs or bullet points — no walls of text.
- If a campaign violates a MUST FOLLOW rule from the methodology above, flag it explicitly.
- Do not make up data that isn't in the context. If the data is insufficient to answer, say so clearly.
- Sound like a trusted colleague, not a generic AI tool.`,

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
    const message = error instanceof Error ? error.message : "Failed to analyse performance";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
