import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    // In a real app, you'd get the user ID from the session/auth
    // For now, we'll use a mock user ID
    const userId = "mock-user-id"

    const watchlistTokens = await prisma.watchlistToken.findMany({
      where: { userId },
      orderBy: { addedAt: "desc" },
    })

    // Enrich with current market data (mock for now)
    const enrichedTokens = watchlistTokens.map((token) => ({
      ...token,
      currentPrice: Math.random() * 100 + 10,
      change24h: (Math.random() - 0.5) * 20,
      volume24h: Math.random() * 1000000 + 100000,
      marketCap: Math.random() * 10000000 + 1000000,
    }))

    return NextResponse.json({
      success: true,
      data: {
        tokens: enrichedTokens,
      },
    })
  } catch (error) {
    console.error("Watchlist API Error:", error)

    // Return mock data as fallback
    const mockTokens = [
      {
        id: "watchlist-1",
        symbol: "SOL",
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        currentPrice: 170.45,
        change24h: 5.67,
        volume24h: 2500000,
        marketCap: 75000000000,
      },
      {
        id: "watchlist-2",
        symbol: "BONK",
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        currentPrice: 0.000025,
        change24h: -2.34,
        volume24h: 15000000,
        marketCap: 1500000000,
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        tokens: mockTokens,
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { symbol } = await request.json()
    const userId = "mock-user-id"

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    const newToken = await prisma.watchlistToken.create({
      data: {
        symbol: symbol.toUpperCase(),
        userId,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        token: {
          ...newToken,
          currentPrice: Math.random() * 100 + 10,
          change24h: (Math.random() - 0.5) * 20,
          volume24h: Math.random() * 1000000 + 100000,
          marketCap: Math.random() * 10000000 + 1000000,
        },
      },
    })
  } catch (error) {
    console.error("Add watchlist token error:", error)
    return NextResponse.json({ error: "Failed to add token" }, { status: 500 })
  }
}
