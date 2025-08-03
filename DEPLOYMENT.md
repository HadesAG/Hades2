# 🚀 HADES Deployment Guide - Vercel

This guide walks you through deploying your HADES cryptocurrency intelligence platform to Vercel.

## 📋 Prerequisites

- GitHub repository with your HADES code
- Vercel account (free tier works)
- Privy App ID from [Privy Dashboard](https://dashboard.privy.io)

## 🔧 Step 1: Prepare Your Repository

Ensure these files are in your repository:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to ignore during deployment
- ✅ `scripts/build-vercel.js` - Custom build script
- ✅ `DEPLOYMENT.md` - This guide

## 🌐 Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Build Command: `bun run build:vercel`
   - Output Directory: `.next`
   - Install Command: `bun install`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_PRIVY_APP_ID
vercel env add NODE_ENV production

# Redeploy with environment variables
vercel --prod
```

## 🔐 Step 3: Environment Variables

Set these in your Vercel dashboard under **Settings → Environment Variables**:

### Required Variables
```bash
NEXT_PUBLIC_PRIVY_APP_ID=cmdtu3jk000nelc0b3u9oicog  # Your actual Privy App ID
NODE_ENV=production
```

### Optional Variables (for advanced features)
```bash
DATABASE_URL=postgresql://...  # For PostgreSQL (recommended for production)
COINGECKO_API_KEY=your_key     # For higher rate limits
TELEGRAM_BOT_TOKEN=your_token  # For Telegram notifications
HELIUS_API_KEY=your_key        # For Solana data
```

## 🗄️ Step 4: Database Setup

### Option A: SQLite (Default - Free)
- No additional setup required
- Uses local SQLite database
- Perfect for development and small-scale production

### Option B: PostgreSQL (Recommended for Production)
1. **Get a PostgreSQL database**:
   - **Vercel Postgres** (recommended): Add from Vercel dashboard
   - **Supabase**: Free PostgreSQL with dashboard
   - **PlanetScale**: MySQL alternative
   - **Railway**: Simple PostgreSQL hosting

2. **Add DATABASE_URL**:
   ```bash
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

3. **Redeploy** to apply database changes

## 🎯 Step 5: Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click **Settings → Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## 🔍 Step 6: Verify Deployment

After deployment, check:

- ✅ **Homepage loads**: Your landing page appears
- ✅ **Authentication works**: Privy login functions
- ✅ **API endpoints respond**: `/api/market-data` returns data
- ✅ **Database connects**: User data persists
- ✅ **Real-time data**: Market prices update

## 🐛 Troubleshooting

### Build Failures

**Error: "Cannot initialize Privy provider"**
```bash
# Solution: Set NEXT_PUBLIC_PRIVY_APP_ID in Vercel environment variables
NEXT_PUBLIC_PRIVY_APP_ID=your_actual_app_id
```

**Error: "Database connection failed"**
```bash
# Solution: Check DATABASE_URL format
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

**Error: "Module not found"**
```bash
# Solution: Clear Vercel build cache
# In Vercel dashboard: Settings → Functions → Clear Cache
```

### Runtime Issues

**API Routes Not Working**
- Check function logs in Vercel dashboard
- Verify API routes are in `app/api/` directory
- Ensure proper HTTP methods (GET, POST, etc.)

**Slow Loading**
- Enable Vercel Analytics to identify bottlenecks
- Consider upgrading to Vercel Pro for better performance
- Optimize images and reduce bundle size

### Performance Optimization

**Enable Vercel Features**:
- **Analytics**: Monitor performance
- **Speed Insights**: Track Core Web Vitals
- **Edge Functions**: Faster API responses
- **Image Optimization**: Automatic image optimization

## 📊 Monitoring

### Vercel Dashboard
- **Functions**: Monitor API performance
- **Analytics**: Track user behavior
- **Logs**: Debug runtime issues
- **Deployments**: View build history

### Recommended Monitoring
- **Sentry**: Error tracking
- **LogRocket**: User session recording
- **Vercel Analytics**: Built-in performance monitoring

## 🔄 Continuous Deployment

Your Vercel deployment automatically:
- ✅ **Rebuilds** on every git push to main branch
- ✅ **Runs tests** during build process
- ✅ **Updates environment** with zero downtime
- ✅ **Provides preview** deployments for pull requests

## 🚀 Going Live Checklist

Before going live:
- [ ] Environment variables set correctly
- [ ] Custom domain configured (optional)
- [ ] Database properly configured
- [ ] API rate limits configured
- [ ] Error monitoring set up
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place

## 🆘 Support

If you encounter issues:

1. **Check Vercel Logs**: Dashboard → Functions → View Function Logs
2. **Review Build Logs**: Dashboard → Deployments → View Build Logs
3. **Vercel Discord**: [discord.gg/vercel](https://discord.gg/vercel)
4. **Documentation**: [vercel.com/docs](https://vercel.com/docs)

---

🎉 **Congratulations!** Your HADES platform is now live on Vercel!

Your app will be available at: `https://your-project-name.vercel.app`