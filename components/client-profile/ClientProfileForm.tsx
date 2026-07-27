"use client";

import { useEffect, useState } from "react";
import { useClient } from "@/lib/client-context";
import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/lib/supabase/types";

type ClientFormState = {
  name: string;
  industry: string;
  website: string;
  currency: string;
  location: string;
  tone: string;
  alwaysUse: string;
  neverUse: string;
  googleAdsCustomerId: string;
};

function toFormState(client: Client): ClientFormState {
  return {
    name: client.name ?? "",
    industry: client.industry ?? "",
    website: client.website ?? "",
    currency: client.currency ?? "MYR",
    location: client.location ?? "",
    tone: client.brand_voice?.tone ?? "",
    alwaysUse: (client.always_use ?? []).join(", "),
    neverUse: (client.never_use ?? []).join(", "),
    googleAdsCustomerId: client.google_ads_customer_id ?? "",
  };
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const EMPTY_FORM: ClientFormState = {
  name: "",
  industry: "",
  website: "",
  currency: "MYR",
  location: "",
  tone: "",
  alwaysUse: "",
  neverUse: "",
  googleAdsCustomerId: "",
};

export function ClientProfileForm() {
  const { selectedClient, loading: clientsLoading, refresh } = useClient();
  const [form, setForm] = useState<ClientFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form whenever the selected client changes (switching clients
  // in the sidebar, or the initial load finishing).
  useEffect(() => {
    if (selectedClient) {
      setForm(toFormState(selectedClient));
      setSaved(false);
      setError(null);
    }
  }, [selectedClient]);

  function updateField<K extends keyof ClientFormState>(
    key: K,
    value: ClientFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    if (!selectedClient) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const supabase = createClient();
      const payload = {
        name: form.name,
        industry: form.industry,
        website: form.website,
        currency: form.currency,
        location: form.location,
        brand_voice: { tone: form.tone },
        always_use: parseList(form.alwaysUse),
        never_use: parseList(form.neverUse),
        google_ads_customer_id: form.googleAdsCustomerId.trim() || null,
      };

      const { error: updateError } = await supabase
        .from("clients")
        .update(payload)
        .eq("id", selectedClient.id);

      if (updateError) throw updateError;

      await refresh();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save client profile");
    } finally {
      setSaving(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[13px] text-text outline-none transition-colors placeholder:text-text-4 focus:border-orange focus:ring-2 focus:ring-orange/15";

  if (clientsLoading || !selectedClient) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-[13px] text-text-3">
        Loading client profile...
      </div>
    );
  }

  const hasGoogleAds = !!selectedClient.google_ads_customer_id;

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-text">Client Profile</h2>
          <p className="mt-1 text-[13px] text-text-3">
            Brand context and Google Ads account used across ASHI for copy, reports, and UTM tracking.
          </p>
        </div>
        <span
          className={`inline-flex w-fit rounded-md px-2.5 py-1 text-[11px] font-semibold ${
            hasGoogleAds ? "bg-green-pale text-green-text" : "bg-orange-pale text-orange"
          }`}
        >
          {hasGoogleAds ? "Google Ads Linked" : "No Google Ads Account"}
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red/20 bg-red-pale px-4 py-3 text-[13px] text-red-text">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">Industry</span>
          <input
            type="text"
            value={form.industry}
            onChange={(event) => updateField("industry", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">Website</span>
          <input
            type="text"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">Location</span>
          <input
            type="text"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">Currency</span>
          <input
            type="text"
            value={form.currency}
            onChange={(event) => updateField("currency", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">
            Google Ads Customer ID
          </span>
          <input
            type="text"
            value={form.googleAdsCustomerId}
            onChange={(event) => updateField("googleAdsCustomerId", event.target.value)}
            placeholder="e.g. 3203182617"
            className={inputClassName}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">Brand tone</span>
          <input
            type="text"
            value={form.tone}
            onChange={(event) => updateField("tone", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">
            Always use
          </span>
          <input
            type="text"
            value={form.alwaysUse}
            onChange={(event) => updateField("alwaysUse", event.target.value)}
            placeholder="Certified, Accurate, Native speakers"
            className={inputClassName}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-[13px] font-medium text-text-2">
            Never use
          </span>
          <input
            type="text"
            value={form.neverUse}
            onChange={(event) => updateField("neverUse", event.target.value)}
            placeholder="Cheap, Free translation, Guaranteed"
            className={inputClassName}
          />
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-lg bg-orange px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {saved && (
          <span className="text-[13px] font-medium text-green-text">Saved to Supabase</span>
        )}
      </div>
    </div>
  );
}
