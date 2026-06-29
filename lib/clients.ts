import { amInterpretivBrand } from "@/lib/brand";
import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/lib/supabase/types";

export const AM_INTERPRETIV_DEFAULT: Omit<Client, "id" | "created_at"> = {
  name: amInterpretivBrand.client,
  industry: "Translation & Interpretation Services",
  website: "https://aminterpretiv.com",
  currency: "MYR",
  location: "Malaysia",
  brand_voice: { tone: amInterpretivBrand.tone },
  always_use: [...amInterpretivBrand.alwaysUse],
  never_use: [...amInterpretivBrand.neverUse],
};

export async function getAmInterpretivClient(): Promise<Client | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("name", AM_INTERPRETIV_DEFAULT.name)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function ensureAmInterpretivClient(): Promise<Client> {
  const existing = await getAmInterpretivClient();
  if (existing) return existing;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(AM_INTERPRETIV_DEFAULT)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
