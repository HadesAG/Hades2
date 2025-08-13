'use client';

import { PrivyClientProvider } from '@/lib/privy-provider';
import { AuthProvider } from '@/contexts/auth-context';

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyClientProvider>
      <AuthProvider>{children}</AuthProvider>
    </PrivyClientProvider>
  );
}