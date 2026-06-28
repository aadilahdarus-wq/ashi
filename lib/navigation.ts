import type { NavIconName } from "@/components/icons";

export type NavItem = {
  label: string;
  href: string;
  icon: NavIconName;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Performance", href: "/performance", icon: "performance" },
      { label: "Budget Tracker", href: "/budget-tracker", icon: "budget" },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "AI Suggestions", href: "/ai-suggestions", icon: "ai" },
      { label: "Competitor Spy", href: "/competitor-spy", icon: "spy" },
      { label: "Prompts & Agents", href: "/prompts-agents", icon: "prompts" },
    ],
  },
  {
    title: "CREATIVE",
    items: [
      { label: "Ad Copy Studio", href: "/ad-copy-studio", icon: "adCopy" },
      {
        label: "Organic Performance",
        href: "/organic-performance",
        icon: "organic",
      },
      { label: "UTM Builder", href: "/utm-builder", icon: "utm" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Client Profile", href: "/client-profile", icon: "client" },
      {
        label: "Best Practices",
        href: "/best-practices",
        icon: "practices",
      },
      { label: "Reports", href: "/reports", icon: "reports" },
      { label: "Settings", href: "/settings", icon: "settings" },
    ],
  },
];

export const pageTitles: Record<string, string> = navSections
  .flatMap((section) => section.items)
  .reduce(
    (acc, item) => {
      acc[item.href] = item.label;
      return acc;
    },
    {} as Record<string, string>,
  );

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? "Dashboard";
}
