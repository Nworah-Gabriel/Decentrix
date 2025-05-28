import { ExplorerHeader } from "@/components/explorer/explorer-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SchemasPage() {
  const schemas = [
    {
      id: "179",
      name: "Witnessed Attestations",
      description: "Attestations that require witness verification",
      attestations: 8420,
      type: "WITNESSED_ATTESTATIONS",
    },
    {
      id: "153",
      name: "Endorsements",
      description: "Peer-to-peer endorsements and recommendations",
      attestations: 2156,
      type: "ENDORSEMENTS",
    },
    {
      id: "142",
      name: "Identity Verification",
      description: "KYC and identity verification attestations",
      attestations: 1834,
      type: "IDENTITY_VERIFICATION",
    },
    {
      id: "128",
      name: "Reputation Score",
      description: "Reputation and trust score attestations",
      attestations: 437,
      type: "REPUTATION_SCORE",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <ExplorerHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Schemas</h1>
            <p className="text-gray-600 mt-1">Browse and create attestation schemas</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Create Schema</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemas.map((schema) => (
            <Card key={schema.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">#{schema.id}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">{schema.attestations} attestations</Badge>
                </div>
                <CardTitle className="text-xl">{schema.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{schema.description}</p>
                <Button variant="outline" className="w-full">
                  View Schema
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
