export type StatCard = { label: string; value: string; delta: string; deltaType: "up" | "down" | "flat"; };
export type FormatRow = { label: string; barPct: number; rate: string; delta: string; deltaType: "up" | "down" | "flat" | "best"; };
export type TopicRow = { label: string; barPct: number; rate: string; delta: string; deltaType: "up" | "down" | "flat"; };
export type Post = { id: string; type: "Reel" | "Carousel" | "Static" | "Story" | "Article" | "Document" | "Video"; rank?: "🥇" | "🥈" | "🥉"; caption: string; stats: { icon: string; value: string }[]; };
export type ContentIdea = { title: string; reasoning: string; format: string; formatColor: "ig" | "blue" | "purple" | "li"; };
export type ContentGap = { topic: string; competitor: string; };
export type StoryRow = { name: string; date: string; reach: string; exitRate: string; };
export type HeatCell = { label: string; heat: 0 | 1 | 2 | 3 | 4; };
export type HeatDay = { day: string; cells: HeatCell[]; };
export type AudienceRow = { label: string; barPct: number; pct: string; };

export const igStats: StatCard[] = [
  { label: "Followers", value: "2,840", delta: "↑ 124 this month", deltaType: "up" },
  { label: "Reach", value: "18.4K", delta: "↑ 22%", deltaType: "up" },
  { label: "Impressions", value: "31.2K", delta: "↑ 14%", deltaType: "up" },
  { label: "Avg. Eng. Rate", value: "4.8%", delta: "↓ 0.6%", deltaType: "down" },
  { label: "Posts This Month", value: "9", delta: "→ Same as last", deltaType: "flat" },
];
export const igFormats: FormatRow[] = [
  { label: "Reels", barPct: 100, rate: "6.8%", delta: "🏆 Best", deltaType: "best" },
  { label: "Carousel", barPct: 62, rate: "4.2%", delta: "↑ 8%", deltaType: "up" },
  { label: "Static Image", barPct: 30, rate: "2.1%", delta: "↓ 12%", deltaType: "down" },
  { label: "Stories", barPct: 20, rate: "1.4%", delta: "→ Stable", deltaType: "flat" },
];
export const igTopics: TopicRow[] = [
  { label: "Education / Tips", barPct: 100, rate: "7.2%", delta: "↑ 18%", deltaType: "up" },
  { label: "Behind the Scenes", barPct: 76, rate: "5.8%", delta: "↑ 9%", deltaType: "up" },
  { label: "Certified Translation", barPct: 58, rate: "4.4%", delta: "→ Stable", deltaType: "flat" },
  { label: "Client Stories", barPct: 40, rate: "3.1%", delta: "↓ 5%", deltaType: "down" },
  { label: "Conference / Events", barPct: 28, rate: "2.2%", delta: "→ Stable", deltaType: "flat" },
];
export const igPosts: Post[] = [
  { id: "ig1", type: "Reel", rank: "🥇", caption: "What makes a translation \"certified\" in Malaysia? 🇲🇾 Here's what you need to know before submitting documents to JPN or embassy...", stats: [{ icon: "❤️", value: "284" }, { icon: "💬", value: "42" }, { icon: "📤", value: "118" }] },
  { id: "ig2", type: "Reel", rank: "🥈", caption: "Behind the scenes at a simultaneous interpreting event 🎧 What goes into running a flawless conference session...", stats: [{ icon: "❤️", value: "198" }, { icon: "💬", value: "31" }, { icon: "📤", value: "87" }] },
  { id: "ig3", type: "Carousel", rank: "🥉", caption: "5 documents you NEED certified translation for before applying for a visa. Swipe to see the full list →", stats: [{ icon: "❤️", value: "142" }, { icon: "💬", value: "18" }, { icon: "📤", value: "64" }] },
  { id: "ig4", type: "Static", caption: "Client spotlight: How we supported an international AGM with SIS equipment across 3 languages in KL 🌏", stats: [{ icon: "❤️", value: "96" }, { icon: "💬", value: "9" }, { icon: "📤", value: "22" }] },
  { id: "ig5", type: "Reel", caption: "Can Google Translate replace a human interpreter? We put it to the test 👀 The results might surprise you...", stats: [{ icon: "❤️", value: "312" }, { icon: "💬", value: "58" }, { icon: "📤", value: "201" }] },
];
export const igStories: StoryRow[] = [
  { name: "What is SIS equipment?", date: "Jun 12, 2026", reach: "1,240", exitRate: "38%" },
  { name: "Client testimonial quote", date: "Jun 10, 2026", reach: "980", exitRate: "24%" },
  { name: "Poll: Have you ever had a document rejected?", date: "Jun 8, 2026", reach: "1,580", exitRate: "18%" },
];
export const igHeatmap: HeatDay[] = [
  { day: "Mon", cells: [{ label: "9a", heat: 1 }, { label: "12p", heat: 2 }, { label: "3p", heat: 1 }, { label: "6p", heat: 2 }, { label: "9p", heat: 1 }] },
  { day: "Tue", cells: [{ label: "9a", heat: 1 }, { label: "12p", heat: 2 }, { label: "3p", heat: 2 }, { label: "7p", heat: 4 }, { label: "9p", heat: 3 }] },
  { day: "Wed", cells: [{ label: "9a", heat: 0 }, { label: "12p", heat: 1 }, { label: "3p", heat: 1 }, { label: "6p", heat: 1 }, { label: "9p", heat: 2 }] },
  { day: "Thu", cells: [{ label: "9a", heat: 1 }, { label: "12p", heat: 3 }, { label: "3p", heat: 2 }, { label: "7p", heat: 4 }, { label: "9p", heat: 3 }] },
  { day: "Fri", cells: [{ label: "9a", heat: 1 }, { label: "12p", heat: 2 }, { label: "3p", heat: 1 }, { label: "6p", heat: 2 }, { label: "9p", heat: 1 }] },
  { day: "Sat", cells: [{ label: "9a", heat: 0 }, { label: "12p", heat: 1 }, { label: "3p", heat: 2 }, { label: "6p", heat: 1 }, { label: "9p", heat: 0 }] },
  { day: "Sun", cells: [{ label: "9a", heat: 0 }, { label: "12p", heat: 0 }, { label: "3p", heat: 1 }, { label: "6p", heat: 1 }, { label: "9p", heat: 0 }] },
];
export const igContentIdeas: ContentIdea[] = [
  { title: "Day in the life of a certified translator", reasoning: "Based on your top Reel format. Behind-the-scenes content drives 3.2× more shares.", format: "Reel", formatColor: "ig" },
  { title: "5 languages most requested for embassy documents in Malaysia", reasoning: "Educational carousels get saved 4× more often on this account.", format: "Carousel", formatColor: "blue" },
  { title: "\"We tested Google Translate vs a native interpreter\" — Part 2", reasoning: "Your most-shared Reel this month. A follow-up will likely outperform.", format: "Reel", formatColor: "ig" },
  { title: "Poll: Which document do you need translated most?", reasoning: "Polls average 38% higher reach than static posts for this account.", format: "Story", formatColor: "purple" },
];
export const igContentGaps: ContentGap[] = [
  { topic: "Visa rejection stories & what went wrong", competitor: "Lingo Anytime posts 4× / month on this" },
  { topic: "Korean & Japanese business translation tips", competitor: "Word Perfect — high engagement on this" },
  { topic: "Client testimonial videos", competitor: "Both competitors post regularly" },
  { topic: "What's the difference: translation vs interpreting?", competitor: "High search intent, no local content" },
];
export const liStats: StatCard[] = [
  { label: "Page Followers", value: "1,210", delta: "↑ 48 this month", deltaType: "up" },
  { label: "Post Impressions", value: "9,840", delta: "↑ 31%", deltaType: "up" },
  { label: "Avg. Engagement", value: "2.9%", delta: "↑ 0.4%", deltaType: "up" },
  { label: "Posts This Month", value: "7", delta: "↓ 2 vs last", deltaType: "down" },
];
export const liFormats: FormatRow[] = [
  { label: "Articles", barPct: 100, rate: "2,840", delta: "🏆 Best", deltaType: "best" },
  { label: "Documents / PDFs", barPct: 68, rate: "1,920", delta: "↑ 14%", deltaType: "up" },
  { label: "Video", barPct: 52, rate: "1,480", delta: "→ Stable", deltaType: "flat" },
  { label: "Polls", barPct: 38, rate: "1,080", delta: "↑ 22%", deltaType: "up" },
  { label: "Text Post", barPct: 28, rate: "820", delta: "↓ 8%", deltaType: "down" },
];
export const liTopics: TopicRow[] = [
  { label: "East Asia Expansion", barPct: 100, rate: "2,840", delta: "↑ 38%", deltaType: "up" },
  { label: "Certified Translation", barPct: 72, rate: "2,040", delta: "↑ 12%", deltaType: "up" },
  { label: "Conference Interpreting", barPct: 52, rate: "1,480", delta: "→ Stable", deltaType: "flat" },
  { label: "Client Stories", barPct: 36, rate: "1,020", delta: "↓ 4%", deltaType: "down" },
];
export const liPosts: Post[] = [
  { id: "li1", type: "Article", rank: "🥇", caption: "Why certified translation matters more than ever for Malaysian companies expanding into East Asia", stats: [{ icon: "👍", value: "84" }, { icon: "💬", value: "22" }, { icon: "👁", value: "2,840" }] },
  { id: "li2", type: "Document", rank: "🥈", caption: "Top 7 Questions Clients Ask About Certified Translation", stats: [{ icon: "👍", value: "61" }, { icon: "💬", value: "14" }, { icon: "👁", value: "1,920" }] },
  { id: "li3", type: "Video", rank: "🥉", caption: "What happens when an interpreter makes a mistake during a live event? Real story from our team 😬", stats: [{ icon: "👍", value: "48" }, { icon: "💬", value: "19" }, { icon: "👁", value: "1,480" }] },
];
export const liContentIdeas: ContentIdea[] = [
  { title: "How Malaysian companies are expanding into Japan & Korea — and what that means for translation", reasoning: "Trending topic. Your top article this month covered East Asia expansion.", format: "Article", formatColor: "li" },
  { title: "10 mistakes HR managers make when handling multilingual AGMs", reasoning: "Targets your top persona. Document format averages 1,920 impressions.", format: "Document", formatColor: "li" },
  { title: "Client story: Running a 500-person international conference in KL with 4 languages", reasoning: "Video testimonials perform well. High social proof for enterprise clients.", format: "Video", formatColor: "li" },
];
export const liAudience: AudienceRow[] = [
  { label: "HR & People Ops", barPct: 72, pct: "32%" },
  { label: "C-Suite / Director", barPct: 54, pct: "24%" },
  { label: "Legal & Compliance", barPct: 34, pct: "15%" },
  { label: "Event Management", barPct: 27, pct: "12%" },
  { label: "Business Development", barPct: 18, pct: "8%" },
  { label: "Other", barPct: 20, pct: "9%" },
];
