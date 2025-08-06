'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthGuard } from '@/components/auth/auth-guard';
import { usePrivy } from '@privy-io/react-auth';
import { settingsApi } from '@/lib/api-client';
import { 
  User, 
  Bell, 
  DollarSign, 
  Shield, 
  Eye,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = usePrivy();
  const [settings, setSettings] = useState({
    // Profile
    username: 'hades_trader',
    email: user?.email?.address || 'trader@hades.io',
    timezone: 'UTC-8 (PST)',
    currency: 'USD ($)',
    
    // Display
    theme: 'Dark',
    numberFormat: 'Compact (1.2M)',
    
    // Notifications
    priceAlerts: true,
    volumeAlerts: true,
    signalNotifications: true,
    emailDigest: false,
    
    // Trading
    defaultSlippage: '0.5',
    autoApprove: false,
    
    // API
    heliusApiKey: '',
    telegramBotToken: '',
    
    // Privacy
    shareData: false,
    analytics: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState('Profile');

  // Load settings from backend on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;
      
      try {
        const { settings: userSettings } = await settingsApi.getSettings(user.id);
        setSettings(userSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
        setSaveMessage({
          type: 'error',
          message: 'Failed to load settings. Using defaults.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user?.id]);

  // Clear save message after 3 seconds
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // Clear any existing save message when user makes changes
    if (saveMessage) setSaveMessage(null);
  };

  const saveSettings = async () => {
    if (!user?.id) {
      setSaveMessage({
        type: 'error',
        message: 'Please log in to save settings.'
      });
      return;
    }

    try {
      setSaving(true);
      await settingsApi.saveSettings(user.id, settings);
      setSaveMessage({
        type: 'success',
        message: 'Settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      ...settings,
      // Profile (keep user-specific data)
      timezone: 'UTC-8 (PST)',
      currency: 'USD ($)',
      
      // Display
      theme: 'Dark',
      numberFormat: 'Compact (1.2M)',
      
      // Notifications
      priceAlerts: true,
      volumeAlerts: true,
      signalNotifications: true,
      emailDigest: false,
      
      // Trading
      defaultSlippage: '0.5',
      autoApprove: false,
      
      // Privacy
      shareData: false,
      analytics: true,
    };
    
    setSettings(defaultSettings);
    setSaveMessage({
      type: 'success',
      message: 'Settings reset to defaults. Click Save to apply changes.'
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard 
      requireAuth={true}
      fallbackTitle="Settings Access Required"
      fallbackDescription="Connect your Solana wallet or sign in with email to access your personal settings and configure your HADES experience."
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Configure your HADES platform preferences</p>
          </div>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                saveMessage.type === 'success' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {saveMessage.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{saveMessage.message}</span>
              </div>
            )}
            <Button 
              onClick={saveSettings} 
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="tab-nav flex border-b border-[#2a3441] mb-8">
          {['Profile', 'Notifications', 'Trading', 'API', 'Privacy'].map(tab => (
            <button
              key={tab}
              className={`tab-item px-6 py-4 text-base font-medium transition-all ${activeTab === tab ? 'active bg-[#ff6b35] text-white rounded-t-lg border-b-2 border-[#ff6b35]' : 'text-[#8b949e]'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div>
          {activeTab === 'Profile' && (
            <div className="settings-section bg-[#242938] rounded-xl p-6 border border-[#2a3441] mb-6">
              <div className="section-title flex items-center gap-2 text-lg font-semibold mb-6 text-white">
                <i className="lucide lucide-user w-5 h-5 text-[#ff6b35]"></i>
                Profile Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label block text-[#8b949e] mb-2">Username</label>
                  <input type="text" className="form-input w-full bg-[#1a1f2e] border border-[#2a3441] rounded-lg px-4 py-3 text-white" value={settings.username} onChange={e => handleSettingChange('username', e.target.value)} placeholder="Enter username" title="Username" />
                </div>
                <div>
                  <label className="form-label block text-[#8b949e] mb-2">Email</label>
                  <input type="email" className="form-input w-full bg-[#1a1f2e] border border-[#2a3441] rounded-lg px-4 py-3 text-white" value={settings.email} onChange={e => handleSettingChange('email', e.target.value)} placeholder="Enter email" title="Email" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="form-label block text-[#8b949e] mb-2">Timezone</label>
                  <select className="form-select w-full bg-[#1a1f2e] border border-[#2a3441] rounded-lg px-4 py-3 text-white" value={settings.timezone} onChange={e => handleSettingChange('timezone', e.target.value)} title="Timezone">
                    <option value="UTC-8 (PST)">UTC-8 (PST)</option>
                    <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                    <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                    <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                    <option value="UTC+8 (CST)">UTC+8 (CST)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label block text-[#8b949e] mb-2">Currency</label>
                  <select className="form-select w-full bg-[#1a1f2e] border border-[#2a3441] rounded-lg px-4 py-3 text-white" value={settings.currency} onChange={e => handleSettingChange('currency', e.target.value)} title="Currency">
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="BTC (₿)">BTC (₿)</option>
                    <option value="ETH (Ξ)">ETH (Ξ)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Notifications' && (
            <div className="settings-section bg-[#242938] rounded-xl p-6 border border-[#2a3441] mb-6">
              <div className="section-title flex items-center gap-2 text-lg font-semibold mb-6 text-white">
                <i className="lucide lucide-bell w-5 h-5 text-[#ff6b35]"></i>
                Notifications
              </div>
              <div className="space-y-4">
                {[
                  { key: 'priceAlerts', label: 'Price Alerts', description: 'Get notified when token prices hit your targets' },
                  { key: 'volumeAlerts', label: 'Volume Alerts', description: 'Notifications for unusual volume activity' },
                  { key: 'signalNotifications', label: 'Alpha Signals', description: 'Real-time notifications for new alpha signals' },
                  { key: 'emailDigest', label: 'Daily Email Digest', description: 'Summary of market activity and your portfolio' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{label}</div>
                      <div className="text-sm text-gray-400">{description}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={settings[key as keyof typeof settings] ? 'default' : 'outline'}
                      onClick={() => handleSettingChange(key, !settings[key as keyof typeof settings])}
                      className={
                        settings[key as keyof typeof settings]
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      }
                    >
                      {settings[key as keyof typeof settings] ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'Trading' && (
            <div className="settings-section bg-[#242938] rounded-xl p-6 border border-[#2a3441] mb-6">
              <div className="section-title flex items-center gap-2 text-lg font-semibold mb-6 text-white">
                <i className="lucide lucide-dollar-sign w-5 h-5 text-[#ff6b35]"></i>
                Trading
              </div>
              <div>
                <label className="form-label block text-[#8b949e] mb-2">Default Slippage (%)</label>
                <Input
                  value={settings.defaultSlippage}
                  onChange={(e) => handleSettingChange('defaultSlippage', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="0.5"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="text-white font-medium">Auto-approve transactions</div>
                  <div className="text-sm text-gray-400">Automatically approve transactions under $100</div>
                </div>
                <Button
                  size="sm"
                  variant={settings.autoApprove ? 'default' : 'outline'}
                  onClick={() => handleSettingChange('autoApprove', !settings.autoApprove)}
                  className={
                    settings.autoApprove
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  }
                >
                  {settings.autoApprove ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>
          )}
          {activeTab === 'API' && (
            <div className="settings-section bg-[#242938] rounded-xl p-6 border border-[#2a3441] mb-6">
              <div className="section-title flex items-center gap-2 text-lg font-semibold mb-6 text-white">
                <i className="lucide lucide-shield w-5 h-5 text-[#ff6b35]"></i>
                API Configuration
              </div>
              <div>
                <label className="form-label block text-[#8b949e] mb-2">Helius API Key</label>
                <Input
                  type="password"
                  value={settings.heliusApiKey}
                  onChange={(e) => handleSettingChange('heliusApiKey', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter your Helius API key for enhanced data"
                />
              </div>
              
              <div>
                <label className="form-label block text-[#8b949e] mb-2">Telegram Bot Token</label>
                <Input
                  type="password"
                  value={settings.telegramBotToken}
                  onChange={(e) => handleSettingChange('telegramBotToken', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter your Telegram bot token for alerts"
                />
              </div>
            </div>
          )}
          {activeTab === 'Privacy' && (
            <div className="settings-section bg-[#242938] rounded-xl p-6 border border-[#2a3441] mb-6">
              <div className="section-title flex items-center gap-2 text-lg font-semibold mb-6 text-white">
                <i className="lucide lucide-eye w-5 h-5 text-[#ff6b35]"></i>
                Privacy
              </div>
              <div className="space-y-4">
                {[
                  { key: 'shareData', label: 'Share anonymized data', description: 'Help improve HADES by sharing anonymous usage data' },
                  { key: 'analytics', label: 'Analytics tracking', description: 'Allow analytics to improve your experience' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{label}</div>
                      <div className="text-sm text-gray-400">{description}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={settings[key as keyof typeof settings] ? 'default' : 'outline'}
                      onClick={() => handleSettingChange(key, !settings[key as keyof typeof settings])}
                      className={
                        settings[key as keyof typeof settings]
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      }
                    >
                      {settings[key as keyof typeof settings] ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="button-group flex items-center mt-8">
          <Button 
            onClick={saveSettings} 
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
          <Button 
            onClick={resetToDefaults} 
            disabled={saving}
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}