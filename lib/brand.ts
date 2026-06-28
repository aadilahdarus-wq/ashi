export const amInterpretivBrand = {
  client: "AM Interpretiv",
  tone: "Professional, Direct, Technical",
  alwaysUse: ["Certified", "Accurate", "Native speakers"],
  neverUse: ["Cheap", "Free translation", "Guaranteed"],
} as const;

export const bannedWords = ["cheap", "guaranteed", "free translation"] as const;

export function hasBannedWord(text: string): boolean {
  const lower = text.toLowerCase();
  return bannedWords.some((word) => lower.includes(word));
}

export type CopyScore = "Strong" | "Good" | "Over limit";

export function getCopyScore(text: string, charLimit: number): CopyScore {
  if (text.length > charLimit) return "Over limit";
  if (text.length >= charLimit - 2) return "Strong";
  return "Good";
}
