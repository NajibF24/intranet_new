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

  // Only show news marked as featured in CMS
  const featuredNews = news.filter(n => n.is_featured);
  const otherNews = news.filter(n => !n.is_featured).slice(0, 4);

  if (loading) {
    return (
      <section className="bg-[#6E6F72]" id="news">
        <div className="animate-pulse max-w-7xl mx-auto px-4 py-16">
          <div className="h-8 bg-white/10 w-48 rounded mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-white/10 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section id="news" data-testid="news-section">
      {/* Featured News Section */}
      {featuredNews.length > 0 && (
        <div className="py-16" style={{ backgroundColor: '#6E6F72' }} data-testid="featured-news-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-10"
            >
              <h3 className="text-2xl font-bold text-white">Featured News</h3>
              <Link
                to="/news"
                className="hidden sm:flex items-center text-white/80 font-semibold hover:text-white transition-colors"
                data-testid="view-all-news"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            <div className={`grid gap-8 ${
              featuredNews.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' :
              featuredNews.length === 2 ? 'sm:grid-cols-2' :
              'sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {featuredNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group"
                  data-testid={`featured-card-${index}`}
                >
                  <Link to={`/news/${article.id}`} className="block">
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      {/* Square Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <motion.img
                          src={article.image_url || 'https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=800'}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Date Badge */}
                        <div className="absolute bottom-4 left-4">
                          <span className="text-amber-400 font-semibold text-sm">
                            {format(new Date(article.created_at), 'MMMM d, yyyy')}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                            Featured
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <span className="px-3 py-1 bg-[#0C765B]/10 text-[#0C765B] text-xs font-semibold rounded-full uppercase">
                          {article.category}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-3 mb-2 group-hover:text-[#0C765B] transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                          {article.summary}
                        </p>
                        <span className="inline-flex items-center text-[#0C765B] font-semibold text-sm group-hover:underline">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Mobile View All */}
            <Link
              to="/news"
              className="sm:hidden flex items-center justify-center text-white font-semibold mt-8"
            >
              <span>View All News</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Other News Grid */}
      {otherNews.length > 0 && (
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-slate-900 mb-10"
            >
              More News
            </motion.h3>

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
