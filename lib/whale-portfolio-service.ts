// Whale Portfolio Service for Smart Money Tracker analytics
import { prisma } from './prisma';

export interface WhalePortfolio {
  wallet: {
    address: string;
    label: string;
    category: string;
    totalValue: number;
  };
  totalValue: number;
  holdings: WhaleHolding[];
  recentTransactions: WhaleTransactionWithWallet[];
  topPositions: WhaleHolding[];
  recentActivity: {
    totalTransactions: number;
    totalVolume: number;
    topTokens: { symbol: string; volume: number }[];
    netFlow: number;
  };
}

export interface WhaleHolding {
  tokenAddress: string;
  tokenSymbol: string;
  balance: number;
  usdValue: number;
  lastUpdated: Date;
  percentOfPortfolio?: number;
}

export interface WhaleTransactionWithWallet {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  transactionType: string;
  amount: number;
  usdValue: number;
  timestamp: Date;
  signature: string;
  wallet: {
    label: string;
    category: string;
  };
}

export interface WhaleActivity {
  token: string;
  totalVolume: number;
  transactionCount: number;
  netFlow: number;
  whaleCount: number;
  topWhales: { label: string; volume: number }[];
}

export interface TopMover {
  token: string;
  symbol: string;
  totalVolume: number;
  netFlow: number;
  transactionCount: number;
  whaleCount: number;
  priceChange?: number;
}

export class WhalePortfolioService {
  
  async getWhalePortfolio(walletAddress: string): Promise<WhalePortfolio | null> {
    try {
      const wallet = await prisma.whaleWallet.findUnique({
        where: { address: walletAddress }
      });

      if (!wallet) return null;

      const holdings = await prisma.whaleHolding.findMany({
        where: { walletAddress },
        orderBy: { usdValue: 'desc' }
      });

      const recentTransactions = await prisma.whaleTransaction.findMany({
        where: { walletAddress },
        include: {
          wallet: {
            select: {
              label: true,
              category: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 50
      });

      const totalValue = holdings.reduce((sum, holding) => sum + holding.usdValue, 0);
      
      // Add percentage of portfolio to holdings
      const holdingsWithPercentage = holdings.map(holding => ({
        ...holding,
        percentOfPortfolio: totalValue > 0 ? (holding.usdValue / totalValue) * 100 : 0
      }));

      const recentActivity = await this.analyzeRecentActivity(walletAddress);

      return {
        wallet: {
          address: wallet.address,
          label: wallet.label,
          category: wallet.category,
          totalValue: wallet.totalValue
        },
        totalValue,
        holdings: holdingsWithPercentage,
        recentTransactions,
        topPositions: holdingsWithPercentage.slice(0, 10),
        recentActivity
      };
    } catch (error) {
      console.error('❌ Error fetching whale portfolio:', error);
      return null;
    }
  }

  async getTopMovers(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<TopMover[]> {
    try {
      const since = this.getTimeframeCutoff(timeframe);

      const activities = await prisma.whaleTransaction.groupBy({
        by: ['tokenSymbol', 'tokenAddress'],
        where: {
          timestamp: { gte: since },
          transactionType: { in: ['BUY', 'SELL'] }
        },
        _sum: { 
          usdValue: true,
          amount: true 
        },
        _count: { id: true },
        orderBy: { _sum: { usdValue: 'desc' } },
        take: 20
      });

      const topMovers: TopMover[] = [];

      for (const activity of activities) {
        const netFlow = await this.calculateNetFlow(activity.tokenSymbol, since);
        const whaleCount = await this.getUniqueWhaleCount(activity.tokenSymbol, since);

        topMovers.push({
          token: activity.tokenAddress,
          symbol: activity.tokenSymbol,
          totalVolume: activity._sum.usdValue || 0,
          netFlow,
          transactionCount: activity._count.id,
          whaleCount
        });
      }

      return topMovers;
    } catch (error) {
      console.error('❌ Error fetching top movers:', error);
      return [];
    }
  }

  async getWhaleActivity(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<WhaleActivity[]> {
    try {
      const since = this.getTimeframeCutoff(timeframe);

      const activities = await prisma.whaleTransaction.groupBy({
        by: ['tokenSymbol'],
        where: {
          timestamp: { gte: since },
          transactionType: { in: ['BUY', 'SELL'] }
        },
        _sum: { usdValue: true },
        _count: { id: true },
        orderBy: { _sum: { usdValue: 'desc' } },
        take: 10
      });

      const whaleActivities: WhaleActivity[] = [];

      for (const activity of activities) {
        const netFlow = await this.calculateNetFlow(activity.tokenSymbol, since);
        const whaleCount = await this.getUniqueWhaleCount(activity.tokenSymbol, since);
        const topWhales = await this.getTopWhalesForToken(activity.tokenSymbol, since);

        whaleActivities.push({
          token: activity.tokenSymbol,
          totalVolume: activity._sum.usdValue || 0,
          transactionCount: activity._count.id,
          netFlow,
          whaleCount,
          topWhales
        });
      }

      return whaleActivities;
    } catch (error) {
      console.error('❌ Error fetching whale activity:', error);
      return [];
    }
  }

  async getRecentWhaleTransactions(limit = 20): Promise<WhaleTransactionWithWallet[]> {
    try {
      return await prisma.whaleTransaction.findMany({
        include: {
          wallet: {
            select: {
              label: true,
              category: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        take: limit
      });
    } catch (error) {
      console.error('❌ Error fetching recent whale transactions:', error);
      return [];
    }
  }

  async getWhalesByCategory(category?: string): Promise<any[]> {
    try {
      return await prisma.whaleWallet.findMany({
        where: {
          isActive: true,
          ...(category && { category: category as any })
        },
        include: {
          _count: {
            select: {
              transactions: true,
              holdings: true
            }
          }
        },
        orderBy: { totalValue: 'desc' }
      });
    } catch (error) {
      console.error('❌ Error fetching whales by category:', error);
      return [];
    }
  }

  async updateWhaleTotalValue(walletAddress: string): Promise<void> {
    try {
      const holdings = await prisma.whaleHolding.findMany({
        where: { walletAddress }
      });

      const totalValue = holdings.reduce((sum, holding) => sum + holding.usdValue, 0);

      await prisma.whaleWallet.update({
        where: { address: walletAddress },
        data: { totalValue }
      });
    } catch (error) {
      console.error('❌ Error updating whale total value:', error);
    }
  }

  // Private helper methods

  private async analyzeRecentActivity(walletAddress: string): Promise<{
    totalTransactions: number;
    totalVolume: number;
    topTokens: { symbol: string; volume: number }[];
    netFlow: number;
  }> {
    const since = this.getTimeframeCutoff('24h');

    try {
      const transactions = await prisma.whaleTransaction.findMany({
        where: {
          walletAddress,
          timestamp: { gte: since }
        }
      });

      const totalTransactions = transactions.length;
      const totalVolume = transactions.reduce((sum, tx) => sum + tx.usdValue, 0);

      // Calculate net flow (buys - sells)
      const buys = transactions.filter(tx => tx.transactionType === 'BUY' || tx.transactionType === 'TRANSFER_IN');
      const sells = transactions.filter(tx => tx.transactionType === 'SELL' || tx.transactionType === 'TRANSFER_OUT');
      
      const buyVolume = buys.reduce((sum, tx) => sum + tx.usdValue, 0);
      const sellVolume = sells.reduce((sum, tx) => sum + tx.usdValue, 0);
      const netFlow = buyVolume - sellVolume;

      // Get top tokens by volume
      const tokenVolumes = new Map<string, number>();
      transactions.forEach(tx => {
        const current = tokenVolumes.get(tx.tokenSymbol) || 0;
        tokenVolumes.set(tx.tokenSymbol, current + tx.usdValue);
      });

      const topTokens = Array.from(tokenVolumes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([symbol, volume]) => ({ symbol, volume }));

      return {
        totalTransactions,
        totalVolume,
        topTokens,
        netFlow
      };
    } catch (error) {
      console.error('❌ Error analyzing recent activity:', error);
      return {
        totalTransactions: 0,
        totalVolume: 0,
        topTokens: [],
        netFlow: 0
      };
    }
  }

  private async calculateNetFlow(tokenSymbol: string, since: Date): Promise<number> {
    try {
      const buys = await prisma.whaleTransaction.aggregate({
        where: {
          tokenSymbol,
          timestamp: { gte: since },
          transactionType: { in: ['BUY', 'TRANSFER_IN'] }
        },
        _sum: { usdValue: true }
      });

      const sells = await prisma.whaleTransaction.aggregate({
        where: {
          tokenSymbol,
          timestamp: { gte: since },
          transactionType: { in: ['SELL', 'TRANSFER_OUT'] }
        },
        _sum: { usdValue: true }
      });

      return (buys._sum.usdValue || 0) - (sells._sum.usdValue || 0);
    } catch (error) {
      console.error('❌ Error calculating net flow:', error);
      return 0;
    }
  }

  private async getUniqueWhaleCount(tokenSymbol: string, since: Date): Promise<number> {
    try {
      const result = await prisma.whaleTransaction.groupBy({
        by: ['walletAddress'],
        where: {
          tokenSymbol,
          timestamp: { gte: since }
        }
      });

      return result.length;
    } catch (error) {
      console.error('❌ Error getting unique whale count:', error);
      return 0;
    }
  }

  private async getTopWhalesForToken(tokenSymbol: string, since: Date): Promise<{ label: string; volume: number }[]> {
    try {
      const whaleVolumes = await prisma.whaleTransaction.groupBy({
        by: ['walletAddress'],
        where: {
          tokenSymbol,
          timestamp: { gte: since }
        },
        _sum: { usdValue: true },
        orderBy: { _sum: { usdValue: 'desc' } },
        take: 3
      });

      const topWhales = [];
      for (const whaleVolume of whaleVolumes) {
        const whale = await prisma.whaleWallet.findUnique({
          where: { address: whaleVolume.walletAddress },
          select: { label: true }
        });

        if (whale) {
          topWhales.push({
            label: whale.label,
            volume: whaleVolume._sum.usdValue || 0
          });
        }
      }

      return topWhales;
    } catch (error) {
      console.error('❌ Error getting top whales for token:', error);
      return [];
    }
  }

  private getTimeframeCutoff(timeframe: '1h' | '24h' | '7d'): Date {
    const now = new Date();
    switch (timeframe) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }
}

// Singleton instance
let portfolioServiceInstance: WhalePortfolioService | null = null;

export const getWhalePortfolioService = (): WhalePortfolioService => {
  if (!portfolioServiceInstance) {
    portfolioServiceInstance = new WhalePortfolioService();
  }
  return portfolioServiceInstance;
};