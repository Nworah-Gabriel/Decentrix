"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Zap, Shield, Users, ExternalLink } from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    description: "Learn the basics of creating and managing attestations",
    icon: BookOpen,
    articles: [
      "What are Attestations?",
      "Creating Your First Attestation",
      "Understanding Schemas",
      "Wallet Integration",
    ],
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Developer Guide",
    description: "Technical documentation for developers",
    icon: Code,
    articles: [
      "API Reference",
      "SDK Documentation",
      "GraphQL Queries",
      "Smart Contract Integration",
    ],
    color: "from-purple-500 to-violet-600",
  },
  {
    title: "Advanced Features",
    description: "Explore advanced attestation features",
    icon: Zap,
    articles: [
      "Batch Operations",
      "Custom Resolvers",
      "Attestation Delegation",
      "Time-based Attestations",
    ],
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Security",
    description: "Best practices for secure attestations",
    icon: Shield,
    articles: [
      "Security Best Practices",
      "Verification Methods",
      "Revocation Strategies",
      "Privacy Considerations",
    ],
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Use Cases",
    description: "Real-world applications and examples",
    icon: Users,
    articles: [
      "Identity Verification",
      "Academic Credentials",
      "Professional Certifications",
      "Reputation Systems",
    ],
    color: "from-pink-500 to-rose-600",
  },
];

export function DocsContent() {
  return (
    <div className="space-y-8">
      {/* Quick Start */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Quick Start Guide</h3>
              <p className="text-sm text-muted-foreground">
                Get up and running with SAS in under 5 minutes
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Start Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docSections.map((section, index) => (
          <Card
            key={index}
            className="hover:border-primary/20 transition-all duration-200 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div
                  className={`h-10 w-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <section.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {section.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.articles.map((article, articleIndex) => (
                <div
                  key={articleIndex}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">{article}</span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            API Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">REST API</h4>
              <p className="text-sm text-muted-foreground mb-3">
                RESTful API for basic operations
              </p>
              <Badge variant="outline">v1.0</Badge>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">GraphQL API</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Flexible queries and real-time subscriptions
              </p>
              <Badge variant="outline">v1.0</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
