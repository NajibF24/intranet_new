import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
        const response = await apiService.getNews({ limit: 10 });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Get featured news (first 3 that are marked as featured, or first 3 overall)
  const featuredNews = news.filter(n => n.is_featured).slice(0, 3);
  const fallbackFeatured = news.slice(0, 3);
  const displayFeatured = featuredNews.length > 0 ? featuredNews : fallbackFeatured;
  
  const mainFeatured = displayFeatured[0];
  const secondaryFeatured = displayFeatured.slice(1, 3);
  const otherNews = news.filter(n => !displayFeatured.find(f => f.id === n.id)).slice(0, 4);

  if (loading) {
    return (
      <section className="bg-slate-900" id="news">
        <div className="animate-pulse">
          <div className="h-[600px] bg-slate-800" />
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 bg-slate-700 rounded-xl" />
              <div className="h-64 bg-slate-700 rounded-xl" />
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
    <section id="news" data-testid="news-section">
      {/* Main Featured News - ArcelorMittal Style */}
      {mainFeatured && (
        <div className="relative bg-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-[400px] lg:h-auto"
              >
                <img
                  src={mainFeatured.image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1200'}
                  alt={mainFeatured.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/50 lg:hidden" />
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col justify-center p-8 lg:p-16 bg-slate-900"
              >
                <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider mb-4">
                  Featured Story
                </span>
                <p className="text-amber-500 font-medium mb-4">
                  {format(new Date(mainFeatured.created_at), 'MMMM d, yyyy')}
                </p>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                  {mainFeatured.title}
                </h2>
                <p className="text-slate-300 text-lg mb-8 line-clamp-3">
                  {mainFeatured.summary}
                </p>
                <Link
                  to={`/news/${mainFeatured.id}`}
                  className="inline-flex items-center text-white font-semibold group"
                  data-testid="main-featured-link"
                >
                  <span className="border-b-2 border-white pb-1 group-hover:border-amber-500 transition-colors">
                    Read Full Story
                  </span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Featured News - Two Cards */}
      {secondaryFeatured.length > 0 && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-10"
            >
              <h3 className="text-2xl font-bold text-slate-900">Latest News</h3>
              <Link
                to="/news"
                className="hidden sm:flex items-center text-[#0C765B] font-semibold hover:underline"
                data-testid="view-all-news"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {secondaryFeatured.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group"
                  data-testid={`featured-card-${index}`}
                >
                  <Link to={`/news/${article.id}`} className="block">
                    <div className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
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
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-[#0C765B]/10 text-[#0C765B] text-xs font-semibold rounded-full uppercase">
                            {article.category}
                          </span>
                          {article.is_featured && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#0C765B] transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-slate-600 line-clamp-2 mb-4">
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
              className="sm:hidden flex items-center justify-center text-[#0C765B] font-semibold mt-8"
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
