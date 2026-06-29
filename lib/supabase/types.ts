export type Client = {
  id: string;
  name: string | null;
  industry: string | null;
  website: string | null;
  currency: string | null;
  location: string | null;
  brand_voice: { tone?: string } | null;
  always_use: string[] | null;
  never_use: string[] | null;
  created_at: string;
};

export type UtmLink = {
  id: string;
  client_id: string | null;
  destination_url: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
  full_url: string | null;
  created_at: string;
};

export type ClientInsert = Omit<Client, "id" | "created_at"> & {
  id?: string;
};

export type UtmLinkInsert = Omit<UtmLink, "id" | "created_at"> & {
  id?: string;
};
