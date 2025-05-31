"use client"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/black_logo.svg"
              alt="S.A.S Logo"
              width={30}
              height={30}
              className="w-auto h-auto"
            />
          </motion.div>


          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="https://dexichain.vercel.app" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
