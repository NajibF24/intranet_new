import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../../lib/api';
import { format } from 'date-fns';

export const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiService.getNews({ limit: 20 });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const featuredNews = news.filter(n => n.is_featured);
  const otherNews = news.filter(n => !n.is_featured).slice(0, 4);

  if (loading) {
    return (
      <section style={{ backgroundColor: '#6E6F72' }} id="news">
        <div className="animate-pulse max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 gap-0">
            <div className="h-[400px] bg-white/10" />
            <div className="h-[400px] bg-white/5" />
            <div className="h-[350px] bg-white/5" />
            <div className="h-[350px] bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  // Build the staggered rows: each featured news gets a row
  // Odd rows: image LEFT, text RIGHT — slide from left
  // Even rows: text LEFT, image RIGHT — slide from right
  const renderFeaturedRow = (article, index) => {
    const isEven = index % 2 === 1;
    const slideFrom = isEven ? 80 : -80;

    const imageBlock = (
      <motion.div
        initial={{ opacity: 0, x: slideFrom }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden"
        data-testid={`featured-image-${index}`}
      >
        <img
          src={article.image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1200'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </motion.div>
    );

    const textBlock = (
      <motion.div
        initial={{ opacity: 0, x: -slideFrom }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col justify-center px-8 lg:px-14 py-10 lg:py-16"
        data-testid={`featured-text-${index}`}
      >
        <span className="text-white/50 text-sm font-medium mb-4">
          {format(new Date(article.created_at), 'MMMM d, yyyy')}
        </span>
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-5 leading-tight">
          {article.title}
        </h2>
        <p className="text-white/70 text-base mb-8 line-clamp-3 leading-relaxed">
          {article.summary}
        </p>
        <Link
          to={`/news/${article.id}`}
          className="inline-flex items-center self-start text-white font-semibold border border-white/40 px-6 py-3 rounded-sm hover:bg-white hover:text-slate-900 transition-all duration-300 group"
          data-testid={`featured-link-${index}`}
        >
          <span>Find out more</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    );

    return (
      <div
        key={article.id}
        className={`grid md:grid-cols-2 ${index === 0 ? 'min-h-[450px]' : 'min-h-[380px]'}`}
        data-testid={`featured-row-${index}`}
      >
        {isEven ? (
          <>
            {textBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {textBlock}
          </>
        )}
      </div>
    );
  };

  return (
    <section id="news" data-testid="news-section">
      {/* Featured News — ArcelorMittal staggered layout */}
      {featuredNews.length > 0 && (
        <div style={{ backgroundColor: '#6E6F72' }} data-testid="featured-news-section">
          <div className="max-w-[1400px] mx-auto">
            {featuredNews.map((article, index) => renderFeaturedRow(article, index))}
          </div>
        </div>
      )}

      {/* Other News Grid */}
      {otherNews.length > 0 && (
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <h3 className="text-2xl font-bold text-slate-900">More News</h3>
              <Link
                to="/news"
                className="hidden sm:flex items-center text-[#0C765B] font-semibold hover:underline"
                data-testid="view-all-news"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                  data-testid={`news-card-${index}`}
                >
                  <Link to={`/news/${article.id}`} className="block">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={article.image_url || 'https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=400'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-amber-600 text-xs font-semibold mb-2">
                          {format(new Date(article.created_at), 'MMMM d, yyyy')}
                        </p>
                        <h4 className="font-bold text-slate-900 line-clamp-2 group-hover:text-[#0C765B] transition-colors">
                          {article.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
