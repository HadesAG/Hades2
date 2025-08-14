import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

interface NewSolanaToken {
  id: string
  symbol: string
  name: string
  mintAddress: string
  createdAt: string
  initialPrice: number
  currentPrice?: number
  priceChange?: number
  volume24h?: number
  marketCap?: number
  holders?: number
  liquidity?: number
  isVerified: boolean
  riskLevel: "low" | "medium" | "high"
  description?: string
  website?: string
  telegram?: string
  twitter?: string
  tags: string[]
}

// Mock data generator for new Solana tokens
function generateMockNewTokens(count: number = 20): NewSolanaToken[] {
  const tokenNames = [
    "SolDog", "MoonCat", "RocketFrog", "CryptoShark", "DegenerateApe",
    "SolanaWolf", "DiamondHands", "ToTheMoon", "SafeSol", "LamboToken",
    "PumpIt", "HODL", "DegenFi", "SolVault", "ChadCoin", "AlphaBull",
    "SigmaGrind", "BasedSol", "ChillPepe", "GigaChad", "WenLambo",
    "NotARug", "TrustMeBro", "ToTheStars", "SolPump"
  ]

  const symbols = [
    "SDOG", "MCAT", "RFROG", "SHARK", "APE", "WOLF", "DIAMOND", "MOON",
    "SAFE", "LAMBO", "PUMP", "HODL", "DEGEN", "VAULT", "CHAD", "ALPHA",
    "SIGMA", "BASED", "CHILL", "GIGA", "WEN", "NOTRUG", "TRUST", "STARS", "SPUMP"
  ]

  return Array.from({ length: count }, (_, i) => {
    const name = tokenNames[i % tokenNames.length] + (i > tokenNames.length - 1 ? ` ${Math.floor(i / tokenNames.length) + 1}` : '')
    const symbol = symbols[i % symbols.length] + (i > symbols.length - 1 ? Math.floor(i / symbols.length) + 1 : '')
    const createdMinutesAgo = Math.floor(Math.random() * 120) // Created within last 2 hours
    const initialPrice = Math.random() * 0.01 + 0.0001
    const priceMultiplier = 0.5 + Math.random() * 3 // -50% to +200%
    const currentPrice = initialPrice * priceMultiplier
    const priceChange = ((currentPrice - initialPrice) / initialPrice) * 100
    
    return {
      id: `sol-token-${i + 1}`,
      symbol,
      name,
      mintAddress: `${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(Date.now() - createdMinutesAgo * 60 * 1000).toISOString(),
      initialPrice,
      currentPrice,
      priceChange,
      volume24h: Math.floor(Math.random() * 100000) + 1000,
      marketCap: Math.floor(Math.random() * 1000000) + 10000,
      holders: Math.floor(Math.random() * 500) + 10,
      liquidity: Math.floor(Math.random() * 50000) + 5000,
      isVerified: Math.random() > 0.8,
      riskLevel: (Math.random() > 0.6 ? "high" : Math.random() > 0.3 ? "medium" : "low") as "low" | "medium" | "high",
      description: `New ${name} token on Solana with innovative tokenomics`,
      tags: ["new", "solana", "meme", Math.random() > 0.5 ? "trending" : "hot"].filter(Boolean)
    }
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'created_at' // created_at, price_change, volume
    
    // In a real implementation, you would connect to:
    // - Jupiter API for token data
    // - Solscan API for new token discoveries
    // - Pump.fun API for new launches
    // - DEX screener APIs
    
    // For now, we'll generate mock data that simulates real-time new tokens
    let newTokens = generateMockNewTokens(Math.max(limit, 50))
    
    // Apply sorting
    switch (sortBy) {
      case 'price_change':
        newTokens.sort((a, b) => (b.priceChange || 0) - (a.priceChange || 0))
        break
      case 'volume':
        newTokens.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
        break
      case 'market_cap':
        newTokens.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
        break
      case 'holders':
        newTokens.sort((a, b) => (b.holders || 0) - (a.holders || 0))
        break
      default: // created_at
        newTokens.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Limit results
    newTokens = newTokens.slice(0, limit)

    // Calculate some aggregated stats
    const totalVolume = newTokens.reduce((sum, token) => sum + (token.volume24h || 0), 0)
    const avgPriceChange = newTokens.reduce((sum, token) => sum + (token.priceChange || 0), 0) / newTokens.length
    const highRiskCount = newTokens.filter(token => token.riskLevel === "high").length
    
    return NextResponse.json({
      success: true,
      data: {
        tokens: newTokens,
        stats: {
          totalTokens: newTokens.length,
          totalVolume,
          avgPriceChange,
          highRiskCount,
          newTokensLastHour: newTokens.filter(token => 
            new Date(token.createdAt).getTime() > Date.now() - 60 * 60 * 1000
          ).length
        },
        lastUpdated: new Date().toISOString(),
        source: 'mock' // In production would be 'jupiter' or 'solscan'
      }
    })

  } catch (error) {
    console.error("Error fetching new Solana tokens:", error)
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch new Solana tokens",
      data: {
        tokens: [],
        stats: {
          totalTokens: 0,
          totalVolume: 0,
          avgPriceChange: 0,
          highRiskCount: 0,
          newTokensLastHour: 0
        },
        lastUpdated: new Date().toISOString()
      }
    }, { status: 500 })
  }
}
