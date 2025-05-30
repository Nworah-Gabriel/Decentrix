import { UserDashboard } from "@/components/user-dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your attestations and schemas
          </p>
        </div>
      </div>

      <UserDashboard />
    </div>
  );
}
