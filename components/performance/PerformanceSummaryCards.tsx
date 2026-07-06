import { performanceSummary } from "@/lib/performance";

const stats = [
  { label: "Total Spend", value: performanceSummary.totalSpend },
  { label: "Total Conversions", value: performanceSummary.totalConversions },
  { label: "Avg. CPA", value: performanceSummary.avgCpa },
  { label: "CTR vs last period", value: performanceSummary.ctrChange },
];

export function PerformanceSummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <p className="text-[13px] font-medium text-text-3">{stat.label}</p>
          <p className="mt-3 text-[26px] font-semibold leading-none tracking-tight text-text">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
