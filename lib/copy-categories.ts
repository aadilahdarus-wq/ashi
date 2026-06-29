export type HeadlineCategory =
  | "CTA"
  | "Brand"
  | "USP"
  | "Urgency"
  | "Keyword"
  | "Trust";

export type DescriptionStyle = "Benefit" | "Trust" | "Urgency" | "Service";

export const headlineCategoryStyles: Record<
  HeadlineCategory,
  { label: string; className: string }
> = {
  CTA: {
    label: "CTA",
    className: "bg-orange-pale text-orange",
  },
  Brand: {
    label: "Brand",
    className: "bg-[#EFF6FF] text-[#2563EB]",
  },
  USP: {
    label: "USP",
    className: "bg-green-pale text-green-text",
  },
  Urgency: {
    label: "Urgency",
    className: "bg-red-pale text-red-text",
  },
  Keyword: {
    label: "Keyword",
    className: "bg-[#F3E8FF] text-[#9333EA]",
  },
  Trust: {
    label: "Trust",
    className: "bg-[#CCFBF1] text-[#0D9488]",
  },
};

export const HEADLINE_CATEGORY_DISTRIBUTION: Array<{
  category: HeadlineCategory;
  count: number;
}> = [
  { category: "CTA", count: 3 },
  { category: "Brand", count: 2 },
  { category: "USP", count: 4 },
  { category: "Urgency", count: 2 },
  { category: "Keyword", count: 2 },
  { category: "Trust", count: 2 },
];

export function normalizeHeadlineCategory(value: unknown): HeadlineCategory {
  const categories: HeadlineCategory[] = [
    "CTA",
    "Brand",
    "USP",
    "Urgency",
    "Keyword",
    "Trust",
  ];
  if (typeof value === "string" && categories.includes(value as HeadlineCategory)) {
    return value as HeadlineCategory;
  }
  return "USP";
}

export function normalizeDescriptionStyle(value: unknown): DescriptionStyle {
  const styles: DescriptionStyle[] = ["Benefit", "Trust", "Urgency", "Service"];
  if (typeof value === "string" && styles.includes(value as DescriptionStyle)) {
    return value as DescriptionStyle;
  }
  return "Benefit";
}
