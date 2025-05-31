"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
  gradient?: string
}

export function BentoGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02, y: -5 }}
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300",
            `bg-gradient-to-br ${feature.gradient}`,
            feature.className,
          )}
        >
          <div className="relative z-10">
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </div>
  )
}
