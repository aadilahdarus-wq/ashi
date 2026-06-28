import { NextResponse } from "next/server";
import {
  CLAUDE_MODEL,
  extractTextContent,
  getAnthropicClient,
  parseJsonFromText,
} from "@/lib/anthropic";
import {
  amInterpretivBrand,
  getCopyScore,
  hasBannedWord,
  type CopyScore,
} from "@/lib/brand";

export type GenerateCopyResult = {
  text: string;
  charCount: number;
  score: CopyScore;
  hasBannedWord: boolean;
};

type GenerateCopyRequest = {
  campaign?: string;
  personas?: string[];
  angle?: string;
  goal?: string;
  charLimit?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateCopyRequest;
    const campaign = body.campaign?.trim() || "Certified Translation";
    const personas = body.personas?.filter(Boolean) ?? [];
    const angle = body.angle?.trim() || "Let ASHI decide";
    const goal = body.goal?.trim() || "Get a free quote";
    const charLimit = Number(body.charLimit) || 30;

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: `You are ASHI, an ad copy generator for ${amInterpretivBrand.client}.

Brand rules:
- Tone: ${amInterpretivBrand.tone}
- Always use concepts like: ${amInterpretivBrand.alwaysUse.join(", ")}
- Never use these words or phrases: ${amInterpretivBrand.neverUse.join(", ")}

Generate Google Responsive Search Ad (RSA) headlines only.`,
      messages: [
        {
          role: "user",
          content: `Generate exactly 5 RSA headlines for this campaign.

Campaign: ${campaign}
Target personas: ${personas.length > 0 ? personas.join(", ") : "General business audience"}
Messaging angle: ${angle}
Conversion goal: ${goal}
Character limit: ${charLimit} characters per headline (strict)

Requirements:
- Each headline must be unique and compelling for Malaysia market
- Respect the ${charLimit}-character limit as closely as possible without going over
- Follow brand tone and never use banned words/phrases
- Return ONLY a valid JSON array of 5 strings, no markdown or commentary

Example format:
["Headline one", "Headline two", "Headline three", "Headline four", "Headline five"]`,
        },
      ],
    });

    const rawText = extractTextContent(response.content);
    const headlines = parseJsonFromText<string[]>(rawText);

    if (!Array.isArray(headlines) || headlines.length === 0) {
      throw new Error("Claude returned an invalid headlines array");
    }

    const results: GenerateCopyResult[] = headlines.slice(0, 5).map((headline) => {
      const text = String(headline).trim();
      return {
        text,
        charCount: text.length,
        score: getCopyScore(text, charLimit),
        hasBannedWord: hasBannedWord(text),
      };
    });

    return NextResponse.json({ headlines: results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate copy";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
