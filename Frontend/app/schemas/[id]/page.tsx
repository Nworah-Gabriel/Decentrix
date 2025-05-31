import SchemaDetail from "@/components/schema-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SchemaPageProps {
  params: Promise<{ id: string }>;
}

export default async function SchemaPage({ params }: SchemaPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/schemas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schemas
          </Button>
        </Link>
      </div>

      <SchemaDetail id={id} />
    </div>
  );
}
