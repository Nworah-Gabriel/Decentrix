"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { useSchemaStore } from "@/store/useSchema";
import Link from "next/link";

export function RecentSchemas() {
  const { recentSchemas } = useSchemaStore();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="h-fit border-2 border-border/50 shadow-sm hover:border-border/80 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg sm:text-xl font-semibold">
          Recent Schemas
        </CardTitle>
        <Link href="/schemas">
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 hover:bg-accent/5"
          >
            View All
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {recentSchemas.map((schema) => (
          <div
            key={schema.id}
            className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/5 transition-all duration-200 min-h-[60px] group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className="flex-shrink-0 text-xs sm:text-sm bg-muted/50"
                  >
                    {formatAddress(schema.id)}
                  </Badge>
                  <span className="font-medium truncate text-sm sm:text-base">
                    {schema.name}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground truncate">
                  {schema.description}
                </div>
              </div>
            </div>
            <Link href={`/schemas/${schema.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 ml-2 hover:bg-accent/10"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
