-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

CREATE TABLE IF NOT EXISTS clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  industry text,
  website text,
  currency text DEFAULT 'MYR',
  location text,
  brand_voice jsonb,
  always_use text[],
  never_use text[],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS utm_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id),
  destination_url text,
  source text,
  medium text,
  campaign text,
  term text,
  content text,
  full_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS utm_links_client_id_idx ON utm_links(client_id);
CREATE INDEX IF NOT EXISTS utm_links_created_at_idx ON utm_links(created_at DESC);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read clients"
  ON clients FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert clients"
  ON clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update clients"
  ON clients FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read utm_links"
  ON utm_links FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert utm_links"
  ON utm_links FOR INSERT
  WITH CHECK (true);
