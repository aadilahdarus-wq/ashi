-- Run in Supabase SQL Editor after 002_saved_copy.sql
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text DEFAULT 'Adilah Darus',
  display_name text DEFAULT 'Dila',
  email text DEFAULT 'dila@synapsysdigital.com',
  role text DEFAULT 'Admin',
  currency text DEFAULT 'MYR',
  date_format text DEFAULT 'DD/MM/YYYY',
  timezone text DEFAULT 'Asia/Kuala_Lumpur',
  report_language text DEFAULT 'English',
  dark_mode boolean DEFAULT false,
  compact_sidebar boolean DEFAULT false,
  show_mascot boolean DEFAULT true,
  notif_telegram boolean DEFAULT true,
  notif_whatsapp boolean DEFAULT false,
  notif_email boolean DEFAULT true,
  notif_inapp boolean DEFAULT false,
  telegram_bot_token text DEFAULT '',
  telegram_chat_id text DEFAULT '',
  alert_immediate boolean DEFAULT true,
  alert_daily boolean DEFAULT false,
  alert_quiet_hours boolean DEFAULT false,
  alert_rules jsonb DEFAULT '{"cpa_threshold":100,"ctr_drop":20,"spend_spike":30,"impression_drop":25}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
INSERT INTO user_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read user_settings" ON user_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update user_settings" ON user_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert user_settings" ON user_settings FOR INSERT WITH CHECK (true);
