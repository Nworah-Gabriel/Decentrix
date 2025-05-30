"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"
import { useAttestationStore } from "@/lib/store"
import Link from "next/link"

export function RecentSchemas() {
  const { recentSchemas } = useAttestationStore()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Schemas</CardTitle>
        <Link href="/schemas">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentSchemas.map((schema) => (
          <div
            key={schema.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{schema.id}</Badge>
                  <span className="font-medium">{schema.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">{schema.attestationCount} attestations</div>
              </div>
            </div>
            <Link href={`/schemas/${schema.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
