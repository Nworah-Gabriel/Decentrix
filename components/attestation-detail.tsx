"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  ExternalLink,
  Shield,
  Clock,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Hash,
  Eye,
  Download,
  Share2,
} from "lucide-react";
import { useState } from "react";

// Mock store hook - replace with your actual implementation
const useAttestationStore = () => ({
  getAttestationById: (id: string) => ({
    uid: "0x1234567890abcdef1234567890abcdef12345678",
    schemaId: "0xa1b2c3d4e5f6789012345678901234567890abcd",
    from: "0x742d35Cc6634C0532925a3b8D56c58BBB8c5eB8C",
    to: "0x8ba1f109551bD432803012645Hac136c99b42c61",
    type: "WITNESSED" as const,
    age: "2 hours ago",
    time: "2025-05-30T14:30:00Z",
    revoked: false,
    data: {
      message: "Identity verification completed",
      score: 95,
      verified: true,
      timestamp: "2025-05-30T14:30:00Z",
      metadata: {
        verificationMethod: "KYC",
        documentType: "passport",
        country: "US",
        ipfsHash: "QmXYZ123456789abcdef",
      },
    },
  }),
});

interface AttestationDetailProps {
  id: string;
}

export default function AttestationDetail({
  id = "sample-id",
}: AttestationDetailProps) {
  const { getAttestationById } = useAttestationStore();
  const attestation = getAttestationById(id);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!attestation) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Attestation not found</p>
          <p className="text-sm text-muted-foreground mt-2">
            The requested attestation could not be found or may have been
            revoked.
          </p>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = () => {
    if (attestation.revoked) return "destructive";
    return attestation.type === "WITNESSED" ? "default" : "secondary";
  };

  const getStatusIcon = () => {
    if (attestation.revoked) return <XCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 ">
      {/* Status Alert */}
      {attestation.revoked && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This attestation has been revoked and is no longer valid.
          </AlertDescription>
        </Alert>
      )}

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Attestation Details
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={getStatusColor()}
                className="flex items-center gap-1"
              >
                {getStatusIcon()}
                {attestation.revoked ? "REVOKED" : attestation.type}
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* UID */}
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Unique Identifier (UID)
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono break-all">
                    {attestation.uid}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(attestation.uid, "uid")}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "uid" && (
                  <p className="text-xs text-green-600 mt-1">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Schema */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Schema
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {formatAddress(attestation.schemaId)}
                  </Badge>
                  <Button variant="ghost" size="sm" title="View Schema">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(attestation.schemaId, "schema")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "schema" && (
                  <p className="text-xs text-green-600 mt-1">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Attester */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Attester (From)
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono">
                    {attestation.from}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(attestation.from, "from")}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "from" && (
                  <p className="text-xs text-green-600 mt-1">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Recipient */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Recipient (To)
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono">
                    {attestation.to}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(attestation.to, "to")}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "to" && (
                  <p className="text-xs text-green-600 mt-1">
                    Copied to clipboard!
                  </p>
                )}
              </div>
            </div>

            {/* Metadata Column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">
                      {attestation.age}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Attestor</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatAddress(attestation.from)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Schema</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatAddress(attestation.schemaId)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-xs text-muted-foreground">
                      {attestation.type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                {/* <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Block Explorer
                </Button> */}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Attestation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attestation Data Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Attestation Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Data Summary */}
            {attestation.data && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {attestation.data.score || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verification Score
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {attestation.data.verified ? "✓" : "✗"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified Status
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {attestation.data.metadata?.documentType?.toUpperCase() ||
                      "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">Document Type</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Raw Data */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Raw Attestation Data</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(attestation.data, null, 2),
                      "data"
                    )
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg border">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(attestation.data, null, 2)}
                </pre>
              </div>
              {copiedField === "data" && (
                <p className="text-xs text-green-600 mt-2">
                  JSON copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Blockchain Information</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Network: Sui Blockchain</li>
                <li>Block: #1,234,567</li>
                <li>Transaction: 0xabc123...</li>
                <li>Gas Used: 150,000</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Attestation Lifecycle</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Created: {attestation.time}</li>
                <li>✓ Indexed: {attestation.time}</li>
                <li>{attestation.revoked ? "✗ Revoked" : "✓ Active"}</li>
                <li>◦ Expires: Never</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
