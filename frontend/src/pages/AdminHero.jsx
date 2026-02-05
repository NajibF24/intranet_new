import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Type, Link as LinkIcon, Eye, Sparkles, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

export const AdminHero = () => {
  const [settings, setSettings] = useState({
    hero_image_url: '',
    hero_title_line1: '',
    hero_title_line2: '',
    hero_subtitle: '',
    hero_cta1_text: '',
    hero_cta1_link: '',
    hero_cta2_text: '',
    hero_cta2_link: '',
    show_particles: true,
    show_gradient_overlay: true,
    show_floating_cards: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiService.getHeroSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.updateHeroSettings(settings);
      toast.success('Hero settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update hero settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 w-48 rounded" />
        <div className="h-64 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div data-testid="admin-hero">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hero Settings</h1>
          <p className="text-slate-500 mt-1">Customize the homepage hero section</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </a>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0C765B] hover:bg-[#095E49]"
            data-testid="save-hero-btn"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <div className="space-y-6">
          {/* Background Image */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-[#0C765B]" />
              Background Image
            </h3>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Image URL</label>
              <Input
                value={settings.hero_image_url}
                onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
                placeholder="https://example.com/hero-image.jpg"
                data-testid="hero-image-input"
              />
              <p className="text-xs text-slate-500 mt-2">
                Recommended: High-resolution steel/industrial image (1920x1080 or larger)
              </p>
            </div>
          </div>

          {/* Title Text */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <Type className="w-5 h-5 mr-2 text-[#0C765B]" />
              Hero Text
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Title Line 1</label>
                <Input
                  value={settings.hero_title_line1}
                  onChange={(e) => setSettings({ ...settings, hero_title_line1: e.target.value })}
                  placeholder="Building Indonesia's"
                  data-testid="hero-title1-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Title Line 2 (Highlighted)</label>
                <Input
                  value={settings.hero_title_line2}
                  onChange={(e) => setSettings({ ...settings, hero_title_line2: e.target.value })}
                  placeholder="Steel Future"
                  data-testid="hero-title2-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Subtitle</label>
                <textarea
                  value={settings.hero_subtitle}
                  onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                  placeholder="Company description..."
                  className="w-full h-24 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C765B]/20 focus:border-[#0C765B]"
                  data-testid="hero-subtitle-input"
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <LinkIcon className="w-5 h-5 mr-2 text-[#0C765B]" />
              Call-to-Action Buttons
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Button 1 Text</label>
                  <Input
                    value={settings.hero_cta1_text}
                    onChange={(e) => setSettings({ ...settings, hero_cta1_text: e.target.value })}
                    placeholder="Latest News"
                    data-testid="hero-cta1-text-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Button 1 Link</label>
                  <Input
                    value={settings.hero_cta1_link}
                    onChange={(e) => setSettings({ ...settings, hero_cta1_link: e.target.value })}
                    placeholder="#news"
                    data-testid="hero-cta1-link-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Button 2 Text</label>
                  <Input
                    value={settings.hero_cta2_text}
                    onChange={(e) => setSettings({ ...settings, hero_cta2_text: e.target.value })}
                    placeholder="Employee Directory"
                    data-testid="hero-cta2-text-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Button 2 Link</label>
                  <Input
                    value={settings.hero_cta2_link}
                    onChange={(e) => setSettings({ ...settings, hero_cta2_link: e.target.value })}
                    placeholder="#directory"
                    data-testid="hero-cta2-link-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Live Preview</h3>
          <div className="relative rounded-xl overflow-hidden aspect-video">
            {/* Background */}
            <img
              src={settings.hero_image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800'}
              alt="Hero preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-center">
              <h2 className="text-white text-2xl font-bold mb-1" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                {settings.hero_title_line1 || 'Building Indonesia\'s'}
              </h2>
              <h2 className="text-amber-400 text-2xl font-bold mb-3" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                {settings.hero_title_line2 || 'Steel Future'}
              </h2>
              <p className="text-white/80 text-sm mb-4 max-w-xs line-clamp-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {settings.hero_subtitle || 'Company description goes here...'}
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-[#0C765B] text-white text-xs rounded-lg font-medium">
                  {settings.hero_cta1_text || 'Button 1'}
                </span>
                <span className="px-3 py-1.5 bg-white/20 text-white text-xs rounded-lg font-medium border border-white/30">
                  {settings.hero_cta2_text || 'Button 2'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
