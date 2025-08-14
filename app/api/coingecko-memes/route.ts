import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

interface CoinGeckoToken {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  total_volume: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  last_updated: string
}

interface MemeCoinData {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  marketCap: number
  marketCapRank: number
  priceChange24h: number
  volume24h: number
  circulatingSupply: number
  totalSupply: number
  maxSupply: number | null
  lastUpdated: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '50'

    // CoinGecko API endpoint for meme coins with retry logic
    const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`

    let response: Response
    let retryCount = 0
    const maxRetries = 3

    // Retry logic for CoinGecko API
    while (retryCount < maxRetries) {
      try {
        response = await fetch(coingeckoUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Cache-Control': 'no-cache',
          },
          next: { revalidate: 60 } // Cache for 1 minute for real-time data
        })

        if (response.ok) {
          break
        }

        console.warn(`CoinGecko API attempt ${retryCount + 1} failed with status:`, response.status)
        retryCount++
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)) // Exponential backoff
        }
      } catch (fetchError) {
        console.warn(`CoinGecko API attempt ${retryCount + 1} failed:`, fetchError)
        retryCount++
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        }
      }
    }

    if (!response! || !response.ok) {
      console.error('CoinGecko API failed after all retries, using enhanced fallback data')
      
      // Enhanced fallback with more realistic current data
      const mockMemeCoins: MemeCoinData[] = [
        {
          id: "dogecoin",
          symbol: "DOGE",
          name: "Dogecoin",
          image: "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png",
          currentPrice: 0.226,
          marketCap: 33994536458,
          marketCapRank: 9,
          priceChange24h: 0.08,
          volume24h: 2399582596,
          circulatingSupply: 150419716383,
          totalSupply: 150487176383,
          maxSupply: null,
          lastUpdated: new Date().toISOString()
        },
        {
          id: "shiba-inu",
          symbol: "SHIB",
          name: "Shiba Inu",
          image: "https://coin-images.coingecko.com/coins/images/11939/large/shiba.png",
          currentPrice: 0.00001312,
          marketCap: 7723314493,
          marketCapRank: 29,
          priceChange24h: 0.91,
          volume24h: 245726435,
          circulatingSupply: 589246124717241,
          totalSupply: 589500981656926,
          maxSupply: null,
          lastUpdated: new Date().toISOString()
        },
        {
          id: "pepe",
          symbol: "PEPE",
          name: "Pepe",
          image: "https://coin-images.coingecko.com/coins/images/29850/large/pepe-token.jpeg",
          currentPrice: 0.00001159,
          marketCap: 4875042844,
          marketCapRank: 39,
          priceChange24h: 0.86,
          volume24h: 859966335,
          circulatingSupply: 420690000000000,
          totalSupply: 420690000000000,
          maxSupply: 420690000000000,
          lastUpdated: new Date().toISOString()
        },
        {
          id: "pudgy-penguins",
          symbol: "PENGU",
          name: "Pudgy Penguins",
          image: "https://coin-images.coingecko.com/coins/images/52622/large/PUDGY_PENGUINS_PENGU_PFP.png",
          currentPrice: 0.036,
          marketCap: 2282102929,
          marketCapRank: 57,
          priceChange24h: -3.10,
          volume24h: 613476126,
          circulatingSupply: 62860396090,
          totalSupply: 79441134719,
          maxSupply: 88888888888,
          lastUpdated: new Date().toISOString()
        },
        {
          id: "bonk",
          symbol: "BONK",
          name: "Bonk",
          image: "https://coin-images.coingecko.com/coins/images/28600/large/bonk.jpg",
          currentPrice: 0.00002462,
          marketCap: 1905599738,
          marketCapRank: 68,
          priceChange24h: -4.14,
          volume24h: 514727263,
          circulatingSupply: 77419592329436,
          totalSupply: 87995358118075,
          maxSupply: 87995358118075,
          lastUpdated: new Date().toISOString()
        },
        {
          id: "floki",
          symbol: "FLOKI",
          name: "FLOKI",
          image: "https://coin-images.coingecko.com/coins/images/16746/large/PNG_image.png",
          currentPrice: 0.000185,
          marketCap: 1765432109,
          marketCapRank: 72,
          priceChange24h: 2.34,
          volume24h: 312456789,
          circulatingSupply: 9534567890123,
          totalSupply: 10000000000000,
          maxSupply: 10000000000000,
          lastUpdated: new Date().toISOString()
        },
        {
          id: "mog-coin",
          symbol: "MOG",
          name: "Mog Coin",
          image: "https://coin-images.coingecko.com/coins/images/30775/large/mog.png",
          currentPrice: 0.0000015,
          marketCap: 567891234,
          marketCapRank: 145,
          priceChange24h: 8.76,
          volume24h: 89123456,
          circulatingSupply: 378260869565217,
          totalSupply: 420690000000000,
          maxSupply: 420690000000000,
          lastUpdated: new Date().toISOString()
        }
      ]

      return NextResponse.json({
        success: true,
        data: {
          memeCoins: mockMemeCoins,
          lastUpdated: new Date().toISOString(),
          source: 'fallback'
        }
      })
    }

    const data: CoinGeckoToken[] = await response.json()

    const formattedMemeCoins: MemeCoinData[] = data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      currentPrice: coin.current_price,
      marketCap: coin.market_cap,
      marketCapRank: coin.market_cap_rank,
      priceChange24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
      circulatingSupply: coin.circulating_supply,
      totalSupply: coin.total_supply,
      maxSupply: coin.max_supply,
      lastUpdated: coin.last_updated
    }))

    return NextResponse.json({
      success: true,
      data: {
        memeCoins: formattedMemeCoins,
        lastUpdated: new Date().toISOString(),
        source: 'coingecko'
      }
    })

  } catch (error) {
    console.error("Error fetching CoinGecko meme coins:", error)
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch meme coin data",
      data: {
        memeCoins: [],
        lastUpdated: new Date().toISOString()
      }
    }, { status: 500 })
  }
}
