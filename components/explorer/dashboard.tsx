"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAttestationStore } from "@/lib/store"
import { useEffect } from "react"

export function Dashboard() {
  const { totalAttestations, totalSchemas, uniqueAttestors, fetchStats } = useAttestationStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Showing the most recent SAS activity.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Make Attestation</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Attestations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAttestations.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Schemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSchemas.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unique Attestors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniqueAttestors.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
