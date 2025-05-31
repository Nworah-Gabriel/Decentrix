"use client"

import { motion } from "framer-motion"
import { BentoGrid } from "./BentoGrid"
import { Shield, Vote, FileText, Key, Users, Globe } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      title: "Identity Verification",
      description:
        "Claim and verify your digital identity with blockchain-backed attestations that are universally trusted.",
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      className: "md:col-span-2",
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Voting Systems",
      description: "Enable secure and transparent voting with tamper-proof attestations.",
      icon: <Vote className="w-8 h-8 text-purple-600" />,
      className: "md:col-span-1",
      gradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Statement Attestation",
      description: "Attest to statements and claims with cryptographic proof of authenticity.",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      className: "md:col-span-1",
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Ownership Claims",
      description: "Prove ownership of digital and physical assets with immutable blockchain records.",
      icon: <Key className="w-8 h-8 text-purple-600" />,
      className: "md:col-span-2",
      gradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Cross-Platform Trust",
      description: "Use your credentials across multiple applications and platforms seamlessly.",
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      className: "md:col-span-1",
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Community Driven",
      description: "Join a growing ecosystem of users building trust through attestations.",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      className: "md:col-span-1",
      gradient: "from-purple-50 to-purple-100",
    },
  ]

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Unlock Trust with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Attestations
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our comprehensive attestation program helps you claim identity, participate in voting systems, attest
          statements, and prove ownership across the digital ecosystem.
        </p>
      </motion.div>

      <BentoGrid features={features} />
    </section>
  )
}
