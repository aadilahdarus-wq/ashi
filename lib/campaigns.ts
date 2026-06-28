export type CampaignStatus = "Active" | "Learning" | "Paused";

export type TargetStatus = {
  label: string;
  tone: "success" | "warning" | "neutral" | "muted";
};

export type Campaign = {
  name: string;
  status: CampaignStatus;
  spend: string;
  leads: string;
  cpl: string;
  roas: string;
  target: TargetStatus;
};

export const campaigns: Campaign[] = [
  {
    name: "Brand Search",
    status: "Active",
    spend: "RM 4,210",
    leads: "234 leads",
    cpl: "RM 18 CPL",
    roas: "6.1× ROAS",
    target: { label: "✓ On target", tone: "success" },
  },
  {
    name: "PMax General",
    status: "Learning",
    spend: "RM 3,840",
    leads: "72 leads",
    cpl: "RM 53 CPL",
    roas: "3.8× ROAS",
    target: { label: "Wait", tone: "neutral" },
  },
  {
    name: "Certified Translation",
    status: "Active",
    spend: "RM 2,190",
    leads: "34 leads",
    cpl: "RM 65 CPL",
    roas: "2.8× ROAS",
    target: { label: "⚠ Above target", tone: "warning" },
  },
  {
    name: "Display Retargeting",
    status: "Paused",
    spend: "RM 2,240",
    leads: "8 leads",
    cpl: "RM 280 CPL",
    roas: "4.4× ROAS",
    target: { label: "Paused", tone: "muted" },
  },
];

export const statusStyles: Record<CampaignStatus, string> = {
  Active: "bg-green-pale text-green-text",
  Learning: "bg-orange-pale text-orange",
  Paused: "bg-surface-2 text-text-3",
};

export const targetStyles: Record<TargetStatus["tone"], string> = {
  success: "text-green-text",
  warning: "text-red-text",
  neutral: "text-text-3",
  muted: "text-text-4",
};
