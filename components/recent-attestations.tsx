"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";
import { useAttestationStore } from "@/lib/store";
import Link from "next/link";

export function RecentAttestations() {
  const { recentAttestations } = useAttestationStore();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Attestations</CardTitle>
        <Link href="/attestations">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  UID
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  Schema
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  From
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  To
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  Type
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  Age
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentAttestations.map((attestation) => (
                <tr
                  key={attestation.uid}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3 sm:p-4">
                    <div className="font-mono text-xs sm:text-sm text-accent hover:text-accent/80 cursor-pointer">
                      {attestation.uid.slice(0, 8)}...
                      {attestation.uid.slice(-6)}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <Link href={`/schemas/${attestation.schemaId}`}>
                      <Badge
                        variant="secondary"
                        className="hover:bg-accent/10 cursor-pointer text-xs sm:text-sm"
                      >
                        #{attestation.schemaId}
                      </Badge>
                    </Link>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="font-mono text-xs sm:text-sm text-muted-foreground">
                      {attestation.from.slice(0, 6)}...
                      {attestation.from.slice(-4)}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="font-mono text-xs sm:text-sm text-muted-foreground">
                      {attestation.to.slice(0, 6)}...{attestation.to.slice(-4)}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <Badge
                      variant={
                        attestation.type === "WITNESSED"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        attestation.type === "WITNESSED"
                          ? "bg-accent/10 text-accent hover:bg-accent/20"
                          : ""
                      }
                    >
                      {attestation.type}
                    </Badge>
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                    {attestation.age}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Link href={`/attestations/${attestation.uid}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
