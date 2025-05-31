"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";
import { useAttestationStore } from "@/store/useAttestation";
import Link from "next/link";

export function RecentAttestations() {
  const { recentAttestations } = useAttestationStore();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(Number.parseInt(timestamp));
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "< 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

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
                  ID
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  Name
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  Schema
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  Creator
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base">
                  Subject
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
                  key={attestation.id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3 sm:p-4">
                    <div className="font-mono text-xs sm:text-sm text-accent hover:text-accent/80 cursor-pointer">
                      {formatAddress(attestation.id)}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="font-medium text-xs sm:text-sm max-w-[150px] truncate">
                      {attestation.name}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <Link href={`/schemas/${attestation.schema_id}`}>
                      <Badge
                        variant="secondary"
                        className="hover:bg-accent/10 cursor-pointer text-xs sm:text-sm"
                      >
                        {formatAddress(attestation.schema_id)}
                      </Badge>
                    </Link>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="font-mono text-xs sm:text-sm text-muted-foreground">
                      {formatAddress(attestation.creator)}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="font-mono text-xs sm:text-sm text-muted-foreground">
                      {formatAddress(attestation.subject)}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                    {formatTimestamp(attestation.timestamp_ms)}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Link href={`/attestations/${attestation.id}`}>
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
