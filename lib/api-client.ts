import type { GenerateCopyResult } from "@/app/api/generate-copy/route";
import type { GenerateReportResult } from "@/app/api/generate-report/route";
import type { GeneratedCopy, GenerateMode, ScoreLabel } from "@/lib/ad-copy";

type GenerateCopyRequest = {
  campaign: string;
  personas: string[];
  angle: string;
  goal: string;
  charLimit: number;
};

export async function fetchGeneratedHeadlines(
  payload: GenerateCopyRequest,
): Promise<GenerateCopyResult[]> {
  const response = await fetch("/api/generate-copy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as {
    headlines?: GenerateCopyResult[];
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to generate headlines");
  }

  return data.headlines ?? [];
}

function mapScore(score: GenerateCopyResult["score"]): ScoreLabel {
  return score;
}

export function mapHeadlineResults(
  headlines: GenerateCopyResult[],
): GeneratedCopy[] {
  return headlines.map((headline, index) => ({
    id: `H${index + 1}`,
    label: `H${index + 1}`,
    text: headline.text,
    score: mapScore(headline.score),
  }));
}

export async function streamGeneratedReport(
  payload: {
    meetingNotes: string;
    kpis: {
      spend: string;
      leads: string;
      cpl: string;
      roas: string;
    };
    period: string;
  },
  handlers: {
    onNarrativeDelta: (text: string) => void;
    onComplete: (result: GenerateReportResult) => void;
    onError: (message: string) => void;
  },
): Promise<void> {
  const response = await fetch("/api/generate-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "Failed to generate report");
  }

  if (!response.body) {
    throw new Error("No response stream available");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const line = chunk.trim();
      if (!line.startsWith("data: ")) continue;

      const event = JSON.parse(line.slice(6)) as
        | { type: "narrative_delta"; text: string }
        | ({ type: "complete" } & GenerateReportResult)
        | { type: "error"; error: string };

      if (event.type === "narrative_delta") {
        handlers.onNarrativeDelta(event.text);
      } else if (event.type === "complete") {
        handlers.onComplete({
          narrative: event.narrative,
          highlights: event.highlights,
          recommendations: event.recommendations,
        });
      } else if (event.type === "error") {
        handlers.onError(event.error);
      }
    }
  }
}

export type { GenerateMode };
