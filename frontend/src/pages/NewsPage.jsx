import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { Input } from '../components/ui/input';
import { apiService } from '../lib/api';
import { format } from 'date-fns';

export const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiService.getNews({ limit: 50 });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = ['all', ...new Set(news.map(n => n.category))];
  
  const filteredNews = news.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = filteredNews.find(n => n.is_featured) || filteredNews[0];
  const otherNews = filteredNews.filter(n => n.id !== featuredNews?.id);

  return (
    <div className="min-h-screen bg-white" data-testid="news-page">
      <Header />
      <PageContainer
        title="News & Announcements"
        subtitle="Stay informed with the latest updates, achievements, and announcements from PT Garuda Yamato Steel."
        breadcrumbs={[
          { label: 'Communication', path: '/' },
          { label: 'News & Announcements' },
        ]}
        category="news"
      >
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="news-search"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0C765B] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredNews && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 group"
              >
                <div className="grid md:grid-cols-2 gap-8 bg-slate-50 rounded-2xl overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={featuredNews.image_url || 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800'}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold w-fit mb-4">
                      Featured
                    </span>
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#0C765B] transition-colors">
                      {featuredNews.title}
                    </h2>
                    <p className="text-slate-600 mb-4">{featuredNews.summary}</p>
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

            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={article.image_url || 'https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=400'}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(article.created_at), 'MMM d, yyyy')}
                      </span>
                      <span className="bg-slate-100 px-2 py-1 rounded">{article.category}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#0C765B] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{article.summary}</p>
                    <Link
                      to={`/news/${article.id}`}
                      className="text-[#0C765B] text-sm font-medium hover:underline inline-flex items-center"
                    >
                      Read More <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                No news articles found matching your criteria.
              </div>
            )}
          </>
        )}
      </PageContainer>
      <Footer />
    </div>
  );
};

export default NewsPage;
