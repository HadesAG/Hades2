'use client';

import { useAuth } from '@/contexts/auth-context';
import { LoginButton } from '@/components/auth/login-button';
import { FullPageAuthLoading } from '@/components/auth/auth-loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  Zap, 
  Brain, 
  Star, 
  TrendingUp, 
  Bell, 
  Settings, 
  LogOut,
  Wallet,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const sidebarItems = [
  { href: '/platform', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/platform/search-tokens', icon: Search, label: 'Search Tokens' },
  { href: '/platform/alpha-signals', icon: Zap, label: 'Alpha Signals' },
  { href: '/platform/intelligence-feed', icon: Brain, label: 'Intelligence Feed' },
  { href: '/platform/watchlist', icon: Star, label: 'Watchlist' },
  { href: '/platform/market-analysis', icon: TrendingUp, label: 'Market Analysis' },
  { href: '/platform/alerts', icon: Bell, label: 'Alerts' },
  { href: '/docs', icon: FileText, label: 'API' },
  { href: '/platform/settings', icon: Settings, label: 'Settings' },
];

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated, user, login, logout, isLoggingOut } = useAuth();
  
  // Initialize mounted state for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render auth-dependent content until mounted (hydration complete)
  if (!mounted) {
    return <FullPageAuthLoading />;
  }

  // Display a loading state while the auth state is loading
  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Allow both authenticated and unauthenticated users to access the platform
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Enhanced Sidebar */}
      <div className="w-64 planetary-interface border-r border-gray-800/50 flex flex-col">
        {/* Enhanced Logo */}
        <div className="p-6 border-b border-gray-800/50">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold glow-red group-hover:scale-105 transition-transform">HADES</div>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Intelligence Platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Authentication Section */}
        <div className="p-4 border-t border-gray-800">
          {authenticated ? (
            // Show user info and logout for authenticated users
            <>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {user?.email?.address?.charAt(0).toUpperCase() || 
                     user?.wallet?.address?.charAt(0).toUpperCase() || 'S'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  {user?.email?.address && (
                    <p className="text-xs text-gray-400 truncate">
                      {user.email.address}
                    </p>
                  )}
                  <p className="text-sm font-medium text-white truncate">
                    {user?.wallet?.address ? 
                      `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                      'Solana Wallet'}
                  </p>
                  <p className="text-xs text-[#14F195]">Connected</p>
                </div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-900"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </>
                )}
              </Button>
            </>
          ) : (
            // Show login button for unauthenticated users
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">Connect with Solana</p>
              <Button
                onClick={login}
                className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 text-white"
                size="sm"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet / Email
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Supports Phantom, Solflare & more
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="planetary-interface border-b border-gray-800/50 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white glow-red">
                {sidebarItems.find(item => 
                  item.exact 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href)
                )?.label || 'Intelligence Dashboard'}
              </h1>
              <p className="text-sm text-gray-400">
                Real-time crypto intelligence and market analysis
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Last update: {new Date().toLocaleTimeString()}
              </div>
              {!authenticated && (
                <Button
                  onClick={login}
                  className="descend-button px-4 py-2"
                  size="sm"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        {/* Sticky Footer */}
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-auto shadow-lg sticky bottom-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10">
              <p className="text-xs text-muted-foreground">
                © 2024 Hades.AG - Elite Crypto Intelligence
              </p>
              <div className="flex items-center space-x-6 text-xs">
                <Link href="/terms" className="text-muted-foreground hover:text-red-500 transition-colors">Terms</Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-red-500 transition-colors">Privacy</Link>
                <Link href="#support" className="text-muted-foreground hover:text-red-500 transition-colors">Support</Link>
                <div className="flex items-center space-x-3">
                  <a href="https://x.com/HadesAig" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://t.me/hadesaitg" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/hadesag" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
