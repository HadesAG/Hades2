'use client';

import { useState, useEffect } from 'react';
import { NavigationState } from '@/app/hadesMockData';

interface DescendTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  children: React.ReactNode;
}

export function DescendTransition({ 
  isActive, 
  onComplete, 
  children 
}: DescendTransitionProps) {
  const [stage, setStage] = useState<'idle' | 'descending' | 'complete'>('idle');

  useEffect(() => {
    if (isActive && stage === 'idle') {
      setStage('descending');
      
      // Complete the transition after animation
      const timer = setTimeout(() => {
        setStage('complete');
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive, stage, onComplete]);

  if (stage === 'idle') {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Descending overlay */}
      <div className={`fixed inset-0 z-50 transition-all duration-2000 ${
        stage === 'descending' 
          ? 'bg-gradient-to-b from-transparent via-black/50 to-black opacity-100' 
          : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-white animate-pulse">
              Descending...
            </div>
            <div className="text-lg text-gray-300">
              Entering the Intelligence Layer
            </div>
            
            {/* Animated descent indicator */}
            <div className="flex justify-center">
              <div className="w-1 h-32 bg-gradient-to-b from-red-500 to-transparent animate-pulse">
                <div className="w-full h-4 bg-red-500 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
}