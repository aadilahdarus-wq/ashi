"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createClientRecord, ensureAmInterpretivClient, listClients } from "@/lib/clients";
import type { Client } from "@/lib/supabase/types";

const STORAGE_KEY = "ashi_selected_client_id";

type ClientContextValue = {
  clients: Client[];
  selectedClient: Client | null;
  selectedClientId: string | null;
  loading: boolean;
  error: string | null;
  selectClient: (id: string) => void;
  addClient: (input: { name: string; googleAdsCustomerId: string }) => Promise<void>;
  refresh: () => Promise<void>;
};

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Guarantees at least one client row exists on a fresh install.
      await ensureAmInterpretivClient();
      const rows = await listClients();
      setClients(rows);

      const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      const stillExists = !!stored && rows.some((c) => c.id === stored);
      const nextId = stillExists ? stored : (rows[0]?.id ?? null);
      setSelectedClientIdState(nextId);
      if (nextId && typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, nextId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function selectClient(id: string) {
    setSelectedClientIdState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  }

  async function addClient(input: { name: string; googleAdsCustomerId: string }) {
    const created = await createClientRecord({
      name: input.name,
      google_ads_customer_id: input.googleAdsCustomerId || null,
    });
    setClients((current) => [...current, created]);
    selectClient(created.id);
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? null;

  return (
    <ClientContext.Provider
      value={{
        clients,
        selectedClient,
        selectedClientId,
        loading,
        error,
        selectClient,
        addClient,
        refresh: load,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClient(): ClientContextValue {
  const ctx = useContext(ClientContext);
  if (!ctx) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return ctx;
}
