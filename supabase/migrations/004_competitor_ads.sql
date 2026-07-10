-- Run in Supabase SQL Editor after 003_user_settings.sql

CREATE TABLE IF NOT EXISTS competitor_ads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_name text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('Google', 'Meta')),
  format text NOT NULL DEFAULT 'Search',
  headline text NOT NULL,
  description text,
  angle text,
  angle_type text DEFAULT 'other',
  days_running integer DEFAULT 0,
  source_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS competitor_ads_competitor_idx ON competitor_ads(competitor_name);
CREATE INDEX IF NOT EXISTS competitor_ads_created_at_idx ON competitor_ads(created_at DESC);

ALTER TABLE competitor_ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read competitor_ads"
  ON competitor_ads FOR SELECT USING (true);

CREATE POLICY "Allow public insert competitor_ads"
  ON competitor_ads FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete competitor_ads"
  ON competitor_ads FOR DELETE USING (true);

INSERT INTO competitor_ads (competitor_name, platform, format, headline, description, angle, angle_type, days_running) VALUES
  ('Lingo Anytime', 'Google', 'Search', 'Certified Translation From RM99', 'Fast, accurate certified translation for all official documents. Get a quote in minutes. Malaysia-wide service.', '💰 Price-led', 'price', 8),
  ('Lingo Anytime', 'Google', 'Search', 'Need Certified Translation Today?', 'Same-day certified translation available. Legal, immigration, and corporate documents. WhatsApp now for urgent orders.', '⚡ Urgency', 'urgency', 5),
  ('Lingo Anytime', 'Meta', 'Meta Feed', 'Malaysia''s #1 Translation Agency', '10,000+ documents translated. Certified by qualified linguists. Free quote — reply to this ad or WhatsApp us.', '✅ Trust', 'trust', 21),
  ('Lingo Anytime', 'Google', 'Search', 'Visa Document Translation KL', 'Embassy-accepted certified translations for visa applications. Fast turnaround. Covering KL, Selangor, Penang.', '📍 Geo-targeted', 'geo', 3),
  ('Lingo Anytime', 'Meta', 'Meta Feed', 'Don''t Pay More for Translation', 'Professional certified translation at transparent prices. No hidden fees. Compare our rates — we''re confident you''ll choose us.', '💰 Price comparison', 'price', 14),
  ('Lingo Anytime', 'Google', 'Search', 'Certified Translation — 24hr Service', 'Urgent certified translation for legal and immigration needs. Available 24 hours. Call or WhatsApp now.', '⚡ Urgency', 'urgency', 2),
  ('Word Perfect', 'Google', 'Search', '20 Years of Certified Translation', 'Trusted by law firms, embassies, and MNCs. ISO-certified translators across 40+ language pairs.', '✅ Trust', 'trust', 45),
  ('Word Perfect', 'Meta', 'Meta Feed', 'Translation in 40+ Languages', 'From Mandarin to Arabic to Korean — we cover every language your business needs. Certified and sworn translations available.', '🌏 Multilingual', 'multilingual', 12),
  ('Word Perfect', 'Google', 'Search', 'Court-Accepted Certified Translation', 'Our translations are accepted by Malaysian courts, embassies, and government agencies. Accuracy guaranteed.', '🎯 Quality', 'quality', 7);
