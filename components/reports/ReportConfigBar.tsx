"use client";

const periods = ["Jun 1-14, 2026", "May 2026", "Apr 2026", "Custom range"];
const includeOptions = [
  "Full report",
  "Paid performance only",
  "Organic only",
  "Campaign breakdown",
];
const languages = ["English", "Bahasa Malaysia", "Both"];

type ReportConfigBarProps = {
  onRegenerate: () => void;
  isGenerating?: boolean;
};

export function ReportConfigBar({
  onRegenerate,
  isGenerating = false,
}: ReportConfigBarProps) {
  const selectClassName =
    "rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text outline-none focus:border-orange focus:ring-2 focus:ring-orange/15";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-text-3">
            Period
          </span>
          <select defaultValue={periods[0]} className={`w-full ${selectClassName}`}>
            {periods.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-text-3">
            Include
          </span>
          <select defaultValue={includeOptions[0]} className={`w-full ${selectClassName}`}>
            {includeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-text-3">
            Language
          </span>
          <select defaultValue={languages[0]} className={`w-full ${selectClassName}`}>
            {languages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        disabled={isGenerating}
        onClick={onRegenerate}
        className="shrink-0 rounded-lg bg-orange px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating ? "Generating..." : "✦ Regenerate Summary"}
      </button>
    </div>
  );
}
