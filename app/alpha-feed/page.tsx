'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';



export default function AlphaFeedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the platform version for consistency
    router.replace('/platform/alpha-signals');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-red-500 font-semibold">Redirecting to Alpha Signals...</div>
      </div>
    </div>
  );
}
