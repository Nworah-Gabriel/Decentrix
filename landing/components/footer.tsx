"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gray-50 py-12 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Image
              src="/black_logo.svg"
              alt="S.A.S Logo"
              width={30}
              height={30}
              className="w-auto h-auto"
            />
          </div>

          <div className="text-gray-600 text-center md:text-right">
                        <h2 className=" text-black/75 text-3xl">Sui Attestation Service</h2>

            <p className="mb-2">Built on Sui Blockchain</p>
            <p>&copy; {new Date().getFullYear()} S.A.S. All rights reserved.</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
