import { NextResponse } from "next/server";
import {
  CLAUDE_MODEL,
  extractTextContent,
  getAnthropicClient,
  parseJsonFromText,
} from "@/lib/anthropic";
import {
  getCopyScore,
  hasBannedWord,
  type CopyScore,
} from "@/lib/brand";
import {
  normalizeDescriptionStyle,
  normalizeHeadlineCategory,
  type DescriptionStyle,
  type HeadlineCategory,
} from "@/lib/copy-categories";

export type GenerateCopyResult = {
  text: string;
  charCount: number;
  score: CopyScore;
  hasBannedWord: boolean;
};

export type GenerateHeadlineResult = GenerateCopyResult & {
  category: HeadlineCategory;
};

export type GenerateDescriptionResult = GenerateCopyResult & {
  style: DescriptionStyle;
};

export type GenerateCopyResponse = {
  headlines: GenerateHeadlineResult[];
  descriptions: GenerateDescriptionResult[];
};

type GenerateCopyRequest = {
  campaign?: string;
  personas?: string[];
  angle?: string;
  goal?: string;
  campaignType?: string;
  headlineLimit?: number;
  descriptionLimit?: number;
};

type ClaudeHeadlineItem = {
  text?: string;
  category?: string;
  charCount?: number;
  score?: CopyScore;
  hasBannedWord?: boolean;
};

type ClaudeDescriptionItem = {
  text?: string;
  style?: string;
  charCount?: number;
  score?: CopyScore;
  hasBannedWord?: boolean;
};

type ClaudeCopyResponse = {
  headlines?: ClaudeHeadlineItem[];
  descriptions?: ClaudeDescriptionItem[];
};

function buildSystemPrompt(
  headlineLimit: number,
  descriptionLimit: number,
): string {
  return `You are an expert Google Ads copywriter for AM Interpretiv, a certified translation and interpretation company in Malaysia.

Brand rules:
- Tone: Professional, Direct, Technical
- Always use words like: Certified, Accurate, Native speakers
- NEVER use: Cheap, Free translation, Guaranteed
- Currency: MYR
- Target market: Malaysia

Generate exactly 15 headlines and 4 descriptions for Google RSA best practices.
Each headline must be unique with no repetition. Mix angles and include relevant keywords.

Headline category distribution (exactly 15 headlines):
- 3x CTA — e.g. "Get a Free Quote Today", "Request Your Quote Now", "Contact Us Today"
- 2x Brand — e.g. "AM Interpretiv Malaysia", "Trust AM Interpretiv"
- 4x USP — e.g. "Certified Native Translators", "Accurate Legal Translation", "ISO-Certified Translation", "Professional Interpreters"
- 2x Urgency — e.g. "Same-Day Translation Available", "Fast Turnaround Today" (never use the word Guaranteed)
- 2x Keyword — e.g. "Certified Translation Malaysia", "Document Translation KL"
- 2x Trust — e.g. "Trusted by 500+ Companies", "Official Certified Translators"

Description mix (exactly 4 descriptions, max ${descriptionLimit} chars each):
- 1x Benefit-led
- 1x Trust-led
- 1x Urgency-led
- 1x Service-led

Return ONLY valid JSON in this format:
{
  "headlines": [
    {
      "text": "...",
      "category": "CTA|Brand|USP|Urgency|Keyword|Trust",
      "charCount": 0,
      "score": "Strong|Good|Over limit",
      "hasBannedWord": false
    }
  ],
  "descriptions": [
    {
      "text": "...",
      "style": "Benefit|Trust|Urgency|Service",
      "charCount": 0,
      "score": "Strong|Good|Over limit",
      "hasBannedWord": false
    }
  ]
}

Each headline must be under ${headlineLimit} characters.
Each description must be under ${descriptionLimit} characters.
Mark hasBannedWord: true if it contains Cheap, Free translation, or Guaranteed.
Score as Over limit if exceeds character limit, Strong if under 90% of limit, Good otherwise.`;
}

function normalizeHeadline(
  item: ClaudeHeadlineItem,
  charLimit: number,
): GenerateHeadlineResult {
  const text = String(item.text ?? "").trim();
  return {
    text,
    category: normalizeHeadlineCategory(item.category),
    charCount: text.length,
    score: getCopyScore(text, charLimit),
    hasBannedWord: hasBannedWord(text),
  };
}

function normalizeDescription(
  item: ClaudeDescriptionItem,
  charLimit: number,
): GenerateDescriptionResult {
  const text = String(item.text ?? "").trim();
  return {
    text,
    style: normalizeDescriptionStyle(item.style),
    charCount: text.length,
    score: getCopyScore(text, charLimit),
    hasBannedWord: hasBannedWord(text),
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateCopyRequest;
    const campaign = body.campaign?.trim() || "Certified Translation";
    const personas = body.personas?.filter(Boolean) ?? [];
    const angle = body.angle?.trim() || "Let ASHI decide";
    const goal = body.goal?.trim() || "Get a free quote";
    const campaignType = body.campaignType?.trim() || "RSA";
    const headlineLimit = Number(body.headlineLimit) || 30;
    const descriptionLimit = Number(body.descriptionLimit) || 90;

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: buildSystemPrompt(headlineLimit, descriptionLimit),
      messages: [
        {
          role: "user",
          content: `Generate Google Ads RSA copy for this campaign.

Campaign: ${campaign}
Campaign type: ${campaignType}
Target personas: ${personas.length > 0 ? personas.join(", ") : "General business audience"}
Messaging angle: ${angle}
Conversion goal: ${goal}
Headline character limit: ${headlineLimit}
Description character limit: ${descriptionLimit}

Return exactly 15 headlines (H1–H15 category mix) and 4 descriptions as JSON only.`,
        },
      ],
    });

    const rawText = extractTextContent(response.content);
    const parsed = parseJsonFromText<ClaudeCopyResponse>(rawText);

    if (!parsed.headlines?.length && !parsed.descriptions?.length) {
      throw new Error("Claude returned an invalid copy response");
    }

    const result: GenerateCopyResponse = {
      headlines: (parsed.headlines ?? [])
        .slice(0, 15)
        .map((item) => normalizeHeadline(item, headlineLimit)),
      descriptions: (parsed.descriptions ?? [])
        .slice(0, 4)
        .map((item) => normalizeDescription(item, descriptionLimit)),
    };

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate copy";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
