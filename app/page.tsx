import { DashboardStats } from "@/components/dashboard-stats"
import { RecentAttestations } from "@/components/recent-attestations"
import { RecentSchemas } from "@/components/recent-schemas"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Showing the most recent SAS activity on Sui blockchain.</p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentAttestations />
        </div>
        <div>
          <RecentSchemas />
        </div>
      </div>
    </div>
  )
}
