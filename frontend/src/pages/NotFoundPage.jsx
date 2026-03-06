import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="not-found-page">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-[#0C765B] font-bold text-lg mb-2">404</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
          <p className="text-slate-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0C765B] text-white rounded-lg font-medium hover:bg-[#095E49] transition-colors"
              data-testid="go-home-btn"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <button
              onClick={function() { window.history.back(); }}
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              data-testid="go-back-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
