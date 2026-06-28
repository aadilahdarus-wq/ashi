export type CampaignType = "RSA" | "PMax" | "Meta" | "LinkedIn";

export type CampaignName =
  | "Certified Translation"
  | "Document Translation"
  | "SIS Equipment Rental"
  | "Remote Interpreting";

export type Angle =
  | "Let ASHI decide"
  | "Accuracy & certification"
  | "Urgency/deadline"
  | "Trust & experience"
  | "vs Google Translate";

export type Goal =
  | "Get a free quote"
  | "WhatsApp enquiry"
  | "Phone call";

export type GenerateMode = "headlines" | "descriptions" | "all";

export type ScoreLabel = "Strong" | "Good" | "Over limit";

export type GeneratedCopy = {
  id: string;
  label: string;
  text: string;
  score: ScoreLabel;
};

const bannedWords = ["guaranteed", "cheap", "free translation"];

export function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase();
  return bannedWords.some((word) => lower.includes(word));
}

export function getScore(text: string, maxChars: number): ScoreLabel {
  if (text.length > maxChars) return "Over limit";
  if (text.length >= maxChars - 2) return "Strong";
  return "Good";
}

const headlineSets: Record<CampaignName, string[]> = {
  "Certified Translation": [
    "Certified Translation Malaysia",
    "Get a Free Quote Today",
    "Accurate. Native. Professional.",
    "Official Certified Translators",
    "Cheap Certified Translation",
  ],
  "Document Translation": [
    "Document Translation Services",
    "Fast, Accurate Document Translation",
    "Certified Document Experts",
    "Translate Documents with Confidence",
    "Professional Document Translation",
  ],
  "SIS Equipment Rental": [
    "SIS Equipment Rental Malaysia",
    "Reliable Interpretation Equipment",
    "Rent Booths & Headsets Today",
    "Conference Equipment Hire",
    "Professional SIS Gear on Demand",
  ],
  "Remote Interpreting": [
    "Remote Interpreting Services",
    "Live Interpreters On Demand",
    "Connect with Native Interpreters",
    "Remote Conference Interpreting",
    "Professional Remote Interpreting",
  ],
};

const descriptionSets: Record<CampaignName, string[]> = {
  "Certified Translation": [
    "Certified translation by native speakers. Accurate, professional results for legal and business documents.",
    "Need certified translation? Get a free quote from Malaysia's trusted translation team today.",
    "Professional certified translation services. Fast turnaround with accuracy you can rely on.",
    "Accurate certified translations for HR, legal, and corporate teams across Malaysia.",
    "Guaranteed cheap translation — contact us for certified document translation services.",
  ],
  "Document Translation": [
    "Professional document translation by experienced native linguists. Request your free quote today.",
    "Translate contracts, certificates, and reports with certified accuracy and fast delivery.",
    "Document translation services tailored for legal, medical, and corporate teams in Malaysia.",
    "Accurate document translation with clear pricing and reliable turnaround times.",
    "Trusted document translators delivering certified quality for every file type.",
  ],
  "SIS Equipment Rental": [
    "Rent professional SIS booths, headsets, and interpretation equipment for your next event.",
    "Full-service conference equipment rental with setup support across Malaysia.",
    "Reliable SIS gear for conferences, meetings, and multilingual events of any size.",
    "Professional interpretation equipment hire with flexible packages and fast delivery.",
    "Conference interpreting equipment rental from a team you can trust on event day.",
  ],
  "Remote Interpreting": [
    "Book remote interpreters for meetings, webinars, and conferences with seamless setup.",
    "Professional remote interpreting with native speakers available on short notice.",
    "Connect your team to live interpreters anywhere with reliable remote support.",
    "Remote interpreting services built for corporate, legal, and conference use cases.",
    "Scale multilingual communication with experienced remote interpreters on demand.",
  ],
};

function buildItems(
  texts: string[],
  prefix: "H" | "D",
  maxChars: number,
): GeneratedCopy[] {
  return texts.map((text, index) => ({
    id: `${prefix}${index + 1}`,
    label: `${prefix}${index + 1}`,
    text,
    score: getScore(text, maxChars),
  }));
}

export function generateCopy(options: {
  campaign: CampaignName;
  mode: GenerateMode;
  headlineMax: number;
  descriptionMax: number;
}): { headlines: GeneratedCopy[]; descriptions: GeneratedCopy[] } {
  const headlines = buildItems(
    headlineSets[options.campaign],
    "H",
    options.headlineMax,
  );
  const descriptions = buildItems(
    descriptionSets[options.campaign],
    "D",
    options.descriptionMax,
  );

  if (options.mode === "headlines") {
    return { headlines, descriptions: [] };
  }

  if (options.mode === "descriptions") {
    return { headlines: [], descriptions };
  }

  return { headlines, descriptions };
}

export function hasBestPracticeViolation(items: GeneratedCopy[]): boolean {
  return items.some((item) => containsBannedWords(item.text));
}
