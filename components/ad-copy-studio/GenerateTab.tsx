"use client";

import { useMemo, useState } from "react";
import {
  fetchGeneratedHeadlines,
  mapHeadlineResults,
} from "@/lib/api-client";
import {
  generateCopy,
  hasBestPracticeViolation,
  type Angle,
  type CampaignName,
  type CampaignType,
  type GeneratedCopy,
  type GenerateMode,
  type Goal,
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

function ResultRow({
  item,
  maxChars,
}: {
  item: GeneratedCopy;
  maxChars: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-5 py-4 last:border-b-0 sm:flex-row sm:items-center">
      <span className="w-8 shrink-0 text-[12px] font-semibold text-text-3">
        {item.label}
      </span>
      <p className="min-w-0 flex-1 text-[13px] font-medium text-text">
        {item.text}
      </p>
      <CharacterBar text={item.text} maxChars={maxChars} />
      <ScoreBadge score={item.score} />
      <CopyButton text={item.text} />
    </div>
  );
}

function ResultsSection({
  title,
  items,
  maxChars,
}: {
  title: string;
  items: GeneratedCopy[];
  maxChars: number;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-[13px] font-semibold text-text">{title}</h3>
      </div>
      {items.map((item) => (
        <ResultRow key={item.id} item={item} maxChars={maxChars} />
      ))}
    </div>
  );
}

export function GenerateTab() {
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showViolation = useMemo(
    () => (results ? hasBestPracticeViolation(results.headlines) : false),
    [results],
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

  async function handleGenerate(mode: GenerateMode) {
    setIsGenerating(true);
    setError(null);

    try {
      if (mode === "descriptions") {
        setResults(
          generateCopy({
            campaign,
            mode,
            headlineMax,
            descriptionMax,
          }),
        );
        return;
      }

      const headlines = await fetchGeneratedHeadlines({
        campaign,
        personas,
        angle,
        goal,
        charLimit: headlineMax,
      });

      const mappedHeadlines = mapHeadlineResults(headlines);

      if (mode === "all") {
        const mockDescriptions = generateCopy({
          campaign,
          mode: "descriptions",
          headlineMax,
          descriptionMax,
        }).descriptions;

        setResults({
          headlines: mappedHeadlines,
          descriptions: mockDescriptions,
        });
        return;
      }

      setResults({ headlines: mappedHeadlines, descriptions: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate copy");
    } finally {
      setIsGenerating(false);
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
            ✦ Descriptions Only
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

        {isGenerating && !results ? (
          <div className="flex min-h-[420px] items-center justify-center p-8 text-center">
            <div>
              <p className="text-[15px] font-semibold text-text">
                Generating headlines...
              </p>
              <p className="mt-2 text-[13px] text-text-3">
                Claude is writing RSA copy for {campaign}.
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
            {showViolation && (
              <div className="border-b border-red/20 bg-red-pale px-5 py-3">
                <p className="text-[13px] font-medium text-red-text">
                  Best practice flag: One or more headlines contain banned words
                  (&quot;Guaranteed&quot;, &quot;Cheap&quot;, or &quot;Free
                  translation&quot;). Review before publishing.
                </p>
              </div>
            )}
            <ResultsSection
              title="Headlines"
              items={results.headlines}
              maxChars={headlineMax}
            />
            <ResultsSection
              title="Descriptions"
              items={results.descriptions}
              maxChars={descriptionMax}
            />
          </>
        )}
      </div>
    </div>
  );
}
