import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';

const EmbeddedServicePage = ({ 
  title, 
  subtitle, 
  externalUrl, 
  icon: Icon,
  breadcrumbs 
}) => {

  const handleOpenExternal = () => {
    // Membuka link di tab baru dengan fitur keamanan (noopener, noreferrer)
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" data-testid="embedded-service-page">
      <Header />
      
      {/* --- Page Header Area --- */}
      <div className="bg-[#0C765B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-white/70 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            {breadcrumbs?.map((crumb, index) => (
              <React.Fragment key={index}>
                <span>›</span>
                {crumb.path ? (
                  <a href={crumb.path} className="hover:text-white transition-colors">{crumb.label}</a>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              {Icon && (
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner border border-white/20">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
                <p className="text-white/80 mt-2 text-lg max-w-2xl">{subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content (Gateway Card) --- */}
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="p-8 md:p-16 text-center">
              
              {/* Central Icon */}
              <div className="w-24 h-24 bg-[#0C765B]/5 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-[#0C765B]/10 rounded-full animate-pulse" />
                <ExternalLink className="w-10 h-10 text-[#0C765B] relative z-10" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Launch External Portal
              </h2>
              
              <p className="text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed text-lg">
                This application is hosted on a secure external server. 
                To ensure the best performance and security, please access the dashboard in a new browser tab.
              </p>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={handleOpenExternal} 
                  className="bg-[#0C765B] hover:bg-[#095E49] text-white px-10 py-7 text-lg rounded-xl shadow-lg shadow-[#0C765B]/20 transition-all hover:scale-105 group"
                >
                  <span>Open {title}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Security Note */}
              <div className="mt-12 flex items-center justify-center text-sm text-slate-400 gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Connection via GYS Network</span>
              </div>

            </div>
            
            {/* Bottom Info Strip */}
            <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 text-center text-sm text-slate-500">
              Need help accessing? Contact IT Support at <a href="mailto:it.helpdesk@gyssteel.com" className="text-[#0C765B] font-medium hover:underline">it.support@gys.co.id</a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmbeddedServicePage;
