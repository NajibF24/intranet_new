import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Building2, FileText, Users, MessageSquare } from 'lucide-react';

const menuItems = [
  {
    label: 'Corporate Identity',
    icon: Building2,
    children: [
      { label: 'Corporate Overview', path: '/corporate/overview' },
      { label: 'Corporate Philosophy', path: '/corporate/philosophy' },
      { label: 'Corporate History & Group Structure', path: '/corporate/history' },
    ],
  },
  {
    label: 'Operational/Compliance',
    icon: FileText,
    children: [
      { label: 'Standard Operating Procedures', path: '/compliance/sop' },
      { label: 'Company Policies', path: '/compliance/policies' },
      { label: 'Safety Guidelines', path: '/compliance/safety' },
    ],
  },
  {
    label: 'Employee Services',
    icon: Users,
    children: [
      { label: 'IT Global Services', path: '/services/it' },
      { label: 'GYS Darwinbox', path: '/services/hr' },
      { label: 'FA E-Asset', path: '/services/fa' },
    ],
  },
  {
    label: 'Communication',
    icon: MessageSquare,
    children: [
      { label: 'News & Announcements', path: '/news' },
      { label: 'Events Calendar', path: '/events' },
      { label: 'Photo Gallery', path: '/gallery' },
    ],
  },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
      data-testid="main-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0" data-testid="header-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_intranet-hub-12/artifacts/hotpzocu_Logo%20GYS.png" 
              alt="GYS Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="hidden md:block">
              <p className={`font-bold text-base tracking-tight whitespace-nowrap ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                PT Garuda Yamato Steel
              </p>
              <p className={`text-xs ${isScrolled ? 'text-slate-500' : 'text-white/70'}`}>
                Intranet Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0" data-testid="desktop-nav">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                    isScrolled
                      ? 'text-slate-700 hover:text-[#0C765B] hover:bg-[#0C765B]/5'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  data-testid={`nav-item-${item.label.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path}
                            className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] transition-colors text-sm font-medium"
                            data-testid={`nav-submenu-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-slate-700' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100"
            data-testid="mobile-menu"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-4">
                  <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      to={child.path}
                      className="block px-4 py-3 text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <Link
                to="/admin"
                className="block w-full px-4 py-3 bg-[#0C765B] text-white text-center rounded-lg font-medium mt-4"
              >
                Admin Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
