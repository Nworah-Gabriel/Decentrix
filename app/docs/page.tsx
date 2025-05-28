import { ExplorerHeader } from "@/components/explorer/explorer-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Zap, Shield } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExplorerHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-xl text-gray-600">Everything you need to build with Sui Attestation Service</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <CardTitle>Quick Start</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get up and running with SAS in minutes. Learn the basics and make your first attestation.
                </p>
                <Button variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code className="h-8 w-8 text-purple-600" />
                  <CardTitle>API Reference</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete API documentation with examples and code snippets for all endpoints.
                </p>
                <Button variant="outline">View API</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <CardTitle>Guides</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Step-by-step tutorials for common use cases and integration patterns.
                </p>
                <Button variant="outline">Browse Guides</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-red-600" />
                  <CardTitle>Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn about security best practices and how SAS protects your attestations.
                </p>
                <Button variant="outline">Security Guide</Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-8 border">
            <h2 className="text-2xl font-bold mb-4">Popular Topics</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Creating Your First Schema
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Making Attestations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Verifying Attestations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Using the SDK
                  </a>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Integration Examples
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Schema Design Patterns
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy and ZK Proofs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Troubleshooting
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
