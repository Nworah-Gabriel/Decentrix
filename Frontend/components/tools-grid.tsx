"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Shield,
  QrCode,
  Download,
  Upload,
  Zap,
  Database,
  Key,
  FileText,
} from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "Attestation Verifier",
    description: "Verify the authenticity and validity of any attestation",
    icon: Shield,
    href: "/verify",
    badge: "Popular",
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "QR Code Generator",
    description: "Generate QR codes for easy attestation sharing",
    icon: QrCode,
    href: "/tools/qr-generator",
    badge: "New",
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Batch Operations",
    description: "Create multiple attestations or schemas at once",
    icon: Zap,
    href: "/tools/batch",
    badge: "Pro",
    color: "from-purple-500 to-violet-600",
  },
  {
    title: "Schema Validator",
    description: "Validate schema definitions before deployment",
    icon: FileText,
    href: "/tools/schema-validator",
    badge: null,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Data Export",
    description: "Export attestations and schemas in various formats",
    icon: Download,
    href: "/tools/export",
    badge: null,
    color: "from-teal-500 to-green-600",
  },
  {
    title: "Data Import",
    description: "Import attestations from external sources",
    icon: Upload,
    href: "/tools/import",
    badge: "Beta",
    color: "from-pink-500 to-rose-600",
  },
  {
    title: "GraphQL Explorer",
    description: "Explore the SAS API with GraphQL queries",
    icon: Database,
    href: "/tools/graphql",
    badge: "Dev",
    color: "from-indigo-500 to-blue-600",
  },
  {
    title: "API Keys",
    description: "Manage your API keys for programmatic access",
    icon: Key,
    href: "/tools/api-keys",
    badge: null,
    color: "from-gray-500 to-slate-600",
  },
  {
    title: "Advanced Search",
    description: "Search with complex filters and conditions",
    icon: Search,
    href: "/tools/advanced-search",
    badge: null,
    color: "from-yellow-500 to-amber-600",
  },
];

export function ToolsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool, index) => (
        <Card
          key={index}
          className="hover:border-primary/20 transition-all duration-200 group"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              {tool.badge && (
                <Badge
                  variant="secondary"
                  className={`
                    ${
                      tool.badge === "Popular"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${tool.badge === "New" ? "bg-blue-100 text-blue-800" : ""}
                    ${
                      tool.badge === "Pro"
                        ? "bg-purple-100 text-purple-800"
                        : ""
                    }
                    ${
                      tool.badge === "Beta"
                        ? "bg-orange-100 text-orange-800"
                        : ""
                    }
                    ${tool.badge === "Dev" ? "bg-gray-100 text-gray-800" : ""}
                  `}
                >
                  {tool.badge}
                </Badge>
              )}
              <div
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <tool.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {tool.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{tool.description}</p>
            <Link href={tool.href}>
              <Button className="w-full" variant="outline">
                Open Tool
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
