"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Eye } from "lucide-react"
import { useAttestationStore } from "@/lib/store"
import Link from "next/link"

export function RecentAttestations() {
  const { recentAttestations } = useAttestationStore()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Attestations</CardTitle>
        <Link href="/attestations">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">UID</th>
                <th className="text-left p-4 font-medium">Schema</th>
                <th className="text-left p-4 font-medium">From</th>
                <th className="text-left p-4 font-medium">To</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Age</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentAttestations.map((attestation) => (
                <tr key={attestation.uid} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {attestation.uid.slice(0, 8)}...{attestation.uid.slice(-6)}
                    </div>
                  </td>
                  <td className="p-4">
                    <Link href={`/schemas/${attestation.schemaId}`}>
                      <Badge variant="secondary" className="hover:bg-blue-100 cursor-pointer">
                        #{attestation.schemaId}
                      </Badge>
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm">
                      {attestation.from.slice(0, 6)}...{attestation.from.slice(-4)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm">
                      {attestation.to.slice(0, 6)}...{attestation.to.slice(-4)}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={attestation.type === "WITNESSED" ? "default" : "secondary"}
                      className={
                        attestation.type === "WITNESSED" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""
                      }
                    >
                      {attestation.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{attestation.age}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/attestations/${attestation.uid}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
