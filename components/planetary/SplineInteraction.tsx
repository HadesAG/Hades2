'use client';

import { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles, Target } from 'lucide-react';

interface SplineInteractionProps {
  onDescend: () => void;
  splineSceneUrl: string;
  enableInteractions?: boolean;
  className?: string;
}

export function SplineInteraction({ 
  onDescend, 
  splineSceneUrl, 
  enableInteractions = true,
  className = ""
}: SplineInteractionProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDescendButton, setShowDescendButton] = useState(false);
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
    
    // Show descend button after spline loads
    setTimeout(() => setShowDescendButton(true), 1000);
    
    // Reduce quality on mobile for better performance
    if (isMobile && spline.setQuality) {
      spline.setQuality(0.6);
    }
  };

  // Throttled mouse interactions for better performance
  const throttleTimeout = useRef<NodeJS.Timeout>();
  
  const onSplineMouseDown = (e: any) => {
    if (isMobile || !enableInteractions) return;
    
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
    if (isMobile || !enableInteractions) return;
    
    // Simplified cursor change
    if (containerRef.current && !throttleTimeout.current) {
      containerRef.current.style.cursor = e.target ? 'pointer' : 'default';
    }
  };

  const onSplineMouseUp = (e: any) => {
    if (isMobile || !enableInteractions) return;
    
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default';
    }
  };

  // Simplified animation trigger for performance
  const triggerSceneAnimation = (eventType: string, objectName?: string) => {
    if (isMobile || !enableInteractions) return;
    
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

  const handleDescend = () => {
    // Trigger planetary descent animation if possible
    triggerSceneAnimation('mouseDown', 'MainObject');
    
    // Call the onDescend callback
    setTimeout(() => {
      onDescend();
    }, 300);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {shouldLoad ? (
        <>
          <Spline 
            scene={splineSceneUrl}
            className="w-full h-full"
            onLoad={onSplineLoad}
            onMouseDown={onSplineMouseDown}
            onMouseMove={onSplineMouseHover}
            onMouseUp={onSplineMouseUp}
          />
          
          {/* Interactive overlay with subtle controls - desktop only */}
          {isInteractive && !isMobile && enableInteractions && (
            <div className="absolute top-4 right-4 z-20 space-y-2 opacity-75">
              <button
                onClick={() => triggerSceneAnimation('mouseHover', 'MainObject')}
                className="bg-black/20 backdrop-blur-sm text-white/60 px-2 py-1 rounded text-xs hover:bg-black/40 hover:text-white transition-colors duration-200"
                title="Trigger hover animation"
              >
                <Sparkles className="w-3 h-3" />
              </button>
              <button
                onClick={() => triggerSceneAnimation('mouseDown', 'MainObject')}
                className="bg-black/20 backdrop-blur-sm text-white/60 px-2 py-1 rounded text-xs hover:bg-black/40 hover:text-white transition-colors duration-200"
                title="Trigger click animation"
              >
                <Target className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Descend Button */}
          {showDescendButton && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
              <Button
                onClick={handleDescend}
                className="descend-button group relative overflow-hidden px-8 py-4 text-lg font-semibold"
                size="lg"
              >
                <div className="flex items-center space-x-3">
                  <span>Descend</span>
                  <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-3 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
            <div className="text-red-400 text-sm font-medium">
              {isLoading ? 'Loading Planetary Interface...' : 'Preparing Experience...'}
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