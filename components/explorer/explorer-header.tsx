"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Search, Twitter, Github } from "lucide-react"

export function ExplorerHeader() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-blue-600">SAS</span>
          <span className="text-gray-600 text-sm font-normal">MAINNET</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/explorer" className="text-blue-600 font-medium">
            Attestations
          </Link>
          <Link href="/schemas" className="text-gray-600 hover:text-gray-900 transition-colors">
            Schemas
          </Link>
          <Link href="/tools" className="text-gray-600 hover:text-gray-900 transition-colors">
            Tools
          </Link>
          <Link href="/forum" className="text-gray-600 hover:text-gray-900 transition-colors">
            Forum
          </Link>
          <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Attestation, UID, schema, or address" className="pl-10 w-80" />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
            </Button>
          </div>

          <Button>Connect</Button>
        </div>
      </div>
    </header>
  )
}
