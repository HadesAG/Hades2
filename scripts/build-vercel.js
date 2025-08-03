#!/usr/bin/env node

/**
 * Custom build script for Vercel deployment
 * Handles Prisma setup and database migrations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
console.log(`Platform: ${isVercel ? 'Vercel' : 'local'}`);

try {
  // 1. Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('bun install', { stdio: 'inherit' });

  // 2. Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 3. Handle database setup for Vercel
  if (isVercel && isProduction) {
    console.log('🗄️ Setting up production database...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ DATABASE_URL not set, using SQLite fallback');
      // Create a temporary SQLite database for build
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    } else {
      console.log('📊 Using production database');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    }
  } else {
    // Development or local build
    console.log('🔧 Setting up development database...');
    if (fs.existsSync('prisma/dev.db')) {
      console.log('✅ Development database exists');
    } else {
      console.log('🔄 Creating development database...');
      execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    }
  }

  // 4. Build the application
  console.log('🏗️ Building Next.js application...');
  execSync('bun run build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Try to provide helpful error information
  if (error.message.includes('Privy')) {
    console.error('💡 Hint: Make sure NEXT_PUBLIC_PRIVY_APP_ID is set in Vercel environment variables');
  }
  
  if (error.message.includes('database')) {
    console.error('💡 Hint: Check your DATABASE_URL or database configuration');
  }
  
  process.exit(1);
}