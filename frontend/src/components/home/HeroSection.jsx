import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Factory, Shield, Users, TrendingUp, Volume2, VolumeX } from 'lucide-react';
import { apiService } from '../../lib/api';

var stats = [
  { icon: Factory, value: '500K+', label: 'Metric Tons', subLabel: 'Production Capacity' },
  { icon: Shield, value: '1000+', label: 'Safety Days', subLabel: 'Without Incident' },
  { icon: Users, value: '2,500+', label: 'Employees', subLabel: 'Across Indonesia' },
  { icon: TrendingUp, value: '30+', label: 'Years', subLabel: 'Industry Experience' },
];

var getCachedHero = function() {
  try {
    var cached = localStorage.getItem('heroSettings');
    if (cached) return JSON.parse(cached);
  } catch (e) {}
  return null;
};

var cacheHeroSettings = function(data) {
  try {
    var toCache = { ...data };
    if (toCache.hero_image_url && toCache.hero_image_url.length > 10000) toCache._hasLargeImage = true;
    localStorage.setItem('heroSettings', JSON.stringify(toCache));
  } catch (e) {}
};

function StatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 + index * 0.15, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.05, transition: { duration: 0.2 } }}
      className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-2xl cursor-default shadow-xl border border-white/30"
      data-testid={'hero-stat-' + index}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>{stat.value}</p>
      <p className="text-xs sm:text-sm font-semibold text-white/90">{stat.label}</p>
      <p className="text-xs text-white/70">{stat.subLabel}</p>
    </motion.div>
  );
}

export var HeroSection = function() {
  var [isMuted, setIsMuted] = useState(true);
  var cachedHero = getCachedHero();
  var [isReady, setIsReady] = useState(false);
  var [currentSlide, setCurrentSlide] = useState(0);
  var videoRef = useRef(null);
  var intervalRef = useRef(null);
  var [heroSettings, setHeroSettings] = useState(cachedHero || {
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
  var { scrollY } = useScroll();
  var backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  var contentY = useTransform(scrollY, [0, 500], [0, -50]);
  var opacity = useTransform(scrollY, [0, 400], [1, 0]);
  var scale = useTransform(scrollY, [0, 500], [1, 1.2]);

  // Get images array
  var images = (heroSettings.hero_images && heroSettings.hero_images.length > 0) ? heroSettings.hero_images : (heroSettings.hero_image_url ? [heroSettings.hero_image_url] : []);
  var rotationInterval = heroSettings.hero_rotation_interval || 5;

  // Auto-rotate slides
  var nextSlide = useCallback(function() {
    if (images.length > 1) {
      setCurrentSlide(function(prev) { return (prev + 1) % images.length; });
    }
  }, [images.length]);

  useEffect(function() {
    if (images.length > 1) {
      intervalRef.current = setInterval(nextSlide, rotationInterval * 1000);
      return function() { clearInterval(intervalRef.current); };
    }
  }, [nextSlide, rotationInterval, images.length]);

  useEffect(function() {
    var fetchSettings = async function() {
      try {
        var response = await apiService.getHeroSettings();
        var data = response.data;
        if (!data.hero_images) data.hero_images = [];
        if (!data.hero_rotation_interval) data.hero_rotation_interval = 5;
        setHeroSettings(data);
        setIsMuted(data.video_muted !== false);
        cacheHeroSettings(data);
        var imgList = (data.hero_images && data.hero_images.length > 0) ? data.hero_images : (data.hero_image_url ? [data.hero_image_url] : []);
        if (data.background_type !== 'video' && imgList.length > 0) {
          var img = new Image();
          img.onload = function() { setIsReady(true); };
          img.onerror = function() { setIsReady(true); };
          img.src = imgList[0];
        } else {
          setIsReady(true);
        }
      } catch (error) {
        setIsReady(true);
      }
    };
    if (cachedHero && cachedHero.hero_image_url) {
      setIsReady(true);
      fetchSettings();
    } else {
      fetchSettings();
    }
  }, []);

  var toggleMute = function() {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  var isVideo = heroSettings.background_type === 'video' && heroSettings.hero_video_url;

  return (
    <section className="relative h-screen min-h-[600px] sm:min-h-[700px] overflow-hidden bg-slate-900" data-testid="hero-section">
      {isReady && (
        <React.Fragment>
          {/* Background Media */}
          <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY, scale }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {isVideo ? (
              <video ref={videoRef} src={heroSettings.hero_video_url} className="w-full h-full object-cover" muted={isMuted} loop autoPlay playsInline />
            ) : (
              <AnimatePresence mode="wait">
                {images.length > 0 && (
                  <motion.img
                    key={currentSlide}
                    src={images[currentSlide]}
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Video Sound Control */}
          {isVideo && (
            <button onClick={toggleMute} className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-30 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}

          {/* Slide Indicators */}
          {images.length > 1 && !isVideo && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2" data-testid="slide-indicators">
              {images.map(function(_, i) {
                return (
                  <button
                    key={i}
                    onClick={function() { setCurrentSlide(i); }}
                    className={'w-2.5 h-2.5 rounded-full transition-all duration-300 ' + (i === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60')}
                    data-testid={'slide-dot-' + i}
                  />
                );
              })}
            </div>
          )}

          {/* Gradient Overlays */}
          {heroSettings.show_gradient_overlay && (
            <React.Fragment>
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            </React.Fragment>
          )}

          {/* Particles */}
          {heroSettings.show_particles && (
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none hidden sm:block">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(function(i) {
                return (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full"
                    initial={{ x: (Math.random() * 100) + '%', y: '100%', opacity: 0 }}
                    animate={{ y: '-10%', opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5, ease: 'linear' }}
                  />
                );
              })}
            </div>
          )}

          {/* Main Content */}
          <motion.div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ y: contentY, opacity }}>
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
              {/* Left - Text */}
              <div className="pt-16 sm:pt-0">
                {heroSettings.show_welcome_badge !== false && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 sm:mb-6">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    <span className="text-white text-xs sm:text-sm font-medium">Welcome to GYS Intranet</span>
                  </motion.div>
                )}
                {heroSettings.show_title && (
                  <div>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-1 sm:mb-2 tracking-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>
                      {heroSettings.hero_title_line1}
                    </motion.h1>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-3xl sm:text-5xl lg:text-7xl font-bold text-amber-400 mb-4 sm:mb-6 tracking-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>
                      {heroSettings.hero_title_line2}
                    </motion.h1>
                  </div>
                )}
                {heroSettings.show_subtitle && (
                  <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-sm sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-xl" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>
                    {heroSettings.hero_subtitle}
                  </motion.p>
                )}
                {heroSettings.show_cta_buttons && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <a href={heroSettings.hero_cta1_link} className="px-6 sm:px-8 py-3 sm:py-4 bg-[#0C765B] text-white rounded-xl font-semibold hover:bg-[#095E49] transition-colors flex items-center justify-center text-sm sm:text-base" data-testid="hero-cta1">
                      {heroSettings.hero_cta1_text}
                      <span className="ml-2">→</span>
                    </a>
                    <a href={heroSettings.hero_cta2_link} className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30 flex items-center justify-center text-sm sm:text-base" data-testid="hero-cta2">
                      {heroSettings.hero_cta2_text}
                    </a>
                  </motion.div>
                )}
              </div>

              {/* Right - Stats */}
              {heroSettings.show_floating_cards && (
                <div className="hidden lg:grid grid-cols-2 gap-4">
                  {stats.map(function(stat, index) {
                    return <StatCard key={index} stat={stat} index={index} />;
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.5 }} className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-white/50 rounded-full" />
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </section>
  );
};

export default HeroSection;
