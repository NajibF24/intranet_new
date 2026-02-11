import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { apiService } from '../../lib/api';

// Icon mapper for CMS icons
const iconMap = {
  'building': () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  'file-text': () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  'users': () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  'message-square': () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
};

const NavIcon = ({ name }) => {
  const IconFn = iconMap[name];
  return IconFn ? <IconFn /> : null;
};

// Level 3 fly-out menu
const FlyoutMenu = ({ items }) => (
  <div className="absolute left-full top-0 ml-0.5 min-w-[220px] bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-[60]">
    {items.map((item) => (
      <MenuLink key={item.id} item={item} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] transition-colors" />
    ))}
  </div>
);

// Level 2 dropdown item (may have Level 3 children)
const DropdownItem = ({ item }) => {
  const [showFlyout, setShowFlyout] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => hasChildren && setShowFlyout(true)}
      onMouseLeave={() => setShowFlyout(false)}
    >
      <div className="flex items-center justify-between">
        <MenuLink
          item={item}
          className="flex-1 block px-4 py-2.5 text-sm text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] transition-colors"
        />
        {hasChildren && <ChevronRight className="w-3.5 h-3.5 text-slate-400 mr-3" />}
      </div>
      {hasChildren && showFlyout && <FlyoutMenu items={item.children} />}
    </div>
  );
};

// Generic menu link (handles internal/external/anchor links)
const MenuLink = ({ item, className, children }) => {
  const path = item.path || '#';
  const isExternal = path.startsWith('http');
  const target = item.open_in_new_tab ? '_blank' : undefined;

  if (isExternal || item.open_in_new_tab) {
    return (
      <a href={path} target={target} rel="noopener noreferrer" className={className}>
        {children || item.label}
      </a>
    );
  }

  if (path.startsWith('#') || !path) {
    return <span className={className}>{children || item.label}</span>;
  }

  return (
    <Link to={path} className={className}>
      {children || item.label}
    </Link>
  );
};

// Level 1 nav item with dropdown
const NavItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasChildren = item.children && item.children.length > 0;
  const location = useLocation();

  const isActive = item.path && location.pathname.startsWith(item.path) && item.path !== '';

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!hasChildren) {
    return (
      <MenuLink
        item={item}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
          isActive ? 'text-[#0C765B]' : 'text-slate-700 hover:text-[#0C765B]'
        }`}
      >
        {item.icon && <NavIcon name={item.icon} />}
        {item.label}
      </MenuLink>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
          isActive || open ? 'text-[#0C765B]' : 'text-slate-700 hover:text-[#0C765B]'
        }`}
        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {item.icon && <NavIcon name={item.icon} />}
        <span>{item.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[240px] bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
          {item.children.map((child) => (
            <DropdownItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// Mobile menu item with expandable children
const MobileNavItem = ({ item, depth = 0, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex-1 flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50 ${depth > 0 ? 'pl-' + (4 + depth * 4) : ''}`}
            style={{ paddingLeft: depth > 0 ? `${16 + depth * 16}px` : undefined }}
          >
            <span className="flex items-center gap-2">
              {item.icon && <NavIcon name={item.icon} />}
              {item.label}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <MenuLink
            item={item}
            className={`flex-1 flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0C765B]`}
          >
            {item.icon && <NavIcon name={item.icon} />}
            {item.label}
          </MenuLink>
        )}
      </div>
      {hasChildren && expanded && (
        <div className="bg-slate-50/50">
          {item.children.map((child) => (
            <MobileNavItem key={child.id} item={child} depth={depth + 1} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await apiService.getMenus(true);
        setMenuItems(res.data);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      }
    };
    fetchMenu();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="header-logo">
            <div className="w-10 h-10 bg-[#0C765B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GYS</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-slate-900 leading-tight">PT Garuda Yamato Steel</div>
              <div className="text-xs text-slate-500">Intranet Portal</div>
            </div>
          </Link>

          {/* Desktop Nav — dynamic from CMS */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {menuItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg max-h-[80vh] overflow-y-auto" data-testid="mobile-nav">
          {menuItems.map((item) => (
            <MobileNavItem key={item.id} item={item} onClose={() => setMobileOpen(false)} />
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
