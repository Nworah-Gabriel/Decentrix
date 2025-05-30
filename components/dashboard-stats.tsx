"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useAttestationStore } from "@/lib/store";

export function DashboardStats() {
  const { stats } = useAttestationStore();

  const statCards = [
    {
      title: "Total Attestations",
      value: stats.totalAttestations.toLocaleString(),
      icon: FileText,
      trend: "+12.5%",
      description: "from last month",
    },
    {
      title: "Total Schemas",
      value: stats.totalSchemas.toLocaleString(),
      icon: TrendingUp,
      trend: "+8.2%",
      description: "from last month",
    },
    {
      title: "Unique Attestors",
      value: stats.uniqueAttestors.toLocaleString(),
      icon: Users,
      trend: "+15.3%",
      description: "from last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate pr-2">
              {stat.title}
            </CardTitle>
            <div className="flex-shrink-0">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-xl sm:text-2xl font-bold mb-1 truncate">
              {stat.value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-600 font-medium flex-shrink-0">
                {stat.trend}
              </span>
              <span className="ml-1 truncate">{stat.description}</span>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-bl-full" />
        </Card>
      ))}

      <Card className="col-span-1 sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold mb-1">
                Ready to create an attestation?
              </h3>
              <p className="text-sm text-muted-foreground">
                Start building trust on the Sui blockchain with verifiable
                attestations.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link href="/attestations/create">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Make Attestation
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
