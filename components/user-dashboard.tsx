"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Shield, FileText, TrendingUp, Users } from "lucide-react";
import { AttestationsTable } from "./attestations-table";
import { SchemasTable } from "./schemas-table";
import Link from "next/link";

// Mock user address - in real app this would come from wallet
const userAddress = "0x1234567890abcdef1234567890abcdef12345678";

export function UserDashboard() {
  const stats = [
    {
      title: "Attestations Made",
      value: "24",
      icon: Shield,
      trend: "+3 this week",
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Attestations Received",
      value: "18",
      icon: Users,
      trend: "+2 this week",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Schemas Created",
      value: "5",
      icon: FileText,
      trend: "+1 this month",
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Reputation Score",
      value: "95",
      icon: TrendingUp,
      trend: "+5 points",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/attestations/create">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Attestation
              </Button>
            </Link>
            <Link href="/schemas/create">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Schema
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Verify Attestation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Tabs defaultValue="made" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="made">Attestations Made</TabsTrigger>
          <TabsTrigger value="received">Attestations Received</TabsTrigger>
          <TabsTrigger value="schemas">My Schemas</TabsTrigger>
        </TabsList>

        <TabsContent value="made" className="space-y-4">
          <AttestationsTable
            isHomepage={false}
            showSearch={true}
            showPagination={true}
            filterByAddress={userAddress}
            filterType="attester"
          />
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          <AttestationsTable
            isHomepage={false}
            showSearch={true}
            showPagination={true}
            filterByAddress={userAddress}
            filterType="recipient"
          />
        </TabsContent>

        <TabsContent value="schemas" className="space-y-4">
          <SchemasTable
            isHomepage={false}
            showSearch={true}
            showPagination={true}
            filterByCreator={userAddress}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
