import { SearchResults } from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          <p className="text-muted-foreground">
            {q
              ? `Results for "${q}"`
              : "Search attestations, schemas, and addresses"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search attestations, UIDs, schemas, or addresses..."
            className="pl-10"
            defaultValue={q}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={q} type={type} />
      </Suspense>
    </div>
  );
}
