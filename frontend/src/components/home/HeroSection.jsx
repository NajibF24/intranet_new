import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Factory, Shield, Users, TrendingUp } from 'lucide-react';

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
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
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1920&q=80')`,
          }}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C765B]/95 via-[#0C765B]/85 to-[#074737]/90 z-10" />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 z-10 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse" />
                Welcome to GYS Intranet
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6"
            >
              Building Indonesia&apos;s
              <br />
              <span className="text-amber-400">Steel Future</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg"
            >
              PT Garuda Yamato Steel is committed to excellence in steel manufacturing, 
              delivering premium quality products while prioritizing safety and sustainability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#news"
                className="px-8 py-4 bg-white text-[#0C765B] font-semibold rounded-xl hover:bg-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl"
                data-testid="hero-cta-news"
              >
                Latest News
              </a>
              <a
                href="#directory"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-1 border border-white/20"
                data-testid="hero-cta-directory"
              >
                Employee Directory
              </a>
            </motion.div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass p-6 rounded-2xl cursor-default stat-card-float"
                style={{ animationDelay: `${index * 1.5}s` }}
                data-testid={`hero-stat-${index}`}
              >
                <div className="w-12 h-12 bg-[#0C765B]/10 rounded-xl flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-[#0C765B]" />
                </div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-700">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.subLabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
