// Whale Transaction Monitor Service for Smart Money Tracker
import { getWebSocketClient } from './websocket-client';
import { prisma } from './prisma';
import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { DataAggregator } from './data-services';

export interface TokenMovement {
  tokenAddress: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  amount: number;
  usdValue: number;
}

export interface WhaleAlert {
  type: 'WHALE_TRANSACTION';
  whale: string;
  walletAddress: string;
  action: string;
  token: string;
  amount: number;
  usdValue: number;
  timestamp: number;
  signature: string;
}

export class WhaleTransactionMonitor {
  private wsClient = getWebSocketClient();
  private whaleAddresses = new Set<string>();
  private dataAggregator = new DataAggregator();
  private isRunning = false;
  private alertCallbacks = new Set<(alert: WhaleAlert) => void>();

  async initialize(): Promise<void> {
    if (this.isRunning) return;

    try {
      console.log('🐋 Initializing Whale Transaction Monitor...');
      
      // Load active whale addresses from database
      await this.loadWhaleAddresses();
      
      // Connect to WebSocket for real-time monitoring
      await this.wsClient.connect();
      
      // Subscribe to whale wallet transactions
      await this.subscribeToWhaleWallets();
      
      this.isRunning = true;
      console.log(`🚀 Whale Transaction Monitor started - tracking ${this.whaleAddresses.size} whale wallets`);
    } catch (error) {
      console.error('❌ Failed to initialize Whale Transaction Monitor:', error);
      throw error;
    }
  }

  private async loadWhaleAddresses(): Promise<void> {
    try {
      const whales = await prisma.whaleWallet.findMany({
        where: { isActive: true },
        select: { address: true }
      });
      
      this.whaleAddresses.clear();
      whales.forEach(whale => {
        this.whaleAddresses.add(whale.address);
      });
      
      console.log(`📊 Loaded ${whales.length} active whale wallets`);
    } catch (error) {
      console.error('❌ Failed to load whale addresses:', error);
      throw error;
    }
  }

  private async subscribeToWhaleWallets(): Promise<void> {
    if (this.whaleAddresses.size === 0) {
      console.log('⚠️ No whale addresses to monitor');
      return;
    }

    try {
      // Subscribe to account changes for all whale wallets
      const addresses = Array.from(this.whaleAddresses);
      
      // Note: In a real implementation, you'd use Helius webhooks or account subscriptions
      // For now, we'll set up the framework for when transactions are detected
      this.wsClient.subscribe('*', (message) => {
        this.handleWebSocketMessage(message);
      });

      console.log(`🔔 Subscribed to ${addresses.length} whale wallets for transaction monitoring`);
    } catch (error) {
      console.error('❌ Failed to subscribe to whale wallets:', error);
      throw error;
    }
  }

  private async handleWebSocketMessage(data: any): Promise<void> {
    try {
      // Check if this is a transaction involving a whale wallet
      if (data.account && this.whaleAddresses.has(data.account)) {
        await this.processWhaleTransaction(data.account, data.transaction);
      }
    } catch (error) {
      console.error('❌ Error handling WebSocket message:', error);
    }
  }

  private async processWhaleTransaction(walletAddress: string, transaction: any): Promise<void> {
    if (!transaction || !transaction.signature) return;

    try {
      // Parse transaction for token movements
      const tokenMovements = await this.parseTokenMovements(transaction);
      
      for (const movement of tokenMovements) {
        // Check if this transaction already exists
        const existingTx = await prisma.whaleTransaction.findUnique({
          where: { signature: transaction.signature }
        });
        
        if (existingTx) continue; // Skip duplicate transactions
        
        // Store transaction in database
        await prisma.whaleTransaction.create({
          data: {
            walletAddress,
            tokenAddress: movement.tokenAddress,
            tokenSymbol: movement.symbol,
            transactionType: movement.type,
            amount: movement.amount,
            usdValue: movement.usdValue,
            timestamp: new Date(transaction.blockTime * 1000),
            signature: transaction.signature
          }
        });
        
        // Update whale holdings
        await this.updateWhaleHoldings(walletAddress, movement);
        
        // Send real-time alert
        await this.sendWhaleAlert(walletAddress, movement, transaction.signature);
        
        console.log(`🐋 Processed whale transaction: ${movement.symbol} ${movement.type} $${movement.usdValue.toLocaleString()}`);
      }
    } catch (error) {
      console.error('❌ Error processing whale transaction:', error);
    }
  }

  private async parseTokenMovements(transaction: any): Promise<TokenMovement[]> {
    const movements: TokenMovement[] = [];
    
    try {
      // This is a simplified parser - in production you'd use a more sophisticated
      // transaction parser like @solana/web3.js or Helius parser
      
      // For now, return mock data for demonstration
      // In real implementation, parse transaction instructions for token transfers
      if (transaction.meta?.postTokenBalances && transaction.meta?.preTokenBalances) {
        const preBalances = transaction.meta.preTokenBalances;
        const postBalances = transaction.meta.postTokenBalances;
        
        // Compare pre and post balances to determine movements
        for (const postBalance of postBalances) {
          const preBalance = preBalances.find((pre: any) => 
            pre.accountIndex === postBalance.accountIndex
          );
          
          if (preBalance && postBalance.uiTokenAmount.amount !== preBalance.uiTokenAmount.amount) {
            const amountDiff = parseFloat(postBalance.uiTokenAmount.uiAmount || '0') - 
                             parseFloat(preBalance.uiTokenAmount.uiAmount || '0');
            
            if (Math.abs(amountDiff) > 0) {
              // Get token price for USD value calculation
              const tokenPrice = await this.getTokenPrice(postBalance.mint);
              
              movements.push({
                tokenAddress: postBalance.mint,
                symbol: postBalance.uiTokenAmount.uiAmount > 0 ? 'TOKEN' : 'TOKEN', // Would get actual symbol
                type: amountDiff > 0 ? 'BUY' : 'SELL',
                amount: Math.abs(amountDiff),
                usdValue: Math.abs(amountDiff) * tokenPrice
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error parsing token movements:', error);
    }
    
    return movements;
  }

  private async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      // Use data aggregator to get token price by address
      return await this.dataAggregator.getTokenPrice(tokenAddress);
    } catch (error) {
      console.error(`❌ Failed to get price for token ${tokenAddress}:`, error);
      return 0;
    }
  }

  private async updateWhaleHoldings(walletAddress: string, movement: TokenMovement): Promise<void> {
    try {
      const existingHolding = await prisma.whaleHolding.findUnique({
        where: {
          walletAddress_tokenAddress: {
            walletAddress,
            tokenAddress: movement.tokenAddress
          }
        }
      });

      if (existingHolding) {
        // Update existing holding
        const newBalance = movement.type === 'BUY' || movement.type === 'TRANSFER_IN' 
          ? existingHolding.balance + movement.amount
          : existingHolding.balance - movement.amount;

        await prisma.whaleHolding.update({
          where: { id: existingHolding.id },
          data: {
            balance: Math.max(0, newBalance), // Ensure balance doesn't go negative
            usdValue: Math.max(0, newBalance) * (movement.usdValue / movement.amount),
            lastUpdated: new Date()
          }
        });
      } else if (movement.type === 'BUY' || movement.type === 'TRANSFER_IN') {
        // Create new holding
        await prisma.whaleHolding.create({
          data: {
            walletAddress,
            tokenAddress: movement.tokenAddress,
            tokenSymbol: movement.symbol,
            balance: movement.amount,
            usdValue: movement.usdValue,
            lastUpdated: new Date()
          }
        });
      }
    } catch (error) {
      console.error('❌ Error updating whale holdings:', error);
    }
  }

  private async sendWhaleAlert(walletAddress: string, movement: TokenMovement, signature: string): Promise<void> {
    try {
      const whale = await prisma.whaleWallet.findUnique({
        where: { address: walletAddress }
      });

      if (!whale) return;

      const alert: WhaleAlert = {
        type: 'WHALE_TRANSACTION',
        whale: whale.label,
        walletAddress,
        action: movement.type,
        token: movement.symbol,
        amount: movement.amount,
        usdValue: movement.usdValue,
        timestamp: Date.now(),
        signature
      };

      // Notify all registered callbacks
      this.alertCallbacks.forEach(callback => {
        try {
          callback(alert);
        } catch (error) {
          console.error('❌ Error in whale alert callback:', error);
        }
      });

      console.log(`🚨 Whale Alert: ${whale.label} ${movement.type} ${movement.amount} ${movement.symbol} ($${movement.usdValue.toLocaleString()})`);
    } catch (error) {
      console.error('❌ Error sending whale alert:', error);
    }
  }

  // Public methods for external use
  public onWhaleAlert(callback: (alert: WhaleAlert) => void): () => void {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  public async addWhaleWallet(address: string, label: string, category: string): Promise<void> {
    try {
      await prisma.whaleWallet.create({
        data: {
          address,
          label,
          category: category as any,
          totalValue: 0,
          isActive: true
        }
      });
      
      this.whaleAddresses.add(address);
      console.log(`✅ Added whale wallet: ${label} (${address})`);
    } catch (error) {
      console.error('❌ Error adding whale wallet:', error);
      throw error;
    }
  }

  public async getActiveWhales(): Promise<any[]> {
    return prisma.whaleWallet.findMany({
      where: { isActive: true },
      orderBy: { totalValue: 'desc' }
    });
  }

  public async getWhaleTransactions(limit = 50): Promise<any[]> {
    return prisma.whaleTransaction.findMany({
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
  }

  public stop(): void {
    if (this.isRunning) {
      this.wsClient.disconnect();
      this.isRunning = false;
      console.log('🛑 Whale Transaction Monitor stopped');
    }
  }
}

// Singleton instance
let whaleMonitorInstance: WhaleTransactionMonitor | null = null;

export const getWhaleTransactionMonitor = (): WhaleTransactionMonitor => {
  if (!whaleMonitorInstance) {
    whaleMonitorInstance = new WhaleTransactionMonitor();
  }
  return whaleMonitorInstance;
};