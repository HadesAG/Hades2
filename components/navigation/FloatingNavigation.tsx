'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { LoginButton } from '@/components/auth/login-button';
import { 
  Brain, 
  Search, 
  Zap, 
  TrendingUp, 
  Menu, 
  X,
  User,
  LogOut
} from 'lucide-react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Popover from '@radix-ui/react-popover';

interface FloatingNavigationProps {
  className?: string;
  variant?: 'landing' | 'platform';
}

export function FloatingNavigation({ 
  className = "",
  variant = 'landing'
}: FloatingNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { ready, authenticated, user, logout } = useAuth();

  // Handle scroll effect for floating nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: '/platform/intelligence-feed', icon: Brain, label: 'Intelligence' },
    { href: '/platform/search-tokens', icon: Search, label: 'Search' },
    { href: '/platform/alpha-signals', icon: Zap, label: 'Alpha Feed' },
    { href: '/platform', icon: TrendingUp, label: 'Platform' },
  ];

  const AuthSection = () => {
    if (!ready) {
      return (
        <div className="flex items-center space-x-4">
          <div className="h-10 w-32 bg-gray-800/50 animate-pulse rounded-lg" />
        </div>
      );
    }

    if (authenticated) {
      return (
        <div className="flex items-center space-x-4">
          {/* User Profile Popover */}
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button
                variant="ghost"
                className="floating-nav-item flex items-center space-x-2 px-3 py-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user?.email?.address?.charAt(0).toUpperCase() || 
                     user?.wallet?.address?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden lg:block text-sm text-gray-300">
                  {user?.wallet?.address ? 
                    `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                    'Connected'}
                </span>
              </Button>
            </Popover.Trigger>
            
            <Popover.Portal>
              <Popover.Content
                className="floating-nav bg-black/90 backdrop-blur-md border border-gray-800 rounded-lg p-4 shadow-xl z-50"
                sideOffset={8}
              >
                <div className="space-y-3">
                  <div className="text-sm text-gray-300">
                    {user?.email?.address && (
                      <p className="truncate">{user.email.address}</p>
                    )}
                    <p className="text-green-400">Connected</p>
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
                </div>
                
                <Popover.Arrow className="fill-gray-800" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <Link href="/platform">
            <Button className="launch-btn">
              Platform →
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <LoginButton />
        <Link href="/platform">
          <Button className="launch-btn">
            Launch Platform →
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isScrolled ? 'scale-95' : 'scale-100'
    } ${className}`}>
      <div className={`floating-nav px-6 py-4 rounded-2xl transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl border border-gray-800/50' 
          : 'bg-black/70 backdrop-blur-lg border border-gray-700/30'
      }`}>
        <div className="flex items-center justify-between space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold text-white">HADES</div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu.Root>
              <NavigationMenu.List className="flex items-center space-x-4">
                {navigationItems.map((item) => (
                  <NavigationMenu.Item key={item.href}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={item.href}
                        className="floating-nav-item flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
          
          {/* Auth Section */}
          <div className="hidden md:flex">
            <AuthSection />
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700/50">
            <div className="space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="floating-nav-item flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-3 border-t border-gray-700/50">
                <AuthSection />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}