export type Competitor = {
  id: string; name: string; url: string; color: string; initial: string;
  status: "very-active" | "moderate" | "low";
  activeAds: number; avgAdAge: string; newThisWeek: number;
  newThisWeekDelta: "up" | "flat" | "down"; angles: string[];
};
export type Ad = {
  id: string; competitorId: string; competitorName: string;
  platform: "Google" | "Meta"; format: "Search" | "Display" | "Meta Feed";
  thumb: string; headline: string; description: string;
  daysRunning: number; isNew?: boolean; isLongRunning?: boolean;
  angle: string; angleType: "price" | "urgency" | "trust" | "geo" | "multilingual" | "quality";
};
export type AngleRow = {
  angle: string; lingo: string; wordperfect: string; you: string;
  youStatus: "gap" | "underused" | "strong" | "leading" | "partial" | "none";
};
export type OrgCompetitor = {
  id: string; name: string; color: string; initial: string; isYou?: boolean;
  ig: { followers: string; postsPerMonth: number; avgEngagement: string; topFormats: string[]; topTopics: string[]; };
  li: { followers: string; postsPerMonth: number; avgEngagement: string; topFormats: string[]; topTopics: string[]; };
};

export const competitors: Competitor[] = [
  { id: "lingo", name: "Lingo Anytime", url: "lingoanytime.com.my", color: "#E07000", initial: "L", status: "very-active", activeAds: 18, avgAdAge: "42d", newThisWeek: 4, newThisWeekDelta: "up", angles: ["💰 Price-led", "⚡ Urgency", "📋 Certified docs", "🇲🇾 Malaysia-wide"] },
  { id: "wordperfect", name: "Word Perfect", url: "wordperfect.com.my", color: "#2563EB", initial: "W", status: "moderate", activeAds: 9, avgAdAge: "68d", newThisWeek: 1, newThisWeekDelta: "flat", angles: ["✅ Trust & experience", "📜 Official certified", "🌏 Multilingual"] },
  { id: "masterword", name: "Masterword Services", url: "masterword.com.my", color: "#16A34A", initial: "M", status: "moderate", activeAds: 7, avgAdAge: "55d", newThisWeek: 0, newThisWeekDelta: "flat", angles: ["📋 Certified docs", "🌏 Multilingual", "✅ Trust"] },
  { id: "translasia", name: "Translasia", url: "translasia.com.my", color: "#7C3AED", initial: "T", status: "low", activeAds: 4, avgAdAge: "82d", newThisWeek: 0, newThisWeekDelta: "flat", angles: ["⚡ Urgency", "📍 Geo-targeted"] },
  { id: "dayatrans", name: "Daya Translation", url: "dayatranslation.com", color: "#0891B2", initial: "D", status: "moderate", activeAds: 11, avgAdAge: "38d", newThisWeek: 2, newThisWeekDelta: "up", angles: ["💰 Price-led", "📋 Certified docs", "🇲🇾 Malaysia-wide"] },
  { id: "bilingua", name: "Bilingua Pro", url: "bilinguapro.com.my", color: "#DB2777", initial: "B", status: "low", activeAds: 3, avgAdAge: "91d", newThisWeek: 0, newThisWeekDelta: "flat", angles: ["✅ Trust & experience", "🎯 Quality"] },
];

export const ads: Ad[] = [
  { id: "a1", competitorId: "lingo", competitorName: "Lingo Anytime", platform: "Google", format: "Search", thumb: "🏆", headline: "Certified Translation From RM99", description: "Fast, accurate certified translation for all official documents. Get a quote in minutes. Malaysia-wide service.", daysRunning: 8, angle: "💰 Price-led", angleType: "price" },
  { id: "a2", competitorId: "lingo", competitorName: "Lingo Anytime", platform: "Google", format: "Search", thumb: "📄", headline: "Need Certified Translation Today?", description: "Same-day certified translation available. Legal, immigration, and corporate documents. WhatsApp now for urgent orders.", daysRunning: 5, angle: "⚡ Urgency", angleType: "urgency" },
  { id: "a3", competitorId: "lingo", competitorName: "Lingo Anytime", platform: "Meta", format: "Meta Feed", thumb: "🌏", headline: "Malaysia's #1 Translation Agency", description: "10,000+ documents translated. Certified by qualified linguists. Free quote — reply to this ad or WhatsApp us.", daysRunning: 21, isLongRunning: true, angle: "✅ Trust", angleType: "trust" },
  { id: "a4", competitorId: "lingo", competitorName: "Lingo Anytime", platform: "Google", format: "Search", thumb: "📋", headline: "Visa Document Translation KL", description: "Embassy-accepted certified translations for visa applications. Fast turnaround. Covering KL, Selangor, Penang.", daysRunning: 3, angle: "📍 Geo-targeted", angleType: "geo" },
  { id: "a5", competitorId: "lingo", competitorName: "Lingo Anytime", platform: "Meta", format: "Meta Feed", thumb: "🎯", headline: "Don't Pay More for Translation", description: "Professional certified translation at transparent prices. No hidden fees. Compare our rates — we're confident you'll choose us.", daysRunning: 14, angle: "💰 Price comparison", angleType: "price" },
  { id: "a6", competitorId: "lingo", competitorName: "Lingo Anytime", platform: "Google", format: "Search", thumb: "⚡", headline: "Certified Translation — 24hr Service", description: "Urgent certified translation for legal and immigration needs. Available 24 hours. Call or WhatsApp now.", daysRunning: 2, isNew: true, angle: "⚡ Urgency", angleType: "urgency" },
  { id: "b1", competitorId: "wordperfect", competitorName: "Word Perfect", platform: "Google", format: "Search", thumb: "🏅", headline: "20 Years of Certified Translation", description: "Trusted by law firms, embassies, and MNCs. ISO-certified translators across 40+ language pairs.", daysRunning: 45, isLongRunning: true, angle: "✅ Trust", angleType: "trust" },
  { id: "b2", competitorId: "wordperfect", competitorName: "Word Perfect", platform: "Meta", format: "Meta Feed", thumb: "🌐", headline: "Translation in 40+ Languages", description: "From Mandarin to Arabic to Korean — we cover every language your business needs. Certified and sworn translations available.", daysRunning: 12, angle: "🌏 Multilingual", angleType: "multilingual" },
  { id: "b3", competitorId: "wordperfect", competitorName: "Word Perfect", platform: "Google", format: "Search", thumb: "📜", headline: "Court-Accepted Certified Translation", description: "Our translations are accepted by Malaysian courts, embassies, and government agencies. Accuracy guaranteed.", daysRunning: 7, angle: "🎯 Quality", angleType: "quality" },
];

export const angleBreakdown: AngleRow[] = [
  { angle: "💰 Price / Value", lingo: "8 ads · Heavy use", wordperfect: "2 ads · Light use", you: "0 ads", youStatus: "gap" },
  { angle: "⚡ Urgency / Speed", lingo: "5 ads · Heavy use", wordperfect: "1 ad · Light use", you: "1 ad", youStatus: "underused" },
  { angle: "✅ Trust / Experience", lingo: "3 ads", wordperfect: "5 ads · Heavy use", you: "3 ads", youStatus: "strong" },
  { angle: "🎯 Accuracy / Quality", lingo: "2 ads", wordperfect: "2 ads", you: "4 ads", youStatus: "leading" },
  { angle: "📍 Geo-targeting", lingo: "4 ads · KL focus", wordperfect: "1 ad", you: "2 ads · Partial", youStatus: "partial" },
  { angle: "🌏 Multilingual", lingo: "1 ad", wordperfect: "3 ads", you: "0 ads", youStatus: "gap" },
];

export const orgCompetitors: OrgCompetitor[] = [
  { id: "you", name: "AM Interpretiv", color: "#E07000", initial: "A", isYou: true, ig: { followers: "2,840", postsPerMonth: 9, avgEngagement: "4.8%", topFormats: ["Reels", "Carousel"], topTopics: ["Education", "Behind the Scenes", "Client Stories"] }, li: { followers: "1,210", postsPerMonth: 7, avgEngagement: "2.9%", topFormats: ["Articles", "Documents"], topTopics: ["East Asia Expansion", "Certified Translation"] } },
  { id: "lingo", name: "Lingo Anytime", color: "#E07000", initial: "L", ig: { followers: "8,420", postsPerMonth: 18, avgEngagement: "3.1%", topFormats: ["Static", "Reels"], topTopics: ["Promotions", "Price Offers", "Testimonials"] }, li: { followers: "3,840", postsPerMonth: 14, avgEngagement: "1.8%", topFormats: ["Text Post", "Video"], topTopics: ["Translation Tips", "Industry News"] } },
  { id: "wordperfect", name: "Word Perfect", color: "#2563EB", initial: "W", ig: { followers: "4,100", postsPerMonth: 12, avgEngagement: "2.4%", topFormats: ["Carousel", "Static"], topTopics: ["Trust Building", "Multilingual", "Case Studies"] }, li: { followers: "5,200", postsPerMonth: 20, avgEngagement: "3.8%", topFormats: ["Articles", "Polls"], topTopics: ["Thought Leadership", "Business Expansion", "Legal Translation"] } },
];
