"use client";

import { useMemo, useState } from "react";
import {
  buildUtmUrl,
  getUtmPreviewSegments,
  sanitizeUtmParam,
  type UtmParams,
} from "@/lib/utm";

const initialParams: UtmParams = {
  destination: "",
  source: "google",
  medium: "cpc",
  campaign: "certified-translation",
  term: "",
  content: "",
};

const fields: Array<{
  key: keyof UtmParams;
  label: string;
  placeholder: string;
  optional?: boolean;
  sanitize?: boolean;
}> = [
  {
    key: "destination",
    label: "Destination URL",
    placeholder: "https://example.com/landing-page",
  },
  {
    key: "source",
    label: "Campaign Source",
    placeholder: "google",
    sanitize: true,
  },
  {
    key: "medium",
    label: "Medium",
    placeholder: "cpc",
    sanitize: true,
  },
  {
    key: "campaign",
    label: "Name",
    placeholder: "certified-translation",
    sanitize: true,
  },
  {
    key: "term",
    label: "Term",
    placeholder: "certified translation",
    optional: true,
    sanitize: true,
  },
  {
    key: "content",
    label: "Content",
    placeholder: "hero-banner",
    optional: true,
    sanitize: true,
  },
];

function PreviewSegments({ params }: { params: UtmParams }) {
  const segments = useMemo(() => getUtmPreviewSegments(params), [params]);

  return (
    <p className="break-all font-mono text-[13px] leading-relaxed">
      {segments.map((segment, index) => {
        const className =
          segment.type === "value"
            ? "text-orange"
            : segment.type === "param"
              ? "text-text-2"
              : segment.type === "separator"
                ? "text-text-3"
                : params.destination.trim()
                  ? "text-text"
                  : "text-text-4";

        return (
          <span key={`${segment.type}-${index}`} className={className}>
            {segment.text}
          </span>
        );
      })}
    </p>
  );
}

export function SingleLinkTab() {
  const [params, setParams] = useState<UtmParams>(initialParams);
  const [copied, setCopied] = useState(false);

  const fullUrl = useMemo(() => buildUtmUrl(params), [params]);

  function updateField(key: keyof UtmParams, value: string) {
    const nextValue =
      key === "destination" || !fields.find((field) => field.key === key)?.sanitize
        ? value
        : sanitizeUtmParam(value);

    setParams((current) => ({ ...current, [key]: nextValue }));
    setCopied(false);
  }

  async function handleCopy() {
    if (!fullUrl) return;

    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-[15px] font-semibold text-text">Build your link</h2>
        <p className="mt-1 text-[13px] text-text-3">
          Parameters are sanitized automatically — spaces become hyphens.
        </p>

        <div className="mt-6 space-y-4">
          {fields.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-1.5 flex items-center gap-2 text-[13px] font-medium text-text-2">
                {field.label}
                {field.optional && (
                  <span className="text-[11px] font-normal text-text-4">
                    optional
                  </span>
                )}
              </span>
              <input
                type="text"
                value={params[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[13px] text-text outline-none transition-colors placeholder:text-text-4 focus:border-orange focus:ring-2 focus:ring-orange/15"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-text">URL preview</h2>
            <p className="mt-1 text-[13px] text-text-3">
              Updates in real time as you type.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!fullUrl}
            className="shrink-0 rounded-lg bg-orange px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-surface-2/70 p-4">
          <PreviewSegments params={params} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-text-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-text-2" />
            Parameter
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange" />
            Value
          </span>
        </div>
      </div>
    </div>
  );
}
