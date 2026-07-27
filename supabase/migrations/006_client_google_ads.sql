-- Run in Supabase SQL Editor after 005_practices.sql

ALTER TABLE clients ADD COLUMN IF NOT EXISTS google_ads_customer_id text;

-- Backfill AM Interpretiv's existing client row (if it exists) with its
-- known Google Ads Customer ID. Safe no-op if the row doesn't exist yet —
-- lib/clients.ts creates it on first load either way.
UPDATE clients
SET google_ads_customer_id = '3203182617'
WHERE name = 'AM Interpretiv' AND google_ads_customer_id IS NULL;
