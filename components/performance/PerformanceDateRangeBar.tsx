"use client";
// "use client" because this component uses useState to track which range
// is selected and needs to respond to clicks.

import { useState } from "react";

export type RangePreset = "7d" | "14d" | "30d" | "custom";

export type DateRangeValue = {
  preset: RangePreset;
  customStart?: string;
  customEnd?: string;
};

type Props = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  compareEnabled: boolean;
  onCompareChange: (enabled: boolean) => void;
};

const PRESETS: { key: RangePreset; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "14d", label: "Last 14 days" },
  { key: "30d", label: "Last 30 days" },
];

export function PerformanceDateRangeBar({
  value,
  onChange,
  compareEnabled,
  onCompareChange,
}: Props) {
  const [showCustom, setShowCustom] = useState(value.preset === "custom");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => {
              setShowCustom(false);
              onChange({ preset: preset.key });
            }}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              value.preset === preset.key
                ? "bg-orange text-white"
                : "text-text-2 hover:bg-surface-2"
            }`}
          >
            {preset.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setShowCustom(true);
            if (value.preset !== "custom") {
              const today = new Date().toISOString().slice(0, 10);
              const weekAgo = new Date(Date.now() - 6 * 86400000)
                .toISOString()
                .slice(0, 10);
              onChange({
                preset: "custom",
                customStart: weekAgo,
                customEnd: today,
              });
            }
          }}
          className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
            value.preset === "custom"
              ? "bg-orange text-white"
              : "text-text-2 hover:bg-surface-2"
          }`}
        >
          Custom
        </button>

        {showCustom && (
          <div className="flex items-center gap-2 pl-2">
            <input
              type="date"
              value={value.customStart ?? ""}
              onChange={(e) =>
                onChange({ ...value, preset: "custom", customStart: e.target.value })
              }
              className="rounded-lg border border-border bg-surface-2 px-2 py-1 text-[13px] text-text"
            />
            <span className="text-text-3">to</span>
            <input
              type="date"
              value={value.customEnd ?? ""}
              onChange={(e) =>
                onChange({ ...value, preset: "custom", customEnd: e.target.value })
              }
              className="rounded-lg border border-border bg-surface-2 px-2 py-1 text-[13px] text-text"
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-[13px] font-medium text-text-2">
        <input
          type="checkbox"
          checked={compareEnabled}
          onChange={(e) => onCompareChange(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-orange"
        />
        Compare to previous period
      </label>
    </div>
  );
}
