-- Run in Supabase SQL Editor after 001_initial.sql

CREATE TABLE IF NOT EXISTS saved_copy (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id),
  copy_type text NOT NULL CHECK (copy_type IN ('headline', 'description')),
  text text NOT NULL,
  category text,
  campaign text,
  char_count integer,
  score text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS saved_copy_client_id_idx ON saved_copy(client_id);
CREATE INDEX IF NOT EXISTS saved_copy_created_at_idx ON saved_copy(created_at DESC);

ALTER TABLE saved_copy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read saved_copy"
  ON saved_copy FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert saved_copy"
  ON saved_copy FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete saved_copy"
  ON saved_copy FOR DELETE
  USING (true);
