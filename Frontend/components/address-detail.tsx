"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, User, FileText, Shield } from "lucide-react";
import { useAttestationStore } from "@/lib/store";
import { AttestationsTable } from "./attestations-table";
import { SchemasTable } from "./schemas-table";

interface AddressDetailProps {
  address: string;
}

export function AddressDetail({ address }: AddressDetailProps) {
  const { allAttestations, allSchemas } = useAttestationStore();

  // Filter attestations for this address
  const attestationsAsAttester = allAttestations.filter(
    (a) => a.from === address
  );
  const attestationsAsRecipient = allAttestations.filter(
    (a) => a.to === address
  );
  const schemasCreated = allSchemas.filter((s) => s.creator === address);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Address Details</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {address}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {attestationsAsAttester.length} attestations made
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {attestationsAsRecipient.length} attestations received
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {schemasCreated.length} schemas created
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="made" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="made">
            Attestations Made ({attestationsAsAttester.length})
          </TabsTrigger>
          <TabsTrigger value="received">
            Attestations Received ({attestationsAsRecipient.length})
          </TabsTrigger>
          <TabsTrigger value="schemas">
            Schemas Created ({schemasCreated.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="made" className="space-y-4">
          <AttestationsTable
            isHomepage={false}
            showSearch={true}
            showPagination={true}
            filterByAddress={address}
            filterType="attester"
          />
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          <AttestationsTable
            isHomepage={false}
            showSearch={true}
            showPagination={true}
            filterByAddress={address}
            filterType="recipient"
          />
        </TabsContent>

        <TabsContent value="schemas" className="space-y-4">
          <SchemasTable
            isHomepage={false}
            showSearch={true}
            showPagination={true}
            filterByCreator={address}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
