"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Github, Twitter } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">SAS</span>
          <span className="text-gray-600 text-sm font-normal">MAINNET</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/explorer" className="text-gray-600 hover:text-gray-900 transition-colors">
            Explorer
          </Link>
          <Link href="/schemas" className="text-gray-600 hover:text-gray-900 transition-colors">
            Schemas
          </Link>
          <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">
            Docs
          </Link>
          <Link href="/tools" className="text-gray-600 hover:text-gray-900 transition-colors">
            Tools
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
            </Button>
          </div>
          <Button>Connect Wallet</Button>
        </div>
      </div>
    </header>
  )
}
