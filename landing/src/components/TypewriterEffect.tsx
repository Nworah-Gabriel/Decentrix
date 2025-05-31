"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "../lib/utils"

interface Word {
  text: string
  className?: string
}

interface TypewriterEffectProps {
  words: Word[]
  className?: string
  cursorClassName?: string
}

export function TypewriterEffect({ words, className, cursorClassName }: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < word.text.length) {
            setCurrentText(word.text.slice(0, currentText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 1000)
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  const currentWord = words[currentWordIndex]

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <span className={cn("font-bold", currentWord.className)}>{currentText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className={cn("ml-1 h-6 w-0.5 bg-blue-600", cursorClassName)}
      />
    </div>
  )
}
