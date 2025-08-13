"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SparklesTextProps {
  text: string
  colors?: {
    first: string
    second: string
  }
  className?: string
  sparklesCount?: number
}

interface Sparkle {
  id: number
  x: string
  y: string
  color: string
  delay: number
  scale: number
  lifespan: number
}

export function SparklesText({
  text,
  colors = {
    first: "#9333ea",
    second: "#dc2626",
  },
  className,
  sparklesCount = 10,
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateSpark = (): Sparkle => ({
      id: Math.random(),
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: Math.random() > 0.5 ? colors.first : colors.second,
      delay: Math.random() * 2,
      scale: Math.random() * 1 + 0.3,
      lifespan: Math.random() * 10 + 5,
    })

    const initializeSparks = () => {
      const newSparks = Array.from({ length: sparklesCount }, generateSpark)
      setSparkles(newSparks)
    }

    const updateSparks = () => {
      setSparkles((currentSparks) =>
        currentSparks.map((spark) => ({
          ...spark,
          lifespan: spark.lifespan - 0.1,
        })),
      )

      setSparkles((currentSparks) =>
        currentSparks
          .filter((spark) => spark.lifespan > 0)
          .concat(
            Array.from(
              { length: sparklesCount - currentSparks.filter((spark) => spark.lifespan > 0).length },
              generateSpark,
            ),
          ),
      )
    }

    initializeSparks()
    const interval = setInterval(updateSparks, 100)

    return () => clearInterval(interval)
  }, [colors.first, colors.second, sparklesCount])

  return (
    <div className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: sparkle.x,
              top: sparkle.y,
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: sparkle.scale,
            }}
            transition={{
              duration: sparkle.lifespan / 10,
              delay: sparkle.delay,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 0L3.09017 2.90983L6 3L3.09017 3.09017L3 6L2.90983 3.09017L0 3L2.90983 2.90983L3 0Z"
                fill={sparkle.color}
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
