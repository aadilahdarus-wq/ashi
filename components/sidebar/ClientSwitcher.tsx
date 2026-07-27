"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { useClient } from "@/lib/client-context";

export function ClientSwitcher() {
  const { clients, selectedClient, loading, selectClient, addClient } = useClient();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleAdd() {
    if (!name.trim()) return;
    setSaving(true);
    setFormError(null);
    try {
      await addClient({ name: name.trim(), googleAdsCustomerId: customerId.trim() });
      setName("");
      setCustomerId("");
      setAdding(false);
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add client");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative border-b border-border px-3 py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
      >
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-text">
            {loading ? "Loading…" : (selectedClient?.name ?? "Select client")}
          </span>
        </span>
        <ChevronDownIcon className="h-4 w-4 shrink-0 stroke-text-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setOpen(false);
              setAdding(false);
            }}
          />
          <div className="absolute left-3 right-3 top-full z-40 mt-1 rounded-lg border border-border bg-surface shadow-lg">
            <div className="max-h-56 overflow-y-auto py-1">
              {clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => {
                    selectClient(client.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] text-text hover:bg-surface-2"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{client.name}</span>
                    {!client.google_ads_customer_id && (
                      <span className="block text-[11px] text-text-3">No Google Ads account linked</span>
                    )}
                  </span>
                  {client.id === selectedClient?.id && <span className="text-orange">✓</span>}
                </button>
              ))}
              {clients.length === 0 && !loading && (
                <p className="px-3 py-2 text-[12px] text-text-3">No clients yet.</p>
              )}
            </div>

            <div className="border-t border-border p-2">
              {!adding ? (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="w-full rounded-md px-2 py-1.5 text-left text-[12px] font-medium text-orange hover:bg-orange-pale"
                >
                  + Add client
                </button>
              ) : (
                <div className="space-y-2 p-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Client name"
                    className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-[12px] text-text outline-none focus:border-orange"
                  />
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Google Ads Customer ID"
                    className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-[12px] text-text outline-none focus:border-orange"
                  />
                  {formError && <p className="text-[11px] text-red-text">{formError}</p>}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdding(false);
                        setFormError(null);
                      }}
                      className="flex-1 rounded-md border border-border px-2 py-1.5 text-[12px] text-text-2 hover:bg-surface-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={saving || !name.trim()}
                      onClick={handleAdd}
                      className="flex-1 rounded-md bg-orange px-2 py-1.5 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {saving ? "Adding…" : "Add"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
