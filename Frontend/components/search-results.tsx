"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileText, User, Shield } from "lucide-react";
import { useAttestationStore } from "@/store/useAttestation";
import { useSchemaStore } from "@/store/useSchema";
import Link from "next/link";

interface SearchResultsProps {
  query?: string;
  type?: string;
}

export function SearchResults({
  query = "",
  type = "all",
}: SearchResultsProps) {
  const { allAttestations } = useAttestationStore();
  const { schemas } = useSchemaStore();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
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

  // Search logic
  const searchAttestations = allAttestations.filter(
    (attestation) =>
      attestation.id.toLowerCase().includes(query.toLowerCase()) ||
      attestation.name.toLowerCase().includes(query.toLowerCase()) ||
      attestation.creator.toLowerCase().includes(query.toLowerCase()) ||
      attestation.subject.toLowerCase().includes(query.toLowerCase())
  );

  const searchSchemas = schemas.filter(
    (schema) =>
      schema.name.toLowerCase().includes(query.toLowerCase()) ||
      schema.description.toLowerCase().includes(query.toLowerCase()) ||
      schema.creator?.toLowerCase().includes(query.toLowerCase()) ||
      schema.id.toLowerCase().includes(query.toLowerCase())
  );

  // Mock address search (in real app, this would be more sophisticated)
  const searchAddresses = query.startsWith("0x") ? [query] : [];

  const totalResults =
    searchAttestations.length + searchSchemas.length + searchAddresses.length;

  if (!query) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Enter a search term to find attestations, schemas, or addresses.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Results ({totalResults} found)</CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
          <TabsTrigger value="attestations">
            Attestations ({searchAttestations.length})
          </TabsTrigger>
          <TabsTrigger value="schemas">
            Schemas ({searchSchemas.length})
          </TabsTrigger>
          <TabsTrigger value="addresses">
            Addresses ({searchAddresses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Attestations */}
          {searchAttestations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Attestations ({searchAttestations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {searchAttestations.slice(0, 5).map((attestation) => (
                  <div
                    key={attestation.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {formatAddress(attestation.schema_id)}
                      </Badge>
                      <div>
                        <div className="font-medium text-sm">
                          {attestation.name}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {formatAddress(attestation.id)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(attestation.timestamp_ms)}
                        </div>
                      </div>
                    </div>
                    <Link href={`/attestations/${attestation.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
                {searchAttestations.length > 5 && (
                  <Link href={`/attestations?search=${query}`}>
                    <Button variant="outline" className="w-full">
                      View all {searchAttestations.length} attestations
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Schemas */}
          {searchSchemas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Schemas ({searchSchemas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {searchSchemas.slice(0, 5).map((schema) => (
                  <div
                    key={schema.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {formatAddress(schema.id)}
                      </Badge>
                      <div>
                        <div className="font-medium">{schema.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {schema.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created {formatTimestamp(schema.timestamp_ms)}
                        </div>
                      </div>
                    </div>
                    <Link href={`/schemas/${schema.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
                {searchSchemas.length > 5 && (
                  <Link href={`/schemas?search=${query}`}>
                    <Button variant="outline" className="w-full">
                      View all {searchSchemas.length} schemas
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Addresses */}
          {searchAddresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Addresses ({searchAddresses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {searchAddresses.map((address) => (
                  <div
                    key={address}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-mono text-sm">{address}</div>
                        <div className="text-xs text-muted-foreground">
                          Sui Address
                        </div>
                      </div>
                    </div>
                    <Link href={`/address/${address}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {totalResults === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No results found for "{query}"
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="attestations">
          {/* Show full attestations list */}
        </TabsContent>

        <TabsContent value="schemas">
          {/* Show full schemas list */}
        </TabsContent>

        <TabsContent value="addresses">
          {/* Show full addresses list */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
