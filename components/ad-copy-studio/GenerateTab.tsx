"use client";

import { useMemo, useState } from "react";
import {
  fetchGeneratedCopy,
  hasBannedWordViolation,
  mapDescriptionResults,
  mapHeadlineResults,
} from "@/lib/api-client";
import {
  headlineCategoryStyles,
  type HeadlineCategory,
} from "@/lib/copy-categories";
import { saveCopyToBank } from "@/lib/saved-copy";
import { useClient } from "@/lib/client-context";
import type {
  Angle,
  CampaignName,
  CampaignType,
  GeneratedCopy,
  GenerateMode,
  Goal,
} from "@/lib/ad-copy";

const campaignTypes: CampaignType[] = ["RSA", "PMax", "Meta", "LinkedIn"];

const campaigns: CampaignName[] = [
  "Certified Translation",
  "Document Translation",
  "SIS Equipment Rental",
  "Remote Interpreting",
];

const angles: Angle[] = [
  "Let ASHI decide",
  "Accuracy & certification",
  "Urgency/deadline",
  "Trust & experience",
  "vs Google Translate",
];

const goals: Goal[] = [
  "Get a free quote",
  "WhatsApp enquiry",
  "Phone call",
];

const defaultPersonas = [
  "HR Managers",
  "Legal Professionals",
  "Conference Organisers",
];

function LoadingSpinner() {
  return (
    <div
      className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent"
      aria-hidden="true"
    />
  );
}

function CategoryBadge({ category }: { category: HeadlineCategory }) {
  const config = headlineCategoryStyles[category];
  return (
    <span
      className={`inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function CharacterBar({
  text,
  maxChars,
}: {
  text: string;
  maxChars: number;
}) {
  const length = text.length;
  const ratio = Math.min(length / maxChars, 1);
  const overLimit = length > maxChars;

  return (
    <div className="flex min-w-[120px] flex-col gap-1">
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full transition-all ${overLimit ? "bg-red" : "bg-orange"}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span
        className={`text-[11px] font-medium ${overLimit ? "text-red-text" : "text-text-3"}`}
      >
        {length}/{maxChars} chars
      </span>
    </div>
  );
}

function ScoreBadge({ score }: { score: GeneratedCopy["score"] }) {
  const styles = {
    Strong: "bg-green-pale text-green-text",
    Good: "bg-surface-2 text-text-3",
    "Over limit": "bg-red-pale text-red-text",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${styles[score]}`}
    >
      {score}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium text-text-3 transition-colors hover:bg-surface-2 hover:text-text-2"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function HeadlineResultRow({
  item,
  maxChars,
  selected,
  onToggle,
}: {
  item: GeneratedCopy;
  maxChars: number;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-5 py-4 last:border-b-0 lg:flex-row lg:items-center">
      <div className="flex items-center gap-2 shrink-0">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="h-4 w-4 rounded border-border text-orange focus:ring-orange"
          aria-label={`Select ${item.label}`}
        />
        <span className="w-8 text-[12px] font-semibold text-text-3">
          {item.label}
        </span>
        {item.category && <CategoryBadge category={item.category} />}
      </div>
      <p className="min-w-0 flex-1 text-[13px] font-medium text-text">
        {item.text}
      </p>
      <CharacterBar text={item.text} maxChars={maxChars} />
      <ScoreBadge score={item.score} />
      <CopyButton text={item.text} />
    </div>
  );
}

function DescriptionResultRow({
  item,
  maxChars,
}: {
  item: GeneratedCopy;
  maxChars: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-5 py-4 last:border-b-0 lg:flex-row lg:items-center">
      <div className="flex items-center gap-2 shrink-0">
        <span className="w-8 text-[12px] font-semibold text-text-3">
          {item.label}
        </span>
        {item.style && (
          <span className="inline-flex rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-3">
            {item.style}
          </span>
        )}
      </div>
      <p className="min-w-0 flex-1 text-[13px] font-medium text-text">
        {item.text}
      </p>
      <CharacterBar text={item.text} maxChars={maxChars} />
      <ScoreBadge score={item.score} />
      <CopyButton text={item.text} />
    </div>
  );
}

export function GenerateTab() {
  const { selectedClient } = useClient();
  const [campaignType, setCampaignType] = useState<CampaignType>("RSA");
  const [campaign, setCampaign] = useState<CampaignName>("Certified Translation");
  const [personas, setPersonas] = useState<string[]>(defaultPersonas);
  const [personaInput, setPersonaInput] = useState("");
  const [angle, setAngle] = useState<Angle>("Let ASHI decide");
  const [goal, setGoal] = useState<Goal>("Get a free quote");
  const [headlineMax, setHeadlineMax] = useState(30);
  const [descriptionMax, setDescriptionMax] = useState(90);
  const [results, setResults] = useState<{
    headlines: GeneratedCopy[];
    descriptions: GeneratedCopy[];
  } | null>(null);
  const [selectedHeadlines, setSelectedHeadlines] = useState<Set<string>>(
    new Set(),
  );
  const [lastMode, setLastMode] = useState<GenerateMode>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copyAllDone, setCopyAllDone] = useState(false);
  const [bankMessage, setBankMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visibleItems = useMemo(
    () => [
      ...(results?.headlines ?? []),
      ...(results?.descriptions ?? []),
    ],
    [results],
  );

  const showViolation = useMemo(
    () => hasBannedWordViolation(visibleItems),
    [visibleItems],
  );

  function addPersona() {
    const value = personaInput.trim();
    if (!value || personas.includes(value)) return;
    setPersonas((current) => [...current, value]);
    setPersonaInput("");
  }

  function removePersona(value: string) {
    setPersonas((current) => current.filter((persona) => persona !== value));
  }

  function toggleHeadline(id: string) {
    setSelectedHeadlines((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleGenerate(mode: GenerateMode) {
    setIsGenerating(true);
    setError(null);
    setBankMessage(null);
    setLastMode(mode);
    setSelectedHeadlines(new Set());

    try {
      const response = await fetchGeneratedCopy({
        campaign,
        personas,
        angle,
        goal,
        campaignType,
        headlineLimit: headlineMax,
        descriptionLimit: descriptionMax,
      });

      const headlines = mapHeadlineResults(response.headlines);
      const descriptions = mapDescriptionResults(response.descriptions);

      if (mode === "headlines") {
        setResults({ headlines, descriptions: [] });
      } else if (mode === "descriptions") {
        setResults({ headlines: [], descriptions });
      } else {
        setResults({ headlines, descriptions });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate copy");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopyAll() {
    if (!results?.headlines.length) return;
    const text = results.headlines.map((item) => item.text).join("\n");
    await navigator.clipboard.writeText(text);
    setCopyAllDone(true);
    window.setTimeout(() => setCopyAllDone(false), 2000);
  }

  async function handleSaveToBank() {
    if (!results?.headlines.length || selectedHeadlines.size === 0 || !selectedClient) return;

    setIsSaving(true);
    setError(null);
    setBankMessage(null);

    try {
      const items = results.headlines
        .filter((item) => selectedHeadlines.has(item.id))
        .map((item) => ({
          copyType: "headline" as const,
          text: item.text,
          category: item.category ?? null,
          campaign,
          charCount: item.text.length,
          score: item.score,
        }));

      await saveCopyToBank(selectedClient.id, items);
      setBankMessage(`Saved ${items.length} headline${items.length === 1 ? "" : "s"} to bank`);
      setSelectedHeadlines(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save to bank");
    } finally {
      setIsSaving(false);
    }
  }

  const selectClassName =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[13px] text-text outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/15";

  const buttonDisabledClass = isGenerating
    ? "cursor-not-allowed opacity-60"
    : "hover:opacity-90";

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
      <div className="w-full shrink-0 rounded-xl border border-border bg-surface p-5 xl:w-[320px]">
        <div className="rounded-lg border border-orange-border bg-orange-pale px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-orange">
            Auto-loaded from AM Interpretiv
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-text-2">
            <span className="font-medium text-text">Tone:</span> Professional,
            Direct, Technical
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-text-2">
            <span className="font-medium text-text">Always use:</span> Certified,
            Accurate, Native speakers
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-text-2">
            <span className="font-medium text-text">Never use:</span> Cheap, Free
            translation, Guaranteed
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[13px] font-medium text-text-2">
            Campaign type
          </p>
          <div className="grid grid-cols-2 gap-2">
            {campaignTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCampaignType(type)}
                className={[
                  "rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-colors",
                  campaignType === type
                    ? "border-orange bg-orange-pale text-orange"
                    : "border-border bg-surface text-text-2 hover:bg-surface-2",
                ].join(" ")}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">
            Campaign
          </span>
          <select
            value={campaign}
            onChange={(event) =>
              setCampaign(event.target.value as CampaignName)
            }
            className={selectClassName}
          >
            {campaigns.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">
            Target Personas
          </span>
          <div className="flex flex-wrap gap-2">
            {personas.map((persona) => (
              <span
                key={persona}
                className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[12px] text-text-2"
              >
                {persona}
                <button
                  type="button"
                  onClick={() => removePersona(persona)}
                  className="text-text-4 transition-colors hover:text-text-2"
                  aria-label={`Remove ${persona}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={personaInput}
              onChange={(event) => setPersonaInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addPersona();
                }
              }}
              placeholder="Add persona"
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text outline-none placeholder:text-text-4 focus:border-orange focus:ring-2 focus:ring-orange/15"
            />
            <button
              type="button"
              onClick={addPersona}
              className="rounded-lg border border-border px-3 py-2 text-[12px] font-medium text-text-3 transition-colors hover:bg-surface-2"
            >
              Add
            </button>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">
            Angle
          </span>
          <select
            value={angle}
            onChange={(event) => setAngle(event.target.value as Angle)}
            className={selectClassName}
          >
            {angles.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">
            Goal
          </span>
          <select
            value={goal}
            onChange={(event) => setGoal(event.target.value as Goal)}
            className={selectClassName}
          >
            {goals.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-text-2">
              Headline max
            </span>
            <input
              type="number"
              min={1}
              value={headlineMax}
              onChange={(event) =>
                setHeadlineMax(Number(event.target.value) || 1)
              }
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[13px] text-text outline-none focus:border-orange focus:ring-2 focus:ring-orange/15"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-text-2">
              Description max
            </span>
            <input
              type="number"
              min={1}
              value={descriptionMax}
              onChange={(event) =>
                setDescriptionMax(Number(event.target.value) || 1)
              }
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[13px] text-text outline-none focus:border-orange focus:ring-2 focus:ring-orange/15"
            />
          </label>
        </div>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate("headlines")}
            className={`w-full rounded-lg bg-orange px-4 py-2.5 text-[13px] font-medium text-white transition-opacity ${buttonDisabledClass}`}
          >
            {isGenerating ? "Generating..." : "✦ Headlines Only"}
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate("descriptions")}
            className={`w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-[13px] font-medium text-white transition-opacity ${buttonDisabledClass}`}
          >
            {isGenerating ? "Generating..." : "✦ Descriptions Only"}
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate("all")}
            className={`w-full rounded-lg bg-text px-4 py-2.5 text-[13px] font-medium text-surface transition-opacity ${buttonDisabledClass}`}
          >
            {isGenerating ? "Generating..." : "✦ Generate All"}
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface">
        {error && (
          <div className="border-b border-red/20 bg-red-pale px-5 py-3">
            <p className="text-[13px] font-medium text-red-text">{error}</p>
          </div>
        )}

        {bankMessage && (
          <div className="border-b border-green/20 bg-green-pale px-5 py-3">
            <p className="text-[13px] font-medium text-green-text">{bankMessage}</p>
          </div>
        )}

        {isGenerating ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
            <LoadingSpinner />
            <div>
              <p className="text-[15px] font-semibold text-text">
                Generating copy...
              </p>
              <p className="mt-2 text-[13px] text-text-3">
                Claude is writing 15 RSA headlines and 4 descriptions for{" "}
                {campaign}.
              </p>
            </div>
          </div>
        ) : !results ? (
          <div className="flex min-h-[420px] items-center justify-center p-8 text-center">
            <div>
              <p className="text-[15px] font-semibold text-text">
                Ready to generate
              </p>
              <p className="mt-2 text-[13px] text-text-3">
                Configure context on the left, then choose a generate option.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
              <p className="text-[13px] font-medium text-text-2">
                Generated results
              </p>
              <div className="flex flex-wrap gap-2">
                {results.headlines.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 transition-colors hover:bg-surface-2"
                    >
                      {copyAllDone ? "Copied!" : "Copy All"}
                    </button>
                    <button
                      type="button"
                      disabled={isSaving || selectedHeadlines.size === 0 || !selectedClient}
                      onClick={handleSaveToBank}
                      className="rounded-lg bg-orange px-3 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isSaving
                        ? "Saving..."
                        : `Save to Bank${selectedHeadlines.size > 0 ? ` (${selectedHeadlines.size})` : ""}`}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleGenerate(lastMode)}
                  className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 transition-colors hover:bg-surface-2"
                >
                  Regenerate
                </button>
              </div>
            </div>

            {showViolation && (
              <div className="border-b border-red/20 bg-red-pale px-5 py-3">
                <p className="text-[13px] font-medium text-red-text">
                  Best practice flag: One or more results contain banned words
                  (&quot;Guaranteed&quot;, &quot;Cheap&quot;, or &quot;Free
                  translation&quot;). Review before publishing.
                </p>
              </div>
            )}

            {results.headlines.length > 0 && (
              <div>
                <div className="border-b border-border px-5 py-3">
                  <h3 className="text-[13px] font-semibold text-text">
                    Headlines ({results.headlines.length})
                  </h3>
                  <p className="mt-1 text-[12px] text-text-3">
                    Select headlines to save to your copy bank.
                  </p>
                </div>
                {results.headlines.map((item) => (
                  <HeadlineResultRow
                    key={item.id}
                    item={item}
                    maxChars={headlineMax}
                    selected={selectedHeadlines.has(item.id)}
                    onToggle={() => toggleHeadline(item.id)}
                  />
                ))}
              </div>
            )}

            {results.descriptions.length > 0 && (
              <div>
                <div className="border-b border-border px-5 py-3">
                  <h3 className="text-[13px] font-semibold text-text">
                    Descriptions ({results.descriptions.length})
                  </h3>
                </div>
                {results.descriptions.map((item) => (
                  <DescriptionResultRow
                    key={item.id}
                    item={item}
                    maxChars={descriptionMax}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
