'use client';

import { useEffect, useState } from 'react';
import { PrivyClientProvider } from '@/lib/privy-provider';

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render the provider until we're on the client
  if (!mounted) {
    return <>{children}</>;
  }

  return <PrivyClientProvider>{children}</PrivyClientProvider>;
}