'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';

export function LoginButton() {
  const { login } = usePrivy();

  return (
    <Button
      onClick={login}
      className="bg-[#ff6b35] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#ff5722] transition"
    >
      Login
    </Button>
  );
}