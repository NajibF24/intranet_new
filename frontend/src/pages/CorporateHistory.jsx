import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { JourneyTimeline } from './HistoryTimeline';
import { ShareholderSection } from './HistoryShareholder';

export const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="history-page">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1666219462105-2909c2d72d01?w=1920&q=80" alt="Corporate History" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6 border border-white/20">Corporate Identity</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" data-testid="history-title">
              Corporate History<br />
              <span className="text-[#4fd1a5]">& Group Structure</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">Over five decades of excellence — our journey of growth, innovation, and commitment to the steel industry.</p>
          </motion.div>
        </div>
      </div>

      <JourneyTimeline />
      <ShareholderSection />
      <Footer />
    </div>
  );
};
