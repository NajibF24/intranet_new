import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, Building2, FileText, Users, MessageSquare } from 'lucide-react';
import { apiService } from '../../lib/api';

var iconMap = {
  'building': Building2,
  'file-text': FileText,
  'users': Users,
  'message-square': MessageSquare,
};

export function Header() {
  var [isScrolled, setIsScrolled] = useState(false);
  var [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  var [activeDropdown, setActiveDropdown] = useState(null);
  var [menuItems, setMenuItems] = useState([]);
  var location = useLocation();

  useEffect(function() {
    var handleScroll = function() {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return function() { window.removeEventListener('scroll', handleScroll); };
  }, []);

  useEffect(function() {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(function() {
    apiService.getMenus({ visible_only: true })
      .then(function(res) { setMenuItems(res.data); })
      .catch(function() {});
  }, []);

  return (
    <header
      className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' + (
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      )}
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
              <p className={'font-bold text-base tracking-tight whitespace-nowrap ' + (isScrolled ? 'text-slate-900' : 'text-white')}>
                PT Garuda Yamato Steel
              </p>
              <p className={'text-xs ' + (isScrolled ? 'text-slate-500' : 'text-white/70')}>
                Intranet Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation — dynamic from CMS */}
          <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0" data-testid="desktop-nav">
            {menuItems.map(function(item, index) {
              var IconComp = iconMap[item.icon];
              var hasChildren = item.children && item.children.length > 0;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.id}
                    to={item.path || '/'}
                    className={'flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ' + (
                      isScrolled
                        ? 'text-slate-700 hover:text-[#0C765B] hover:bg-[#0C765B]/5'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {IconComp ? <IconComp className="w-4 h-4" /> : null}
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={function() { setActiveDropdown(index); }}
                  onMouseLeave={function() { setActiveDropdown(null); }}
                >
                  <button
                    className={'flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ' + (
                      isScrolled
                        ? 'text-slate-700 hover:text-[#0C765B] hover:bg-[#0C765B]/5'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    )}
                    data-testid={'nav-item-' + item.label.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')}
                  >
                    {IconComp ? <IconComp className="w-4 h-4" /> : null}
                    <span>{item.label}</span>
                    <ChevronDown className={'w-4 h-4 transition-transform ' + (activeDropdown === index ? 'rotate-180' : '')} />
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
                          {item.children.map(function(child) {
                            var childHasKids = child.children && child.children.length > 0;
                            return (
                              <Level2Item key={child.id} child={child} hasKids={childHasKids} />
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              className={'lg:hidden p-2 rounded-lg ' + (isScrolled ? 'text-slate-700' : 'text-white')}
              onClick={function() { setIsMobileMenuOpen(!isMobileMenuOpen); }}
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
              {menuItems.map(function(item) {
                return (
                  <MobileSection key={item.id} item={item} />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Level 2 dropdown item with optional Level 3 flyout
function Level2Item(props) {
  var child = props.child;
  var hasKids = props.hasKids;
  var [showFlyout, setShowFlyout] = useState(false);

  if (!hasKids) {
    return (
      <Link
        to={child.path || '#'}
        className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] transition-colors text-sm font-medium"
        data-testid={'nav-submenu-' + child.label.toLowerCase().replace(/\s+/g, '-')}
      >
        {child.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={function() { setShowFlyout(true); }}
      onMouseLeave={function() { setShowFlyout(false); }}
    >
      <div className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] transition-colors text-sm font-medium cursor-pointer">
        <span>{child.label}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
      </div>
      {showFlyout && (
        <div className="absolute left-full top-0 ml-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-[60]">
          {child.children.map(function(grandchild) {
            return (
              <Link
                key={grandchild.id}
                to={grandchild.path || '#'}
                className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] transition-colors text-sm font-medium"
              >
                {grandchild.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Mobile expandable section
function MobileSection(props) {
  var item = props.item;
  var [expanded, setExpanded] = useState(false);
  var hasChildren = item.children && item.children.length > 0;

  return (
    <div className="mb-4">
      {hasChildren ? (
        <button
          onClick={function() { setExpanded(!expanded); }}
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider"
        >
          <span>{item.label}</span>
          <ChevronDown className={'w-4 h-4 transition-transform ' + (expanded ? 'rotate-180' : '')} />
        </button>
      ) : (
        <Link to={item.path || '/'} className="block px-4 py-3 text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] rounded-lg transition-colors">
          {item.label}
        </Link>
      )}
      {hasChildren && expanded && item.children.map(function(child) {
        return (
          <Link
            key={child.id}
            to={child.path || '#'}
            className="block px-4 py-3 text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] rounded-lg transition-colors"
          >
            {child.label}
          </Link>
        );
      })}
    </div>
  );
}

export default Header;
