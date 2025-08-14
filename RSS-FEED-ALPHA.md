# RSS FEED AS ALPHA SIGNALS

## USE RSS FEED EMBED ONLY! FOR THE MIDDLE SECTION OF ALPHA SIGNALS

## KEEP EXISTING ALPHA SIGNALS BUT PUT AND ORGANIZE IN THE RIGHT AND LEFT CARDS/SECTIONS

## MAINTAIN ALL CURRENT STYLING AND JUST SURGICALLY INTEGRATE THE RSS FEED FOR "Trending".  

## Create tabs "new" "leaderboard" and use the following code snippet while adapting it completely and integrating it to our app in this repo.  Here's the code snippet to use/reference:

## Code Snippet:

```bash
  const renderContent = () => {
    if (loading) {
      return <LoadingCard lines={5} className="mt-4" />
    }

    switch (activeTab) {
      case "trending":
        return (
          <div className="space-y-6 min-h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between mb-6">
              <SparklesText 
                text="Alpha Signals Feed"
                className="text-2xl font-semibold text-foreground"
                colors={{
                  first: 'rgb(239, 68, 68)',
                  second: 'rgb(249, 115, 22)',
                }}
                sparklesCount={5}
              />
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                Live
              </Badge>
            </div>

            <div className="w-full h-[calc(100vh-16rem)] rounded-lg overflow-hidden border border-border">
              <iframe 
                src="https://rss.app/embed/v1/feed/_xegk27P1igGNXPcH" 
                className="w-full h-full border-0"
                title="Alpha Signals RSS Feed"
                data-height="600"
              />
            </div>
          </div>
        )

      case "new":
        return (
          <div className="space-y-6 min-h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between mb-6">
              <SparklesText 
                text="New Solana Tokens"
                className="text-xl font-semibold"
                colors={{
                  first: 'rgb(34, 197, 94)',
                  second: 'rgb(59, 130, 246)',
                }}
                sparklesCount={5}
              />
              <Badge variant="outline" className="text-green-600 border-green-200">
                Real-time
              </Badge>
            </div>

            {launchpadData && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900">Launch Activity</h3>
                      <p className="text-sm text-green-700">
                        <NumberTicker 
                          value={launchpadData.intelligence.aggregatedStats.newTokensPerHour} 
                          decimalPlaces={1}
                          className="font-semibold"
                        /> tokens launching/hour
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-900">
                        {newTokens.length} Live Tokens
                      </div>
                      <p className="text-sm text-green-700">
                        Last 2 hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {newTokens.length > 0 ? (
              newTokens.map((token) => (
                <GlowBorder key={token.id}>
                  <Card 
                    className="border-border/30 bg-card/50 backdrop-blur-xl hover:bg-card/70 hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => {
                      setSelectedToken({ 
                        address: token.mintAddress, 
                        symbol: token.symbol, 
                        name: token.name 
                      })
                      setShowChartModal(true)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold">
                              {token.symbol.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-foreground">{token.symbol}</span>
                              <Badge className={getRiskLevelColor(token.riskLevel)}>
                                {token.riskLevel.toUpperCase()}
                              </Badge>
                              {token.isVerified && (
                                <Badge variant="outline" className="text-blue-600 border-blue-200">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">{token.name}</p>
                            <p className="text-xs text-muted-foreground mb-2">{token.description}</p>
                            
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>💰 {formatMarketCap(token.marketCap || 0)}</span>
                              <span>📊 {formatPrice(token.volume24h || 0)} Vol</span>
                              <span>👥 {token.holders} holders</span>
                              <span>💧 {formatPrice(token.liquidity || 0)} Liq</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${(token.priceChange || 0) > 0 ? "text-green-600" : "text-red-600"}`}>
                            {(token.priceChange || 0) > 0 ? "+" : ""}
                            {(token.priceChange || 0).toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            ${(token.currentPrice || 0).toFixed(6)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimeAgo(token.createdAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GlowBorder>
              ))
            ) : (
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No new tokens available at the moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case "leaderboard":
        return (
          <div className="space-y-6 min-h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between mb-6">
              <SparklesText 
                text="Launchpad Meme Leaderboard"
                className="text-xl font-semibold"
                colors={{
                  first: 'rgb(239, 68, 68)',
                  second: 'rgb(249, 115, 22)',
                }}
                sparklesCount={5}
              />
              <Badge variant="outline" className="text-red-600 border-red-200">
                Real-time
              </Badge>
            </div>

            {launchpadTokens.length > 0 ? (
              launchpadTokens.map((token, index) => (
                <GlowBorder key={token.id}>
                  <Card className="border-border/30 bg-card/50 backdrop-blur-xl hover:bg-card/70 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                              src={token.image} 
                              alt={token.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <Avatar className="h-12 w-12 hidden">
                              <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                                {token.symbol.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-foreground">{token.symbol}</span>
                              <Badge variant="outline" className="text-orange-600 border-orange-200">
                                {token.launchpadLogo} {token.launchpad}
                              </Badge>
                              {token.isGraduated && (
                                <Badge variant="outline" className="text-green-600 border-green-200">
                                  ✓ Graduated
                                </Badge>
                              )}
                              {token.liquidityLocked && (
                                <Badge variant="outline" className="text-blue-600 border-blue-200">
                                  🔒 Locked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">{token.name}</p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span>📊 {formatPrice(token.volume24h)} Vol</span>
                              <span>💰 {formatMarketCap(token.marketCap)} MCap</span>
                              {token.marketCapRank && (
                                <span>📈 #{token.marketCapRank}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground text-lg">
                            {formatMarketCap(token.marketCap)}
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            ${token.currentPrice.toFixed(token.currentPrice < 0.01 ? 6 : 4)}
                          </div>
                          <div className={`text-sm font-medium ${token.priceChange24h > 0 ? "text-green-600" : "text-red-600"}`}>
                            {token.priceChange24h > 0 ? "+" : ""}
                            {token.priceChange24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GlowBorder>
              ))
            ) : (
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No launchpad tokens data available at the moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )



      default:
        return null
    }
  }

  const tabOrder: Array<"trending" | "new" | "leaderboard"> = ["trending", "new", "leaderboard"];
  function handleTabKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    tab: "trending" | "new" | "leaderboard"
  ) {
    const idx = tabOrder.indexOf(tab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(tabOrder[(idx + 1) % tabOrder.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(tabOrder[(idx - 1 + tabOrder.length) % tabOrder.length]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveTab(tab);
    }
  }
```

