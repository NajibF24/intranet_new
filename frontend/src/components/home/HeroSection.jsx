import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Factory, Shield, Users, TrendingUp } from 'lucide-react';
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
  const [heroSettings, setHeroSettings] = useState({
    hero_image_url: 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1920&q=80',
    hero_title_line1: "Building Indonesia's",
    hero_title_line2: 'Steel Future',
    hero_subtitle: 'PT Garuda Yamato Steel is committed to excellence in steel manufacturing, delivering premium quality products while prioritizing safety and sustainability.',
    hero_cta1_text: 'Latest News',
    hero_cta1_link: '#news',
    hero_cta2_text: 'Employee Directory',
    hero_cta2_link: '#directory',
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

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Image with Dramatic Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: backgroundY,
          scale: scale,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${heroSettings.hero_image_url}')`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Only - No full overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      {/* Left Side Gradient for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Animated Particles/Sparks Effect */}
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

      {/* Content */}
      <motion.div 
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"
        style={{ y: contentY, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 border border-white/20">
                <motion.span 
                  className="w-2 h-2 bg-amber-400 rounded-full mr-2"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Welcome to GYS Intranet
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6"
              style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
            >
              {heroSettings.hero_title_line1}
              <br />
              <motion.span 
                className="text-amber-400"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(251,191,36,0.5)',
                    '0 0 20px rgba(251,191,36,0.8)',
                    '0 0 10px rgba(251,191,36,0.5)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {heroSettings.hero_title_line2}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/90 leading-relaxed mb-8 max-w-lg"
              style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}
            >
              {heroSettings.hero_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href={heroSettings.hero_cta1_link}
                className="px-8 py-4 bg-[#0C765B] text-white font-semibold rounded-xl hover:bg-[#095E49] transition-all shadow-lg shadow-[#0C765B]/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid="hero-cta-news"
              >
                {heroSettings.hero_cta1_text}
              </motion.a>
              <motion.a
                href={heroSettings.hero_cta2_link}
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all border border-white/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid="hero-cta-directory"
              >
                {heroSettings.hero_cta2_text}
              </motion.a>
            </motion.div>
          </div>

          {/* Right Content - Stats Cards (More Transparent) */}
          <div className="grid grid-cols-2 gap-4">
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
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <motion.div 
            className="w-1.5 h-3 bg-white/70 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
