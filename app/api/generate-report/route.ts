import {
  CLAUDE_MODEL,
  extractTextContent,
  getAnthropicClient,
  parseJsonFromText,
} from "@/lib/anthropic";
import { amInterpretivBrand } from "@/lib/brand";

export type ReportHighlights = {
  win: string;
  watch: string;
  nextSteps: string;
};

export type GenerateReportResult = {
  narrative: string;
  highlights: ReportHighlights;
  recommendations: string[];
};

type GenerateReportRequest = {
  meetingNotes?: string;
  kpis?: {
    spend?: string;
    leads?: string;
    cpl?: string;
    roas?: string;
  };
  period?: string;
};

function encodeSse(payload: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateReportRequest;
    const meetingNotes = body.meetingNotes?.trim() || "No meeting notes provided.";
    const period = body.period?.trim() || "the selected period";
    const kpis = {
      spend: body.kpis?.spend ?? "RM 12,480",
      leads: body.kpis?.leads ?? "348",
      cpl: body.kpis?.cpl ?? "RM 35.9",
      roas: body.kpis?.roas ?? "4.2×",
    };

    const client = getAnthropicClient();
    const stream = new TransformStream<Uint8Array, Uint8Array>();
    const writer = stream.writable.getWriter();

    void (async () => {
      try {
        const narrativeResponse = await client.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: 512,
          system: `You are ASHI, a performance marketing analyst writing client reports for ${amInterpretivBrand.client}. Tone: ${amInterpretivBrand.tone}.`,
          messages: [
            {
              role: "user",
              content: `Write a performance narrative for ${amInterpretivBrand.client} covering ${period}.

KPI data:
- Total spend: ${kpis.spend}
- Total leads: ${kpis.leads}
- Blended ROAS: ${kpis.roas}
- Average CPL: ${kpis.cpl}

Meeting notes from the account team:
${meetingNotes}

Write exactly one paragraph of about 150 words. Be specific, professional, and actionable. Reference the KPIs and any relevant context from the meeting notes. Output plain text only — no headings, bullets, or markdown.`,
            },
          ],
        });

        let narrative = "";

        for await (const event of narrativeResponse) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            narrative += event.delta.text;
            await writer.write(
              encodeSse({ type: "narrative_delta", text: event.delta.text }),
            );
          }
        }

        const structuredResponse = await client.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: 1024,
          system: `You are ASHI generating structured report insights for ${amInterpretivBrand.client}.`,
          messages: [
            {
              role: "user",
              content: `Based on this performance narrative, KPI data, and meeting notes, generate highlights and recommendations.

Period: ${period}
KPIs: spend ${kpis.spend}, leads ${kpis.leads}, ROAS ${kpis.roas}, CPL ${kpis.cpl}
Meeting notes: ${meetingNotes}

Narrative:
${narrative.trim()}

Return ONLY valid JSON in this exact shape:
{
  "highlights": {
    "win": "one sentence about the biggest win",
    "watch": "one sentence about what to watch",
    "nextSteps": "one sentence about recommended next steps"
  },
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3",
    "recommendation 4",
    "recommendation 5"
  ]
}`,
            },
          ],
        });

        const structuredText = extractTextContent(structuredResponse.content);
        const structured = parseJsonFromText<{
          highlights: ReportHighlights;
          recommendations: string[];
        }>(structuredText);

        await writer.write(
          encodeSse({
            type: "complete",
            narrative: narrative.trim(),
            highlights: structured.highlights,
            recommendations: structured.recommendations.slice(0, 5),
          }),
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to generate report";
        await writer.write(encodeSse({ type: "error", error: message }));
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate report";
    return Response.json({ error: message }, { status: 500 });
  }
}
