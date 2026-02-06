import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { ExternalLink, Maximize2, Minimize2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const EmbeddedServicePage = ({ 
  title, 
  subtitle, 
  externalUrl, 
  fallbackMessage,
  icon: Icon,
  breadcrumbs 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);

  // Set a timeout for iframe loading - if it doesn't load in 10 seconds, show fallback
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded) {
        setLoadTimeout(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [iframeLoaded]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoaded(true);
  };

  const handleRefresh = () => {
    setIframeLoaded(false);
    setIframeError(false);
    const iframe = document.getElementById('service-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleOpenExternal = () => {
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white" data-testid="fullscreen-iframe">
        {/* Fullscreen Header */}
        <div className="h-14 bg-[#0C765B] flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="w-5 h-5 text-white" />}
            <span className="text-white font-semibold">{title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenExternal}
              className="text-white hover:bg-white/20"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="text-white hover:bg-white/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Fullscreen Iframe */}
        <iframe
          id="service-iframe"
          src={externalUrl}
          className="w-full h-[calc(100vh-56px)]"
          title={title}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="fullscreen; clipboard-read; clipboard-write"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="embedded-service-page">
      <Header />
      
      {/* Page Header */}
      <div className="bg-[#0C765B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">Home</a>
            {breadcrumbs?.map((crumb, index) => (
              <React.Fragment key={index}>
                <span>›</span>
                {crumb.path ? (
                  <a href={crumb.path} className="hover:text-white">{crumb.label}</a>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {Icon && (
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
                <p className="text-white/80 mt-1">{subtitle}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="border-white/30 text-white hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="border-white/30 text-white hover:bg-white/20"
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenExternal}
                className="border-white/30 text-white hover:bg-white/20"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)}>
          <Maximize2 className="w-4 h-4 mr-2" />
          Fullscreen
        </Button>
        <Button variant="outline" size="sm" onClick={handleOpenExternal}>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Iframe Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200"
        >
          {/* Loading State */}
          {!iframeLoaded && (
            <div className="h-[70vh] flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#0C765B]/20 border-t-[#0C765B] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading {title}...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {iframeError && (
            <div className="h-[70vh] flex items-center justify-center bg-slate-50">
              <div className="text-center max-w-md px-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Unable to Load in Frame</h3>
                <p className="text-slate-600 mb-6">
                  {fallbackMessage || `This service cannot be embedded. Please click the button below to access ${title} directly.`}
                </p>
                <Button onClick={handleOpenExternal} className="bg-[#0C765B] hover:bg-[#095E49]">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open {title}
                </Button>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            id="service-iframe"
            src={externalUrl}
            className={`w-full h-[70vh] ${!iframeLoaded || iframeError ? 'hidden' : ''}`}
            title={title}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="fullscreen; clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          />
        </motion.div>

        {/* Info Note */}
        <p className="text-center text-sm text-slate-500 mt-4">
          Having trouble? <button onClick={handleOpenExternal} className="text-[#0C765B] hover:underline">Open in new tab</button>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default EmbeddedServicePage;
