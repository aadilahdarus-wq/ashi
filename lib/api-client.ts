import type {
  GenerateCopyResponse,
  GenerateDescriptionResult,
  GenerateHeadlineResult,
} from "@/app/api/generate-copy/route";
import type { GenerateReportResult } from "@/app/api/generate-report/route";
import type { GeneratedCopy, GenerateMode, ScoreLabel } from "@/lib/ad-copy";

export type GenerateCopyRequest = {
  campaign: string;
  personas: string[];
  angle: string;
  goal: string;
  campaignType: string;
  headlineLimit: number;
  descriptionLimit: number;
};

export async function fetchGeneratedCopy(
  payload: GenerateCopyRequest,
): Promise<GenerateCopyResponse> {
  const response = await fetch("/api/generate-copy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as GenerateCopyResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to generate copy");
  }

  return {
    headlines: data.headlines ?? [],
    descriptions: data.descriptions ?? [],
  };
}

function mapScore(score: GenerateHeadlineResult["score"]): ScoreLabel {
  return score;
}

export function mapHeadlineResults(
  items: GenerateHeadlineResult[],
): GeneratedCopy[] {
  return items.map((item, index) => ({
    id: `H${index + 1}`,
    label: `H${index + 1}`,
    text: item.text,
    score: mapScore(item.score),
    hasBannedWord: item.hasBannedWord,
    category: item.category,
  }));
}

export function mapDescriptionResults(
  items: GenerateDescriptionResult[],
): GeneratedCopy[] {
  return items.map((item, index) => ({
    id: `D${index + 1}`,
    label: `D${index + 1}`,
    text: item.text,
    score: mapScore(item.score),
    hasBannedWord: item.hasBannedWord,
    style: item.style,
  }));
}

export function hasBannedWordViolation(items: GeneratedCopy[]): boolean {
  return items.some((item) => item.hasBannedWord);
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
