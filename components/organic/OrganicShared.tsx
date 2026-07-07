import type { StatCard, FormatRow, TopicRow, Post, ContentIdea, ContentGap, AudienceRow, StoryRow, HeatDay } from "@/lib/organic";

export function StatCards({ stats, cols = 4 }: { stats: StatCard[]; cols?: number }) {
  const gridClass = cols === 5 ? "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5" : "grid grid-cols-2 gap-4 xl:grid-cols-4";
  return (
    <div className={gridClass}>
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
          <p className="text-[13px] font-medium text-text-3">{s.label}</p>
          <p className="mt-3 text-[26px] font-semibold leading-none tracking-tight text-text">{s.value}</p>
          <p className={`mt-2 text-[12px] font-medium ${s.deltaType === "up" ? "text-green" : s.deltaType === "down" ? "text-red" : "text-text-3"}`}>{s.delta}</p>
        </div>
      ))}
    </div>
  );
}

function FormatIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes("reel") || l.includes("video")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2"/><path d="M8 3v14M12 3v14M3 8h14M3 12h14"/>
    </svg>
  );
  if (l.includes("carousel")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="11" rx="1.5"/><path d="M3 11l4-4 3.5 3.5L13 8l4 5"/>
    </svg>
  );
  if (l.includes("static") || l.includes("image") || l.includes("photo")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="11" rx="1.5"/><path d="M3 12l4-4 3 3 2-2 4 4"/>
    </svg>
  );
  if (l.includes("stor")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3"/>
    </svg>
  );
  if (l.includes("article")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h7l5 5v9a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M12 3v5h5"/><path d="M7 10h6M7 13h4"/>
    </svg>
  );
  if (l.includes("doc") || l.includes("pdf")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="14" height="16" rx="1.5"/><path d="M7 7h6M7 10h6M7 13h4"/>
    </svg>
  );
  if (l.includes("poll")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="3" height="4" rx="1"/><rect x="8.5" y="9" width="3" height="8" rx="1"/><rect x="14" y="5" width="3" height="12" rx="1"/>
    </svg>
  );
  if (l.includes("text")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h12M4 10h8M4 14h10"/>
    </svg>
  );
  if (l.includes("education") || l.includes("tips")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3L2 7l8 4 8-4-8-4z"/><path d="M2 13l8 4 8-4"/><path d="M2 10l8 4 8-4"/>
    </svg>
  );
  if (l.includes("behind") || l.includes("scene")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="8" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
    </svg>
  );
  if (l.includes("client") || l.includes("stor")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8c0 4-7 9-7 9S3 12 3 8a7 7 0 0114 0z"/><circle cx="10" cy="8" r="2.5"/>
    </svg>
  );
  if (l.includes("conference") || l.includes("event")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="14" height="11" rx="1.5"/><path d="M7 5V3.5M13 5V3.5"/><path d="M3 9h14"/>
    </svg>
  );
  if (l.includes("east asia") || l.includes("expansion") || l.includes("global")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7"/><path d="M3 10h14"/><path d="M10 3c-2 2-3 4.5-3 7s1 5 3 7"/><path d="M10 3c2 2 3 4.5 3 7s-1 5-3 7"/>
    </svg>
  );
  if (l.includes("certified") || l.includes("translation") || l.includes("interpreting")) return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h10a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M7 7h6M7 10h6M7 13h4"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7"/><path d="M10 7v3l2 2"/>
    </svg>
  );
}

function BarRow({ label, barPct, rate, delta, deltaType, barColor, badgeColor }: { label: string; barPct: number; rate: string; delta: string; deltaType: string; barColor: string; badgeColor: string; }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3 last:border-b-0">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-3" style={{ background: badgeColor }}>
        <FormatIcon label={label} />
      </span>
      <span className="w-[90px] shrink-0 truncate text-[12px] font-semibold text-text">{label}</span>
      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full" style={{ width: `${barPct}%`, background: barColor }} />
      </div>
      <span className="w-[44px] shrink-0 text-right font-mono text-[12px] font-bold text-text">{rate}</span>
      <span className={`w-[52px] shrink-0 text-center text-[10px] font-bold ${deltaType === "up" || deltaType === "best" ? "text-green" : deltaType === "down" ? "text-red" : "text-text-3"}`}>{delta}</span>
    </div>
  );
}

export function FormatPerformance({ rows, barColor, subtitle }: { rows: FormatRow[]; barColor: string; subtitle: string; }) {
  const badgeColor = barColor.includes("E1306C") ? "#fde8f2" : "#deeaf7";
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-[14px] font-semibold text-text">Format Performance</h3><span className="text-[11px] text-text-3">{subtitle}</span></div>
      {rows.map((r) => <BarRow key={r.label} {...r} barColor={barColor} badgeColor={badgeColor} />)}
    </div>
  );
}

export function TopTopics({ rows, barColor, subtitle }: { rows: TopicRow[]; barColor: string; subtitle: string; }) {
  const badgeColor = barColor.includes("E1306C") ? "#fde8f2" : "#deeaf7";
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-[14px] font-semibold text-text">Top Topics</h3><span className="text-[11px] text-text-3">{subtitle}</span></div>
      {rows.map((r) => <BarRow key={r.label} {...r} barColor={barColor} badgeColor={badgeColor} />)}
    </div>
  );
}

function PostThumb({ type }: { type: Post["type"] }) {
  const icons: Record<Post["type"], React.ReactNode> = {
    Reel: <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M8 3v14M12 3v14M3 8h14M3 12h14"/></svg>,
    Carousel: <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="11" rx="1.5"/><path d="M3 11l4-4 3.5 3.5L13 8l4 5"/></svg>,
    Static: <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="11" rx="1.5"/><path d="M3 12l4-4 3 3 2-2 4 4"/></svg>,
    Story: <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3"/></svg>,
    Article: <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h7l5 5v9a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M12 3v5h5"/><path d="M7 10h6M7 13h4"/></svg>,
    Document: <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="14" height="16" rx="1.5"/><path d="M7 7h6M7 10h6M7 13h4"/></svg>,
    Video: <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="12" height="10" rx="1.5"/><path d="M14 8l4-2v8l-4-2V8z"/></svg>,
  };
  return <span className="text-text-3">{icons[type]}</span>;
}

export function PostCard({ post, onSimilar }: { post: Post; onSimilar: (post: Post) => void; }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative flex h-[80px] items-center justify-center bg-surface-2">
        <PostThumb type={post.type} />
        <span className="absolute left-2 top-2 rounded bg-surface/80 px-1.5 py-0.5 text-[9px] font-bold uppercase text-text-2">{post.type}</span>
        {post.rank && <span className="absolute right-2 top-2 text-[16px]">{post.rank}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-3 text-[12px] leading-relaxed text-text-2">{post.caption}</p>
        <div className="flex gap-3 text-[11px] text-text-3">{post.stats.map((s) => <span key={s.icon}>{s.icon} <strong className="text-text">{s.value}</strong></span>)}</div>
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <button type="button" className="flex-1 rounded-lg border border-border py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface-2">View</button>
        <button type="button" onClick={() => onSimilar(post)} className="flex-1 rounded-lg bg-orange py-1.5 text-[12px] font-medium text-white hover:opacity-90">↗ Similar</button>
      </div>
    </div>
  );
}

function IdeaIcon({ format }: { format: string }) {
  const f = format.toLowerCase();
  if (f === "reel" || f === "video") return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-text-3"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M8 3v14M12 3v14M3 8h14M3 12h14"/></svg>;
  if (f === "carousel") return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-text-3"><rect x="3" y="4" width="14" height="11" rx="1.5"/><path d="M3 11l4-4 3.5 3.5L13 8l4 5"/></svg>;
  if (f === "story") return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-text-3"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3"/></svg>;
  if (f === "article") return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-text-3"><path d="M5 3h7l5 5v9a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M12 3v5h5"/><path d="M7 10h6M7 13h4"/></svg>;
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-text-3"><rect x="3" y="2" width="14" height="16" rx="1.5"/><path d="M7 7h6M7 10h6M7 13h4"/></svg>;
}

const formatColors: Record<string, string> = { ig: "bg-pink-50 text-pink-600 border border-pink-200", blue: "bg-blue-50 text-blue-600 border border-blue-200", purple: "bg-purple-50 text-purple-600 border border-purple-200", li: "bg-blue-50 text-blue-700 border border-blue-200" };

export function ContentIdeasCard({ ideas, title, onGenerateMore }: { ideas: ContentIdea[]; title: string; onGenerateMore: () => void; }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-[14px] font-semibold text-text">✦ {title}</h3><button type="button" onClick={onGenerateMore} className="rounded-lg bg-orange px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90">Generate More</button></div>
      {ideas.map((idea) => (
        <div key={idea.title} className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0">
          <IdeaIcon format={idea.format} />
          <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold text-text">{idea.title}</p><p className="mt-0.5 text-[11px] leading-relaxed text-text-3">{idea.reasoning}</p></div>
          <span className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${formatColors[idea.formatColor]}`}>{idea.format}</span>
        </div>
      ))}
    </div>
  );
}

export function ContentGapsCard({ gaps }: { gaps: ContentGap[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-[14px] font-semibold text-text">Content Gaps vs Competitors</h3><span className="text-[11px] text-text-3">Topics they post, you don't</span></div>
      {gaps.map((g) => (
        <div key={g.topic} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-surface-2">
          <div className="flex-1"><p className="text-[13px] font-medium text-text-2">{g.topic}</p><p className="text-[11px] text-text-3">{g.competitor}</p></div>
          <span className="shrink-0 rounded bg-red-pale px-2 py-0.5 text-[10px] font-bold text-red-text">Gap</span>
        </div>
      ))}
    </div>
  );
}

export function StoriesCard({ stories }: { stories: StoryRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-[14px] font-semibold text-text">Recent Stories</h3><span className="cursor-pointer text-[12px] font-medium text-orange hover:underline">See all</span></div>
      {stories.map((s) => (
        <div key={s.name} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-text-3">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polygon points="6,4 16,10 6,16" fill="currentColor" stroke="none"/></svg>
          </span>
          <div className="flex-1 min-w-0"><p className="truncate text-[13px] font-medium text-text">{s.name}</p><p className="text-[11px] text-text-3">{s.date}</p></div>
          <div className="flex gap-4 shrink-0 text-right">
            <div><p className="text-[13px] font-bold text-text">{s.reach}</p><p className="text-[10px] text-text-3">Reach</p></div>
            <div><p className="text-[13px] font-bold text-text">{s.exitRate}</p><p className="text-[10px] text-text-3">Exit Rate</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

const heatBg = ["bg-surface-2","bg-orange/10","bg-orange/25","bg-orange/50","bg-orange"];
const heatText = ["text-text-3","text-text-3","text-text-2","text-text","text-white"];

export function BestTimeHeatmap({ days }: { days: HeatDay[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-[14px] font-semibold text-text">Best Time to Post</h3><span className="text-[10px] text-text-3">Darker = higher engagement</span></div>
      <div className="flex gap-1 p-4 overflow-x-auto">
        {days.map((day) => (
          <div key={day.day} className="flex flex-1 flex-col items-center gap-1 min-w-[36px]">
            <span className="text-[10px] font-semibold text-text-3">{day.day}</span>
            {day.cells.map((cell) => (
              <div key={cell.label} className={`flex h-7 w-full items-center justify-center rounded text-[9px] font-bold ${heatBg[cell.heat]} ${heatText[cell.heat]}`}>{cell.label}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AudienceBreakdown({ rows, barColor }: { rows: AudienceRow[]; barColor: string; }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-[14px] font-semibold text-text">Audience Breakdown</h3><span className="text-[11px] text-text-3">by job function</span></div>
      <div className="space-y-3 p-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="w-36 shrink-0 text-[12px] text-text-2">{r.label}</span>
            <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full" style={{ width: `${r.barPct}%`, background: barColor }} /></div>
            <span className="w-8 shrink-0 text-right text-[12px] font-bold text-text">{r.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
