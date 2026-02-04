import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

// Page header images based on category
const pageImages = {
  corporate: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=80',
  compliance: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80',
  services: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80',
  news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80',
  events: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
  gallery: 'https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1920&q=80',
  default: 'https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=1920&q=80',
};

export const PageContainer = ({ title, subtitle, breadcrumbs = [], category = 'default', children }) => {
  const backgroundImage = pageImages[category] || pageImages.default;

  return (
    <div className="min-h-screen bg-white" data-testid="page-container">
      {/* Hero Header with Image */}
      <div className="relative pt-20 pb-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
          {/* Breadcrumbs */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center space-x-2 text-white/70 text-sm mb-6"
            data-testid="breadcrumbs"
          >
            <Link to="/" className="flex items-center hover:text-white transition-colors">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-4 h-4" />
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </motion.nav>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-white/90 max-w-2xl"
              style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default PageContainer;
