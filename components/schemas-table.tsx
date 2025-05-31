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
import { useSchemaStore } from "@/store/useSchema";
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
  const { schemas } = useSchemaStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSchemas = schemas.filter((schema) => {
    const matchesSearch =
      schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schema.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                {isHomepage ? "Recent Schemas" : "All Schemas"}
              </CardTitle>
              {!isHomepage && (
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredSchemas.length} schemas found
                </p>
              )}
            </div>

            {isHomepage ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Link href="/schemas/create" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Schema
                  </Button>
                </Link>
                <Link href="/schemas" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    View All Schemas
                  </Button>
                </Link>
              </div>
            ) : (
              showSearch && (
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schemas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full sm:w-64"
                  />
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
                <th className="text-left p-4 font-medium">Description</th>
                <th className="text-left p-4 font-medium">Creator</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchemas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    <p className="text-muted-foreground">No schema available</p>
                  </td>
                </tr>
              ) : (
                paginatedSchemas.map((schema) => (
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
                            {formatAddress(schema.id)}
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
                      <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                        {schema.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm text-muted-foreground">
                        {formatAddress(schema.creator)}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatTimestamp(schema.timestamp_ms)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/schemas/${schema.id}`}>
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
                          onClick={() =>
                            copyToClipboard(schema.definition_json)
                          }
                          title="Copy Definition"
                        >
                          <Copy className="h-4 w-4" />
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
          {paginatedSchemas.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No schema available</p>
            </div>
          ) : (
            <div className="divide-y">
              {paginatedSchemas.map((schema) => (
                <div key={schema.id} className="p-4 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link href={`/schemas/${schema.id}`}>
                          <div className="font-medium text-sm text-blue-600 hover:text-blue-800 cursor-pointer truncate">
                            {schema.name}
                          </div>
                        </Link>
                        <Link href={`/schemas/${schema.id}`}>
                          <Badge
                            variant="outline"
                            className="font-mono hover:bg-blue-50 cursor-pointer text-xs mt-1"
                          >
                            {formatAddress(schema.id)}
                          </Badge>
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link href={`/schemas/${schema.id}`}>
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(schema.definition_json)}
                        title="Copy Definition"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {schema.description && (
                    <div className="text-sm text-muted-foreground">
                      {schema.description}
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Creator:</span>{" "}
                      <span className="font-mono text-xs break-all">
                        {formatAddress(schema.creator)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      <span className="font-mono text-xs">
                        {formatTimestamp(schema.timestamp_ms)}
                      </span>
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
              {Math.min(endIndex, displaySchemas.length)} of{" "}
              {displaySchemas.length} schemas
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
