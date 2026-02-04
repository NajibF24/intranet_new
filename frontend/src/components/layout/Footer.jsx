import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { apiService } from '../../lib/api';

export const Footer = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiService.getNews({ limit: 5 });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news for ticker:', error);
      }
    };
    fetchNews();
  }, []);

  const tickerContent = news.length > 0
    ? news.map(n => n.title).join(' * ')
    : 'Loading latest news...';

  return (
    <footer className="bg-slate-900 text-white" data-testid="main-footer">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_intranet-hub-12/artifacts/hotpzocu_Logo%20GYS.png" 
                alt="GYS Logo"
                className="h-14 w-auto object-contain"
              />
              <div>
                <p className="font-bold text-lg">PT Garuda Yamato Steel</p>
                <p className="text-slate-400 text-sm">Intranet Portal</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              A leading steel manufacturer committed to quality, innovation, and sustainability. 
              Building Indonesia&apos;s future with premium steel products.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-[#0C765B]" />
                <span>Jl. Industri Raya No. 123, Cikarang, Bekasi</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-[#0C765B]" />
                <span>+62 21 8900 1234</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-[#0C765B]" />
                <span>info@gys.co.id</span>
              </div>
            </div>
          </div>

          {/* Corporate Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Corporate Identity</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/corporate/vision" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  Company Vision
                </Link>
              </li>
              <li>
                <Link to="/corporate/mission" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  Company Mission
                </Link>
              </li>
              <li>
                <Link to="/corporate/about" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  About GYS
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Operational/Compliance</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/compliance/sop" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  Standard Operating Procedures
                </Link>
              </li>
              <li>
                <Link to="/compliance/policies" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  Company Policies
                </Link>
              </li>
              <li>
                <Link to="/compliance/safety" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  Safety Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Social */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Employee Services</h3>
            <ul className="space-y-3 mb-8">
              <li>
                <Link to="/services/it" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  IT Global Services
                </Link>
              </li>
              <li>
                <Link to="/services/hr" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  HR Darwinbox
                </Link>
              </li>
              <li>
                <Link to="/services/fa" className="text-slate-400 hover:text-[#0C765B] transition-colors text-sm">
                  FA E-Asset
                </Link>
              </li>
            </ul>

            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#0C765B] transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#0C765B] transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#0C765B] transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#0C765B] transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} PT Garuda Yamato Steel. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-slate-500 hover:text-slate-300 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-500 hover:text-slate-300 text-sm">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="bg-[#0C765B] py-3 overflow-hidden" data-testid="news-ticker">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-amber-500 px-4 py-1 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">Latest News</span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="ticker-animate whitespace-nowrap inline-block">
              <span className="text-white/90 text-sm px-8">
                {tickerContent} * {tickerContent}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
