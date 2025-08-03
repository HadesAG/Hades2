'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Radar, ShieldCheck, Zap, Search, ExternalLink, ArrowRight, Globe, Diamond, Circle, Menu } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

function LazySplineScene() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle Spline scene load
  const onSplineLoad = (spline: any) => {
    splineRef.current = spline;
    setIsInteractive(true);
    
    // Log available objects for debugging
    console.log('Spline scene loaded:', spline);
    
    // You can access and manipulate objects here
    // Example: const cube = spline.findObjectByName('Cube');
  };

  // Handle mouse interactions
  const onSplineMouseDown = (e: any) => {
    console.log('Mouse down on:', e.target?.name || 'unknown object');
    
    // Add visual feedback or trigger animations
    if (e.target) {
      // Example: Scale object on click
      const originalScale = { ...e.target.scale };
      e.target.scale.x *= 1.1;
      e.target.scale.y *= 1.1;
      e.target.scale.z *= 1.1;
      
      // Reset scale after 200ms
      setTimeout(() => {
        e.target.scale.x = originalScale.x;
        e.target.scale.y = originalScale.y;
        e.target.scale.z = originalScale.z;
      }, 200);
    }
  };

  const onSplineMouseHover = (e: any) => {
    console.log('Mouse hover on:', e.target?.name || 'unknown object');
    
    // Change cursor to pointer when hovering over interactive objects
    if (containerRef.current) {
      containerRef.current.classList.toggle('cursor-pointer', !!e.target);
    }
  };

  const onSplineMouseUp = (e: any) => {
    console.log('Mouse up on:', e.target?.name || 'unknown object');
    
    // Reset cursor
    if (containerRef.current) {
      containerRef.current.classList.remove('cursor-pointer');
    }
  };

  // Trigger scene animations programmatically
  const triggerSceneAnimation = (eventType: string, objectName?: string) => {
    if (splineRef.current && objectName) {
      try {
        splineRef.current.emitEvent(eventType, objectName);
      } catch (error) {
        console.log('Animation trigger failed:', error);
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
          
          {/* Interactive overlay with subtle controls */}
          {isInteractive && (
            <div className="absolute top-4 right-4 z-20 space-y-2">
              <button
                onClick={() => triggerSceneAnimation('mouseHover', 'MainObject')}
                className="bg-black/30 backdrop-blur-sm text-white/70 px-3 py-1 rounded-lg text-sm hover:bg-black/50 hover:text-white transition-all duration-200"
                title="Trigger hover animation"
              >
                ✨
              </button>
              <button
                onClick={() => triggerSceneAnimation('mouseDown', 'MainObject')}
                className="bg-black/30 backdrop-blur-sm text-white/70 px-3 py-1 rounded-lg text-sm hover:bg-black/50 hover:text-white transition-all duration-200"
                title="Trigger click animation"
              >
                🎯
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            <div className="text-orange-500 font-semibold">Preparing 3D Experience...</div>
          </div>
        </div>
      )}
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
      {/* Space Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent" style={{
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
            <Link href="/intelligence" className="nav-link">Intelligence</Link>
            <Link href="/platform" className="nav-link">Chains</Link>
            <Link href="/alpha-feed" className="nav-link">Alpha Feed</Link>
          </div>
          
          <Link href="/platform" className="launch-btn">
            Launch Platform →
              </Link>
          
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
            <span className="orange-text">Intelligence</span> <span className="white-text">Features</span>
          </h2>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Real-time Scanning */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6">
                <Radar className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Real-time Scanning</h3>
              <p className="text-gray-400 leading-relaxed">
                Continuous monitoring of token emergence across multiple chains, providing instant intelligence the moment opportunities surface.
              </p>
            </div>
            
            {/* Risk Assessment */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Risk Verification</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced algorithms verify token legitimacy, contract security, and liquidity depth before surfacing opportunities.
              </p>
            </div>
            
            {/* Alpha Intelligence */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
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
              Seamless <span className="text-orange-500">Jupiter Integration</span>
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
                <p className="text-gray-400 text-sm">L2 intelligence</p>
              </div>
            </div>
            
            {/* Ethereum */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Diamond className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Ethereum</h3>
                <p className="text-gray-400 text-sm">Core network data</p>
              </div>
            </div>
            
            {/* Multi-Chain */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Multi-Chain</h3>
                <p className="text-gray-400 text-sm">Cross-chain bridges</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Access the <span className="text-orange-500 glow-orange">Underworld</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the intelligence network that moves beneath the surface of the markets
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/alpha-feed" className="cta-primary text-lg px-8 py-4">
              <span>Access Alpha Feed →</span>
            </Link>
            
            <Link href="/platform" className="cta-secondary text-lg px-8 py-4">
              <span>Launch Platform</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* HADES Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold text-white mb-4">HADES</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Intelligence Platform forged in the shadows of Jupiter
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Cross-chain intelligence aggregation for the next generation of traders and protocols.
              </p>
            </div>
            
            {/* Platform Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/intelligence" className="text-gray-400 hover:text-orange-500 transition-colors">Intelligence Hub</Link></li>
                <li><Link href="/alpha-feed" className="text-gray-400 hover:text-orange-500 transition-colors">Alpha Feed</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-orange-500 transition-colors">Dashboard</Link></li>
                <li><Link href="/platform" className="text-gray-400 hover:text-orange-500 transition-colors">Chain Monitor</Link></li>
              </ul>
            </div>
            
            {/* Resources Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#documentation" className="text-gray-400 hover:text-orange-500 transition-colors">Documentation</Link></li>
                <li><Link href="#api-reference" className="text-gray-400 hover:text-orange-500 transition-colors">API Reference</Link></li>
                <li><Link href="#support-center" className="text-gray-400 hover:text-orange-500 transition-colors">Support Center</Link></li>
                <li><Link href="#system-status" className="text-gray-400 hover:text-orange-500 transition-colors">System Status</Link></li>
              </ul>
            </div>
            
            {/* Community Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Community</h4>
              <ul className="space-y-3">
                <li><Link href="#telegram" className="text-gray-400 hover:text-orange-500 transition-colors">Telegram</Link></li>
                <li><Link href="#twitter" className="text-gray-400 hover:text-orange-500 transition-colors">Twitter</Link></li>
                <li><Link href="#discord" className="text-gray-400 hover:text-orange-500 transition-colors">Discord</Link></li>
                <li><Link href="#github" className="text-gray-400 hover:text-orange-500 transition-colors">GitHub</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2024 HADES Intelligence Platform. Forged in the shadows of Jupiter.
            </p>
            
            <div className="flex space-x-6 text-sm">
              <Link href="#privacy" className="text-gray-500 hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link href="#terms" className="text-gray-500 hover:text-orange-500 transition-colors">Terms of Service</Link>
              <Link href="#cookies" className="text-gray-500 hover:text-orange-500 transition-colors">Cookie Policy</Link>
      </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}