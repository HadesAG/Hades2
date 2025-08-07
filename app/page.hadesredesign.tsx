'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SplineInteraction } from '@/components/planetary/SplineInteraction';
import { FloatingNavigation } from '@/components/navigation/FloatingNavigation';
import { DescendTransition } from '@/components/transitions/DescendTransition';
import { EnhancedDashboardCard } from '@/components/platform/EnhancedDashboardCard';
import { 
  Radar, 
  ShieldCheck, 
  Zap, 
  Search, 
  ArrowRight, 
  Globe, 
  Diamond, 
  Circle,
  Target,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { NavigationState, mockStore, mockQuery } from '@/app/hadesMockData';

export default function HadesRedesignPage() {
  const [navigationState, setNavigationState] = useState<NavigationState>(NavigationState.LANDING);
  const [isDescending, setIsDescending] = useState(false);
  const router = useRouter();

  const handleDescend = () => {
    setIsDescending(true);
    setNavigationState(NavigationState.DESCENDING);
  };

  const handleDescentComplete = () => {
    setNavigationState(NavigationState.PLATFORM);
    // Navigate to platform after descent animation
    setTimeout(() => {
      router.push('/platform');
    }, 500);
  };

  const splineSceneUrl = "https://prod.spline.design/DNj4ME98pq5OHLLH/scene.splinecode";

  return (
    <DescendTransition 
      isActive={isDescending} 
      onComplete={handleDescentComplete}
    >
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
          {/* Enhanced radial gradients */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at center, rgba(20, 20, 20, 0.8) 0%, rgba(8, 8, 8, 1) 70%),
                        radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.05) 0%, transparent 50%),
                        #0a0a0a`
          }} />
          
          {/* Enhanced animated stars */}
          <div className="absolute inset-0 opacity-40">
            <div 
              className="absolute inset-0 animate-star-field"
              style={{
                backgroundImage: `
                  radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.15), transparent),
                  radial-gradient(2px 2px at 40px 70px, rgba(239, 68, 68, 0.1), transparent),
                  radial-gradient(1px 1px at 90px 40px, rgba(59, 130, 246, 0.08), transparent),
                  radial-gradient(1px 1px at 130px 80px, rgba(220, 38, 127, 0.06), transparent),
                  radial-gradient(3px 3px at 160px 120px, rgba(255, 255, 255, 0.05), transparent)
                `,
                backgroundRepeat: 'repeat',
                backgroundSize: '200px 200px'
              }}
            />
          </div>
        </div>

        {/* Floating Navigation */}
        <FloatingNavigation variant="landing" />

        {/* Hero Section with 3D Spline */}
        <main className="relative z-10">
          <div className="ambient-glow"></div>
          
          {/* 3D Spline Scene Container */}
          <div className="relative h-screen w-full">
            <SplineInteraction 
              onDescend={handleDescend}
              splineSceneUrl={splineSceneUrl}
              enableInteractions={navigationState === NavigationState.LANDING}
              className="absolute inset-0 z-0"
            />
            
            {/* Enhanced Hero Content Overlay - Only show on landing */}
            {navigationState === NavigationState.LANDING && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="text-center space-y-6 max-w-4xl mx-auto px-6">
                  <div className="intelligence-badge pointer-events-auto">
                    Intelligence Platform
                  </div>
                  
                  <h1 className="hero-title">
                    <span className="glow-red">HADES</span>
                  </h1>
                  
                  <p className="subtitle-glow text-center max-w-2xl mx-auto">
                    Hunt alpha before it hits social
                  </p>
                  
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Cross-chain intelligence aggregation for the next generation of traders and protocols.
                    Descend into the intelligence layer where opportunities surface before they reach the masses.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Enhanced Features Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="features-title text-center fade-in-up">
              <span className="glow-red">Intelligence</span> <span className="white-text">Features</span>
            </h2>
            
            {/* Enhanced Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {/* Real-time Scanning */}
              <EnhancedDashboardCard
                title="Real-time Scanning"
                value="1,247"
                subtitle="Tokens monitored across 12 chains"
                icon={Radar}
                iconColor="text-red-500"
                iconBgColor="bg-red-500/20"
                trend={{ value: "+24 today", isPositive: true }}
                className="fade-in-up delay-1"
              />
              
              {/* Risk Assessment */}
              <EnhancedDashboardCard
                title="Risk Verification"
                value="89"
                subtitle="Active security assessments"
                icon={ShieldCheck}
                iconColor="text-yellow-500"
                iconBgColor="bg-yellow-500/20"
                trend={{ value: "98% accuracy", isPositive: true }}
                className="fade-in-up delay-2"
              />
              
              {/* Alpha Intelligence */}
              <EnhancedDashboardCard
                title="Alpha Intelligence"
                value="156"
                subtitle="High-conviction signals"
                icon={Zap}
                iconColor="text-red-500"
                iconBgColor="bg-red-500/20"
                trend={{ value: "+12 signals", isPositive: true }}
                className="fade-in-up delay-3"
              />
            </div>
          </div>
        </section>

        {/* Enhanced Integration Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="planetary-interface p-12">
              <CardContent className="space-y-6">
                <h3 className="text-3xl font-bold text-white mb-6">
                  Seamless <span className="glow-red">Jupiter Integration</span>
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  HADES intelligence flows directly into your Jupiter swap interface, 
                  providing contextual insights without disrupting your trading flow.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/platform" className="pointer-events-auto">
                    <Button className="cta-primary text-lg px-8 py-4">
                      <span>Explore Integration</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/platform/alpha-signals" className="pointer-events-auto">
                    <Button className="cta-secondary text-lg px-8 py-4">
                      <span>Access Alpha Feed</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enhanced Chain Support Section */}
        <section className="relative z-10 px-6 py-20 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {/* Solana */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Solana</h3>
                  <p className="text-gray-400 text-sm">High-speed monitoring</p>
                </div>
              </div>
              
              {/* Base */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Circle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Base</h3>
                  <p className="text-gray-400 text-sm">Q4 &#39;25</p>
                </div>
              </div>
              
              {/* Ethereum */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Diamond className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Ethereum</h3>
                  <p className="text-gray-400 text-sm">Q4 &#39;25</p>
                </div>
              </div>
              
              {/* Multi-Chain */}
              <div className="flex flex-col items-center space-y-4 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Multi-Chain</h3>
                  <p className="text-gray-400 text-sm">Q1 &#39;26</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Final CTA Section */}
        <section className="relative z-10 px-6 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Access the <span className="glow-red">Underworld</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join the intelligence network that moves beneath the surface of the markets
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/platform/alpha-signals">
                <Button className="cta-primary text-lg px-8 py-4">
                  <span>Access Alpha Feed →</span>
                </Button>
              </Link>
              
              <Link href="/platform">
                <Button className="cta-secondary text-lg px-8 py-4">
                  <span>Launch Platform</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="relative z-10 bg-black/50 border-t border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-4 gap-12">
              {/* HADES Brand */}
              <div className="md:col-span-1">
                <h3 className="text-2xl font-bold glow-red mb-4">HADES</h3>
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
                  <li><Link href="/platform/intelligence-feed" className="text-gray-400 hover:text-red-500 transition-colors">Intelligence Hub</Link></li>
                  <li><Link href="/platform/search-tokens" className="text-gray-400 hover:text-red-500 transition-colors">Token Search</Link></li>
                  <li><Link href="/platform/alpha-signals" className="text-gray-400 hover:text-red-500 transition-colors">Alpha Feed</Link></li>
                  <li><Link href="/platform" className="text-gray-400 hover:text-red-500 transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              
              {/* Resources Links */}
              <div>
                <h4 className="text-white font-semibold mb-6">Resources</h4>
                <ul className="space-y-3">
                  <li><Link href="#documentation" className="text-gray-400 hover:text-red-500 transition-colors">Documentation</Link></li>
                  <li><Link href="#api-reference" className="text-gray-400 hover:text-red-500 transition-colors">API Reference</Link></li>
                  <li><Link href="#support-center" className="text-gray-400 hover:text-red-500 transition-colors">Support Center</Link></li>
                  <li><Link href="#system-status" className="text-gray-400 hover:text-red-500 transition-colors">System Status</Link></li>
                </ul>
              </div>
              
              {/* Community Links */}
              <div>
                <h4 className="text-white font-semibold mb-6">Community</h4>
                <ul className="space-y-3">
                  <li><Link href="#telegram" className="text-gray-400 hover:text-red-500 transition-colors">Telegram</Link></li>
                  <li><Link href="#twitter" className="text-gray-400 hover:text-red-500 transition-colors">Twitter</Link></li>
                  <li><Link href="#discord" className="text-gray-400 hover:text-red-500 transition-colors">Discord</Link></li>
                  <li><Link href="#github" className="text-gray-400 hover:text-red-500 transition-colors">GitHub</Link></li>
                </ul>
              </div>
            </div>
            
            {/* Footer Bottom */}
            <div className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © 2024 HADES Intelligence Platform. Forged in the shadows of Jupiter.
              </p>
              
              <div className="flex space-x-6 text-sm">
                <Link href="#privacy" className="text-gray-500 hover:text-red-500 transition-colors">Privacy Policy</Link>
                <Link href="#terms" className="text-gray-500 hover:text-red-500 transition-colors">Terms of Service</Link>
                <Link href="#cookies" className="text-gray-500 hover:text-red-500 transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </DescendTransition>
  );
}