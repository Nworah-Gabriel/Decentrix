import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, CheckCircle, Users, FileText, Layers, Lock } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Badge,
      title: "Identity Verification",
      description: "Verify identities, credentials, and achievements with cryptographic proof.",
      color: "text-blue-600",
    },
    {
      icon: CheckCircle,
      title: "Reputation Systems",
      description: "Build trust networks and reputation scores based on verified attestations.",
      color: "text-green-600",
    },
    {
      icon: Users,
      title: "Social Proof",
      description: "Create social graphs and endorsement networks within the Sui ecosystem.",
      color: "text-purple-600",
    },
    {
      icon: FileText,
      title: "Document Verification",
      description: "Attest to the authenticity and integrity of important documents.",
      color: "text-orange-600",
    },
    {
      icon: Layers,
      title: "Custom Schemas",
      description: "Create flexible attestation schemas for any use case or industry.",
      color: "text-cyan-600",
    },
    {
      icon: Lock,
      title: "Privacy Preserving",
      description: "Support for zero-knowledge proofs and selective disclosure.",
      color: "text-red-600",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Attestation Features</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to build trust and verify information on the Sui blockchain
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
