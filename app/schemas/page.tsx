import { SchemasGrid } from "@/components/schemas-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus } from "lucide-react"

export default function SchemasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Schemas</h1>
          <p className="text-muted-foreground">Explore all attestation schemas available on the Sui blockchain.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Schema
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search schemas..." className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <SchemasGrid />
    </div>
  )
}
