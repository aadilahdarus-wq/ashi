import { performanceRows } from "@/lib/performance";

export function PerformanceTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold text-text">
          Campaign breakdown
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/60">
              <th className="px-5 py-3 font-medium text-text-3">Campaign</th>
              <th className="px-5 py-3 font-medium text-text-3">
                Impressions
              </th>
              <th className="px-5 py-3 font-medium text-text-3">Clicks</th>
              <th className="px-5 py-3 font-medium text-text-3">CTR</th>
              <th className="px-5 py-3 font-medium text-text-3">CPC</th>
              <th className="px-5 py-3 font-medium text-text-3">Spend</th>
              <th className="px-5 py-3 font-medium text-text-3">
                Conversions
              </th>
              <th className="px-5 py-3 font-medium text-text-3">CPA</th>
            </tr>
          </thead>
          <tbody>
            {performanceRows.map((row) => (
              <tr
                key={row.campaign}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4 font-medium text-text">
                  {row.campaign}
                </td>
                <td className="px-5 py-4 text-text-2">{row.impressions}</td>
                <td className="px-5 py-4 text-text-2">{row.clicks}</td>
                <td className="px-5 py-4 text-text-2">{row.ctr}</td>
                <td className="px-5 py-4 text-text-2">{row.cpc}</td>
                <td className="px-5 py-4 text-text-2">{row.spend}</td>
                <td className="px-5 py-4 text-text-2">{row.conversions}</td>
                <td className="px-5 py-4 text-text-2">{row.cpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
