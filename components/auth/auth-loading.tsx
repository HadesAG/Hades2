'use client';

import { Loader2 } from 'lucide-react';

export function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full blur-xl opacity-50 animate-pulse" />
        <div className="relative bg-black rounded-full p-4">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      </div>
      <p className="mt-4 text-gray-400 text-sm animate-pulse">
        Connecting to Solana...
      </p>
    </div>
  );
}

export function FullPageAuthLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full blur-2xl opacity-50 animate-pulse" />
          <div className="relative bg-black rounded-full p-6">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
        </div>
        <h2 className="mt-6 text-xl font-semibold text-white">
          Loading HADES
        </h2>
        <p className="mt-2 text-gray-400 text-sm animate-pulse">
          Initializing Solana connection...
        </p>
      </div>
    </div>
  );
}
