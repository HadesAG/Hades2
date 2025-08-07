// Mock data for HADES platform redesign

// Enums for the HADES platform design system
export enum NavigationState {
  LANDING = 'landing',
  DESCENDING = 'descending', 
  PLATFORM = 'platform'
}

export enum InteractionMode {
  HOVER = 'hover',
  CLICK = 'click',
  DESCEND = 'descend'
}

export enum PlatformSection {
  DASHBOARD = 'dashboard',
  SEARCH = 'search-tokens',
  ALPHA_SIGNALS = 'alpha-signals',
  INTELLIGENCE = 'intelligence-feed',
  WATCHLIST = 'watchlist',
  MARKET_ANALYSIS = 'market-analysis',
  ALERTS = 'alerts',
  SETTINGS = 'settings'
}

export enum ThemeVariant {
  SPACE = 'space',
  PLANETARY = 'planetary',
  UNDERWORLD = 'underworld'
}

// Type definitions for HADES platform redesign
export interface PlatformProps {
  initialNavigationState: NavigationState;
  splineSceneUrl: string;
  enableInteractions: boolean;
  showDescendButton: boolean;
  platformSections: PlatformSectionData[];
}

export interface SplineInteractionProps {
  onDescend: () => void;
  onHover: (target: string) => void;
  onClick: (target: string) => void;
  isLoading: boolean;
}

export interface DashboardMetricsProps {
  tokensTracked: number;
  activeSignals: number;
  chainsMonitored: number;
  alertsPending: number;
  reportsGenerated: number;
  warningsActive: number;
  newTokensDetected: number;
}

export interface PlatformSectionData {
  id: PlatformSection;
  title: string;
  description: string;
}

// Data for global state store
export const mockStore = {
  navigationState: NavigationState.LANDING as const,
  currentSection: PlatformSection.DASHBOARD as const,
  isDescending: false,
  splineLoaded: false,
  userAuthenticated: false,
  platformMetrics: {
    tokensTracked: 1247,
    activeSignals: 89,
    chainsMonitored: 12,
    alertsPending: 8,
    reportsGenerated: 42,
    warningsActive: 3,
    newTokensDetected: 67
  }
};

// Data returned by API queries
export const mockQuery = {
  marketStats: {
    activeTokens: 1247,
    totalVolume: 2847392847,
    topGainers: 156,
    newListings: 24
  },
  alphaSignals: [
    {
      id: "signal-1",
      tokenSymbol: "ALPHA",
      chain: "solana",
      strength: 0.85,
      timestamp: new Date("2024-01-15T10:30:00Z"),
      type: "new_listing"
    },
    {
      id: "signal-2", 
      tokenSymbol: "BETA",
      chain: "ethereum",
      strength: 0.72,
      timestamp: new Date("2024-01-15T09:45:00Z"),
      type: "volume_spike"
    }
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  initialNavigationState: NavigationState.LANDING as const,
  splineSceneUrl: "https://prod.spline.design/DNj4ME98pq5OHLLH/scene.splinecode",
  enableInteractions: true,
  showDescendButton: true,
  platformSections: [
    {
      id: PlatformSection.DASHBOARD,
      title: "Dashboard",
      description: "Intelligence overview and metrics"
    },
    {
      id: PlatformSection.SEARCH,
      title: "Search Tokens", 
      description: "Token discovery and analysis"
    },
    {
      id: PlatformSection.ALPHA_SIGNALS,
      title: "Alpha Signals",
      description: "Real-time opportunity alerts"
    }
  ]
};