-- Run in Supabase SQL Editor after 004_competitor_ads.sql

CREATE TABLE IF NOT EXISTS practices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL DEFAULT 'google',
  topic text NOT NULL,
  rule text NOT NULL,
  why text,
  severity text NOT NULL DEFAULT 'should' CHECK (severity IN ('must', 'should', 'watch')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS practices_platform_idx ON practices(platform);
CREATE INDEX IF NOT EXISTS practices_topic_idx ON practices(topic);
CREATE INDEX IF NOT EXISTS practices_severity_idx ON practices(severity);

ALTER TABLE practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read practices"
  ON practices FOR SELECT USING (true);

CREATE POLICY "Allow public insert practices"
  ON practices FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update practices"
  ON practices FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete practices"
  ON practices FOR DELETE USING (true);

INSERT INTO practices (platform, topic, rule, why, severity) VALUES
('google', 'PMax', 'Never let PMax and Brand Search run without a negative keyword list at account level. PMax will cannibalise brand traffic and inflate ROAS artificially.', 'Without brand negatives, PMax steals credit for branded searches that would have converted organically, making ROAS look better than it actually is.', 'must'),
('google', 'PMax', 'Check the search terms report weekly for PMax. Exclude irrelevant placements and search themes after 7 days of data.', 'PMax search themes and placements default to broad. Without regular pruning, budget bleeds into low-intent or off-topic queries quickly.', 'must'),
('google', 'PMax', 'Always upload audience signals when launching PMax. Use customer lists, website visitors, and converters — not just interest categories.', 'Audience signals dramatically reduce the learning period. First-party data signals (CRM lists, site visitors) consistently outperform interest-based signals.', 'should'),
('google', 'PMax', 'Do not evaluate PMax ROAS during the learning phase (first 2–4 weeks). Wait for at least 50 conversions before drawing conclusions.', NULL, 'watch'),
('google', 'Bidding', 'Never switch bidding strategies mid-flight without a 2-week data buffer. Switching resets the learning phase and can destabilise performance for 2–4 weeks.', 'Smart Bidding needs historical signal data to work properly. Switching cold means the algorithm starts blind.', 'must'),
('google', 'Bidding', 'Set tCPA targets at 20–30% above actual CPA when first enabling Smart Bidding. Tighten targets only after 4 weeks of stable data.', 'Setting targets too aggressively at launch causes the algorithm to restrict volume and enter a prolonged learning phase.', 'should'),
('google', 'Bidding', 'Watch for Maximise Conversions campaigns with no budget cap — they will spend the full daily budget regardless of conversion quality.', NULL, 'watch'),
('google', 'Keywords', 'Add negative keywords at campaign and account level before launching. At minimum: competitor brand terms, irrelevant locations, and off-service queries.', 'Launching without negatives means the first week of data is polluted with irrelevant clicks that waste budget and confuse Smart Bidding.', 'must'),
('google', 'Keywords', 'Review search terms weekly for the first month of any new campaign. After that, bi-weekly is acceptable for stable campaigns.', 'The first 30 days surface the most unexpected search terms. Missing this window means wasted spend compounds over months.', 'must'),
('google', 'Keywords', 'Use Exact and Phrase match for branded terms only. Broad match is acceptable for non-brand with tCPA bidding and a healthy negative list.', 'Broad match without Smart Bidding or negatives is how budgets disappear on irrelevant terms.', 'should'),
('google', 'Copy', 'Every RSA must have at least 3 headlines pinned in position 1, 2, and 3. Never leave pinning entirely to Google — especially for compliance-sensitive clients.', 'Google will test headlines in ways that can create misleading or off-brand combinations without pinning constraints.', 'must'),
('google', 'Copy', 'Include at least one headline with a specific number or data point (price, timeframe, quantity). Specificity consistently outperforms vague benefit claims.', 'Headlines like "From RM99" or "Same-day turnaround" anchor the offer and signal credibility more effectively than "Fast and reliable."', 'should'),
('google', 'Budget', 'Flag any campaign underpacing by more than 20% after day 10 of the month. Underpacing means leaving impressions and conversions on the table.', NULL, 'must'),
('google', 'Budget', 'Never increase daily budget by more than 20% in a single change. Large budget jumps can destabilise Smart Bidding and trigger a new learning phase.', 'Google treats significant budget changes as a signal to re-enter learning mode. Incremental increases of 10–20% every 5–7 days is the safe approach.', 'must');
