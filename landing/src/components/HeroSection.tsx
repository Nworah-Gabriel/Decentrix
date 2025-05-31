"use client"

import { motion } from "framer-motion"
import { Lamp } from "./Lamp"
import { TypewriterEffect } from "./TypewriterEffect"
import { Button } from "./ui/Button"
import Link from "next/link"

export function HeroSection() {
  const words = [
    {
      text: "Secure",
      className: "text-blue-600",
    },
    {
      text: "Tamper-proof",
      className: "text-purple-600",
    },
    {
      text: "Portable",
      className: "text-blue-600",
    },
    {
      text: "Credentials",
      className: "text-purple-600",
    },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Lamp />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-9xl font-bold text-gray-900 mb-6">
            Blockchain-Based
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Attestation Service
            </span>
          </h1>

          <div className="text-xl md:text-2xl text-gray-600 mb-8">
            <TypewriterEffect words={words} />
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Built on Sui blockchain, S.A.S provides secure, tamper-proof, and portable credentials that can be
            verified and used across apps to unlock trust, access, and opportunities.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="https://dexichain.vercel.app" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg"
              >
                Start Attesting
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
