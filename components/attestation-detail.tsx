"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Hash,
  Eye,
  Download,
  Share2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAttestationStore } from "@/store/useAttestation";

interface AttestationDetailProps {
  id: string;
}

export default function AttestationDetail({
  id = "sample-id",
}: AttestationDetailProps) {
  const { selectedAttestation, fetchAttestationById } = useAttestationStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttestation = async () => {
      setLoading(true);
      await fetchAttestationById(id);
      setLoading(false);
    };

    loadAttestation();
  }, [id, fetchAttestationById]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">
            Loading attestation...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedAttestation) {
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(Number.parseInt(timestamp));
    return date.toLocaleString();
  };

  const parseDefinitionJson = (definitionJson: string) => {
    try {
      return JSON.parse(definitionJson);
    } catch {
      return {};
    }
  };

  const attestationData = parseDefinitionJson(
    selectedAttestation.definition_json
  );

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Attestation Details
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                ACTIVE
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
              {/* ID */}
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Attestation ID
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono break-all">
                    {selectedAttestation.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedAttestation.id, "id")
                    }
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "id" && (
                  <p className="text-xs text-green-600 mt-1">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <div className="mt-2">
                  <p className="p-3 bg-muted rounded-md text-sm">
                    {selectedAttestation.name}
                  </p>
                </div>
              </div>

              {/* Schema */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Schema
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {formatAddress(selectedAttestation.schema_id)}
                  </Badge>
                  <Button variant="ghost" size="sm" title="View Schema">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedAttestation.schema_id, "schema")
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

              {/* Creator */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Creator
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono">
                    {selectedAttestation.creator}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedAttestation.creator, "creator")
                    }
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "creator" && (
                  <p className="text-xs text-green-600 mt-1">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Subject
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono">
                    {selectedAttestation.subject}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedAttestation.subject, "subject")
                    }
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "subject" && (
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
                      {formatTimestamp(selectedAttestation.timestamp_ms)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Creator</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatAddress(selectedAttestation.creator)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Schema</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatAddress(selectedAttestation.schema_id)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Issuer</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatAddress(selectedAttestation.issuer)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
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
            <Separator />

            {/* Raw Data */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Definition JSON</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(selectedAttestation.definition_json, "data")
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg border">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(attestationData, null, 2)}
                </pre>
              </div>
              {copiedField === "data" && (
                <p className="text-xs text-green-600 mt-2">
                  JSON copied to clipboard!
                </p>
              )}
            </div>

            {/* Data Hash */}
            {selectedAttestation.data_hash &&
              selectedAttestation.data_hash.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Data Hashes</h4>
                  <div className="space-y-2">
                    {selectedAttestation.data_hash.map((hash, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                          {hash}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(hash, `hash_${index}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <li>
                  Created: {formatTimestamp(selectedAttestation.timestamp_ms)}
                </li>
                <li>Status: Active</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Attestation Lifecycle</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  ✓ Created: {formatTimestamp(selectedAttestation.timestamp_ms)}
                </li>
                <li>
                  ✓ Indexed: {formatTimestamp(selectedAttestation.timestamp_ms)}
                </li>
                <li>✓ Active</li>
                <li>◦ Expires: Never</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
