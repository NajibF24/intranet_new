import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Type, Link as LinkIcon, Eye, Sparkles, Upload, Video, Volume2, VolumeX, EyeOff, X, Clock, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

var VISIBILITY_ITEMS = [
  { key: 'show_welcome_badge', label: 'Welcome Badge', desc: '"Welcome to GYS Intranet"' },
  { key: 'show_title', label: 'Show Title', desc: 'Main hero title text' },
  { key: 'show_subtitle', label: 'Show Subtitle', desc: 'Description below title' },
  { key: 'show_cta_buttons', label: 'CTA Buttons', desc: 'Action buttons' },
];

var EFFECTS_ITEMS = [
  { key: 'show_particles', label: 'Animated Particles', desc: 'Floating spark animation' },
  { key: 'show_gradient_overlay', label: 'Gradient Overlay', desc: 'Dark gradient for text visibility' },
  { key: 'show_floating_cards', label: 'Stats Cards', desc: 'Statistics cards on hero' },
];

export var AdminHero = function() {
  var [settings, setSettings] = useState({
    hero_image_url: '',
    hero_images: [],
    hero_rotation_interval: 5,
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
  var [loading, setLoading] = useState(true);
  var [saving, setSaving] = useState(false);
  var [uploadingImage, setUploadingImage] = useState(false);
  var [uploadingVideo, setUploadingVideo] = useState(false);
  var videoRef = useRef(null);

  useEffect(function() { fetchSettings(); }, []);

  var fetchSettings = async function() {
    try {
      var response = await apiService.getHeroSettings();
      var data = response.data;
      if (!data.hero_images) data.hero_images = [];
      if (!data.hero_rotation_interval) data.hero_rotation_interval = 5;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    } finally {
      setLoading(false);
    }
  };

  var handleSave = async function() {
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

  var handleSlideUpload = async function(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (settings.hero_images.length >= 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    setUploadingImage(true);
    try {
      var formData = new FormData();
      formData.append('file', file);
      var response = await apiService.uploadPhoto(formData);
      var newImages = [...settings.hero_images, response.data.image_url];
      setSettings({ ...settings, hero_images: newImages, hero_image_url: newImages[0] });
      toast.success('Image added to slideshow!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  var removeSlide = function(index) {
    var imgs = settings.hero_images || [];
    var newImages = imgs.filter(function(_, i) { return i !== index; });
    setSettings({ ...settings, hero_images: newImages, hero_image_url: newImages[0] || '' });
  };

  var handleVideoUpload = async function(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video size should be less than 50MB');
      return;
    }
    setUploadingVideo(true);
    try {
      var formData = new FormData();
      formData.append('file', file);
      var response = await apiService.uploadPhoto(formData);
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

  var heroImages = settings.hero_images || [];
  var heroImgCount = heroImages.length;
  var rotInterval = settings.hero_rotation_interval || 5;

  return (
    <div data-testid="admin-hero">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Hero Settings</h1>
          <p className="text-slate-500 mt-1 text-sm">Customize the homepage hero section</p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm">
            <Eye className="w-4 h-4 mr-2" /> Preview
          </a>
          <Button onClick={handleSave} disabled={saving} className="bg-[#0C765B] hover:bg-[#095E49]" data-testid="save-hero-btn">
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-6">
          {/* Background Media */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-[#0C765B]" /> Background Media
            </h3>
            <Tabs value={settings.background_type} onValueChange={function(v) { setSettings({...settings, background_type: v}); }}>
              <TabsList className="mb-4">
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Image Slideshow
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" /> Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4">
                {/* Image Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {heroImages.map(function(url, i) {
                    return (
                      <div key={i} className="relative group rounded-lg overflow-hidden aspect-video bg-slate-100" data-testid={'hero-slide-' + i}>
                        <img src={url} alt={'Slide ' + (i + 1)} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                        <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-medium">{i + 1}</span>
                        <button
                          onClick={function() { removeSlide(i); }}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={'remove-slide-' + i}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                  {heroImgCount < 5 && (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-200 rounded-lg hover:border-[#0C765B]/50 transition-colors bg-slate-50">
                        {uploadingImage ? (
                          <div className="animate-spin w-6 h-6 border-2 border-[#0C765B] border-t-transparent rounded-full" />
                        ) : (
                          <div className="text-center">
                            <Plus className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                            <span className="text-xs text-slate-500">Add Image</span>
                          </div>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleSlideUpload} className="hidden" disabled={uploadingImage} data-testid="hero-slide-upload" />
                    </label>
                  )}
                </div>
                <p className="text-xs text-slate-500">{heroImgCount}/5 images. Recommended: 1920x1080px (16:9), max 5MB</p>

                {/* Rotation Interval */}
                {heroImgCount > 1 && (
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg" data-testid="rotation-interval">
                    <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">Rotation Interval</p>
                      <p className="text-xs text-slate-500">How many seconds between each slide</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="2"
                        max="15"
                        value={rotInterval}
                        onChange={function(e) { setSettings({...settings, hero_rotation_interval: parseInt(e.target.value)}); }}
                        className="w-20 sm:w-28"
                        data-testid="rotation-slider"
                      />
                      <span className="text-sm font-semibold text-[#0C765B] w-8 text-center">{rotInterval}s</span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <label className="cursor-pointer block">
                  <div className="flex items-center justify-center px-4 py-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-[#0C765B]/50 transition-colors">
                    <Upload className="w-5 h-5 mr-2 text-slate-400" />
                    <span className="text-sm text-slate-500">{uploadingVideo ? 'Uploading...' : 'Click to upload video'}</span>
                  </div>
                  <input type="file" accept="video/mp4,video/webm" onChange={handleVideoUpload} className="hidden" disabled={uploadingVideo} />
                </label>
                <p className="text-xs text-slate-500">MP4/WebM, max 50MB, 5-10s loop recommended</p>
                {settings.hero_video_url && (
                  <div className="relative">
                    <video ref={videoRef} src={settings.hero_video_url} className="w-full h-32 object-cover rounded-lg" muted loop autoPlay playsInline />
                    <button onClick={function() { setSettings({...settings, hero_video_url: ''}); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {settings.video_muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#0C765B]" />}
                    <span className="text-sm text-slate-700">Video Sound</span>
                  </div>
                  <Switch checked={!settings.video_muted} onCheckedChange={function(checked) { setSettings({...settings, video_muted: !checked}); }} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Content Visibility */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <EyeOff className="w-5 h-5 mr-2 text-[#0C765B]" /> Content Visibility
            </h3>
            <div className="space-y-4">
              {VISIBILITY_ITEMS.map(function(item) {
                return (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <Switch checked={settings[item.key]} onCheckedChange={function(checked) { setSettings({...settings, [item.key]: checked}); }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Effects */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#0C765B]" /> Visual Effects
            </h3>
            <div className="space-y-4">
              {EFFECTS_ITEMS.map(function(item) {
                return (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <Switch checked={settings[item.key]} onCheckedChange={function(checked) { setSettings({...settings, [item.key]: checked}); }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Title Text */}
          {settings.show_title && (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-[#0C765B]" /> Hero Text
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Title Line 1</label>
                  <Input value={settings.hero_title_line1} onChange={function(e) { setSettings({...settings, hero_title_line1: e.target.value}); }} placeholder="Building Indonesia's" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Title Line 2 (Highlighted)</label>
                  <Input value={settings.hero_title_line2} onChange={function(e) { setSettings({...settings, hero_title_line2: e.target.value}); }} placeholder="Steel Future" />
                </div>
                {settings.show_subtitle && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Subtitle</label>
                    <textarea value={settings.hero_subtitle} onChange={function(e) { setSettings({...settings, hero_subtitle: e.target.value}); }} placeholder="Company description..." className="w-full h-24 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C765B]/20 focus:border-[#0C765B] text-sm" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          {settings.show_cta_buttons && (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2 text-[#0C765B]" /> CTA Buttons
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Button 1 Text</label>
                    <Input value={settings.hero_cta1_text} onChange={function(e) { setSettings({...settings, hero_cta1_text: e.target.value}); }} placeholder="Latest News" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Button 1 Link</label>
                    <Input value={settings.hero_cta1_link} onChange={function(e) { setSettings({...settings, hero_cta1_link: e.target.value}); }} placeholder="#news" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Button 2 Text</label>
                    <Input value={settings.hero_cta2_text} onChange={function(e) { setSettings({...settings, hero_cta2_text: e.target.value}); }} placeholder="Employee Directory" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Button 2 Link</label>
                    <Input value={settings.hero_cta2_link} onChange={function(e) { setSettings({...settings, hero_cta2_link: e.target.value}); }} placeholder="#directory" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Live Preview</h3>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900">
              {settings.background_type === 'video' && settings.hero_video_url ? (
                <video src={settings.hero_video_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
              ) : (
                <img
                  src={(heroImages[0]) || settings.hero_image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800'}
                  alt="Hero preview"
                  className="w-full h-full object-cover"
                />
              )}
              {settings.show_gradient_overlay && <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />}
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-center">
                {settings.show_title && (
                  <div>
                    <h2 className="text-white text-lg sm:text-2xl font-bold mb-1">{settings.hero_title_line1 || "Building Indonesia's"}</h2>
                    <h2 className="text-amber-400 text-lg sm:text-2xl font-bold mb-3">{settings.hero_title_line2 || 'Steel Future'}</h2>
                  </div>
                )}
                {settings.show_subtitle && <p className="text-white/80 text-xs sm:text-sm mb-3 max-w-xs line-clamp-2">{settings.hero_subtitle || 'Company description...'}</p>}
                {settings.show_cta_buttons && (
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-[#0C765B] text-white text-xs rounded-lg font-medium">{settings.hero_cta1_text || 'Button 1'}</span>
                    <span className="px-3 py-1.5 bg-white/20 text-white text-xs rounded-lg font-medium border border-white/30">{settings.hero_cta2_text || 'Button 2'}</span>
                  </div>
                )}
              </div>
              {heroImgCount > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3 inline mr-1" />{rotInterval}s rotation
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">Scaled preview. Actual hero is full-width.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
