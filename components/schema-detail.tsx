"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, FileText, Users, Calendar, Code } from "lucide-react"
import { useAttestationStore } from "@/lib/store"

interface SchemaDetailProps {
  id: string
}

export function SchemaDetail({ id }: SchemaDetailProps) {
  const { getSchemaById } = useAttestationStore()
  const schema = getSchemaById(id)

  if (!schema) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Schema not found</p>
        </CardContent>
      </Card>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{schema.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">#{schema.id}</Badge>
                  <span className="text-sm text-muted-foreground">Schema</span>
                </div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Use This Schema
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{schema.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{schema.attestationCount} attestations</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Created {schema.createdAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{schema.fields.length} fields</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schema Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schema.fields.map((field, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{field}</Badge>
                  <span className="text-sm text-muted-foreground">string</span>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schema Definition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(
                {
                  id: schema.id,
                  name: schema.name,
                  description: schema.description,
                  fields: schema.fields.map((field) => ({
                    name: field,
                    type: "string",
                    required: true,
                  })),
                  version: "1.0.0",
                  created: schema.createdAt,
                },
                null,
                2,
              )}
            </pre>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(schema, null, 2))}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Schema
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
