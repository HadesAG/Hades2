// Script to seed whale wallet data for demo purposes
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Known Solana whale wallets for demo (these are public addresses)
const WHALE_WALLETS = [
  {
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    label: 'Jump Trading',
    category: 'MARKET_MAKER' as const,
  },
  {
    address: 'GThUX1Atko4tqhN2NaiTazWSeFWMuiUiudN9HGoP49ld',
    label: 'Alameda Research',
    category: 'HEDGE_FUND' as const,
  },
  {
    address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
    label: 'Solana Foundation',
    category: 'INSTITUTION' as const,
  },
  {
    address: 'CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq',
    label: 'FTX Exchange',
    category: 'INSTITUTION' as const,
  },
  {
    address: 'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
    label: 'Binance Hot Wallet',
    category: 'INSTITUTION' as const,
  },
  {
    address: 'HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN',
    label: 'Three Arrows Capital',
    category: 'HEDGE_FUND' as const,
  },
  {
    address: '3LAKq8hLbgTW3BfJZy4jmTs4thrC2hEL4HbMZbFSUWnS',
    label: 'DeFiance Capital',
    category: 'VC_FUND' as const,
  },
  {
    address: '8UviNr47S8eL6J3WfDxMRa3hvLta1VDJwNWqsDgtN3Cv',
    label: 'Multicoin Capital',
    category: 'VC_FUND' as const,
  },
  {
    address: 'A7X8GbnCWRJCXbviKhcJGxSEeZrtqQTdczGNvgRhDD9W',
    label: 'Pantera Capital',
    category: 'VC_FUND' as const,
  },
  {
    address: '6FKvsq4ydWFci6nGq9ckbjYMtnmaqAoatz5c9XWjiDuS',
    label: 'Coinbase Custody',
    category: 'INSTITUTION' as const,
  },
  {
    address: 'BKipkearSqAUdNKa1WDstvcMjoPsSKBuNyvKDQDDu9WE',
    label: 'Serum DEX',
    category: 'PROJECT_TREASURY' as const,
  },
  {
    address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    label: 'Raydium Protocol',
    category: 'PROJECT_TREASURY' as const,
  },
  {
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    label: 'Orca Protocol',
    category: 'PROJECT_TREASURY' as const,
  },
  {
    address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    label: 'Jupiter Aggregator',
    category: 'PROJECT_TREASURY' as const,
  },
  {
    address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    label: 'Mango Markets',
    category: 'PROJECT_TREASURY' as const,
  },
  {
    address: 'So11111111111111111111111111111111111111112',
    label: 'Wrapped SOL',
    category: 'PROJECT_TREASURY' as const,
  },
  {
    address: '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
    label: 'Jupiter DAO Treasury',
    category: 'PROJECT_TREASURY' as const,
  },
  {
    address: '5uvshrEW5horb7MUDdevShqfAd6FzUvQqGp9RgEp3as5',
    label: 'Phantom Wallet',
    category: 'KNOWN_TRADER' as const,
  },
  {
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    label: 'Solflare Wallet',
    category: 'KNOWN_TRADER' as const,
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    label: 'Circle USDC Treasury',
    category: 'INSTITUTION' as const,
  }
];

// Sample transaction data for demo (will be created after wallets)
const createSampleTransactions = (walletAddresses: string[]) => [
  {
    walletAddress: walletAddresses[0], // Jump Trading
    tokenAddress: 'So11111111111111111111111111111111111111112',
    tokenSymbol: 'SOL',
    transactionType: 'BUY' as const,
    amount: 15000,
    usdValue: 2250000,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    signature: 'sample_signature_1_' + Date.now()
  },
  {
    walletAddress: walletAddresses[1], // Alameda Research
    tokenAddress: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    tokenSymbol: 'JUP',
    transactionType: 'BUY' as const,
    amount: 500000,
    usdValue: 425000,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    signature: 'sample_signature_2_' + Date.now()
  },
  {
    walletAddress: walletAddresses[2], // Solana Foundation
    tokenAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    tokenSymbol: 'mSOL',
    transactionType: 'SELL' as const,
    amount: 8000,
    usdValue: 1200000,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    signature: 'sample_signature_3_' + Date.now()
  },
  {
    walletAddress: walletAddresses[6], // DeFiance Capital
    tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    tokenSymbol: 'USDC',
    transactionType: 'BUY' as const,
    amount: 750000,
    usdValue: 750000,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    signature: 'sample_signature_4_' + Date.now()
  },
  {
    walletAddress: walletAddresses[7], // Multicoin Capital
    tokenAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    tokenSymbol: 'BONK',
    transactionType: 'SELL' as const,
    amount: 50000000,
    usdValue: 850000,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    signature: 'sample_signature_5_' + Date.now()
  }
];

// Sample holdings data (will be created after wallets)
const createSampleHoldings = (walletAddresses: string[]) => [
  {
    walletAddress: walletAddresses[0], // Jump Trading
    tokenAddress: 'So11111111111111111111111111111111111111112',
    tokenSymbol: 'SOL',
    balance: 125000,
    usdValue: 18750000
  },
  {
    walletAddress: walletAddresses[0], // Jump Trading
    tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    tokenSymbol: 'USDC',
    balance: 5000000,
    usdValue: 5000000
  },
  {
    walletAddress: walletAddresses[1], // Alameda Research
    tokenAddress: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    tokenSymbol: 'JUP',
    balance: 2000000,
    usdValue: 1700000
  },
  {
    walletAddress: walletAddresses[1], // Alameda Research
    tokenAddress: 'So11111111111111111111111111111111111111112',
    tokenSymbol: 'SOL',
    balance: 45000,
    usdValue: 6750000
  },
  {
    walletAddress: walletAddresses[2], // Solana Foundation
    tokenAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    tokenSymbol: 'mSOL',
    balance: 35000,
    usdValue: 5250000
  }
];

async function seedWhaleData() {
  console.log('🌱 Seeding whale wallet data...');

  try {
    // Clear existing whale data
    await prisma.whaleTransaction.deleteMany();
    await prisma.whaleHolding.deleteMany();
    await prisma.whaleWallet.deleteMany();

    // Create whale wallets
    console.log('📊 Creating whale wallets...');
    const createdWallets = [];
    for (const whale of WHALE_WALLETS) {
      const created = await prisma.whaleWallet.create({
        data: whale
      });
      createdWallets.push(created);
    }

    // Get wallet addresses for foreign key references
    const walletAddresses = createdWallets.map(w => w.address);

    // Create sample transactions
    console.log('💰 Creating sample transactions...');
    const sampleTransactions = createSampleTransactions(walletAddresses);
    for (const transaction of sampleTransactions) {
      await prisma.whaleTransaction.create({
        data: transaction
      });
    }

    // Create sample holdings
    console.log('🏦 Creating sample holdings...');
    const sampleHoldings = createSampleHoldings(walletAddresses);
    for (const holding of sampleHoldings) {
      await prisma.whaleHolding.create({
        data: holding
      });
    }

    // Update total values for whales with holdings
    console.log('📈 Updating whale total values...');
    const whalesWithHoldings = await prisma.whaleWallet.findMany({
      include: {
        holdings: true
      }
    });

    for (const whale of whalesWithHoldings) {
      const totalValue = whale.holdings.reduce((sum, holding) => sum + holding.usdValue, 0);
      await prisma.whaleWallet.update({
        where: { id: whale.id },
        data: { totalValue }
      });
    }

    console.log('✅ Successfully seeded whale data!');
    console.log(`   - ${WHALE_WALLETS.length} whale wallets created`);
    console.log(`   - ${sampleTransactions.length} sample transactions created`);
    console.log(`   - ${sampleHoldings.length} sample holdings created`);

  } catch (error) {
    console.error('❌ Error seeding whale data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWhaleData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedWhaleData };