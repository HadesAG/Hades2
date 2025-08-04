'use client';

import { useAuth } from '@/contexts/auth-context';
import { LoginButton } from '@/components/auth/login-button';
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
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
  
  useEffect(() => {
    if (ready && !authenticated) {
      // Redirect to home page if not authenticated
      router.push('/');
    }
  }, [ready, authenticated, router]);

  // Display a loading state while the auth state is loading
  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If the user is not authenticated, show a login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            HADES Intelligence Platform
          </h1>
          <p className="text-slate-300 mb-8">
            Connect your Solana wallet or sign in with email to access the platform
          </p>
          <Button 
            onClick={login} 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet / Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-orange-500">HADES</div>
          </Link>
          <p className="text-xs text-slate-400 mt-1">Intelligence Platform</p>
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
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800">
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
              <p className="text-xs text-slate-400">Connected</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-950 border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {sidebarItems.find(item => 
                  item.exact 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href)
                )?.label || 'Intelligence Dashboard'}
              </h1>
              <p className="text-sm text-slate-400">
                Real-time crypto intelligence and market analysis
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400">
                Last update: {new Date().toLocaleTimeString()}
              </div>
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