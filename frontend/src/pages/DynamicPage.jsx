import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home, ChevronDown, ExternalLink } from 'lucide-react';
import { apiService } from '../lib/api';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// ============ BLOCK RENDERERS ============

const HeroSimpleBlock = ({ content }) => (
  <div className="relative bg-gradient-to-br from-[#0C765B] to-[#074737] py-24 px-4 text-center" data-testid="block-hero">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
    <div className="max-w-4xl mx-auto relative z-10">
      {content.title && (
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight"
        >
          {content.title}
        </motion.h1>
      )}
      {content.subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/80 max-w-2xl mx-auto"
        >
          {content.subtitle}
        </motion.p>
      )}
    </div>
  </div>
);

const TextBlock = ({ content }) => (
  <div className="max-w-4xl mx-auto px-4 py-12" data-testid="block-text">
    {content.heading && (
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{content.heading}</h2>
    )}
    {content.body && (
      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base">{content.body}</div>
    )}
  </div>
);

const ImageBlock = ({ content }) => (
  <div className="max-w-4xl mx-auto px-4 py-8" data-testid="block-image">
    {content.url && (
      <figure>
        <img
          src={content.url}
          alt={content.caption || ''}
          className="w-full rounded-xl shadow-lg object-cover max-h-[500px]"
        />
        {content.caption && (
          <figcaption className="text-center text-sm text-slate-500 mt-3">{content.caption}</figcaption>
        )}
      </figure>
    )}
  </div>
);

const TwoColumnBlock = ({ content }) => (
  <div className="max-w-5xl mx-auto px-4 py-12" data-testid="block-two-column">
    <div className="grid md:grid-cols-2 gap-8">
      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{content.left_content}</div>
      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{content.right_content}</div>
    </div>
  </div>
);

const CardsBlock = ({ content }) => {
  const items = content.items || [];
  return (
    <div className="max-w-6xl mx-auto px-4 py-12" data-testid="block-cards">
      {content.title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">{content.title}</h2>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const FeaturesBlock = ({ content }) => {
  const items = content.items || [];
  return (
    <div className="max-w-5xl mx-auto px-4 py-12" data-testid="block-features">
      {content.title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">{content.title}</h2>
      )}
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 p-5 bg-slate-50 rounded-xl"
          >
            <div className="w-10 h-10 bg-[#0C765B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 bg-[#0C765B] rounded-full" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CTABlock = ({ content }) => (
  <div className="bg-gradient-to-r from-[#0C765B] to-[#095E49] py-16 px-4 text-center" data-testid="block-cta">
    <div className="max-w-3xl mx-auto">
      {content.title && (
        <h2 className="text-3xl font-bold text-white mb-4">{content.title}</h2>
      )}
      {content.description && (
        <p className="text-white/80 mb-8 text-lg">{content.description}</p>
      )}
      {content.button_text && (
        <Link
          to={content.button_link || '#'}
          className="inline-flex items-center px-8 py-3 bg-white text-[#0C765B] rounded-full font-semibold hover:bg-slate-100 transition-colors"
        >
          {content.button_text}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Link>
      )}
    </div>
  </div>
);

const AccordionBlock = ({ content }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const items = content.items || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" data-testid="block-accordion">
      {content.title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">{content.title}</h2>
      )}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-900">{item.title}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-6 pb-4"
              >
                <p className="text-slate-600 whitespace-pre-wrap">{item.body}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Block renderer mapper
const renderBlock = (block, index) => {
  const key = block.id || index;
  switch (block.type) {
    case 'hero_simple': return <HeroSimpleBlock key={key} content={block.content} />;
    case 'text': return <TextBlock key={key} content={block.content} />;
    case 'image': return <ImageBlock key={key} content={block.content} />;
    case 'two_column': return <TwoColumnBlock key={key} content={block.content} />;
    case 'cards': return <CardsBlock key={key} content={block.content} />;
    case 'features': return <FeaturesBlock key={key} content={block.content} />;
    case 'cta': return <CTABlock key={key} content={block.content} />;
    case 'accordion': return <AccordionBlock key={key} content={block.content} />;
    default: return null;
  }
};

// ============ MAIN COMPONENT ============

export function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.getPageBySlug(slug);
        setPage(res.data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Page not found' : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white" data-testid="dynamic-page-loading">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#0C765B] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-white" data-testid="dynamic-page-error">
        <Header />
        <div className="pt-32 text-center px-4">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-slate-500 mb-8">{error || 'Page not found'}</p>
          <Link to="/" className="text-[#0C765B] hover:underline font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const hasHeroBlock = page.blocks?.some(b => b.type === 'hero_simple');

  return (
    <div className="min-h-screen bg-white" data-testid="dynamic-page">
      <Header />
      
      {/* If no hero block, show a minimal breadcrumb header */}
      {!hasHeroBlock && (
        <div className="pt-24 pb-8 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-3">
              <Link to="/" className="flex items-center hover:text-[#0C765B] transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">{page.title}</span>
            </nav>
            <h1 className="text-3xl font-bold text-slate-900">{page.title}</h1>
          </div>
        </div>
      )}

      {/* Render blocks */}
      <div data-testid="dynamic-page-blocks">
        {page.blocks?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((block, index) => renderBlock(block, index))}
      </div>

      <Footer />
    </div>
  );
}

export default DynamicPage;
