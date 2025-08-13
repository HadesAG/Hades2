"use client"

import type React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  text?: string
  className?: string
  children?: React.ReactNode
}

export function InteractiveHoverButton({
  text = "Button",
  className,
  children,
  ...props
}: InteractiveHoverButtonProps) {
  // Extract motion-specific props
  const { whileHover, ...buttonProps } = props;
  
  return (
    <motion.button
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-md border border-neutral-200 bg-transparent px-4 py-2 text-center font-semibold transition-colors",
        "dark:border-neutral-800 dark:text-neutral-400",
        className,
      )}
      whileHover={whileHover || "hover"}
      {...buttonProps}
    >
      <span className="relative z-10 inline-block text-neutral-600 transition-colors duration-500 group-hover:text-white dark:text-neutral-400 dark:group-hover:text-white">
        {children || text}
      </span>
      <motion.div
        className="absolute inset-0 block h-full w-full rounded-md bg-neutral-950 dark:bg-white"
        variants={{
          hover: {
            width: "100%",
          },
        }}
        initial={{ width: "0%" }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  )
}
