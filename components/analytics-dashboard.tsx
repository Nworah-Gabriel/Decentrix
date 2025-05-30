"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Shield,
  Activity,
} from "lucide-react";

export function AnalyticsDashboard() {
  const metrics = [
    {
      title: "Total Volume",
      value: "15,420",
      change: "+12.5%",
      trend: "up",
      icon: Activity,
      description: "Total attestations created",
    },
    {
      title: "Active Schemas",
      value: "216",
      change: "+8.2%",
      trend: "up",
      icon: FileText,
      description: "Schemas with recent activity",
    },
    {
      title: "Unique Users",
      value: "1,205",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      description: "Active attestors this month",
    },
    {
      title: "Verification Rate",
      value: "94.2%",
      change: "-2.1%",
      trend: "down",
      icon: Shield,
      description: "Successfully verified attestations",
    },
  ];

  const topSchemas = [
    { id: "42", name: "Identity Verification", count: 1250, growth: "+15%" },
    { id: "38", name: "Academic Credential", count: 890, growth: "+8%" },
    { id: "55", name: "Professional License", count: 567, growth: "+22%" },
    { id: "12", name: "Reputation Score", count: 445, growth: "+5%" },
    { id: "73", name: "Membership Proof", count: 334, growth: "+18%" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {metric.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attestation Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Chart placeholder - Attestation volume trends
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schema Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Chart placeholder - Schema usage pie chart
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Schemas */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Schemas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSchemas.map((schema, index) => (
              <div
                key={schema.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{schema.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Schema #{schema.id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {schema.count.toLocaleString()}
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    {schema.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
