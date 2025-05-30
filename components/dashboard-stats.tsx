"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, FileText, Plus } from "lucide-react"
import { useAttestationStore } from "@/lib/store"

export function DashboardStats() {
  const { stats } = useAttestationStore()

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
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">{stat.trend}</span>
              <span className="ml-1">{stat.description}</span>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-bl-full" />
        </Card>
      ))}

      <Card className="md:col-span-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-lg font-semibold">Ready to create an attestation?</h3>
            <p className="text-muted-foreground">
              Start building trust on the Sui blockchain with verifiable attestations.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Make Attestation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
