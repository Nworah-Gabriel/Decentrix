import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, BookOpen } from "lucide-react"

export function CTA() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Building?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join the growing ecosystem of developers building trust and reputation systems on Sui
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/explorer">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Code className="mr-2 h-5 w-5" />
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  )
}
