import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Type, Sparkles, Bell, Megaphone, Zap, Info, AlertCircle, Radio } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

const ICON_OPTIONS = [
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'bell', label: 'Bell', icon: Bell },
  { value: 'megaphone', label: 'Megaphone', icon: Megaphone },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'info', label: 'Info', icon: Info },
  { value: 'alert-circle', label: 'Alert', icon: AlertCircle },
  { value: 'radio', label: 'Radio', icon: Radio },
];

export function AdminTicker() {
  const [settings, setSettings] = useState({
    mode: 'default',
    manual_text: '',
    icon: 'sparkles',
    badge_text: 'Latest News',
    is_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [featuredNews, setFeaturedNews] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tickerRes, newsRes] = await Promise.all([
        apiService.getTickerSettings(),
        apiService.getNews({ limit: 5 }),
      ]);
      setSettings(tickerRes.data);
      setFeaturedNews(newsRes.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.updateTickerSettings(settings);
      toast.success('Ticker settings updated!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const getPreviewText = () => {
    if (settings.mode === 'manual') {
      return settings.manual_text || 'Enter your custom text...';
    }
    return featuredNews.map(n => n.title).join(' ✦ ') || 'No featured news available';
  };

  const SelectedIcon = ICON_OPTIONS.find(i => i.value === settings.icon)?.icon || Sparkles;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 rounded animate-pulse w-1/3" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div data-testid="admin-ticker">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ticker Banner Settings</h1>
          <p className="text-slate-500 mt-1">Configure the running text banner at the bottom of the page</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0C765B] hover:bg-[#095E49]"
          data-testid="save-ticker-btn"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Enable Ticker Banner</h3>
                <p className="text-sm text-slate-500">Show or hide the running text banner</p>
              </div>
              <Switch
                checked={settings.is_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, is_enabled: checked })}
                data-testid="toggle-ticker-enabled"
              />
            </div>
          </div>

          {/* Mode Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <Type className="w-5 h-5 mr-2 text-[#0C765B]" />
              Content Mode
            </h3>
            <div className="space-y-3">
              <label
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  settings.mode === 'default'
                    ? 'border-[#0C765B] bg-[#0C765B]/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSettings({ ...settings, mode: 'default' })}
              >
                <input
                  type="radio"
                  name="mode"
                  value="default"
                  checked={settings.mode === 'default'}
                  onChange={() => setSettings({ ...settings, mode: 'default' })}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  settings.mode === 'default' ? 'border-[#0C765B]' : 'border-slate-300'
                }`}>
                  {settings.mode === 'default' && (
                    <div className="w-3 h-3 rounded-full bg-[#0C765B]" />
                  )}
                </div>
                <div>
                  <span className="font-medium text-slate-900">Default Mode</span>
                  <p className="text-sm text-slate-500">Automatically shows featured news titles</p>
                </div>
              </label>

              <label
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  settings.mode === 'manual'
                    ? 'border-[#0C765B] bg-[#0C765B]/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSettings({ ...settings, mode: 'manual' })}
              >
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  checked={settings.mode === 'manual'}
                  onChange={() => setSettings({ ...settings, mode: 'manual' })}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  settings.mode === 'manual' ? 'border-[#0C765B]' : 'border-slate-300'
                }`}>
                  {settings.mode === 'manual' && (
                    <div className="w-3 h-3 rounded-full bg-[#0C765B]" />
                  )}
                </div>
                <div>
                  <span className="font-medium text-slate-900">Manual Mode</span>
                  <p className="text-sm text-slate-500">Enter custom text to display</p>
                </div>
              </label>
            </div>
          </div>

          {/* Manual Text Input */}
          {settings.mode === 'manual' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Custom Text</h3>
              <Input
                value={settings.manual_text}
                onChange={(e) => setSettings({ ...settings, manual_text: e.target.value })}
                placeholder="Enter your custom ticker text here..."
                className="mb-2"
                data-testid="manual-text-input"
              />
              <p className="text-xs text-slate-500">
                This text will scroll continuously. Keep it concise but informative.
              </p>
            </motion.div>
          )}

          {/* Badge & Icon */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Badge & Icon</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Badge Text</label>
                <Input
                  value={settings.badge_text}
                  onChange={(e) => setSettings({ ...settings, badge_text: e.target.value })}
                  placeholder="Latest News"
                  data-testid="badge-text-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSettings({ ...settings, icon: option.value })}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                        settings.icon === option.value
                          ? 'border-[#0C765B] bg-[#0C765B]/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      data-testid={`icon-${option.value}`}
                    >
                      <option.icon className={`w-5 h-5 ${
                        settings.icon === option.value ? 'text-[#0C765B]' : 'text-slate-500'
                      }`} />
                      <span className="text-xs mt-1 text-slate-600">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Live Preview</h3>
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              {settings.is_enabled ? (
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-500 px-4 py-3 flex items-center space-x-2">
                    <SelectedIcon className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm whitespace-nowrap">
                      {settings.badge_text || 'Latest News'}
                    </span>
                  </div>
                  <div className="overflow-hidden flex-1 py-3">
                    <div className="whitespace-nowrap animate-pulse">
                      <span className="text-white/90 text-sm px-4">
                        {getPreviewText()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400">
                  Ticker banner is disabled
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              The banner appears at the bottom of the page after scrolling past the hero section
            </p>
          </div>

          {/* Current Featured News */}
          {settings.mode === 'default' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mt-6">
              <h3 className="font-semibold text-slate-900 mb-4">Current Featured News</h3>
              <div className="space-y-2">
                {featuredNews.length > 0 ? (
                  featuredNews.map((news, index) => (
                    <div key={news.id} className="flex items-center text-sm">
                      <span className="w-6 h-6 rounded-full bg-[#0C765B]/10 text-[#0C765B] flex items-center justify-center text-xs font-medium mr-2">
                        {index + 1}
                      </span>
                      <span className="text-slate-700 truncate">{news.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No news articles found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTicker;
