"use client";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
type DataPoint = { date: string; primary: number; secondary: number; };
type Props = { data: DataPoint[]; primaryLabel: string; secondaryLabel: string; primaryColor: string; title: string; };
const IG_DATA: DataPoint[] = [
  { date: "May 15", primary: 9200, secondary: 38 },
  { date: "May 22", primary: 11400, secondary: 52 },
  { date: "May 29", primary: 14800, secondary: 61 },
  { date: "Jun 7", primary: 16200, secondary: 74 },
  { date: "Jun 14", primary: 18400, secondary: 124 },
];
const LI_DATA: DataPoint[] = [
  { date: "May 15", primary: 5200, secondary: 8 },
  { date: "May 22", primary: 6400, secondary: 12 },
  { date: "May 29", primary: 7800, secondary: 18 },
  { date: "Jun 7", primary: 8900, secondary: 28 },
  { date: "Jun 14", primary: 9840, secondary: 48 },
];
export function IgGrowthChart() {
  return <GrowthChart data={IG_DATA} title="Follower Growth & Reach" primaryLabel="Reach" secondaryLabel="New Followers" primaryColor="#E1306C" />;
}
export function LiGrowthChart() {
  return <GrowthChart data={LI_DATA} title="Impressions & Follower Growth" primaryLabel="Impressions" secondaryLabel="New Followers" primaryColor="#0A66C2" />;
}
function GrowthChart({ data, title, primaryLabel, secondaryLabel, primaryColor }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-text">{title}</h3>
        <div className="flex items-center gap-4 text-[11px] text-text-3">
          <span className="flex items-center gap-1.5"><span className="h-[2px] w-3 rounded-full" style={{ background: primaryColor }} />{primaryLabel}</span>
          <span className="flex items-center gap-1.5"><span className="h-[2px] w-3 rounded-full border-t-2 border-dashed border-orange" />{secondaryLabel}</span>
        </div>
      </div>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${primaryLabel}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={primaryColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--text-3)", fontSize: 11 }} />
            <YAxis yAxisId="primary" hide domain={['auto', 'auto']} />
            <YAxis yAxisId="secondary" hide domain={['auto', 'auto']} orientation="right" />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Area yAxisId="primary" type="monotone" dataKey="primary" stroke={primaryColor} strokeWidth={2.5} fill={`url(#grad-${primaryLabel})`} name={primaryLabel} dot={{ r: 3.5, fill: primaryColor, stroke: "white", strokeWidth: 1.5 }} />
            <Line yAxisId="secondary" type="monotone" dataKey="secondary" stroke="var(--orange)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name={secondaryLabel} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
