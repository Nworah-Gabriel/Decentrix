import { SchemasTable } from "@/components/schemas-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function SchemasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Schemas</h1>
          <p className="text-muted-foreground">
            Explore all attestation schemas available on the Sui blockchain.
          </p>
        </div>
        <Link href="/schemas/create">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Schema
          </Button>
        </Link>
      </div>

      <SchemasTable
        isHomepage={false}
        showSearch={true}
        showPagination={true}
      />
    </div>
  );
}
