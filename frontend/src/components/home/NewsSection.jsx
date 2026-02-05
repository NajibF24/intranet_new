import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../../lib/api';
import { format } from 'date-fns';

export const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiService.getNews({ limit: 5 });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const featuredNews = news.find(n => n.is_featured) || news[0];
  const otherNews = news.filter(n => n.id !== featuredNews?.id).slice(0, 4);

  if (loading) {
    return (
      <section className="py-24 bg-slate-50" id="news">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-slate-200 rounded-2xl" />
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-slate-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-slate-50" id="news" data-testid="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-[#0C765B] font-semibold text-sm uppercase tracking-wider mb-2 block">
              Stay Informed
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              News & Announcements
            </h2>
          </div>
          <Link
            to="/news"
            className="hidden sm:flex items-center space-x-2 text-[#0C765B] font-semibold hover:underline"
            data-testid="view-all-news"
          >
            <span>View All News</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Article */}
          {featuredNews && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group"
              data-testid="featured-news"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="image-zoom aspect-[16/10]">
                  <img
                    src={featuredNews.image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800'}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold">
                    Featured
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(featuredNews.created_at), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      {featuredNews.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#0C765B] transition-colors">
                    {featuredNews.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-3 mb-4">
                    {featuredNews.summary}
                  </p>
                  <Link
                    to={`/news/${featuredNews.id}`}
                    className="inline-flex items-center text-[#0C765B] font-semibold hover:underline"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.article>
          )}

          {/* Other Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherNews.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                data-testid={`news-card-${index}`}
              >
                <Link to={`/news/${article.id}`}>
                  <div className="image-zoom aspect-[16/9]">
                    <img
                      src={article.image_url || 'https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=400'}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-xs text-slate-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(article.created_at), 'MMM d, yyyy')}
                    </div>
                    <h4 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-[#0C765B] transition-colors">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Mobile View All */}
        <Link
          to="/news"
          className="sm:hidden flex items-center justify-center space-x-2 text-[#0C765B] font-semibold mt-8"
        >
          <span>View All News</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default NewsSection;
