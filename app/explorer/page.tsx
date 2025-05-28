import { ExplorerHeader } from "@/components/explorer/explorer-header"
import { Dashboard } from "@/components/explorer/dashboard"
import { AttestationTable } from "@/components/explorer/attestation-table"

export default function ExplorerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExplorerHeader />
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
        <div className="mt-8">
          <AttestationTable />
        </div>
      </main>
    </div>
  )
}
