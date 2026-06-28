import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { HealthScore } from "@/components/dashboard/HealthScore";
import { StatCards } from "@/components/dashboard/StatCards";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <StatCards />
      <HealthScore />
      <CampaignTable />
    </div>
  );
}
