"use client";

import { useEffect, useMemo, useState } from "react";
import { ensureAmInterpretivClient } from "@/lib/clients";
import { createClient } from "@/lib/supabase/client";
import type { UtmLink } from "@/lib/supabase/types";
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SingleLinkTab() {
  const [params, setParams] = useState<UtmParams>(initialParams);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [history, setHistory] = useState<UtmLink[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fullUrl = useMemo(() => buildUtmUrl(params), [params]);

  async function loadHistory(activeClientId: string) {
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("utm_links")
      .select("*")
      .eq("client_id", activeClientId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (fetchError) throw fetchError;
    setHistory(data ?? []);
  }

  useEffect(() => {
    async function init() {
      try {
        const client = await ensureAmInterpretivClient();
        setClientId(client.id);
        await loadHistory(client.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load UTM history");
      } finally {
        setLoadingHistory(false);
      }
    }

    void init();
  }, []);

  function updateField(key: keyof UtmParams, value: string) {
    const nextValue =
      key === "destination" || !fields.find((field) => field.key === key)?.sanitize
        ? value
        : sanitizeUtmParam(value);

    setParams((current) => ({ ...current, [key]: nextValue }));
    setCopied(false);
    setSaved(false);
  }

  async function handleCopy() {
    if (!fullUrl) return;

    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    if (!fullUrl || !clientId) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("utm_links").insert({
        client_id: clientId,
        destination_url: params.destination.trim(),
        source: params.source,
        medium: params.medium,
        campaign: params.campaign,
        term: params.term || null,
        content: params.content || null,
        full_url: fullUrl,
      });

      if (insertError) throw insertError;

      await loadHistory(clientId);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save UTM link");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-[15px] font-semibold text-text">Build your link</h2>
          <p className="mt-1 text-[13px] text-text-3">
            Parameters are sanitized automatically — spaces become hyphens.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red/20 bg-red-pale px-4 py-3 text-[13px] text-red-text">
              {error}
            </div>
          )}

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

          <button
            type="button"
            disabled={!fullUrl || saving || !clientId}
            onClick={handleSave}
            className="mt-6 w-full rounded-lg bg-orange px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving..." : saved ? "Saved to Supabase" : "Save Link"}
          </button>
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

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-text">Saved links</h2>
            <p className="mt-1 text-[13px] text-text-3">
              Recent UTM links saved for AM Interpretiv.
            </p>
          </div>
        </div>

        {loadingHistory ? (
          <p className="mt-4 text-[13px] text-text-3">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="mt-4 text-[13px] text-text-3">
            No saved links yet. Build a URL and click Save Link.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-border text-text-3">
                  <th className="px-3 py-2 font-medium">Campaign</th>
                  <th className="px-3 py-2 font-medium">Source / Medium</th>
                  <th className="px-3 py-2 font-medium">Full URL</th>
                  <th className="px-3 py-2 font-medium">Saved</th>
                </tr>
              </thead>
              <tbody>
                {history.map((link) => (
                  <tr key={link.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-3 font-medium text-text">
                      {link.campaign || "—"}
                    </td>
                    <td className="px-3 py-3 text-text-2">
                      {link.source}/{link.medium}
                    </td>
                    <td className="max-w-[360px] truncate px-3 py-3 font-mono text-[12px] text-text-2">
                      {link.full_url}
                    </td>
                    <td className="px-3 py-3 text-text-3">
                      {formatDate(link.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
