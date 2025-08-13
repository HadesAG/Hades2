"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ParticleImageProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  text?: string
  className?: string
  particleColor?: string
  particleCount?: number
}

export function ParticleImage({
  src,
  alt,
  width = 200,
  height = 100,
  text = "HADES",
  className,
  particleColor = "#f59e0b",
  particleCount = 50,
}: ParticleImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
    }> = []

    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 60,
        maxLife: 60,
        size: Math.random() * 3 + 1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#f59e0b")
      gradient.addColorStop(0.5, "#f97316")
      gradient.addColorStop(1, "#ea580c")

      ctx.font = `bold ${Math.min((width / text.length) * 1.2, height * 0.6)}px Arial`
      ctx.fillStyle = gradient
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life--

        const alpha = particle.life / particle.maxLife
        ctx.shadowColor = particleColor
        ctx.shadowBlur = particle.size * 2
        ctx.fillStyle = `${particleColor}${Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        if (particle.life <= 0) {
          particles.splice(i, 1)
        }
      }

      // Create new particles randomly
      if (Math.random() < 0.1 && particles.length < particleCount) {
        createParticle(Math.random() * canvas.width, Math.random() * canvas.height)
      }

      requestAnimationFrame(animate)
    }

    canvas.width = width
    canvas.height = height
    animate()
  }, [text, particleColor, width, height, particleCount])

  return <canvas ref={canvasRef} className={cn("max-w-full h-auto", className)} />
}
