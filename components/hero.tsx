"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="h-4 w-4" />
            Powered by Sui Blockchain
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
          Sui Attestation Service
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
          The most trusted way to make attestations onchain.
          <br />
          Build reputation, verify credentials, and establish trust on Sui.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/explorer">
            <Button size="lg" className="text-lg px-8 py-6">
              Explore Attestations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            Read Documentation
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center p-6 rounded-lg bg-white/60 backdrop-blur-sm border">
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Trustless</h3>
            <p className="text-gray-600 text-center">
              Built on Sui's secure infrastructure with cryptographic guarantees
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-lg bg-white/60 backdrop-blur-sm border">
            <Zap className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-center">Instant attestations with Sui's parallel execution engine</p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-lg bg-white/60 backdrop-blur-sm border">
            <Globe className="h-12 w-12 text-cyan-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interoperable</h3>
            <p className="text-gray-600 text-center">Compatible with existing attestation standards and protocols</p>
          </div>
        </div>
      </div>
    </section>
  )
}
