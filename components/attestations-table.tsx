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
} from "lucide-react";
import { useAttestationStore } from "@/lib/store";
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
  const [filterTypeInternal, setFilterTypeInternal] = useState("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const filteredAttestations = attestations.filter((attestation) => {
    const matchesSearch =
      attestation.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attestation.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attestation.to.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterTypeInternal === "all" || attestation.type === filterTypeInternal;

    const matchesAddress =
      !filterByAddress ||
      (filterType === "attester" && attestation.from === filterByAddress) ||
      (filterType === "recipient" && attestation.to === filterByAddress) ||
      (!filterType &&
        (attestation.from === filterByAddress ||
          attestation.to === filterByAddress));

    return matchesSearch && matchesFilter && matchesAddress;
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
              {/* {isHomepage ? "Recent Attestations" : "All Attestations"} */}
            </CardTitle>
            {!isHomepage && (
              <p className="text-sm text-muted-foreground mt-1">
                {filteredAttestations.length} attestations found
              </p>
            )}
          </div>

          {isHomepage ? (
            <Link href="/attestations">
              <Button variant="outline">View All Attestations</Button>
            </Link>
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
                <select
                  value={filterTypeInternal}
                  onChange={(e) => setFilterTypeInternal(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="WITNESSED">Witnessed</option>
                  <option value="SELF">Self</option>
                </select>
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
                <th className="text-left p-4 font-medium">UID</th>
                <th className="text-left p-4 font-medium">Schema</th>
                <th className="text-left p-4 font-medium">Attester</th>
                <th className="text-left p-4 font-medium">Recipient</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Time</th>
                <th className="text-left p-4 font-medium">Revoked</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAttestations.map((attestation) => (
                <tr
                  key={attestation.uid}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <Link href={`/attestations/${attestation.uid}`}>
                      <div className="font-mono text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {attestation.uid.slice(0, 10)}...
                        {attestation.uid.slice(-8)}
                      </div>
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link href={`/schemas/${attestation.schemaId}`}>
                      <Badge
                        variant="outline"
                        className="hover:bg-blue-50 cursor-pointer"
                      >
                        #{attestation.schemaId}
                      </Badge>
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {attestation.from.slice(0, 8)}...
                      {attestation.from.slice(-6)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {attestation.to.slice(0, 8)}...{attestation.to.slice(-6)}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        attestation.type === "WITNESSED"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        attestation.type === "WITNESSED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {attestation.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {attestation.time}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={attestation.revoked ? "destructive" : "outline"}
                    >
                      {attestation.revoked ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/attestations/${attestation.uid}`}>
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
