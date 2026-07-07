"use client";
import { useState } from "react";
import { igStats, igFormats, igTopics, igPosts, igStories, igHeatmap, igContentIdeas, igContentGaps, liStats, liFormats, liTopics, liPosts, liContentIdeas, liAudience, type Post } from "@/lib/organic";
import { StatCards, FormatPerformance, TopTopics, PostCard, ContentIdeasCard, ContentGapsCard, StoriesCard, BestTimeHeatmap, AudienceBreakdown } from "./OrganicShared";
import { IgGrowthChart, LiGrowthChart } from "./GrowthChart";

const IG_COLOR = "#E1306C";
const LI_COLOR = "#0A66C2";
type Platform = "ig" | "li";

export function OrganicPerformance() {
  const [platform, setPlatform] = useState<Platform>("ig");
  const [toast, setToast] = useState("");
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  function handleSimilar(post: Post) { showToast(`✦ Generating ideas similar to "${post.caption.slice(0, 40)}…"`); }
  function handleGenerateMore(p: Platform) { showToast(p === "ig" ? "✦ Generating more Instagram content ideas…" : "✦ Generating more LinkedIn article ideas…"); }

  return (
    <div className="relative space-y-5">
      <div className="flex gap-2 border-b border-border">
        <PlatformTab active={platform === "ig"} color={IG_COLOR} onClick={() => setPlatform("ig")} label="Instagram" followers="2,840 followers"
          icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="3.5"/><circle cx="10" cy="10" r="3.5"/><circle cx="14.5" cy="5.5" r="0.75" fill="currentColor" stroke="none"/></svg>}
        />
        <PlatformTab active={platform === "li"} color={LI_COLOR} onClick={() => setPlatform("li")} label="LinkedIn" followers="1,210 followers"
          icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="11" rx="1.5"/><path d="M6 7V5a4 4 0 018 0v2"/><line x1="2" y1="11" x2="18" y2="11"/></svg>}
        />
      </div>

      {platform === "ig" && (
        <div className="space-y-5">
          <InsightBanner color={IG_COLOR} text={<><strong>Reels outperform static posts by 3.2× on reach</strong> for this account. Your top 3 posts this month are all Reels. However, posting frequency dropped to 2/week in the last 14 days — engagement rate fell 18% as a result. Best time to post is <strong>Tuesday and Thursday, 7–9pm</strong>.</>} actionLabel="✦ Generate Content Ideas" onAction={() => showToast("✦ Generating content ideas…")} />
          <StatCards stats={igStats} cols={5} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
            <IgGrowthChart />
            <div className="space-y-5"><FormatPerformance rows={igFormats} barColor={IG_COLOR} subtitle="Avg. engagement rate" /><TopTopics rows={igTopics} barColor={IG_COLOR} subtitle="by avg. engagement" /></div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-[15px] font-semibold text-text">Top Posts This Month</h2>
              <button type="button" onClick={() => showToast("✦ Generating content ideas based on top posts…")} className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface-2">✦ Get Similar Ideas</button>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 xl:grid-cols-6">
              {igPosts.map((post) => <PostCard key={post.id} post={post} onSimilar={handleSimilar} />)}
              <button type="button" onClick={() => showToast("✦ Generating content ideas based on top posts…")} className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-center transition-colors hover:border-orange">
                <span className="text-[22px]">✦</span>
                <span className="text-[12px] font-semibold text-text-3">Generate ideas<br />based on top posts</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><StoriesCard stories={igStories} /><BestTimeHeatmap days={igHeatmap} /></div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><ContentIdeasCard ideas={igContentIdeas} title="Content Ideas from ASHI" onGenerateMore={() => handleGenerateMore("ig")} /><ContentGapsCard gaps={igContentGaps} /></div>
        </div>
      )}

      {platform === "li" && (
        <div className="space-y-5">
          <InsightBanner color={LI_COLOR} text={<><strong>Article posts outperform standard posts by 2.8× on impressions</strong> — but you've only published 1 article this month. Your audience skews toward <strong>HR Managers and Corporate Decision-Makers</strong>, which aligns well with longer-form thought leadership content.</>} actionLabel="✦ Generate Article Ideas" onAction={() => showToast("✦ Generating LinkedIn article ideas…")} />
          <StatCards stats={liStats} cols={4} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
            <LiGrowthChart />
            <div className="space-y-5"><FormatPerformance rows={liFormats} barColor={LI_COLOR} subtitle="Avg. impressions" /><TopTopics rows={liTopics} barColor={LI_COLOR} subtitle="by avg. impressions" /></div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-[15px] font-semibold text-text">Top Posts This Month</h2>
              <button type="button" onClick={() => showToast("✦ Generating LinkedIn content ideas…")} className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface-2">✦ Get Similar Ideas</button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">{liPosts.map((post) => <PostCard key={post.id} post={post} onSimilar={handleSimilar} />)}</div>
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><ContentIdeasCard ideas={liContentIdeas} title="Article Ideas from ASHI" onGenerateMore={() => handleGenerateMore("li")} /><AudienceBreakdown rows={liAudience} barColor={LI_COLOR} /></div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-text px-5 py-2.5 text-[13px] font-semibold text-surface shadow-md">{toast}</div>}
    </div>
  );
}

function PlatformTab({ active, color, onClick, label, followers, icon }: { active: boolean; color: string; onClick: () => void; label: string; followers: string; icon: React.ReactNode; }) {
  return (
    <button type="button" onClick={onClick} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[13px] font-semibold transition-colors ${active ? "border-current" : "border-transparent text-text-3 hover:text-text"}`} style={active ? { color, borderColor: color } : undefined}>
      {icon}{label}
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${active ? "bg-surface-2 text-text-2" : "text-text-3"}`}>{followers}</span>
    </button>
  );
}

function InsightBanner({ text, actionLabel, onAction, color }: { text: React.ReactNode; actionLabel: string; onAction: () => void; color: string; }) {
  return (
    <div className="flex gap-4 rounded-xl border p-5" style={{ borderColor: color, background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
      <span className="text-[22px]">🦒</span>
      <div className="flex-1">
        <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-text-3">ASHI Insight</p>
        <p className="text-[13px] leading-relaxed text-text-2">{text}</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={onAction} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90" style={{ background: color }}>{actionLabel}</button>
          <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface-2">Dismiss</button>
        </div>
      </div>
    </div>
  );
}
