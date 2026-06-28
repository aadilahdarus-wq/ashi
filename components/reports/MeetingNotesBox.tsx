"use client";

const quickChips = [
  { label: "+ Client flag", prefix: "[Client flag] " },
  { label: "+ Upcoming", prefix: "[Upcoming] " },
  { label: "+ Budget note", prefix: "[Budget note] " },
  { label: "+ Competitor note", prefix: "[Competitor note] " },
];

type MeetingNotesBoxProps = {
  notes: string;
  onNotesChange: (value: string) => void;
  onSaveRegenerate: () => void;
  isGenerating?: boolean;
};

export function MeetingNotesBox({
  notes,
  onNotesChange,
  onSaveRegenerate,
  isGenerating = false,
}: MeetingNotesBoxProps) {
  function appendChip(prefix: string) {
    onNotesChange(`${notes}${notes && !notes.endsWith("\n") ? "\n" : ""}${prefix}`);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div>
        <h2 className="text-[15px] font-semibold text-text">
          Your Meeting Notes
        </h2>
        <p className="mt-1 text-[13px] text-text-3">
          ASHI reads these when generating the summary
        </p>
      </div>

      <textarea
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        rows={4}
        placeholder="e.g. Client mentioned AGM season starting Aug, expecting surge in SIS rental enquiries..."
        className="mt-4 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-[13px] leading-relaxed text-text outline-none placeholder:text-text-4 focus:border-orange focus:ring-2 focus:ring-orange/15"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {quickChips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => appendChip(chip.prefix)}
            className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-[12px] font-medium text-text-3 transition-colors hover:border-orange-border hover:bg-orange-pale hover:text-orange"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={isGenerating}
        onClick={onSaveRegenerate}
        className="mt-4 rounded-lg bg-orange px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating ? "Generating..." : "✦ Save & Regenerate"}
      </button>
    </div>
  );
}
