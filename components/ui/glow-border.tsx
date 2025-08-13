"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface GlowBorderProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function GlowBorder({
  children,
  className,
  glowColor = "rgb(239 68 68)", // red-500
}: GlowBorderProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
      style={{
        boxShadow: `0 0 20px ${glowColor}20, 0 0 40px ${glowColor}10`,
      }}
    >
      <div
        className="absolute inset-0 rounded-lg opacity-20"
        style={{
          background: `linear-gradient(45deg, ${glowColor}20, transparent, ${glowColor}20)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
