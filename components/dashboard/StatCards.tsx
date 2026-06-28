type StatCardProps = {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
};

const stats: StatCardProps[] = [
  {
    label: "Total Spend",
    value: "RM 12,480",
    change: "↑8.2%",
    changeType: "positive",
  },
  {
    label: "Total Leads",
    value: "348",
    change: "↑14.1%",
    changeType: "positive",
  },
  {
    label: "Blended ROAS",
    value: "4.2×",
    change: "stable",
    changeType: "neutral",
  },
  {
    label: "Avg CPL",
    value: "RM 35.9",
    change: "↑RM4.2",
    changeType: "negative",
  },
];

function ChangeBadge({
  change,
  changeType,
}: {
  change: string;
  changeType: StatCardProps["changeType"];
}) {
  const styles = {
    positive: "bg-green-pale text-green-text",
    negative: "bg-red-pale text-red-text",
    neutral: "bg-surface-2 text-text-3",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${styles[changeType]}`}
    >
      {change}
    </span>
  );
}

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <p className="text-[13px] font-medium text-text-3">{stat.label}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-[26px] font-semibold leading-none tracking-tight text-text">
              {stat.value}
            </p>
            <ChangeBadge change={stat.change} changeType={stat.changeType} />
          </div>
        </div>
      ))}
    </div>
  );
}
