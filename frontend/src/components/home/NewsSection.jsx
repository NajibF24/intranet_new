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
  const otherNews = news.filter(n => !n.is_featured).slice(0, 6);

  if (loading) {
    return (
      <section className="bg-[#3C3C3C]" id="news">
        <div className="animate-pulse">
          <div className="grid grid-cols-2 min-h-[450px]">
            <div className="bg-white/5" />
            <div className="bg-white/3" />
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  // ArcelorMittal layout: each featured row = text LEFT, image RIGHT
  // Rows alternate: odd has description, even has just date
  const renderFeaturedRow = (article, index) => {
    const hasDescription = index % 2 === 0;
    const slideFrom = index % 2 === 0 ? -60 : 60;

    return (
//      <div
  //      key={article.id}
    //    className="grid grid-cols-1 md:grid-cols-2 border-t border-white/10 first:border-t-0"
      //  data-testid={`featured-row-${index}`}
     // >
        <div
          key={article.id}
          // Menambahkan bg-[#A5A7AA] untuk mengganti warna box
          className="grid grid-cols-1 md:grid-cols-2 border-t border-white/10 first:border-t-0 bg-[#F0F1F1]"
          data-testid={`featured-row-${index}`}
        >
        {/* Text side — always LEFT */}
        <motion.div
          initial={{ opacity: 0, x: slideFrom }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col justify-center px-10 lg:px-16 xl:px-20 py-14 lg:py-20"
          data-testid={`featured-text-${index}`}
        >
          <h2 className="text-[1.7rem] lg:text-[2.1rem] xl:text-[2.4rem] font-bold text-black leading-[1.2] mb-5 tracking-tight">
            {article.title}
          </h2>

          {hasDescription && article.summary && (
            <p className="text-black/60 text-[0.95rem] leading-relaxed mb-7 line-clamp-3">
              {article.summary}
            </p>
          )}

          {!hasDescription && (
            <p className="text-black/40 text-sm mb-7">
              {format(new Date(article.created_at), 'MMMM d, yyyy')}
            </p>
          )}

          <Link
            to={`/news/${article.id}`}
            className="inline-flex items-center self-start text-black text-[0.85rem] font-medium border border-black/30 px-6 py-2.5 hover:bg-[#48AE92] hover:text-[#3C3C3C] transition-all duration-300 group"
            data-testid={`featured-link-${index}`}
          >
            <span>Find out more</span>
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Image side — always RIGHT, 4:3 ratio */}
        <motion.div
          initial={{ opacity: 0, x: -slideFrom }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative overflow-hidden"
          data-testid={`featured-image-${index}`}
        >
          <div className="relative w-full h-full min-h-[320px] lg:min-h-[400px]">
            <img
              src={article.image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1200'}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <section id="news" data-testid="news-section">
      {/* Featured News — ArcelorMittal layout */}
      {featuredNews.length > 0 && (
        <div className="bg-[#3C3C3C]" data-testid="featured-news-section">
          {featuredNews.map((article, index) => renderFeaturedRow(article, index))}
        </div>
      )}

      {/* Latest News grid below */}
      {otherNews.length > 0 && (
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group"
                  data-testid={`news-card-${index}`}
                >
                  <Link to={`/news/${article.id}`} className="block">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={article.image_url || 'https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=700'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-slate-400 text-xs font-medium mb-2">
                          {format(new Date(article.created_at), 'MMMM d, yyyy')}
                        </p>
                        <h4 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-[#0C765B] transition-colors text-[0.95rem] leading-snug">
                          {article.title}
                        </h4>
                        <span className="inline-flex items-center text-[#0C765B] text-sm font-medium mt-3">
                          Find out more
                        </span>
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
