import { ExplorerHeader } from "@/components/explorer/explorer-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Terminal, Smartphone, Globe, Database } from "lucide-react"

export default function ToolsPage() {
  const tools = [
    {
      icon: Terminal,
      title: "SAS CLI",
      description: "Command-line interface for managing attestations and schemas",
      status: "Available",
      color: "text-blue-600",
    },
    {
      icon: Smartphone,
      title: "Mobile SDK",
      description: "React Native and Flutter SDKs for mobile applications",
      status: "Beta",
      color: "text-green-600",
    },
    {
      icon: Globe,
      title: "REST API",
      description: "RESTful API for easy integration with any platform",
      status: "Available",
      color: "text-purple-600",
    },
    {
      icon: Database,
      title: "GraphQL API",
      description: "Flexible GraphQL endpoint for complex queries",
      status: "Coming Soon",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <ExplorerHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Developer Tools</h1>
            <p className="text-xl text-gray-600">Powerful tools to build and integrate with SAS</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <tool.icon className={`h-8 w-8 ${tool.color}`} />
                    <div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <div className="text-sm text-gray-500">{tool.status}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <Button
                    variant={tool.status === "Available" ? "default" : "outline"}
                    disabled={tool.status === "Coming Soon"}
                  >
                    {tool.status === "Available" ? "Download" : tool.status === "Beta" ? "Try Beta" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
