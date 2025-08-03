'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          saveMessage.type === 'success' 
            ? 'bg-green-900/20 border border-green-700 text-green-300' 
            : 'bg-red-900/20 border border-red-700 text-red-300'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{saveMessage.message}</span>
        </div>
      )}

      {/* Settings Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Configure your HADES platform preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-2">
            <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
              <DollarSign className="h-4 w-4 mr-2" />
              Trading
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
              <Shield className="h-4 w-4 mr-2" />
              API
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
              <Eye className="h-4 w-4 mr-2" />
              Privacy
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Profile Information */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Username</label>
                  <Input
                    value={settings.username}
                    onChange={(e) => handleSettingChange('username', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Email</label>
                  <Input
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Timezone</label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="UTC-8 (PST)">UTC-8 (PST)</SelectItem>
                      <SelectItem value="UTC-5 (EST)">UTC-5 (EST)</SelectItem>
                      <SelectItem value="UTC+0 (GMT)">UTC+0 (GMT)</SelectItem>
                      <SelectItem value="UTC+1 (CET)">UTC+1 (CET)</SelectItem>
                      <SelectItem value="UTC+8 (CST)">UTC+8 (CST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Currency</label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="USD ($)">USD ($)</SelectItem>
                      <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                      <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                      <SelectItem value="JPY (¥)">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Display Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Theme</label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="Dark">Dark</SelectItem>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Number Format</label>
                  <Select value={settings.numberFormat} onValueChange={(value) => handleSettingChange('numberFormat', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="Compact (1.2M)">Compact (1.2M)</SelectItem>
                      <SelectItem value="Full (1,200,000)">Full (1,200,000)</SelectItem>
                      <SelectItem value="Scientific (1.2e6)">Scientific (1.2e6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { key: 'priceAlerts', label: 'Price Alerts', description: 'Get notified when token prices hit your targets' },
                  { key: 'volumeAlerts', label: 'Volume Alerts', description: 'Notifications for unusual volume activity' },
                  { key: 'signalNotifications', label: 'Alpha Signals', description: 'Real-time notifications for new alpha signals' },
                  { key: 'emailDigest', label: 'Daily Email Digest', description: 'Summary of market activity and your portfolio' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{label}</div>
                      <div className="text-sm text-slate-400">{description}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={settings[key as keyof typeof settings] ? 'default' : 'outline'}
                      onClick={() => handleSettingChange(key, !settings[key as keyof typeof settings])}
                      className={
                        settings[key as keyof typeof settings]
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      }
                    >
                      {settings[key as keyof typeof settings] ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trading Settings */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Default Slippage (%)</label>
                <Input
                  value={settings.defaultSlippage}
                  onChange={(e) => handleSettingChange('defaultSlippage', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0.5"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="text-white font-medium">Auto-approve transactions</div>
                  <div className="text-sm text-slate-400">Automatically approve transactions under $100</div>
                </div>
                <Button
                  size="sm"
                  variant={settings.autoApprove ? 'default' : 'outline'}
                  onClick={() => handleSettingChange('autoApprove', !settings.autoApprove)}
                  className={
                    settings.autoApprove
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }
                >
                  {settings.autoApprove ? 'ON' : 'OFF'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Helius API Key</label>
                <Input
                  type="password"
                  value={settings.heliusApiKey}
                  onChange={(e) => handleSettingChange('heliusApiKey', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your Helius API key for enhanced data"
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Telegram Bot Token</label>
                <Input
                  type="password"
                  value={settings.telegramBotToken}
                  onChange={(e) => handleSettingChange('telegramBotToken', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your Telegram bot token for alerts"
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { key: 'shareData', label: 'Share anonymized data', description: 'Help improve HADES by sharing anonymous usage data' },
                  { key: 'analytics', label: 'Analytics tracking', description: 'Allow analytics to improve your experience' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{label}</div>
                      <div className="text-sm text-slate-400">{description}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={settings[key as keyof typeof settings] ? 'default' : 'outline'}
                      onClick={() => handleSettingChange(key, !settings[key as keyof typeof settings])}
                      className={
                        settings[key as keyof typeof settings]
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      }
                    >
                      {settings[key as keyof typeof settings] ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
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
              className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}