import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { apiService } from '../../lib/api';

export const StickyNewsBanner = () => {
  const [news, setNews] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiService.getNews({ limit: 5 });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show banner after scrolling past hero (approximately 100vh)
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Show when scrolled past hero, hide when back at hero
      if (scrollPosition > heroHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tickerContent = news.length > 0
    ? news.map(n => n.title).join(' ✦ ')
    : 'Loading latest news...';

  // Don't show if dismissed or no news
  if (isDismissed) return null;

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
            {/* Latest News Badge */}
            <div className="flex-shrink-0 bg-amber-500 px-4 py-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm whitespace-nowrap">Latest News</span>
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
