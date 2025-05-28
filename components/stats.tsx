"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAttestationStore } from "@/lib/store"
import { useEffect } from "react"

export function Stats() {
  const { totalAttestations, totalSchemas, uniqueAttestors, fetchStats } = useAttestationStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by the Sui Community</h2>
        <p className="text-xl text-gray-600">Real-time statistics from the Sui Attestation Service</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-0">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
              {totalAttestations.toLocaleString()}
            </div>
            <div className="text-lg text-blue-700 font-medium">Total Attestations</div>
          </CardContent>
        </Card>

        <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-0">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">{totalSchemas.toLocaleString()}</div>
            <div className="text-lg text-purple-700 font-medium">Active Schemas</div>
          </CardContent>
        </Card>

        <Card className="text-center p-8 bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
          <CardContent className="p-0">
            <div className="text-4xl md:text-5xl font-bold text-cyan-600 mb-2">{uniqueAttestors.toLocaleString()}</div>
            <div className="text-lg text-cyan-700 font-medium">Unique Attestors</div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
