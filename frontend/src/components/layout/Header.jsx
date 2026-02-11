import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Building2, FileText, Users, MessageSquare } from 'lucide-react';
import { apiService } from '../../lib/api';
import { Level2Item, MobileSection } from './NavParts';

var ICONS = { 'building': Building2, 'file-text': FileText, 'users': Users, 'message-square': MessageSquare };

export function Header() {
  var [isScrolled, setIsScrolled] = useState(false);
  var [mobileOpen, setMobileOpen] = useState(false);
  var [activeDD, setActiveDD] = useState(null);
  var [items, setItems] = useState([]);
  var loc = useLocation();

  useEffect(function() {
    function onScroll() { setIsScrolled(window.scrollY > 20); }
    window.addEventListener('scroll', onScroll);
    return function() { window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(function() { setMobileOpen(false); setActiveDD(null); }, [loc]);

  useEffect(function() {
    apiService.getMenus({ visible_only: true }).then(function(r) { setItems(r.data); }).catch(function() {});
  }, []);

  var hdrCls = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ';
  hdrCls += isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-transparent';

  var btnCls = isScrolled
    ? 'text-slate-700 hover:text-[#0C765B] hover:bg-[#0C765B]/5'
    : 'text-white/90 hover:text-white hover:bg-white/10';

  return (
    <header className={hdrCls} data-testid="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0" data-testid="header-logo">
            <img src="https://customer-assets.emergentagent.com/job_intranet-hub-12/artifacts/hotpzocu_Logo%20GYS.png" alt="GYS Logo" className="h-12 w-auto object-contain" />
            <div className="hidden md:block">
              <p className={'font-bold text-base tracking-tight whitespace-nowrap ' + (isScrolled ? 'text-slate-900' : 'text-white')}>PT Garuda Yamato Steel</p>
              <p className={'text-xs ' + (isScrolled ? 'text-slate-500' : 'text-white/70')}>Intranet Portal</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0" data-testid="desktop-nav">
            {items.map(function(item, idx) {
              var Ic = ICONS[item.icon];
              var kids = item.children || [];
              if (kids.length === 0) {
                return React.createElement(Link, { key: item.id, to: item.path || '/', className: 'flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ' + btnCls }, Ic ? React.createElement(Ic, { className: 'w-4 h-4' }) : null, item.label);
              }
              return (
                <div key={item.id} className="relative group" onMouseEnter={function() { setActiveDD(idx); }} onMouseLeave={function() { setActiveDD(null); }}>
                  <button className={'flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ' + btnCls} data-testid={'nav-item-' + item.label.toLowerCase().replace(/[\s/]+/g, '-')}>
                    {Ic ? React.createElement(Ic, { className: 'w-4 h-4' }) : null}
                    <span>{item.label}</span>
                    <ChevronDown className={'w-4 h-4 transition-transform ' + (activeDD === idx ? 'rotate-180' : '')} />
                  </button>
                  <AnimatePresence>
                    {activeDD === idx ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }} className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="p-2">
                          {kids.map(function(c) { return React.createElement(Level2Item, { key: c.id, child: c }); })}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <button className={'lg:hidden p-2 rounded-lg ' + (isScrolled ? 'text-slate-700' : 'text-white')} onClick={function() { setMobileOpen(!mobileOpen); }} data-testid="mobile-menu-toggle">
            {mobileOpen ? React.createElement(X, { className: 'w-6 h-6' }) : React.createElement(Menu, { className: 'w-6 h-6' })}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-slate-100" data-testid="mobile-menu">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {items.map(function(it) { return React.createElement(MobileSection, { key: it.id, item: it }); })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export default Header;
