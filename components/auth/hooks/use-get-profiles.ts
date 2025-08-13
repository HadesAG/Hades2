'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface Profile {
  id: string;
  username: string;
  walletAddress: string;
  createdAt: string;
  updatedAt: string;
  isOG?: boolean;
  ogReason?: string;
}

interface UseGetProfilesResult {
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getProfileByUsername: (username: string) => Profile | null;
  getProfileByWallet: (walletAddress: string) => Profile | null;
}

export function useGetProfiles(): UseGetProfilesResult {
  const { ready, authenticated } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!ready || !authenticated) {
      setProfiles([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would fetch from your API
      // const response = await fetch('/api/profiles');
      // if (!response.ok) {
      //   throw new Error('Failed to fetch profiles');
      // }
      // const data = await response.json();
      // setProfiles(data.profiles || []);

      // For now, return empty array as no profiles API exists yet
      setProfiles([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profiles';
      setError(errorMessage);
      console.error('Error fetching profiles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ready, authenticated]);

  // Auto-fetch profiles when auth state changes
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Helper function to get profile by username
  const getProfileByUsername = useCallback((username: string): Profile | null => {
    return profiles.find(profile => profile.username.toLowerCase() === username.toLowerCase()) || null;
  }, [profiles]);

  // Helper function to get profile by wallet address
  const getProfileByWallet = useCallback((walletAddress: string): Profile | null => {
    return profiles.find(profile => profile.walletAddress === walletAddress) || null;
  }, [profiles]);

  return {
    profiles,
    isLoading,
    error,
    refetch: fetchProfiles,
    getProfileByUsername,
    getProfileByWallet
  };
}

// Hook for getting a single profile by username
export function useGetProfile(username: string | null) {
  const { getProfileByUsername, isLoading, error, refetch } = useGetProfiles();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (username) {
      const foundProfile = getProfileByUsername(username);
      setProfile(foundProfile);
    } else {
      setProfile(null);
    }
  }, [username, getProfileByUsername]);

  return {
    profile,
    isLoading,
    error,
    refetch
  };
}

// Hook for getting a profile by wallet address
export function useGetProfileByWallet(walletAddress: string | null) {
  const { getProfileByWallet, isLoading, error, refetch } = useGetProfiles();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (walletAddress) {
      const foundProfile = getProfileByWallet(walletAddress);
      setProfile(foundProfile);
    } else {
      setProfile(null);
    }
  }, [walletAddress, getProfileByWallet]);

  return {
    profile,
    isLoading,
    error,
    refetch
  };
}
