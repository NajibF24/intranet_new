import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { apiService } from '../lib/api';
import { format } from 'date-fns';

export const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiService.getNewsById(id);
        setNews(response.data);
        
        // Fetch related news
        const allNews = await apiService.getNews({ limit: 4 });
        setRelatedNews(allNews.data.filter(n => n.id !== id).slice(0, 3));
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 w-3/4 rounded" />
            <div className="h-4 bg-slate-200 w-1/2 rounded" />
            <div className="h-96 bg-slate-200 rounded-xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-16 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">News Not Found</h1>
          <Link to="/news" className="text-[#0C765B] hover:underline">
            Back to News
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="news-detail-page">
      <Header />
      
      {/* Hero Image */}
      <div className="relative pt-20">
        <div className="h-[50vh] min-h-[400px] relative">
          <img
            src={news.image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1920'}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to="/news"
                  className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to News
                </Link>
                <div className="flex items-center space-x-4 text-white/80 text-sm mb-3">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(news.created_at), 'MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                    <Tag className="w-3 h-3 mr-1" />
                    {news.category}
                  </span>
                  {news.is_featured && (
                    <span className="bg-amber-500 px-3 py-1 rounded-full text-white text-xs font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {news.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Summary */}
          <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium">
            {news.summary}
          </p>

          {/* Main Content */}
          <div className="prose prose-lg prose-slate max-w-none">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-slate-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share this article
              </span>
              <div className="flex space-x-3">
                <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Related News</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={article.image_url || 'https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=400'}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-slate-500">
                      {format(new Date(article.created_at), 'MMM d, yyyy')}
                    </span>
                    <h3 className="font-semibold text-slate-900 mt-1 line-clamp-2 group-hover:text-[#0C765B] transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;
