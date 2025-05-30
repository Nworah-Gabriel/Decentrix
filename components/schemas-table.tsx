"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  FileText,
  Search,
  Copy,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useAttestationStore } from "@/lib/store";
import { useState } from "react";
import Link from "next/link";

interface SchemasTableProps {
  isHomepage?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  limit?: number;
  filterByCreator?: string;
}

export function SchemasTable({
  isHomepage = false,
  showSearch = true,
  showPagination = true,
  limit,
  filterByCreator,
}: SchemasTableProps) {
  const { allSchemas: schemas } = useAttestationStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSchemas = schemas.filter((schema) => {
    const matchesSearch =
      schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schema.schema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schema.creator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCreator =
      !filterByCreator || schema.creator === filterByCreator;

    return matchesSearch && matchesCreator;
  });

  // Apply limit for homepage
  const displaySchemas =
    isHomepage && limit ? filteredSchemas.slice(0, limit) : filteredSchemas;

  // Pagination logic
  const totalPages = Math.ceil(displaySchemas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchemas = showPagination
    ? displaySchemas.slice(startIndex, endIndex)
    : displaySchemas;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">
              {isHomepage ? "Recent Schemas" : "All Schemas"}
            </CardTitle>
            {!isHomepage && (
              <p className="text-sm text-muted-foreground mt-1">
                {filteredSchemas.length} schemas found
              </p>
            )}
          </div>

          {isHomepage ? (
            <div className="flex items-center gap-2">
              <Link href="/schemas/create">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schema
                </Button>
              </Link>
              <Link href="/schemas">
                <Button variant="outline">View All Schemas</Button>
              </Link>
            </div>
          ) : (
            showSearch && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            )
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Schema</th>
                <th className="text-left p-4 font-medium">Creator</th>
                <th className="text-left p-4 font-medium">Resolver</th>
                <th className="text-left p-4 font-medium">Revocable</th>
                <th className="text-left p-4 font-medium">Attestations</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchemas.map((schema) => (
                <tr
                  key={schema.id}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <Link href={`/schemas/${schema.id}`}>
                        <Badge
                          variant="outline"
                          className="font-mono hover:bg-blue-50 cursor-pointer"
                        >
                          #{schema.id}
                        </Badge>
                      </Link>
                    </div>
                  </td>
                  <td className="p-4">
                    <Link href={`/schemas/${schema.id}`}>
                      <div className="font-medium text-sm max-w-[200px] truncate hover:text-blue-600 cursor-pointer">
                        {schema.name}
                      </div>
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded max-w-[300px] truncate">
                        {schema.schema}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(schema.schema)}
                        title="Copy Schema"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {schema.creator.slice(0, 8)}...{schema.creator.slice(-6)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {schema.resolver
                        ? `${schema.resolver.slice(
                            0,
                            8
                          )}...${schema.resolver.slice(-6)}`
                        : "None"}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={schema.revocable ? "default" : "secondary"}>
                      {schema.revocable ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">
                      {schema.attestationCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {schema.createdAt}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/schemas/${schema.id}`}>
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
              {Math.min(endIndex, displaySchemas.length)} of{" "}
              {displaySchemas.length} schemas
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
