export type ReportBadgeTone = "orange" | "green" | "blue";

export type ReportListItem = {
  id: string;
  title: string;
  client?: string;
  period: string;
  badge: { label: string; tone: ReportBadgeTone };
};

export type ScheduledReport = {
  id: string;
  title: string;
  schedule: string;
  badge: { label: string; tone: ReportBadgeTone };
};

export const recentReports: ReportListItem[] = [
  {
    id: "june-full",
    title: "June Full Report",
    client: "AM Interpretiv",
    period: "Jun 1-14, 2026",
    badge: { label: "New", tone: "orange" },
  },
  {
    id: "may-paid",
    title: "May Paid Performance",
    period: "May 2026",
    badge: { label: "Sent", tone: "green" },
  },
  {
    id: "april-full",
    title: "April Full Report",
    period: "Apr 2026",
    badge: { label: "Sent", tone: "green" },
  },
];

export const scheduledReports: ScheduledReport[] = [
  {
    id: "monthly-full",
    title: "Monthly Full Report",
    schedule: "Sends 1st of each month",
    badge: { label: "Auto", tone: "blue" },
  },
];

export const reportBadgeStyles: Record<ReportBadgeTone, string> = {
  orange: "bg-orange-pale text-orange",
  green: "bg-green-pale text-green-text",
  blue: "bg-[#EFF6FF] text-[#2563EB] dark:bg-[#2563EB]/15 dark:text-[#60A5FA]",
};

export const reportRecommendations = [
  "Shift 15% of Display Retargeting budget into Brand Search while CPL remains below RM 20.",
  "Refresh Certified Translation ad copy to reduce CPL — current RSA headlines are nearing character limits.",
  "Prepare a PMax asset update before AGM season; client expects a surge in SIS rental enquiries from August.",
  "Add a WhatsApp enquiry extension to top-performing Certified Translation ads to match stated conversion goal.",
  "Review competitor activity on certified translation terms and adjust bids on high-intent keywords.",
];

export const reportSummary =
  "Overall performance for Jun 1–14 was strong, with total spend up 8.2% and leads growing 14.1% period-over-period. Brand Search continued to deliver efficient volume at RM 18 CPL, while Certified Translation remained active but above target at RM 65 CPL. PMax General is still in learning phase — hold major budget changes until conversion data stabilises. Display Retargeting remains paused pending creative refresh.";

export const reportHighlights = {
  win: "Brand Search delivered 234 leads at RM 18 CPL with 6.1× ROAS — the most efficient campaign this period.",
  watch: "Certified Translation CPL at RM 65 is above target; headline quality and landing page alignment need review.",
  nextSteps:
    "Client flagged AGM season from August — prepare SIS rental campaign assets and adjust monthly reporting cadence.",
};
