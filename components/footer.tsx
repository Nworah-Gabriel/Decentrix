import Link from "next/link"
import { Shield, Twitter, Github, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span>SAS</span>
            </Link>
            <p className="text-gray-400 mb-4">The most trusted attestation service on Sui blockchain.</p>
            <div className="flex gap-4">
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <MessageCircle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/explorer" className="hover:text-white">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="/schemas" className="hover:text-white">
                  Schemas
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-white">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Developers</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/docs" className="hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-white">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/sdk" className="hover:text-white">
                  SDK
                </Link>
              </li>
              <li>
                <Link href="/examples" className="hover:text-white">
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/discord" className="hover:text-white">
                  Discord
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-white">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Sui Attestation Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
