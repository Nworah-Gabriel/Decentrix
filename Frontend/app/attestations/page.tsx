import { AttestationsTable } from "@/components/attestations-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AttestationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            All Attestations
          </h1>
          <p className="text-muted-foreground">
            Browse and search through all attestations on Sui blockchain.
          </p>
        </div>
        <Link href="/attestations/create">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Make Attestation
          </Button>
        </Link>
      </div>

      <AttestationsTable
        isHomepage={false}
        showTitle={false}
        showSearch={true}
        showPagination={true}
      />
    </div>
  );
}
