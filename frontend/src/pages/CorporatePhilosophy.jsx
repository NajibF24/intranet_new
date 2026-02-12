import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { QualitySection, InnovationSection, SustainabilitySection } from './PhilosophySections';

export const PhilosophyPage = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="philosophy-page">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=80" alt="Corporate Philosophy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a3d30]/95 via-[#0a3d30]/80 to-[#0a3d30]/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6 border border-white/20">Corporate Identity</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" data-testid="philosophy-title">
              Corporate Philosophy<br />
              <span className="text-[#4fd1a5]">& Core Value</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Tagline */}
      <div className="bg-[#0C765B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-white/40 rounded-full flex-shrink-0" />
            <p className="text-white text-lg md:text-xl font-medium leading-relaxed" data-testid="philosophy-tagline">
              <span className="font-bold">Strength in Excellence</span> — these words define GYS's unwavering philosophy: to deliver strength and trust for the future.
            </p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-slate-600 text-lg leading-relaxed max-w-4xl" data-testid="philosophy-intro">
          We are committed to provide world-class expertise and experience in Indonesia's construction industry through uncompromising quality, innovative technologies, and sustainable practices. As the only manufacturer supplying high-tensile and seismic-grade steel, GYS ensures structural safety while providing reliability and value to society. Guided by our three core values — <span className="font-semibold text-[#0C765B]">Quality</span>, <span className="font-semibold text-[#0C765B]">Innovation</span>, and <span className="font-semibold text-[#0C765B]">Sustainability</span> — we continue to move forward alongside Indonesia's growth and development.
        </p>
      </div>

      <QualitySection />
      <InnovationSection />
      <SustainabilitySection />

      {/* Bottom */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Strength in Excellence</h3>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">Quality, Innovation, and Sustainability — the pillars that drive GYS forward.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-6 py-2.5 bg-[#0C765B] text-white font-semibold rounded-full text-sm">Quality</span>
            <span className="px-6 py-2.5 bg-[#0C765B] text-white font-semibold rounded-full text-sm">Innovation</span>
            <span className="px-6 py-2.5 bg-[#0C765B] text-white font-semibold rounded-full text-sm">Sustainability</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
