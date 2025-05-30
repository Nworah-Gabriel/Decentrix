"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  ExternalLink,
  FileText,
  Users,
  Calendar,
  Code,
  Hash,
  User,
  Settings,
  Shield,
  Activity,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Zap,
  Database,
} from "lucide-react";
import { useState } from "react";

// Mock store hook - replace with your actual implementation
const useAttestationStore = () => ({
  getSchemaById: (id: string) => ({
    id: "0xa1b2c3d4e5f6789012345678901234567890abcd",
    name: "Identity Verification Schema",
    description:
      "A comprehensive schema for verifying user identity through various documentation methods including KYC compliance, document verification, and biometric validation.",
    schema:
      "string message,uint256 score,bool verified,bytes32 documentHash,string country",
    creator: "0x742d35Cc6634C0532925a3b8D56c58BBB8c5eB8C",
    resolver: "0x1234567890abcdef1234567890abcdef12345678",
    revocable: true,
    attestationCount: 1547,
    createdAt: "2024-01-15T10:30:00Z",
    fields: ["message", "score", "verified", "documentHash", "country"],
  }),
});

interface SchemaDetailProps {
  id: string;
}

export default function SchemaDetail({
  id = "sample-schema",
}: SchemaDetailProps) {
  const { getSchemaById } = useAttestationStore();
  const schema = getSchemaById(id);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!schema) {
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

  const parseSchemaFields = (schemaString: string) => {
    return schemaString.split(",").map((field) => {
      const parts = field.trim().split(" ");
      return {
        type: parts[0],
        name: parts[1],
        isArray: parts[0].includes("[]"),
        isRequired: true, // Assume all fields are required for now
      };
    });
  };

  const parsedFields = parseSchemaFields(schema.schema);

  const getTypeColor = (type: string) => {
    const baseType = type.replace("[]", "");
    switch (baseType) {
      case "string":
        return "bg-blue-100 text-blue-800";
      case "uint256":
        return "bg-green-100 text-green-800";
      case "bool":
        return "bg-purple-100 text-purple-800";
      case "bytes32":
        return "bg-orange-100 text-orange-800";
      case "address":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                <h1 className="text-3xl font-bold">{schema.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    Schema #{formatAddress(schema.id)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">
                      {schema.attestationCount} attestations
                    </span>
                  </div>
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
            {schema.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {schema.attestationCount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total Attestations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Code className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{parsedFields.length}</p>
                <p className="text-xs text-muted-foreground">Schema Fields</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Date(schema.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">Created</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  schema.revocable ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                <Shield
                  className={`h-5 w-5 ${
                    schema.revocable ? "text-orange-600" : "text-gray-600"
                  }`}
                />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {schema.revocable ? "Yes" : "No"}
                </p>
                <p className="text-xs text-muted-foreground">Revocable</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schema Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Schema Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Schema Fields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsedFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-xs ${getTypeColor(field.type)}`}
                        >
                          {field.type}
                        </Badge>
                        {field.isArray && (
                          <Badge variant="outline" className="text-xs">
                            Array
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{field.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {field.isRequired ? "Required" : "Optional"} field
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                    onClick={() => copyToClipboard(schema.schema, "schema")}
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
                <code className="text-sm font-mono block whitespace-pre-wrap">
                  {schema.schema}
                </code>
              </div>
              {copiedField === "schema" && (
                <p className="text-xs text-green-600 mt-2">
                  Schema definition copied!
                </p>
              )}

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="font-medium">JSON Schema</h4>
                <div className="bg-muted p-4 rounded-lg border">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        id: schema.id,
                        name: schema.name,
                        description: schema.description,
                        fields: parsedFields.map((field) => ({
                          name: field.name,
                          type: field.type,
                          required: field.isRequired,
                          isArray: field.isArray,
                        })),
                        version: "1.0.0",
                        revocable: schema.revocable,
                        resolver: schema.resolver,
                        creator: schema.creator,
                        created: schema.createdAt,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    {formatAddress(schema.id)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(schema.id, "id")}
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
                    {formatAddress(schema.creator)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(schema.creator, "creator")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === "creator" && (
                  <p className="text-xs text-green-600 mt-1">Copied!</p>
                )}
              </div>

              {schema.resolver && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Resolver
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                      {formatAddress(schema.resolver)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(schema.resolver, "resolver")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copiedField === "resolver" && (
                    <p className="text-xs text-green-600 mt-1">Copied!</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Revocable
                </span>
                <Badge variant={schema.revocable ? "default" : "secondary"}>
                  {schema.revocable ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {schema.revocable ? "Yes" : "No"}
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
                <Eye className="h-4 w-4 mr-2" />
                View Attestations
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Schema
              </Button>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
                <span className="font-medium">234 attestations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Last 7 Days
                </span>
                <span className="font-medium">52 attestations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Average Score
                </span>
                <span className="font-medium">87.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Success Rate
                </span>
                <span className="font-medium text-green-600">94.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Copy, ExternalLink, FileText, Users, Calendar, Code } from "lucide-react"
// import { useAttestationStore } from "@/lib/store"

// interface SchemaDetailProps {
//   id: string
// }

// export function SchemaDetail({ id }: SchemaDetailProps) {
//   const { getSchemaById } = useAttestationStore()
//   const schema = getSchemaById(id)

//   if (!schema) {
//     return (
//       <Card>
//         <CardContent className="p-8 text-center">
//           <p className="text-muted-foreground">Schema not found</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                 <FileText className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <CardTitle className="text-2xl">{schema.name}</CardTitle>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant="outline">#{schema.id}</Badge>
//                   <span className="text-sm text-muted-foreground">Schema</span>
//                 </div>
//               </div>
//             </div>
//             <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
//               Use This Schema
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <p className="text-muted-foreground">{schema.description}</p>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center gap-2">
//               <Users className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm">{schema.attestationCount} attestations</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm">Created {schema.createdAt}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Code className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm">{schema.fields.length} fields</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Schema Fields</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {schema.fields.map((field, index) => (
//               <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <Badge variant="secondary">{field}</Badge>
//                   <span className="text-sm text-muted-foreground">string</span>
//                 </div>
//                 <Button variant="ghost" size="sm">
//                   <ExternalLink className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Schema Definition</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="bg-muted p-4 rounded-lg">
//             <pre className="text-sm overflow-x-auto">
//               {JSON.stringify(
//                 {
//                   id: schema.id,
//                   name: schema.name,
//                   description: schema.description,
//                   fields: schema.fields.map((field) => ({
//                     name: field,
//                     type: "string",
//                     required: true,
//                   })),
//                   version: "1.0.0",
//                   created: schema.createdAt,
//                 },
//                 null,
//                 2,
//               )}
//             </pre>
//           </div>
//           <div className="flex items-center gap-2 mt-4">
//             <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(schema, null, 2))}>
//               <Copy className="h-4 w-4 mr-2" />
//               Copy Schema
//             </Button>
//             <Button variant="outline" size="sm">
//               <ExternalLink className="h-4 w-4 mr-2" />
//               View on Explorer
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
