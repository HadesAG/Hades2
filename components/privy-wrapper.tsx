'use client';

import { useEffect, useState } from 'react';
import { PrivyClientProvider } from '@/lib/privy-provider';
import { AuthProvider } from '@/contexts/auth-context';

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always wrap with PrivyClientProvider and AuthProvider
  // PrivyClientProvider handles SSR gracefully internally
  return (
    <PrivyClientProvider>
      <AuthProvider>{children}</AuthProvider>
    </PrivyClientProvider>
  );
}