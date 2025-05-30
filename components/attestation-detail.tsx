"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Shield, Clock, User, FileText } from "lucide-react"
import { useAttestationStore } from "@/lib/store"

interface AttestationDetailProps {
  id: string
}

export function AttestationDetail({ id }: AttestationDetailProps) {
  const { getAttestationById } = useAttestationStore()
  const attestation = getAttestationById(id)

  if (!attestation) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Attestation not found</p>
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
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Attestation Details
            </CardTitle>
            <Badge
              variant={attestation.type === "WITNESSED" ? "default" : "secondary"}
              className={attestation.type === "WITNESSED" ? "bg-yellow-100 text-yellow-800" : ""}
            >
              {attestation.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">UID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">{attestation.uid}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(attestation.uid)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Schema</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">#{attestation.schemaId}</Badge>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">From</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">{attestation.from}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(attestation.from)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">To</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">{attestation.to}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(attestation.to)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Created {attestation.age}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Attestor: {attestation.from.slice(0, 8)}...{attestation.from.slice(-6)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Schema #{attestation.schemaId}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attestation Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(
                {
                  message: "Identity verification completed",
                  score: 95,
                  verified: true,
                  timestamp: new Date().toISOString(),
                  metadata: {
                    verificationMethod: "KYC",
                    documentType: "passport",
                    country: "US",
                  },
                },
                null,
                2,
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
