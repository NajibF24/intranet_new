import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X, Building2, FileText, Users, MessageSquare } from 'lucide-react';
import { apiService } from '../../lib/api';

function getIcon(name) {
  const icons = { 'building': Building2, 'file-text': FileText, 'users': Users, 'message-square': MessageSquare };
  const Icon = icons[name];
  if (!Icon) return null;
  return React.createElement(Icon, { className: 'w-4 h-4' });
}

function MenuLink(props) {
  const { item, className, children } = props;
  const path = item.path || '';
  const isExternal = path.startsWith('http');

  if (isExternal || item.open_in_new_tab) {
    return React.createElement('a', { href: path || '#', target: '_blank', rel: 'noopener noreferrer', className }, children || item.label);
  }
  if (!path || path === '#') {
    return React.createElement('span', { className }, children || item.label);
  }
  return React.createElement(Link, { to: path, className }, children || item.label);
}

function Level3Flyout(props) {
  const items = props.items || [];
  return (
    <div className="absolute left-full top-0 ml-0.5 min-w-[220px] bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-[60]">
      {items.map(function(item) {
        return (
          <MenuLink key={item.id} item={item} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors" />
        );
      })}
    </div>
  );
}

function DropdownChild(props) {
  const item = props.item;
  const [flyout, setFlyout] = useState(false);
  const kids = item.children || [];
  const hasKids = kids.length > 0;

  return (
    <div className="relative" onMouseEnter={function() { if (hasKids) setFlyout(true); }} onMouseLeave={function() { setFlyout(false); }}>
      <div className="flex items-center">
        <MenuLink item={item} className="flex-1 block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors" />
        {hasKids && <ChevronRight className="w-3.5 h-3.5 text-slate-400 mr-3 flex-shrink-0" />}
      </div>
      {hasKids && flyout && <Level3Flyout items={kids} />}
    </div>
  );
}

function NavItem(props) {
  const item = props.item;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const kids = item.children || [];
  const hasKids = kids.length > 0;

  useEffect(function() {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return function() { document.removeEventListener('mousedown', handleClick); };
  }, []);

  if (!hasKids) {
    return (
      <MenuLink item={item} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors rounded-md">
        {item.icon ? getIcon(item.icon) : null}
        {item.label}
      </MenuLink>
    );
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={function() { setOpen(true); }} onMouseLeave={function() { setOpen(false); }}>
      <button
        className={'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ' + (open ? 'text-emerald-700' : 'text-slate-700 hover:text-emerald-700')}
        data-testid={'nav-' + item.label.toLowerCase().replace(/\s+/g, '-')}
      >
        {item.icon ? getIcon(item.icon) : null}
        <span>{item.label}</span>
        <ChevronDown className={'w-3.5 h-3.5 transition-transform ' + (open ? 'rotate-180' : '')} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[240px] bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
          {kids.map(function(child) {
            return <DropdownChild key={child.id} item={child} />;
          })}
        </div>
      )}
    </div>
  );
}

function MobileItem(props) {
  const item = props.item;
  const depth = props.depth || 0;
  const [expanded, setExpanded] = useState(false);
  const kids = item.children || [];
  const hasKids = kids.length > 0;
  var padLeft = depth > 0 ? (16 + depth * 16) + 'px' : undefined;

  return (
    <div>
      {hasKids ? (
        <button
          onClick={function() { setExpanded(!expanded); }}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
          style={{ paddingLeft: padLeft }}
        >
          <span className="flex items-center gap-2">
            {item.icon ? getIcon(item.icon) : null}
            {item.label}
          </span>
          <ChevronDown className={'w-4 h-4 transition-transform ' + (expanded ? 'rotate-180' : '')} />
        </button>
      ) : (
        <MenuLink
          item={item}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
        >
          {item.icon ? getIcon(item.icon) : null}
          {item.label}
        </MenuLink>
      )}
      {hasKids && expanded && (
        <div className="bg-slate-50/50">
          {kids.map(function(child) {
            return <MobileItem key={child.id} item={child} depth={depth + 1} />;
          })}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(function() {
    apiService.getMenus({ visible_only: true })
      .then(function(res) { setMenuItems(res.data); })
      .catch(function() {});
  }, []);

  useEffect(function() {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3" data-testid="header-logo">
            <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GYS</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-slate-900 leading-tight">PT Garuda Yamato Steel</div>
              <div className="text-xs text-slate-500">Intranet Portal</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {menuItems.map(function(item) {
              return <NavItem key={item.id} item={item} />;
            })}
          </nav>

          <button
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={function() { setMobileOpen(!mobileOpen); }}
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg max-h-[80vh] overflow-y-auto" data-testid="mobile-nav">
          {menuItems.map(function(item) {
            return <MobileItem key={item.id} item={item} />;
          })}
        </div>
      )}
    </header>
  );
}

export default Header;
