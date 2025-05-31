"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Shield, Activity } from "lucide-react";
import { useAttestationStore } from "@/store/useAttestation";
import { useSchemaStore } from "@/store/useSchema";
import { useEffect } from "react";

export function DashboardStats() {
  const { stats, allAttestations, fetchAttestations } = useAttestationStore();
  const { schemas, fetchSchemas } = useSchemaStore();

  useEffect(() => {
    fetchAttestations();
    fetchSchemas();
  }, [fetchAttestations, fetchSchemas]);

  // Calculate additional stats
  const uniqueIssuers = new Set(allAttestations.map((a) => a.issuer)).size;
  const uniqueSubjects = new Set(allAttestations.map((a) => a.subject)).size;
  const recentAttestations = allAttestations.filter((a) => {
    const attestationTime = Number.parseInt(a.timestamp_ms);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return attestationTime > oneDayAgo;
  }).length;

  const statsData = [
    {
      title: "Total Attestations",
      value: allAttestations.length.toLocaleString(),
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trendColor: "text-green-600",
    },
    {
      title: "Total Schemas",
      value: schemas.length.toLocaleString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trendColor: "text-green-600",
    },
    {
      title: "Unique Attesters",
      value: uniqueIssuers.toLocaleString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trendColor: "text-green-600",
    },
    {
      title: "24h Activity",
      value: recentAttestations.toLocaleString(),
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "+18%",
      trendColor: "text-green-600",
    },
  ];

  const networkStats = [
    {
      label: "Network",
      value: "Sui Mainnet",
      status: "online",
    },
    {
      label: "Block Height",
      value: "2,847,392",
      status: "synced",
    },
    {
      label: "Gas Price",
      value: "1,000 MIST",
      status: "normal",
    },
    {
      label: "TPS",
      value: "1,247",
      status: "healthy",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sui Attestation Explorer
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Explore attestations and schemas on the Sui blockchain
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-sm`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              {/* <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div> */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Status */}
      {/* <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {networkStats.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.status === "online" ||
                    item.status === "synced" ||
                    item.status === "healthy" ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-yellow-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        item.status === "online" ||
                        item.status === "synced" ||
                        item.status === "healthy"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="text-lg font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Quick Stats Row */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Total Subjects
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {uniqueSubjects.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-green-900">98.7%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Avg. Response Time
                </p>
                <p className="text-2xl font-bold text-purple-900">1.2s</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
