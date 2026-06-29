import { ensureAmInterpretivClient } from "@/lib/clients";
import { createClient } from "@/lib/supabase/client";
import type { SavedCopy } from "@/lib/supabase/types";

export type SaveCopyItem = {
  copyType: "headline" | "description";
  text: string;
  category?: string | null;
  campaign: string;
  charCount: number;
  score: string;
};

export async function saveCopyToBank(items: SaveCopyItem[]): Promise<SavedCopy[]> {
  if (items.length === 0) return [];

  const client = await ensureAmInterpretivClient();
  const supabase = createClient();

  const rows = items.map((item) => ({
    client_id: client.id,
    copy_type: item.copyType,
    text: item.text,
    category: item.category ?? null,
    campaign: item.campaign,
    char_count: item.charCount,
    score: item.score,
  }));

  const { data, error } = await supabase.from("saved_copy").insert(rows).select("*");

  if (error) throw error;
  return data ?? [];
}

export async function fetchSavedCopy(limit = 20): Promise<SavedCopy[]> {
  const client = await ensureAmInterpretivClient();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_copy")
    .select("*")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
