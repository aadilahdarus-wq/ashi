import {
  campaigns,
  statusStyles,
  targetStyles,
} from "@/lib/campaigns";

type CampaignTableProps = {
  embedded?: boolean;
};

export function CampaignTable({ embedded = false }: CampaignTableProps) {
  const wrapperClassName = embedded
    ? "overflow-hidden"
    : "overflow-hidden rounded-xl border border-border bg-surface";

  return (
    <div className={wrapperClassName}>
      {!embedded && (
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-[15px] font-semibold text-text">Campaigns</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-2/60">
              <th className="px-5 py-3 font-medium text-text-3">Campaign</th>
              <th className="px-5 py-3 font-medium text-text-3">Status</th>
              <th className="px-5 py-3 font-medium text-text-3">Spend</th>
              <th className="px-5 py-3 font-medium text-text-3">Leads</th>
              <th className="px-5 py-3 font-medium text-text-3">CPL</th>
              <th className="px-5 py-3 font-medium text-text-3">ROAS</th>
              <th className="px-5 py-3 font-medium text-text-3">Target</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.name}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4 font-medium text-text">
                  {campaign.name}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${statusStyles[campaign.status]}`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-text-2">{campaign.spend}</td>
                <td className="px-5 py-4 text-text-2">{campaign.leads}</td>
                <td className="px-5 py-4 text-text-2">{campaign.cpl}</td>
                <td className="px-5 py-4 text-text-2">{campaign.roas}</td>
                <td
                  className={`px-5 py-4 font-medium ${targetStyles[campaign.target.tone]}`}
                >
                  {campaign.target.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
