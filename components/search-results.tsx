"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileText, User, Shield } from "lucide-react";
import { useAttestationStore } from "@/lib/store";
import Link from "next/link";

interface SearchResultsProps {
  query?: string;
  type?: string;
}

export function SearchResults({
  query = "",
  type = "all",
}: SearchResultsProps) {
  const { allAttestations, allSchemas } = useAttestationStore();

  // Search logic
  const searchAttestations = allAttestations.filter(
    (attestation) =>
      attestation.uid.toLowerCase().includes(query.toLowerCase()) ||
      attestation.from.toLowerCase().includes(query.toLowerCase()) ||
      attestation.to.toLowerCase().includes(query.toLowerCase())
  );

  const searchSchemas = allSchemas.filter(
    (schema) =>
      schema.name.toLowerCase().includes(query.toLowerCase()) ||
      schema.description.toLowerCase().includes(query.toLowerCase()) ||
      schema.creator.toLowerCase().includes(query.toLowerCase())
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
                    key={attestation.uid}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{attestation.schemaId}</Badge>
                      <div>
                        <div className="font-mono text-sm">
                          {attestation.uid.slice(0, 16)}...
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {attestation.time}
                        </div>
                      </div>
                    </div>
                    <Link href={`/attestations/${attestation.uid}`}>
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
                      <Badge variant="outline">#{schema.id}</Badge>
                      <div>
                        <div className="font-medium">{schema.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {schema.attestationCount} attestations
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
