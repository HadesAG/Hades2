'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Radar, ShieldCheck, Zap, Search, ExternalLink, ArrowRight, Globe, Diamond, Circle, Menu, Wallet } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/auth-context';
import { LoginButton } from '@/components/auth/login-button';
import { UserMenu } from '@/components/auth/user-menu';
import HadesRoadmap from '@/components/HadesRoadmap';

function LazySplineScene() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices for performance optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    
    // Use reduced threshold for mobile to delay loading
    const threshold = isMobile ? 0.3 : 0.1;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true);
          // Add small delay to ensure smooth scrolling
          setTimeout(() => setShouldLoad(true), isMobile ? 500 : 100);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, [isLoading, isMobile]);

  // Handle Spline scene load with performance optimization
  const onSplineLoad = (spline: any) => {
    splineRef.current = spline;
    setIsInteractive(true);
    setIsLoading(false);
    
    // Reduce quality on mobile for better performance
    if (isMobile && spline.setQuality) {
      spline.setQuality(0.6);
    }
  };

  // Throttled mouse interactions for better performance
  const throttleTimeout = useRef<NodeJS.Timeout>();
  
  const onSplineMouseDown = (e: any) => {
    if (isMobile) return; // Disable on mobile for performance
    
    if (e.target && !throttleTimeout.current) {
      // Simplified scaling effect
      const originalTransform = e.target.style.transform || '';
      e.target.style.transform = 'scale(1.05)';
      
      // Reset after animation
      throttleTimeout.current = setTimeout(() => {
        if (e.target) e.target.style.transform = originalTransform;
        throttleTimeout.current = undefined;
      }, 150);
    }
  };

  const onSplineMouseHover = (e: any) => {
    if (isMobile) return; // Disable on mobile
    
    // Simplified cursor change
    if (containerRef.current && !throttleTimeout.current) {
      containerRef.current.style.cursor = e.target ? 'pointer' : 'default';
    }
  };

  const onSplineMouseUp = (e: any) => {
    if (isMobile) return; // Disable on mobile
    
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default';
    }
  };

  // Simplified animation trigger for performance
  const triggerSceneAnimation = (eventType: string, objectName?: string) => {
    if (isMobile) return; // Disable on mobile
    
    if (splineRef.current && objectName && !throttleTimeout.current) {
      try {
        splineRef.current.emitEvent(eventType, objectName);
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = undefined;
        }, 300);
      } catch (error) {
        // Silent fail for better UX
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      {shouldLoad ? (
        <>
          <Spline 
            scene="https://prod.spline.design/DNj4ME98pq5OHLLH/scene.splinecode"
            className="w-full h-full"
            onLoad={onSplineLoad}
            onMouseDown={onSplineMouseDown}
            onMouseMove={onSplineMouseHover}
            onMouseUp={onSplineMouseUp}
          />
          
          {/* Interactive overlay with subtle controls - desktop only */}
          {isInteractive && !isMobile && (
            <div className="absolute top-4 right-4 z-20 space-y-2 opacity-75">
              <button
                onClick={() => triggerSceneAnimation('mouseHover', 'MainObject')}
                className="bg-black/20 backdrop-blur-sm text-white/60 px-2 py-1 rounded text-xs hover:bg-black/40 hover:text-white transition-colors duration-200"
                title="Trigger hover animation"
              >
                ✨
              </button>
              <button
                onClick={() => triggerSceneAnimation('mouseDown', 'MainObject')}
                className="bg-black/20 backdrop-blur-sm text-white/60 px-2 py-1 rounded text-xs hover:bg-black/40 hover:text-white transition-colors duration-200"
                title="Trigger click animation"
              >
                🎯
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-3 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
            <div className="text-red-400 text-sm font-medium">
              {isLoading ? 'Loading 3D Scene...' : 'Preparing Experience...'}
            </div>
            {isMobile && (
              <div className="text-xs text-gray-500 mt-2">Optimized for mobile</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Navigation authentication component
function NavigationAuth() {
  const { ready, authenticated, user } = useAuth();

  // Show loading state while checking auth
  if (!ready) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-10 w-32 bg-gray-800 animate-pulse rounded-lg" />
      </div>
    );
  }

  // Show user menu if authenticated
  if (authenticated) {
    return (
      <div className="flex items-center space-x-4">
        {/* Compact user menu for landing page */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {user?.email?.address?.charAt(0).toUpperCase() || 
                 user?.wallet?.address?.charAt(0).toUpperCase() || 'S'}
              </span>
            </div>
            <span className="text-sm text-gray-300">
              {user?.wallet?.address ? 
                `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                'Connected'}
            </span>
          </div>
        </div>
        <Link href="/platform" className="launch-btn">
          Platform →
        </Link>
      </div>
    );
  }

  // Show login options if not authenticated
  return (
    <div className="flex items-center space-x-4">
      <LoginButton />
      <Link href="/platform" className="launch-btn">
        Launch Platform →
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://prod.spline.design" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
      </Head>
      <div className="min-h-screen relative overflow-x-hidden">
        {/* RSS Ticker at very top */}
        <div className="relative w-full h-12 z-50">
          <iframe
            src="https://rss.app/embed/v1/ticker/BXbP5zQAvNc6WcK9"
            frameBorder="0"
            title="RSS Ticker Feed"
            className="w-full h-full border-0"
          ></iframe>
        </div>
        {/* Space Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" style={{ top: '48px' }}>
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent" style={{
          background: `radial-gradient(ellipse at center, rgba(20, 20, 20, 0.8) 0%, rgba(8, 8, 8, 1) 70%),
                      radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 235, 59, 0.05) 0%, transparent 50%),
                      #0a0a0a`
        }} />
        
        {/* Animated stars */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0 animate-star-field"
            style={{
              backgroundImage: `
                radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.1), transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.05), transparent),
                radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.08), transparent),
                radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.03), transparent)
              `,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 200px'
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            HADES
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/platform/intelligence-feed" className="nav-link">Intelligence</Link>
            <Link href="/platform/search-tokens" className="nav-link">Search</Link>
            <Link href="/platform/alpha-signals" className="nav-link">Alpha Feed</Link>
            <Link href="/platform" className="nav-link">Platform</Link>
            <Link href="/docs" className="nav-link">API</Link>
            <a href="#roadmap" className="nav-link" onClick={e => { e.preventDefault(); document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' }); }}>Roadmap</a>
          </div>
          
          <NavigationAuth />
          
          <button className="md:hidden text-white" aria-label="Open mobile menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section with 3D Spline */}
      <main className="relative z-10">
        <div className="ambient-glow"></div>
        
        {/* 3D Spline Scene Container */}
        <div className="relative h-screen w-full">
          {/* Spline 3D Scene - Lazy loaded */}
          <LazySplineScene />
          
          {/* Hero Content Overlay */}
          {/* Removed overlay content to let Spline design stand alone */}
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="features-title text-center fade-in-up">
            <span className="red-text">Intelligence</span> <span className="white-text">Features</span>
          </h2>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Real-time Scanning */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 hover:border-red-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                <Radar className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Real-time Scanning</h3>
              <p className="text-gray-400 leading-relaxed">
                Continuous monitoring of token emergence across multiple chains, providing instant intelligence the moment opportunities surface.
              </p>
            </div>
            
            {/* Risk Assessment */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 hover:border-red-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Risk Verification</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced algorithms verify token legitimacy, contract security, and liquidity depth before surfacing opportunities.
              </p>
            </div>
            
            {/* Alpha Intelligence */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 hover:border-red-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Alpha Intelligence</h3>
              <p className="text-gray-400 leading-relaxed">
                Curated intelligence feed delivering high-conviction opportunities with detailed analysis and timing insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-white mb-6">
              Seamless <span className="text-red-500">Jupiter Integration</span>
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              HADES intelligence flows directly into your Jupiter swap interface, providing contextual insights without disrupting your trading flow.
            </p>
            <Link href="/platform" className="cta-primary">
              <span>Explore Integration</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Chain Support Section */}
      <section className="relative z-10 px-6 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Solana */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Solana</h3>
                <p className="text-gray-400 text-sm">High-speed monitoring</p>
              </div>
            </div>
            
            {/* Base */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Circle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Base</h3>
                <p className="text-gray-400 text-sm">Q4 &rsquo;25</p>
              </div>
            </div>
            
            {/* Ethereum */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Diamond className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Ethereum</h3>
                <p className="text-gray-400 text-sm">Q4 &rsquo;25</p>
              </div>
            </div>
            
            {/* Multi-Chain */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Multi-Chain</h3>
                <p className="text-gray-400 text-sm">Q1 &rsquo;26</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Access the <span className="text-red-500 glow-red">Underworld</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the intelligence network that moves beneath the surface of the markets
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/platform/alpha-signals" className="cta-primary text-lg px-8 py-4">
              <span>Access Alpha Feed →</span>
            </Link>
            
            <Link href="/platform" className="cta-secondary text-lg px-8 py-4">
              <span>Launch Platform</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <HadesRoadmap />

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
    </>
  );
}
