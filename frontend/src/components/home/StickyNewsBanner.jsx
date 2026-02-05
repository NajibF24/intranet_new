import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Bell, Megaphone, Zap, Info, AlertCircle, Radio } from 'lucide-react';
import { apiService } from '../../lib/api';

const ICONS = {
  sparkles: Sparkles,
  bell: Bell,
  megaphone: Megaphone,
  zap: Zap,
  info: Info,
  'alert-circle': AlertCircle,
  radio: Radio,
};

export const StickyNewsBanner = () => {
  const [news, setNews] = useState([]);
  const [tickerSettings, setTickerSettings] = useState({
    mode: 'default',
    manual_text: '',
    icon: 'sparkles',
    badge_text: 'Latest News',
    is_enabled: true,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, tickerRes] = await Promise.all([
          apiService.getNews({ limit: 5 }),
          apiService.getTickerSettings(),
        ]);
        setNews(newsRes.data);
        setTickerSettings(tickerRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > heroHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get ticker content based on mode
  const getTickerContent = () => {
    if (tickerSettings.mode === 'manual' && tickerSettings.manual_text) {
      return tickerSettings.manual_text;
    }
    // Default mode: show news titles
    if (news.length > 0) {
      return news.map(n => n.title).join(' ✦ ');
    }
    return 'Welcome to PT Garuda Yamato Steel Intranet';
  };

  const tickerContent = getTickerContent();
  const IconComponent = ICONS[tickerSettings.icon] || Sparkles;

  // Don't show if disabled, dismissed, or no content
  if (!tickerSettings.is_enabled || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C765B] shadow-lg"
          data-testid="sticky-news-banner"
        >
          <div className="flex items-center">
            {/* Badge */}
            <div className="flex-shrink-0 bg-amber-500 px-4 py-3 flex items-center space-x-2">
              <IconComponent className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm whitespace-nowrap">
                {tickerSettings.badge_text || 'Latest News'}
              </span>
            </div>
            
            {/* Ticker Content */}
            <div className="overflow-hidden flex-1 py-3">
              <div className="ticker-animate whitespace-nowrap inline-block">
                <span className="text-white/90 text-sm px-4">
                  {tickerContent} ✦ {tickerContent}
                </span>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 px-4 py-3 text-white/70 hover:text-white transition-colors"
              aria-label="Close news banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyNewsBanner;
