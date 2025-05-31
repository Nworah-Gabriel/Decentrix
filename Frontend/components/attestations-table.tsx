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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(Number.parseInt(timestamp));
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                {showTitle
                  ? isHomepage
                    ? "Recent Attestations"
                    : "All Attestations"
                  : ""}
              </CardTitle>
              {!isHomepage && (
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredAttestations.length > 0 && (
                    <>{filteredAttestations.length} attestations found</>
                  )}
                </p>
              )}
            </div>

            {isHomepage ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Link href="/attestations/create" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Attestation
                  </Button>
                </Link>
                <Link href="/attestations" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    disabled={paginatedAttestations.length === 0}
                    className="w-full sm:w-auto"
                  >
                    View All Attestations
                  </Button>
                </Link>
              </div>
            ) : (
              showSearch && (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search attestations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full sm:w-64"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
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
              {paginatedAttestations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No attestation available
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedAttestations.map((attestation) => (
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
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                          >
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {paginatedAttestations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No attestation available</p>
            </div>
          ) : (
            <div className="divide-y">
              {paginatedAttestations.map((attestation) => (
                <div key={attestation.id} className="p-4 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link href={`/attestations/${attestation.id}`}>
                        <div className="font-medium text-sm text-blue-600 hover:text-blue-800 cursor-pointer truncate">
                          {attestation.name}
                        </div>
                      </Link>
                      <div className="font-mono text-xs text-muted-foreground mt-1">
                        ID: {formatAddress(attestation.id)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
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
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Schema:</span>{" "}
                      <Link href={`/schemas/${attestation.schema_id}`}>
                        <Badge
                          variant="outline"
                          className="hover:bg-blue-50 cursor-pointer text-xs"
                        >
                          {formatAddress(attestation.schema_id)}
                        </Badge>
                      </Link>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      <span className="font-mono text-xs">
                        {formatTimestamp(attestation.timestamp_ms)}
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
                        <div className="flex-1 min-w-0">
                          <span className="text-muted-foreground">
                            Creator:
                          </span>{" "}
                          <span className="font-mono text-xs break-all">
                            {formatAddress(attestation.creator)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-muted-foreground">
                            Subject:
                          </span>{" "}
                          <span className="font-mono text-xs break-all">
                            {formatAddress(attestation.subject)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, displayAttestations.length)} of{" "}
              {displayAttestations.length} attestations
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 3) {
                    page = i + 1;
                  } else if (currentPage <= 2) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    page = totalPages - 2 + i;
                  } else {
                    page = currentPage - 1 + i;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
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
                className="px-2"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
