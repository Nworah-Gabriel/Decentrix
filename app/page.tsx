import { DashboardStats } from "@/components/dashboard-stats";
import { AttestationsTable } from "@/components/attestations-table";
import { SchemasTable } from "@/components/schemas-table";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <DashboardStats />

      {/* Recent Attestations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between"></div>
        <AttestationsTable
          isHomepage={true}
          showSearch={false}
          showPagination={false}
          limit={8}
        />
      </div>

      {/* Recent Schemas Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between"></div>
        <SchemasTable
          isHomepage={true}
          showSearch={false}
          showPagination={false}
          limit={6}
        />
      </div>
    </div>
  );
}
