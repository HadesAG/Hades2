"use client"

import { useState, useEffect, useCallback } from "react"
import { usePrivy } from "@privy-io/react-auth"

interface WatchlistItem {
  id: string
  tokenAddress: string
  tokenSymbol: string
  tokenName: string
  addedAt: string
}

export function useWatchlist() {
  const { authenticated, user } = usePrivy()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWatchlist = useCallback(async () => {
    if (!authenticated || !user) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/user/watchlist")
      const data = await response.json()

      if (data.success) {
        setWatchlist(data.data)
      } else {
        setError(data.error || "Failed to fetch watchlist")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch watchlist")
    } finally {
      setLoading(false)
    }
  }, [authenticated, user])

  const addToWatchlist = useCallback(
    async (tokenAddress: string, tokenSymbol: string, tokenName: string) => {
      if (!authenticated) return false

      try {
        const response = await fetch("/api/user/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenAddress, tokenSymbol, tokenName }),
        })

        const data = await response.json()
        if (data.success) {
          setWatchlist((prev) => [...prev, data.data])
          return true
        } else {
          setError(data.error || "Failed to add to watchlist")
          return false
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add to watchlist")
        return false
      }
    },
    [authenticated],
  )

  const removeFromWatchlist = useCallback(
    async (id: string) => {
      if (!authenticated) return false

      try {
        const response = await fetch(`/api/user/watchlist/${id}`, {
          method: "DELETE",
        })

        const data = await response.json()
        if (data.success) {
          setWatchlist((prev) => prev.filter((item) => item.id !== id))
          return true
        } else {
          setError(data.error || "Failed to remove from watchlist")
          return false
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove from watchlist")
        return false
      }
    },
    [authenticated],
  )

  const isInWatchlist = useCallback(
    (tokenAddress: string) => {
      return watchlist.some((item) => item.tokenAddress === tokenAddress)
    },
    [watchlist],
  )

  useEffect(() => {
    if (authenticated) {
      fetchWatchlist()
    } else {
      setWatchlist([])
    }
  }, [authenticated, fetchWatchlist])

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refetch: fetchWatchlist,
  }
}
