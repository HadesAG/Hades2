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
  Wallet
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
      </div>
    </div>
  );
}
