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
      <section className="bg-[#414141]" id="news">
        <div className="animate-pulse">
          <div className="grid grid-cols-5 min-h-[420px]">
            <div className="col-span-3 bg-white/5" />
            <div className="col-span-2 bg-white/5" />
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  const renderFeaturedRow = (article, index) => {
    const isEven = index % 2 === 1;
    const slideDir = isEven ? 1 : -1;

    const imageCell = (
      <motion.div
        initial={{ opacity: 0, x: slideDir * 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={isEven ? 'col-span-2' : 'col-span-3'}
      >
        <div className="relative w-full h-full min-h-[380px] lg:min-h-[440px]">
          <img
            src={article.image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1200'}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </motion.div>
    );

    const textCell = (
      <motion.div
        initial={{ opacity: 0, x: -slideDir * 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`flex flex-col justify-center ${isEven ? 'col-span-3 px-12 lg:px-20 xl:px-24' : 'col-span-2 px-10 lg:px-16 xl:px-20'}`}
      >
        <span className="text-white/40 text-sm tracking-wide mb-5">
          {format(new Date(article.created_at), 'MMMM d, yyyy')}
        </span>
        <h2 className="text-2xl lg:text-3xl xl:text-[2.5rem] font-bold text-white leading-tight mb-5">
          {article.title}
        </h2>
        {article.summary && (
          <p className="text-white/60 text-base leading-relaxed mb-8 line-clamp-3">
            {article.summary}
          </p>
        )}
        <Link
          to={`/news/${article.id}`}
          className="inline-flex items-center self-start text-white text-sm font-medium border border-white/30 px-7 py-3 hover:bg-white hover:text-slate-900 transition-all duration-300 group"
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
        className="grid grid-cols-1 md:grid-cols-5"
        data-testid={`featured-row-${index}`}
      >
        {isEven ? (
          <>
            {textCell}
            {imageCell}
          </>
        ) : (
          <>
            {imageCell}
            {textCell}
          </>
        )}
      </div>
    );
  };

  return (
    <section id="news" data-testid="news-section">
      {/* Featured News — ArcelorMittal style */}
      {featuredNews.length > 0 && (
        <div className="bg-[#414141]" data-testid="featured-news-section">
          {featuredNews.map((article, index) => renderFeaturedRow(article, index))}
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
