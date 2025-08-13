"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"

export function useAuth() {
  const { authenticated, user, login, logout, ready, connectWallet, linkWallet, unlinkWallet } = usePrivy()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (ready) {
      setIsLoading(false)
    }
  }, [ready])

  // Sync user data with our database when authenticated
  useEffect(() => {
    if (authenticated && user) {
      fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          privyId: user.id,
          email: user.email?.address,
          walletAddress: user.wallet?.address,
        }),
      }).catch(console.error)
    }
  }, [authenticated, user])

  const handleLogin = async () => {
    try {
      await login()
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return {
    isAuthenticated: authenticated,
    user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    connectWallet,
    linkWallet,
    unlinkWallet,
    walletAddress: user?.wallet?.address,
    email: user?.email?.address,
  }
}
