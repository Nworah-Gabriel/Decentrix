import { DashboardStats } from "@/components/dashboard-stats";
import { RecentAttestations } from "@/components/recent-attestations";
import { RecentSchemas } from "@/components/recent-schemas";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Showing the most recent SAS activity on Sui blockchain.
          </p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <RecentAttestations />
        </div>
        <div className="xl:col-span-1">
          <RecentSchemas />
        </div>
      </div>
    </div>
  );
}
