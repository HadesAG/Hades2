'use client';

import { useAuth } from '@/contexts/auth-context';
import { LoginButton } from '@/components/auth/login-button';
import { UserMenu } from '@/components/auth/user-menu';
import { usePrivy } from '@privy-io/react-auth';
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
  
  // Initialize mounted state for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render auth-dependent content until mounted (hydration complete)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Now we can safely use auth hooks after hydration
  return <AuthenticatedPlatformLayout pathname={pathname} router={router}>{children}</AuthenticatedPlatformLayout>;
}

function AuthenticatedPlatformLayout({ 
  children, 
  pathname, 
  router 
}: { 
  children: React.ReactNode;
  pathname: string;
  router: any;
}) {
  const { ready, authenticated, user, login, logout } = useAuth();
  
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
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-orange-500">HADES</div>
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
                    ? 'bg-orange-600 text-white' 
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {user?.email?.address?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email?.address || 'Wallet User'}
                  </p>
                  <p className="text-xs text-gray-400">Connected</p>
                </div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </>
          ) : (
            // Show login button for unauthenticated users
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-3">Connect to access all features</p>
              <Button
                onClick={login}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-black border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">
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
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2"
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