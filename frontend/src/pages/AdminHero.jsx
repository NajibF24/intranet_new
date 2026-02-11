import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Type, Link as LinkIcon, Eye, Sparkles, Upload, Video, Volume2, VolumeX, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

export const AdminHero = () => {
  const [settings, setSettings] = useState({
    hero_image_url: '',
    hero_video_url: '',
    background_type: 'image',
    video_muted: true,
    hero_title_line1: '',
    hero_title_line2: '',
    hero_subtitle: '',
    hero_cta1_text: '',
    hero_cta1_link: '',
    hero_cta2_text: '',
    hero_cta2_link: '',
    show_title: true,
    show_subtitle: true,
    show_cta_buttons: true,
    show_particles: true,
    show_gradient_overlay: true,
    show_floating_cards: true,
    show_welcome_badge: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const videoRef = useRef(null);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiService.uploadPhoto(formData);
      setSettings({ ...settings, hero_image_url: response.data.image_url });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024; // 50MB for video
    if (file.size > maxSize) {
      toast.error('Video size should be less than 50MB');
      return;
    }

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiService.uploadPhoto(formData);
      setSettings({ ...settings, hero_video_url: response.data.image_url });
      toast.success('Video uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploadingVideo(false);
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
          {/* Background Media */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-[#0C765B]" />
              Background Media
            </h3>
            
            <Tabs value={settings.background_type} onValueChange={(v) => setSettings({...settings, background_type: v})}>
              <TabsList className="mb-4">
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4">
                <div>
                  <label className="cursor-pointer block">
                    <div className="flex items-center justify-center px-4 py-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-[#0C765B]/50 transition-colors">
                      <Upload className="w-5 h-5 mr-2 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-2">
                    Recommended: 1920x1080px (16:9), max 5MB, JPG/PNG/WebP
                  </p>
                </div>
                {settings.hero_image_url && (
                  <div className="relative">
                    <img
                      src={settings.hero_image_url}
                      alt="Hero preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setSettings({...settings, hero_image_url: ''})}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div>
                  <label className="cursor-pointer block">
                    <div className="flex items-center justify-center px-4 py-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-[#0C765B]/50 transition-colors">
                      <Upload className="w-5 h-5 mr-2 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {uploadingVideo ? 'Uploading...' : 'Click to upload video'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={uploadingVideo}
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-2">
                    Recommended: 1920x1080px, MP4/WebM, max 50MB, 24-30fps, 5-10 seconds loop
                  </p>
                </div>
                {settings.hero_video_url && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={settings.hero_video_url}
                      className="w-full h-32 object-cover rounded-lg"
                      muted
                      loop
                      autoPlay
                    />
                    <button
                      onClick={() => setSettings({...settings, hero_video_url: ''})}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {settings.video_muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#0C765B]" />}
                    <span className="text-sm text-slate-700">Video Sound</span>
                  </div>
                  <Switch
                    checked={!settings.video_muted}
                    onCheckedChange={(checked) => setSettings({...settings, video_muted: !checked})}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Content Visibility */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <EyeOff className="w-5 h-5 mr-2 text-[#0C765B]" />
              Content Visibility
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700">Show Welcome Badge</span>
                  <p className="text-xs text-slate-500">"Welcome to GYS Intranet" badge</p>
                </div>
                <Switch
                  checked={settings.show_welcome_badge}
                  onCheckedChange={(checked) => setSettings({...settings, show_welcome_badge: checked})}
                  data-testid="hero-welcome-badge-toggle"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700">Show Title</span>
                  <p className="text-xs text-slate-500">Main hero title text</p>
                </div>
                <Switch
                  checked={settings.show_title}
                  onCheckedChange={(checked) => setSettings({...settings, show_title: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700">Show Subtitle</span>
                  <p className="text-xs text-slate-500">Description text below title</p>
                </div>
                <Switch
                  checked={settings.show_subtitle}
                  onCheckedChange={(checked) => setSettings({...settings, show_subtitle: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700">Show CTA Buttons</span>
                  <p className="text-xs text-slate-500">Action buttons on hero</p>
                </div>
                <Switch
                  checked={settings.show_cta_buttons}
                  onCheckedChange={(checked) => setSettings({...settings, show_cta_buttons: checked})}
                />
              </div>
            </div>
          </div>

          {/* Visual Effects */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#0C765B]" />
              Visual Effects
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700">Animated Particles</span>
                  <p className="text-xs text-slate-500">Floating particles animation</p>
                </div>
                <Switch
                  checked={settings.show_particles}
                  onCheckedChange={(checked) => setSettings({...settings, show_particles: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700">Gradient Overlay</span>
                  <p className="text-xs text-slate-500">Dark gradient for text visibility</p>
                </div>
                <Switch
                  checked={settings.show_gradient_overlay}
                  onCheckedChange={(checked) => setSettings({...settings, show_gradient_overlay: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700">Floating Stats Cards</span>
                  <p className="text-xs text-slate-500">Statistics cards on hero</p>
                </div>
                <Switch
                  checked={settings.show_floating_cards}
                  onCheckedChange={(checked) => setSettings({...settings, show_floating_cards: checked})}
                />
              </div>
            </div>
          </div>

          {/* Title Text */}
          {settings.show_title && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-[#0C765B]" />
                Hero Text
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Title Line 1</label>
                  <Input
                    value={settings.hero_title_line1}
                    onChange={(e) => setSettings({...settings, hero_title_line1: e.target.value})}
                    placeholder="Building Indonesia's"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Title Line 2 (Highlighted)</label>
                  <Input
                    value={settings.hero_title_line2}
                    onChange={(e) => setSettings({...settings, hero_title_line2: e.target.value})}
                    placeholder="Steel Future"
                  />
                </div>
                {settings.show_subtitle && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Subtitle</label>
                    <textarea
                      value={settings.hero_subtitle}
                      onChange={(e) => setSettings({...settings, hero_subtitle: e.target.value})}
                      placeholder="Company description..."
                      className="w-full h-24 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C765B]/20 focus:border-[#0C765B]"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          {settings.show_cta_buttons && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2 text-[#0C765B]" />
                CTA Buttons
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Button 1 Text</label>
                    <Input
                      value={settings.hero_cta1_text}
                      onChange={(e) => setSettings({...settings, hero_cta1_text: e.target.value})}
                      placeholder="Latest News"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Button 1 Link</label>
                    <Input
                      value={settings.hero_cta1_link}
                      onChange={(e) => setSettings({...settings, hero_cta1_link: e.target.value})}
                      placeholder="#news"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Button 2 Text</label>
                    <Input
                      value={settings.hero_cta2_text}
                      onChange={(e) => setSettings({...settings, hero_cta2_text: e.target.value})}
                      placeholder="Employee Directory"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Button 2 Link</label>
                    <Input
                      value={settings.hero_cta2_link}
                      onChange={(e) => setSettings({...settings, hero_cta2_link: e.target.value})}
                      placeholder="#directory"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Live Preview</h3>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900">
              {/* Background */}
              {settings.background_type === 'video' && settings.hero_video_url ? (
                <video
                  src={settings.hero_video_url}
                  className="w-full h-full object-cover"
                  muted={settings.video_muted}
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={settings.hero_image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800'}
                  alt="Hero preview"
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Overlay */}
              {settings.show_gradient_overlay && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              )}
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                {settings.show_title && (
                  <>
                    <h2 className="text-white text-2xl font-bold mb-1" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                      {settings.hero_title_line1 || 'Building Indonesia\'s'}
                    </h2>
                    <h2 className="text-amber-400 text-2xl font-bold mb-3" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                      {settings.hero_title_line2 || 'Steel Future'}
                    </h2>
                  </>
                )}
                {settings.show_subtitle && (
                  <p className="text-white/80 text-sm mb-4 max-w-xs line-clamp-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {settings.hero_subtitle || 'Company description goes here...'}
                  </p>
                )}
                {settings.show_cta_buttons && (
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-[#0C765B] text-white text-xs rounded-lg font-medium">
                      {settings.hero_cta1_text || 'Button 1'}
                    </span>
                    <span className="px-3 py-1.5 bg-white/20 text-white text-xs rounded-lg font-medium border border-white/30">
                      {settings.hero_cta2_text || 'Button 2'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              This is a scaled preview. Actual hero will be full-width.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
