"use client";

import {
  recentReports,
  reportBadgeStyles,
  scheduledReports,
  type ReportListItem,
} from "@/lib/reports";

type ReportSidebarProps = {
  selectedReportId: string;
  onSelectReport: (id: string) => void;
};

function ReportBadge({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof reportBadgeStyles;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${reportBadgeStyles[tone]}`}
    >
      {label}
    </span>
  );
}

function ReportListButton({
  report,
  selected,
  onSelect,
}: {
  report: ReportListItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-lg border px-3 py-3 text-left transition-colors",
        selected
          ? "border-orange-border bg-orange-pale"
          : "border-transparent bg-surface hover:bg-surface-2",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium text-text">{report.title}</p>
        <ReportBadge label={report.badge.label} tone={report.badge.tone} />
      </div>
      {report.client && (
        <p className="mt-1 text-[12px] text-text-3">{report.client}</p>
      )}
      <p className="mt-0.5 text-[12px] text-text-4">{report.period}</p>
    </button>
  );
}

export function ReportSidebar({
  selectedReportId,
  onSelectReport,
}: ReportSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col rounded-xl border border-border bg-surface xl:w-[280px] xl:max-h-[calc(100vh-140px)]">
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-[13px] font-semibold text-text">Recent reports</h2>
      </div>

      <div className="space-y-1 overflow-y-auto p-2">
        {recentReports.map((report) => (
          <ReportListButton
            key={report.id}
            report={report}
            selected={selectedReportId === report.id}
            onSelect={() => onSelectReport(report.id)}
          />
        ))}
      </div>

      <div className="border-t border-border px-4 py-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-4">
          Scheduled
        </h3>
        <div className="mt-2 space-y-1">
          {scheduledReports.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-border bg-surface-2/50 px-3 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-medium text-text">
                  {report.title}
                </p>
                <ReportBadge
                  label={report.badge.label}
                  tone={report.badge.tone}
                />
              </div>
              <p className="mt-1 text-[12px] text-text-3">{report.schedule}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-border p-3">
        <button
          type="button"
          className="w-full rounded-lg border border-dashed border-border px-4 py-2.5 text-[13px] font-medium text-text-3 transition-colors hover:border-orange hover:bg-orange-pale hover:text-orange"
        >
          + New Report
        </button>
      </div>
    </aside>
  );
}
