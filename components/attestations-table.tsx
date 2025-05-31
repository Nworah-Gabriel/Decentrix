"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ExternalLink,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useAttestationStore } from "@/store/useAttestation";
import { useState } from "react";
import Link from "next/link";

interface AttestationsTableProps {
  isHomepage?: boolean;
  showTitle?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  limit?: number;
  filterByAddress?: string;
  filterType?: "attester" | "recipient";
}

export function AttestationsTable({
  isHomepage = false,
  showTitle = true,
  showSearch = true,
  showPagination = true,
  limit,
  filterByAddress,
  filterType,
}: AttestationsTableProps) {
  const { allAttestations: attestations } = useAttestationStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const filteredAttestations = attestations.filter((attestation) => {
    const matchesSearch =
      attestation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attestation.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attestation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attestation.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAddress =
      !filterByAddress ||
      (filterType === "attester" && attestation.creator === filterByAddress) ||
      (filterType === "recipient" && attestation.subject === filterByAddress) ||
      (!filterType &&
        (attestation.creator === filterByAddress ||
          attestation.subject === filterByAddress));

    return matchesSearch && matchesAddress;
  });

  // Apply limit for homepage
  const displayAttestations =
    isHomepage && limit
      ? filteredAttestations.slice(0, limit)
      : filteredAttestations;

  // Pagination logic
  const totalPages = Math.ceil(displayAttestations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttestations = showPagination
    ? displayAttestations.slice(startIndex, endIndex)
    : displayAttestations;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(Number.parseInt(timestamp));
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">
              {showTitle
                ? isHomepage
                  ? "Recent Attestations"
                  : "All Attestations"
                : ""}
            </CardTitle>
            {!isHomepage && (
              <p className="text-sm text-muted-foreground mt-1">
                {filteredAttestations.length} attestations found
              </p>
            )}
          </div>

          {isHomepage ? (
            <div className="flex items-center gap-2">
              <Link href="/attestations/create">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Attestation
                </Button>
              </Link>
              <Link href="/attestations">
                <Button variant="outline">View All Attestations</Button>
              </Link>
            </div>
          ) : (
            showSearch && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search attestations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Schema</th>
                <th className="text-left p-4 font-medium">Creator</th>
                <th className="text-left p-4 font-medium">Subject</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAttestations.map((attestation) => (
                <tr
                  key={attestation.id}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <Link href={`/attestations/${attestation.id}`}>
                      <div className="font-mono text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {formatAddress(attestation.id)}
                      </div>
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-sm max-w-[200px] truncate">
                      {attestation.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <Link href={`/schemas/${attestation.schema_id}`}>
                      <Badge
                        variant="outline"
                        className="hover:bg-blue-50 cursor-pointer"
                      >
                        {formatAddress(attestation.schema_id)}
                      </Badge>
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {formatAddress(attestation.creator)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {formatAddress(attestation.subject)}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatTimestamp(attestation.timestamp_ms)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/attestations/${attestation.id}`}>
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View on Explorer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, displayAttestations.length)} of{" "}
              {displayAttestations.length} attestations
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
