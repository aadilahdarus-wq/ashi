"use client";
import { useState } from "react";
import { competitors, ads, angleBreakdown, orgCompetitors, type Competitor, type Ad } from "@/lib/competitor";
type Tab = "ads" | "organic";
type Platform = "all" | "Google" | "Meta";
type CompFilter = "all" | string;

export function CompetitorSpy() {
  const [tab, setTab] = useState<Tab>("ads");
  const [platform, setPlatform] = useState<Platform>("all");
  const [compFilter, setCompFilter] = useState<CompFilter>("all");
  const [toast, setToast] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  const filteredAds = ads.filter(ad => (platform === "all" || ad.platform === platform) && (compFilter === "all" || ad.competitorId === compFilter));
  return (
    <div className="space-y-5">
      <div className="flex gap-0 border-b border-border -mt-1">
        <TabBtn active={tab === "ads"} onClick={() => setTab("ads")} label="Ad Intelligence" icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><rect x="2" y="3" width="16" height="14" rx="1.5"/><path d="M2 7h16"/><path d="M6 11h4M6 14h6"/></svg>} />
        <TabBtn active={tab === "organic"} onClick={() => setTab("organic")} label="Organic Intelligence" icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M3 17c0-4 2-7 7-9 5 2 7 5 7 9"/><path d="M10 8V3"/></svg>} />
      </div>

      {tab === "ads" && (
        <div className="space-y-5">
          {!bannerDismissed && (
            <div className="flex gap-4 rounded-xl border border-orange bg-orange-pale p-5">
              <span className="text-[22px]">🦒</span>
              <div className="flex-1">
                <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-orange">ASHI — Ad Intelligence Alert</p>
                <p className="text-[13px] leading-relaxed text-text-2"><strong>Lingo Anytime launched 4 new ads this week</strong> — all targeting "certified translation Malaysia" with a price-led angle ("From RM99"). Your brand impression share dropped from 84% to 71%. Consider adding a price-anchored headline.</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => showToast("✦ Generating response suggestions…")} className="rounded-lg bg-orange px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90">View Response Suggestions</button>
                  <button type="button" onClick={() => setBannerDismissed(true)} className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface-2">Dismiss</button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {competitors.map(comp => <CompCard key={comp.id} comp={comp} onResponseIdeas={() => showToast(`✦ Generating response ideas for ${comp.name}…`)} />)}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h2 className="text-[15px] font-semibold text-text">Ad Library — {compFilter === "all" ? "All Competitors" : competitors.find(c => c.id === compFilter)?.name} <span className="ml-2 text-[12px] font-normal text-text-3">{filteredAds.length} ads</span></h2>
              <div className="flex gap-2">
                <select value={platform} onChange={e => setPlatform(e.target.value as Platform)} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] text-text outline-none focus:border-orange"><option value="all">All platforms</option><option value="Google">Google Ads</option><option value="Meta">Meta Ads</option></select>
                <select value={compFilter} onChange={e => setCompFilter(e.target.value)} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] text-text outline-none focus:border-orange"><option value="all">All competitors</option>{competitors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredAds.map(ad => <AdCard key={ad.id} ad={ad} onSaveIdea={() => showToast("✦ Saving ad idea…")} />)}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-[15px] font-semibold text-text">Ad Angle Breakdown — All Competitors</h2>
              <span className="text-[12px] text-text-3">What angles they're using vs you</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-text-3">Ad Angle</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-text-3">Lingo Anytime</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-text-3">Word Perfect</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-orange">AM Interpretiv (You)</th>
                  </tr>
                </thead>
                <tbody>
                  {angleBreakdown.map(row => (
                    <tr key={row.angle} className="border-b border-border last:border-b-0 hover:bg-surface-2">
                      <td className="px-5 py-3 font-semibold text-text">{row.angle}</td>
                      <td className="px-5 py-3 text-text-2">{row.lingo}</td>
                      <td className="px-5 py-3 text-text-2">{row.wordperfect}</td>
                      <td className="px-5 py-3 bg-orange-pale"><span className="text-text-2">{row.you} </span><StatusBadge status={row.youStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "organic" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div><h2 className="text-[18px] font-bold text-text">Organic Intelligence</h2><p className="text-[13px] text-text-3">Instagram and LinkedIn activity vs competitors</p></div>
            <select className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] text-text outline-none focus:border-orange"><option>Last 30 days</option><option>Last 90 days</option></select>
          </div>
          <OrgPlatformCard platform="Instagram" platformColor="#E1306C" metric="ig" />
          <OrgPlatformCard platform="LinkedIn" platformColor="#0A66C2" metric="li" />
        </div>
      )}

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-text px-5 py-2.5 text-[13px] font-semibold text-surface shadow-md">{toast}</div>}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button type="button" onClick={onClick} className={`flex items-center gap-2 border-b-2 px-5 py-3 text-[13px] font-semibold transition-colors ${active ? "border-orange text-orange" : "border-transparent text-text-3 hover:text-text"}`}>{icon}{label}</button>;
}

function CompCard({ comp, onResponseIdeas }: { comp: Competitor; onResponseIdeas: () => void }) {
  const statusStyles = { "very-active": "text-red bg-red-pale border border-red", "moderate": "text-text-2 bg-surface-2 border border-border", "low": "text-text-3 bg-surface-2 border border-border" };
  const statusLabels = { "very-active": "● Very Active", "moderate": "◎ Moderate", "low": "○ Low" };
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-[14px] font-bold text-text">{comp.name}</p>
          <p className="text-[11px] font-mono text-text-3">{comp.url}</p>
        </div>
        <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${statusStyles[comp.status]}`}>{statusLabels[comp.status]}</span>
      </div>
      <div className="px-4 py-3">
        <div className="mb-3 grid grid-cols-3 gap-3 text-center">
          <div><p className="text-[22px] font-bold text-text">{comp.activeAds}</p><p className="text-[10px] text-text-3">Active ads</p></div>
          <div><p className="text-[22px] font-bold text-text">{comp.avgAdAge}</p><p className="text-[10px] text-text-3">Avg. ad age</p></div>
          <div><p className={`text-[22px] font-bold ${comp.newThisWeekDelta === "up" ? "text-red" : "text-text"}`}>{comp.newThisWeekDelta === "up" ? "↑ " : "+"}{comp.newThisWeek}</p><p className="text-[10px] text-text-3">New this week</p></div>
        </div>
        <div className="flex flex-wrap gap-1.5">{comp.angles.map(a => <span key={a} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-2">{a}</span>)}</div>
      </div>
      <div className="flex gap-2 border-t border-border px-4 py-3">
        <button type="button" className="flex-1 rounded-lg border border-border py-1.5 text-[11px] font-medium text-text-2 hover:bg-surface-2">View All Ads</button>
        <button type="button" onClick={onResponseIdeas} className="flex-1 rounded-lg bg-orange py-1.5 text-[11px] font-medium text-white hover:opacity-90">✦ Response Ideas</button>
      </div>
    </div>
  );
}

const angleBg: Record<string, string> = { price: "bg-green-pale text-green", urgency: "bg-red-pale text-red", trust: "bg-blue-pale text-blue", geo: "bg-surface-2 text-text-2", multilingual: "bg-orange-pale text-orange", quality: "bg-surface-2 text-text-2" };

function AdCard({ ad, onSaveIdea }: { ad: Ad; onSaveIdea: () => void }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md">
      <div className="relative flex h-[72px] items-center justify-center bg-surface-2 text-[28px]">
        {ad.thumb}
        <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${ad.platform === "Google" ? "bg-[#4285F4]" : "bg-[#1877F2]"}`}>{ad.platform}</span>
        <span className="absolute right-2 top-2 text-[10px] text-text-3">🕐 {ad.daysRunning}d {ad.isNew && <span className="text-orange font-bold">New ✦</span>}{ad.isLongRunning && " ⚠"}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-text-3">{ad.competitorName} · {ad.format}</p>
        <p className="text-[13px] font-bold leading-snug text-blue">{ad.headline}</p>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-text-3">{ad.description}</p>
      </div>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${angleBg[ad.angleType] ?? "bg-surface-2 text-text-2"}`}>{ad.angle}</span>
        <button type="button" onClick={onSaveIdea} className="ml-auto rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium text-text-2 hover:bg-surface-2">Save idea</button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { gap: "bg-red-pale text-red border border-red", underused: "bg-orange-pale text-orange border border-orange-border", strong: "bg-green-pale text-green border border-green", leading: "bg-green-pale text-green border border-green", partial: "bg-surface-2 text-text-3 border border-border", none: "" };
  const labels: Record<string, string> = { gap: "Gap", underused: "Underused", strong: "Strong", leading: "Leading", partial: "Partial", none: "" };
  if (status === "none" || !labels[status]) return null;
  return <span className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${styles[status]}`}>{labels[status]}</span>;
}

function OrgPlatformCard({ platform, platformColor, metric }: { platform: string; platformColor: string; metric: "ig" | "li" }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-text"><span className="h-2 w-2 rounded-full" style={{ background: platformColor }} />{platform} — Side by Side</h2>
        <span className="text-[12px] text-text-3">Last 30 days</span>
      </div>
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {orgCompetitors.map(comp => {
          const data = comp[metric];
          return (
            <div key={comp.id} className={`p-4 ${comp.isYou ? "bg-orange-pale" : ""}`}>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white" style={{ background: comp.color }}>{comp.initial}</div>
                <div><p className="text-[13px] font-bold text-text">{comp.name}</p>{comp.isYou && <p className="text-[10px] font-bold text-orange">You</p>}</div>
              </div>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-text-3">Followers</span><span className="font-bold text-text">{data.followers}</span></div>
                <div className="flex justify-between"><span className="text-text-3">Posts / month</span><span className="font-bold text-text">{data.postsPerMonth}</span></div>
                <div className="flex justify-between"><span className="text-text-3">Avg. engagement</span><span className="font-bold text-text">{data.avgEngagement}</span></div>
                <div className="pt-2 border-t border-border"><p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-text-3">Top formats</p><div className="flex flex-wrap gap-1">{data.topFormats.map(f => <span key={f} className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-2">{f}</span>)}</div></div>
                <div className="pt-2 border-t border-border"><p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-text-3">Top topics</p><div className="flex flex-wrap gap-1">{data.topTopics.map(t => <span key={t} className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-2">{t}</span>)}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
