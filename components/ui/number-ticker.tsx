"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface NumberTickerProps {
  value: number
  direction?: "up" | "down"
  delay?: number
  className?: string
  decimalPlaces?: number
  format?: "number" | "currency" | "percentage"
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  format = "number",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value)
      }, delay * 1000)
    }
  }, [motionValue, isInView, delay, value, direction])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          let formattedValue = ""
          const numValue = Number(latest.toFixed(decimalPlaces))

          switch (format) {
            case "currency":
              if (numValue >= 1000000) {
                formattedValue = `$${(numValue / 1000000).toFixed(1)}M`
              } else if (numValue >= 1000) {
                formattedValue = `$${(numValue / 1000).toFixed(1)}K`
              } else {
                formattedValue = `$${numValue.toFixed(decimalPlaces)}`
              }
              break
            case "percentage":
              formattedValue = `${numValue.toFixed(decimalPlaces)}`
              break
            default:
              formattedValue = Intl.NumberFormat("en-US", {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              }).format(numValue)
          }

          ref.current.textContent = formattedValue
        }
      }),
    [springValue, decimalPlaces, format],
  )

  return <span className={cn("inline-block tabular-nums", className)} ref={ref} />
}
