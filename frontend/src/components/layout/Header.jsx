import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Building2, FileText, Users, MessageSquare } from 'lucide-react';
import { apiService } from '../../lib/api';
import { Level2Item, MobileSection } from './NavParts';

var ICONS = { 'building': Building2, 'file-text': FileText, 'users': Users, 'message-square': MessageSquare };

var neonStyle = document.createElement('style');
neonStyle.textContent = [
  '@keyframes neonBreathe {',
  '  0%, 100% { text-shadow: 0 0 4px rgba(12,118,91,0.4), 0 0 8px rgba(12,118,91,0.2); }',
  '  50% { text-shadow: 0 0 8px rgba(12,118,91,0.8), 0 0 20px rgba(12,118,91,0.4), 0 0 30px rgba(12,118,91,0.2); }',
  '}',
  '@keyframes neonBorderBreathe {',
  '  0%, 100% { box-shadow: 0 0 4px rgba(12,118,91,0.3), inset 0 0 4px rgba(12,118,91,0.1); }',
  '  50% { box-shadow: 0 0 10px rgba(12,118,91,0.5), 0 0 20px rgba(12,118,91,0.2), inset 0 0 6px rgba(12,118,91,0.15); }',
  '}',
  '.neon-nav-item {',
  '  animation: neonBreathe 3s ease-in-out infinite;',
  '  color: #e0fff5 !important;',
  '}',
  '.neon-nav-item:hover {',
  '  text-shadow: 0 0 10px rgba(12,118,91,1), 0 0 25px rgba(12,118,91,0.6), 0 0 40px rgba(12,118,91,0.3) !important;',
  '  background: rgba(12,118,91,0.15) !important;',
  '}',
  '.neon-header-bar {',
  '  animation: neonBorderBreathe 3s ease-in-out infinite;',
  '  border-bottom: 1px solid rgba(12,118,91,0.3);',
  '}',
].join('\n');
if (!document.getElementById('neon-navbar-styles')) {
  neonStyle.id = 'neon-navbar-styles';
  document.head.appendChild(neonStyle);
}

export function Header() {
  var [isScrolled, setIsScrolled] = useState(window.scrollY > 20);
  var [mobileOpen, setMobileOpen] = useState(false);
  var [activeDD, setActiveDD] = useState(null);
  var [items, setItems] = useState([]);
  var [navbarTransparent, setNavbarTransparent] = useState(true);
  var loc = useLocation();

  useEffect(function() {
    function onScroll() { setIsScrolled(window.scrollY > 20); }
    onScroll();
    window.addEventListener('scroll', onScroll);
    return function() { window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(function() { setMobileOpen(false); setActiveDD(null); }, [loc]);

  useEffect(function() {
    apiService.getMenus({ visible_only: true }).then(function(r) { setItems(r.data); }).catch(function() {});
    apiService.getHeroSettings().then(function(r) {
      if (r.data && r.data.navbar_transparent !== undefined) {
        setNavbarTransparent(r.data.navbar_transparent);
      }
    }).catch(function() {});
  }, []);

  var isTransparentMode = navbarTransparent && !isScrolled;

  var hdrCls = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ';
  hdrCls += isTransparentMode
    ? 'bg-gradient-to-b from-black/40 via-black/15 to-transparent neon-header-bar'
    : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100';

  var btnCls = isTransparentMode
    ? 'neon-nav-item px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap'
    : 'text-slate-700 hover:text-[#0C765B] hover:bg-[#0C765B]/5 px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap';

  return (
    <header className={hdrCls} data-testid="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0" data-testid="header-logo">
            <img
              src="https://customer-assets.emergentagent.com/job_intranet-hub-12/artifacts/hotpzocu_Logo%20GYS.png"
              alt="GYS Logo"
              className="h-12 w-auto object-contain"
              style={isTransparentMode ? { filter: 'drop-shadow(0 0 6px rgba(12,118,91,0.5))' } : {}}
            />
            <div className="hidden md:block">
              <p className={'font-bold text-base tracking-tight whitespace-nowrap ' + (isTransparentMode ? 'neon-nav-item' : 'text-slate-900')}>PT Garuda Yamato Steel</p>
              <p className={'text-xs ' + (isTransparentMode ? 'text-emerald-200/80' : 'text-slate-500')} style={isTransparentMode ? { textShadow: '0 0 6px rgba(12,118,91,0.4)' } : {}}>Intranet Portal</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0" data-testid="desktop-nav">
            {items.map(function(item, idx) {
              var Ic = ICONS[item.icon];
              var kids = item.children || [];
              if (kids.length === 0) {
                return React.createElement(Link, { key: item.id, to: item.path || '/', className: 'flex items-center space-x-1 ' + btnCls }, Ic ? React.createElement(Ic, { className: 'w-4 h-4' }) : null, item.label);
              }
              return (
                <div key={item.id} className="relative group" onMouseEnter={function() { setActiveDD(idx); }} onMouseLeave={function() { setActiveDD(null); }}>
                  <button className={'flex items-center space-x-1 ' + btnCls} data-testid={'nav-item-' + item.label.toLowerCase().replace(/[\s/]+/g, '-')}>
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

          <button className={'lg:hidden p-2 rounded-lg ' + (isTransparentMode ? 'neon-nav-item' : 'text-slate-700')} onClick={function() { setMobileOpen(!mobileOpen); }} data-testid="mobile-menu-toggle">
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
