"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/Button"
import { ArrowRight, Zap, Shield, Globe } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Trust?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of users who are already using S.A.S to create secure, verifiable attestations on the
              Sui blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
                <Zap className="w-6 h-6" />
                <span>Lightning Fast</span>
              </motion.div>
              <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
                <Shield className="w-6 h-6" />
                <span>Secure & Tamper-proof</span>
              </motion.div>
              <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
                <Globe className="w-6 h-6" />
                <span>Globally Accessible</span>
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
