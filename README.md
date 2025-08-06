# HADES - Cross-Chain Intelligence Aggregator

**"Forged in the shadows of Jupiter"**

A sophisticated cryptocurrency intelligence platform built with Next.js, featuring an immersive 3D interface powered by Spline. HADES scans, verifies, and surfaces critical intelligence the moment tokens emerge across multiple blockchains.

![HADES Platform](https://img.shields.io/badge/HADES-Cross%20Chain%20Intelligence-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Spline](https://img.shields.io/badge/Spline-3D%20Interactive-purple?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=flat-square&logo=prisma)

## 🚀 Core Features

### 🎮 Interactive 3D Experience

- **Immersive Landing** - Interactive Spline 3D scene with real-time user interaction
- **Dynamic Animations** - Click, hover, and programmatic animation triggers
- **Visual Feedback** - Responsive object scaling and cursor interactions
- **Lazy Loading** - Optimized 3D scene loading with intersection observers

### 🧠 Intelligence Layer

- **Real-time Market Data** - Live cryptocurrency prices and market statistics
- **Alpha Signals** - AI-powered trading signals with confidence ratings
- **👁️ Intelligence Feed** - Curated market intelligence and insights
- **🔍 Real-time Scanning** - Continuous token emergence monitoring across chains
- **🛡️ Risk Verification** - Advanced algorithms for token legitimacy assessment

### 🛠️ Platform Features

- **Watchlist Management** - Track your favorite tokens with custom alerts
- **Smart Alerts** - Price, volume, and percentage change notifications
- **Market Analysis** - Sector performance and dominance charts
- **Token Search** - Comprehensive token discovery and analysis
- **User Settings** - Personalized preferences and configurations
- **Secure Authentication** - Privy-powered wallet and email authentication

### 🌐 Cross-Chain Support

- **Solana** - Active: High-speed monitoring and Jupiter integration
- **Base** - Planned (Q4 '25): Layer 2 scaling solutions
- **Ethereum** - Planned (Q4 '25): DeFi ecosystem intelligence
- **Multi-Chain** - Planned (Q1 '26): Unified intelligence across blockchain networks

## 🛠️ Tech Stack

### Frontend & 3D

- **Framework**: Next.js 14 with App Router, React 18, TypeScript
- **3D Graphics**: Spline 3D with @splinetool/react-spline
- **Styling**: Tailwind CSS, Radix UI Components
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization

### Backend & Data

- **Database**: SQLite with Prisma ORM
- **Authentication**: Privy (Web3 + Email)
- **APIs**: CoinGecko, Jupiter, Birdeye, Fear & Greed Index
- **Runtime**: Bun (recommended) or Node.js

### Infrastructure

- **Deployment**: Vercel, Netlify (configured)
- **Development**: Hot reload, TypeScript strict mode
- **Performance**: SSR/SSG, API caching, lazy loading

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **Bun** (recommended) or **npm**/**yarn**
- **Git**
- **Modern browser** with WebGL support for 3D interactions

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HadesAG/Hades2.git
cd Hades2
```

### 2. Install Dependencies

Using bun (recommended):

```bash
bun install
```

If you encounter dependency conflicts, use:

```bash
bun install --force
```

Alternative package managers:

```bash
# Using npm
npm install --legacy-peer-deps

# Using yarn
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add the following environment variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Privy Authentication (Required)
NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"

# Optional API Keys (for enhanced features)
HELIUS_RPC="your_helius_rpc_url"
HELIUS_API_KEY="your_helius_api_key"
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

### 4. Database Setup

Initialize and migrate the database:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

**For PowerShell users**, run commands separately:

```powershell
npx prisma generate
npx prisma migrate dev
```

### 5. Start Development Server

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

🎮 **3D Interface**: The landing page features an interactive Spline 3D scene that responds to mouse interactions and includes programmatic animation controls.

## 🔧 Configuration

### Privy Authentication Setup

1. Visit [Privy Console](https://console.privy.io/)
2. Create a new app
3. Copy your App ID and App Secret
4. Add them to your `.env.local` file
5. Configure allowed domains (add `localhost:3000` for development)

### API Keys (Optional but Recommended)

- **Helius**: For enhanced Solana data ([Get API Key](https://helius.xyz/))
- **Telegram Bot**: For notifications ([Create Bot](https://t.me/botfather))

## 📁 Project Structure

```bash

Hades2/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── alerts/        # Alert management
│   │   ├── settings/      # User settings
│   │   ├── signals/       # Trading signals
│   │   ├── telegram-webhook/ # Telegram integration
│   │   └── watchlist/     # Watchlist management
│   ├── platform/          # Main application pages
│   │   ├── alerts/        # Alerts dashboard
│   │   ├── alpha-signals/ # Alpha signals page
│   │   ├── intelligence-feed/ # Intelligence feed
│   │   ├── market-analysis/   # Market analysis
│   │   ├── search-tokens/     # Token search
│   │   ├── settings/          # User settings
│   │   └── watchlist/         # Watchlist management
│   ├── alpha-feed/        # Alpha feed public page
│   ├── intelligence/      # Intelligence hub page
│   ├── dashboard/         # Dashboard page
│   ├── page.tsx          # Landing page with 3D Spline scene
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles with 3D animations
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   └── privy-wrapper.tsx # Authentication wrapper
├── lib/                 # Utility libraries
│   ├── api-client.ts    # API client utilities
│   ├── data-services.ts # External API integrations
│   ├── prisma.ts        # Database client
│   ├── telegram-service.ts # Telegram bot integration
│   └── utils.ts         # Helper functions
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
└── public/              # Static assets
```

## 🔄 Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev    # Run database migrations
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
```

## 🌐 API Endpoints

### Authentication Required Endpoints

- `GET /api/settings` - Get user settings
- `POST /api/settings` - Save user settings
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add token to watchlist
- `DELETE /api/watchlist/[symbol]` - Remove token from watchlist
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create new alert
- `PATCH /api/alerts/[id]` - Update alert
- `DELETE /api/alerts/[id]` - Delete alert

### Public Endpoints

- `GET /api/alpha-signals` - Get alpha trading signals
- `GET /api/signals` - Get general trading signals
- `GET /api/launchpad-intelligence` - Get launchpad data
- `GET /api/telegram-signals` - Get Telegram signals
- `POST /api/telegram-webhook` - Telegram bot webhook endpoint

## 🚀 Deployment

### Vercel (Recommended)

**Quick Deploy**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/hades-crypto-platform)

1. **One-Click Deploy**:
   - Click the "Deploy with Vercel" button above
   - Connect your GitHub account
   - Set environment variables (see below)
   - Deploy automatically

2. **Manual Deploy**:

   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

3. **Environment Variables**:
   Set in Vercel dashboard:

   ```bash
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   NODE_ENV=production
   ```

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Other Platforms

The application can be deployed on any platform that supports Next.js:

- **Netlify**: Use `netlify.toml` configuration
- **Railway**: Automatic deployment from GitHub
- **Digital Ocean**: App Platform deployment
- **AWS**: Amplify or EC2 deployment

## 🔒 Security

- All API routes are protected with user authentication
- Database queries use Prisma's built-in SQL injection protection
- Environment variables are properly configured
- CORS policies are enforced for API endpoints

## 📊 Performance

- **SSR/SSG**: Optimized with Next.js App Router
- **3D Optimization**: Lazy loading Spline scenes with intersection observers
- **API Caching**: External API responses are cached
- **Database**: Optimized queries with Prisma
- **Images**: Next.js Image optimization
- **Bundle**: Code splitting and tree shaking
- **Interactive**: Hardware-accelerated 3D graphics with WebGL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Dependency Conflicts

If you encounter dependency conflicts during installation:

```bash
# With bun (recommended)
bun install --force

# With npm
npm install --legacy-peer-deps

# With yarn
yarn install --ignore-peer-deps
```

### Common Issues

- **Privy Auth Error**: Ensure your `NEXT_PUBLIC_PRIVY_APP_ID` is set correctly
- **Database Error**: Run `npx prisma generate` and `npx prisma migrate dev`
- **API Rate Limits**: CoinGecko free tier has rate limits; consider upgrading for production
- **3D Scene Not Loading**: Check browser WebGL support and ensure stable internet connection
- **Spline Interactions**: Check browser console for interaction logs and object names

## 🆘 Support

- **Documentation**: Check the [Wiki](https://github.com/your-username/hades-crypto-platform/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/hades-crypto-platform/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/your-username/hades-crypto-platform/discussions)

## 🙏 Acknowledgments

- [Spline](https://spline.design/) for 3D design and interactive graphics
- [CoinGecko](https://coingecko.com/) for market data API
- [Privy](https://privy.io/) for authentication infrastructure
- [Shadcn/ui](https://ui.shadcn.com/) for UI components
- [Fear & Greed Index](https://alternative.me/) for sentiment data
- [Jupiter](https://jup.ag/) for Solana swap aggregation inspiration

---bash

**Built with ❤️ for the crypto community**

![HADES](https://img.shields.io/badge/HADES-2024-orange?style=for-the-badge)
