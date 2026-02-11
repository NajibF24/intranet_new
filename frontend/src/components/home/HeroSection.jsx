import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Factory, Shield, Users, TrendingUp, Volume2, VolumeX } from 'lucide-react';
import { apiService } from '../../lib/api';

const stats = [
  {
    icon: Factory,
    value: '500K+',
    label: 'Metric Tons',
    subLabel: 'Production Capacity',
  },
  {
    icon: Shield,
    value: '1000+',
    label: 'Safety Days',
    subLabel: 'Without Incident',
  },
  {
    icon: Users,
    value: '2,500+',
    label: 'Employees',
    subLabel: 'Across Indonesia',
  },
  {
    icon: TrendingUp,
    value: '30+',
    label: 'Years',
    subLabel: 'Industry Experience',
  },
];

export const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const [heroSettings, setHeroSettings] = useState({
    hero_image_url: 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1920&q=80',
    hero_video_url: '',
    background_type: 'image',
    video_muted: true,
    hero_title_line1: "Building Indonesia's",
    hero_title_line2: 'Steel Future',
    hero_subtitle: 'PT Garuda Yamato Steel is committed to excellence in steel manufacturing, delivering premium quality products while prioritizing safety and sustainability.',
    hero_cta1_text: 'Latest News',
    hero_cta1_link: '#news',
    hero_cta2_text: 'Employee Directory',
    hero_cta2_link: '#directory',
    show_title: true,
    show_subtitle: true,
    show_cta_buttons: true,
    show_particles: true,
    show_gradient_overlay: true,
    show_floating_cards: true,
    show_welcome_badge: true,
  });
  const { scrollY } = useScroll();
  
  // Parallax transforms based on scroll
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.2]);

  useEffect(() => {
    // Fetch hero settings
    const fetchSettings = async () => {
      try {
        const response = await apiService.getHeroSettings();
        setHeroSettings(response.data);
        setIsMuted(response.data.video_muted !== false);
      } catch (error) {
        // Use defaults
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle video mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isVideo = heroSettings.background_type === 'video' && heroSettings.hero_video_url;

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden" data-testid="hero-section">
      {/* Background Media with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY, scale }}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={heroSettings.hero_video_url}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            autoPlay
            playsInline
          />
        ) : (
          <motion.img
            src={heroSettings.hero_image_url}
            alt="Steel Manufacturing"
            className="w-full h-full object-cover"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        )}
      </motion.div>

      {/* Video Sound Control */}
      {isVideo && (
        <button
          onClick={toggleMute}
          className="absolute bottom-8 right-8 z-30 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* Gradient Overlays */}
      {heroSettings.show_gradient_overlay && (
        <>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </>
      )}

      {/* Animated Particles/Sparks Effect */}
      {heroSettings.show_particles && (
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: '100%',
                opacity: 0,
              }}
              animate={{
                y: '-10%',
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <motion.div 
        className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center"
        style={{ y: contentY, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content - Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-white text-sm font-medium">Welcome to GYS Intranet</span>
            </motion.div>

            {heroSettings.show_title && (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl lg:text-7xl font-bold text-white mb-2 tracking-tight"
                  style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}
                >
                  {heroSettings.hero_title_line1}
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl lg:text-7xl font-bold text-amber-400 mb-6 tracking-tight"
                  style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}
                >
                  {heroSettings.hero_title_line2}
                </motion.h1>
              </>
            )}

            {heroSettings.show_subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-white/90 mb-8 max-w-xl"
                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}
              >
                {heroSettings.hero_subtitle}
              </motion.p>
            )}

            {heroSettings.show_cta_buttons && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href={heroSettings.hero_cta1_link}
                  className="px-8 py-4 bg-[#0C765B] text-white rounded-xl font-semibold hover:bg-[#095E49] transition-colors flex items-center justify-center group"
                  data-testid="hero-cta1"
                >
                  {heroSettings.hero_cta1_text}
                  <motion.span
                    className="ml-2"
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.span>
                </a>
                <a
                  href={heroSettings.hero_cta2_link}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30 flex items-center justify-center"
                  data-testid="hero-cta2"
                >
                  {heroSettings.hero_cta2_text}
                </a>
              </motion.div>
            )}
          </div>

          {/* Right Content - Stats Cards */}
          {heroSettings.show_floating_cards && (
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4 + index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white/20 backdrop-blur-md p-6 rounded-2xl cursor-default shadow-xl border border-white/30"
                  data-testid={`hero-stat-${index}`}
                >
                  <motion.div 
                    className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"
                    whileHover={{ rotate: 10 }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.p 
                    className="text-3xl font-bold text-white tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm font-semibold text-white/90">{stat.label}</p>
                  <p className="text-xs text-white/70">{stat.subLabel}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
