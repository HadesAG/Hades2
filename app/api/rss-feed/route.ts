import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simplified RSS feed - just return mock data since trending tab uses direct RSS embed
    // No need to process Telegram data as the embedded RSS feed handles everything

    // Return mock RSS feed data as fallback
    const mockFeedItems = [
      {
        id: "rss-1",
        title: "SOL Breaking Above Key Resistance - Smart Money Accumulating",
        description:
          "Large whale wallets have been accumulating SOL over the past 24 hours, with over $50M in buy orders detected. Technical analysis shows a breakout above the $180 resistance level.",
        link: "#signal-rss-1",
        pubDate: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        source: "Alpha Signals",
        category: "high",
      },
      {
        id: "rss-2",
        title: "BONK Whale Activity Surge - 300% Volume Increase",
        description:
          "Unusual whale activity detected in BONK token with volume spiking 300% in the last hour. Multiple large transactions from known smart money wallets.",
        link: "#signal-rss-2",
        pubDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        source: "Whale Tracker",
        category: "medium",
      },
      {
        id: "rss-3",
        title: "New Meme Token Launch: DOGE2 - Early Alpha",
        description:
          "Fresh meme token launch detected with strong community backing and verified team. Early entry opportunity before major exchange listings.",
        link: "#signal-rss-3",
        pubDate: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        source: "Launch Pad",
        category: "high",
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        items: mockFeedItems,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("RSS Feed API Error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch RSS feed",
      data: {
        items: [],
        lastUpdated: new Date().toISOString(),
      },
    }, { status: 500 });
  }
}
