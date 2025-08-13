"use client"

import { useState, useEffect, useCallback } from "react"
import { usePrivy } from "@privy-io/react-auth"

interface Alert {
  id: string
  tokenAddress: string
  tokenSymbol: string
  alertType: "price_above" | "price_below" | "volume_spike" | "whale_activity"
  threshold: number
  isActive: boolean
  createdAt: string
}

export function useAlerts() {
  const { authenticated, user } = usePrivy()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async () => {
    if (!authenticated || !user) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/user/alerts")
      const data = await response.json()

      if (data.success) {
        setAlerts(data.data)
      } else {
        setError(data.error || "Failed to fetch alerts")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch alerts")
    } finally {
      setLoading(false)
    }
  }, [authenticated, user])

  const createAlert = useCallback(
    async (tokenAddress: string, tokenSymbol: string, alertType: Alert["alertType"], threshold: number) => {
      if (!authenticated) return false

      try {
        const response = await fetch("/api/user/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenAddress, tokenSymbol, alertType, threshold }),
        })

        const data = await response.json()
        if (data.success) {
          setAlerts((prev) => [...prev, data.data])
          return true
        } else {
          setError(data.error || "Failed to create alert")
          return false
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create alert")
        return false
      }
    },
    [authenticated],
  )

  const toggleAlert = useCallback(
    async (id: string, isActive: boolean) => {
      if (!authenticated) return false

      try {
        const response = await fetch(`/api/user/alerts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive }),
        })

        const data = await response.json()
        if (data.success) {
          setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isActive } : alert)))
          return true
        } else {
          setError(data.error || "Failed to update alert")
          return false
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update alert")
        return false
      }
    },
    [authenticated],
  )

  const deleteAlert = useCallback(
    async (id: string) => {
      if (!authenticated) return false

      try {
        const response = await fetch(`/api/user/alerts/${id}`, {
          method: "DELETE",
        })

        const data = await response.json()
        if (data.success) {
          setAlerts((prev) => prev.filter((alert) => alert.id !== id))
          return true
        } else {
          setError(data.error || "Failed to delete alert")
          return false
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete alert")
        return false
      }
    },
    [authenticated],
  )

  useEffect(() => {
    if (authenticated) {
      fetchAlerts()
    } else {
      setAlerts([])
    }
  }, [authenticated, fetchAlerts])

  return {
    alerts,
    loading,
    error,
    createAlert,
    toggleAlert,
    deleteAlert,
    refetch: fetchAlerts,
  }
}
