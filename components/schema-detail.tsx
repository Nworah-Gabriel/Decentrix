"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  ExternalLink,
  FileText,
  Calendar,
  Code,
  User,
  Settings,
  Shield,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Zap,
  Database,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSchemaStore } from "@/store/useSchema";

interface SchemaDetailProps {
  id: string;
}

export default function SchemaDetail({
  id = "sample-schema",
}: SchemaDetailProps) {
  const { selectedSchema, fetchSchemaById } = useSchemaStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchema = async () => {
      setLoading(true);
      await fetchSchemaById(id);
      setLoading(false);
    };

    loadSchema();
  }, [id, fetchSchemaById]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading schema...</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedSchema) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Schema not found</p>
          <p className="text-sm text-muted-foreground mt-2">
            The requested schema could not be found or may not exist on this
            network.
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
    return date.toLocaleDateString();
  };

  const parseDefinitionJson = (definitionJson: string) => {
    try {
      return JSON.parse(definitionJson);
    } catch {
      return {};
    }
  };

  const schemaDefinition = parseDefinitionJson(selectedSchema.definition_json);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{selectedSchema.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    Schema {formatAddress(selectedSchema.id)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-white/90">
                <Zap className="h-4 w-4 mr-2" />
                Use Schema
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-lg leading-relaxed">
            {selectedSchema.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatTimestamp(selectedSchema.timestamp_ms)}
                </p>
                <p className="text-xs text-muted-foreground">Created</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatAddress(selectedSchema.creator)}
                </p>
                <p className="text-xs text-muted-foreground">Creator</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">Active</p>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schema Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Schema Definition */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Schema Definition
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedSchema.definition_json, "schema")
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg border">
                <pre className="text-sm font-mono block whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(schemaDefinition, null, 2)}
                </pre>
              </div>
              {copiedField === "schema" && (
                <p className="text-xs text-green-600 mt-2">
                  Schema definition copied!
                </p>
              )}

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="font-medium">Raw Definition JSON</h4>
                <div className="bg-muted p-4 rounded-lg border">
                  <pre className="text-xs overflow-x-auto">
                    {selectedSchema.definition_json}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Hashes */}
          {selectedSchema.data_hash && selectedSchema.data_hash.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Hashes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSchema.data_hash.map((hash, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <code className="flex-1 text-sm font-mono mr-4 break-all">
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schema Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Schema Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Schema ID
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                    {formatAddress(selectedSchema.id)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(selectedSchema.id, "id")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "id" && (
                  <p className="text-xs text-green-600 mt-1">Copied!</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Creator
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                    {formatAddress(selectedSchema.creator)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedSchema.creator, "creator")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "creator" && (
                  <p className="text-xs text-green-600 mt-1">Copied!</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Issuer
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                    {formatAddress(selectedSchema.issuer)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedSchema.issuer, "issuer")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "issuer" && (
                  <p className="text-xs text-green-600 mt-1">Copied!</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Status
                </span>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="default">
                <Zap className="h-4 w-4 mr-2" />
                Create Attestation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Schema
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
