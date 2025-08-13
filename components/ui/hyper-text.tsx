"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HyperTextProps {
  text: string
  duration?: number
  framerProps?: any
  className?: string
  animateOnLoad?: boolean
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const getRandomInt = (max: number) => Math.floor(Math.random() * max)

export function HyperText({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = true,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split(""))
  const [trigger, setTrigger] = useState(false)
  const interations = useRef(0)
  const isFirstRender = useRef(true)

  const triggerAnimation = () => {
    interations.current = 0
    setTrigger(true)
  }

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current) {
          clearInterval(interval)
          isFirstRender.current = false
          return
        }
        if (!trigger) return

        setDisplayText((t) =>
          t.map((l, i) => {
            if (l === " ") {
              return l
            }

            if (i <= interations.current) {
              return text[i]
            }

            return alphabets[getRandomInt(26)]
          }),
        )

        if (interations.current >= text.length) {
          setTrigger(false)
          clearInterval(interval)
        }

        interations.current = interations.current + 0.1
      },
      duration / (text.length * 10),
    )

    return () => clearInterval(interval)
  }, [text, duration, trigger, animateOnLoad])

  useEffect(() => {
    if (animateOnLoad) {
      triggerAnimation()
    }
  }, [animateOnLoad])

  return (
    <div
      className={cn("overflow-hidden py-2 flex cursor-default scale-100", className)}
      onMouseEnter={triggerAnimation}
    >
      <AnimatePresence mode="wait">
        {displayText.map((letter, i) => (
          <motion.span key={i} className="font-mono" {...framerProps}>
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
