import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';

export function Level2Item(props) {
  var child = props.child;
  var kids = child.children || [];
  var hasKids = kids.length > 0;
  var [showFlyout, setShowFlyout] = useState(false);

  if (!hasKids) {
    return (
      <Link
        to={child.path || '#'}
        className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] transition-colors text-sm font-medium"
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
          {kids.map(function(gc) {
            return (
              <Link key={gc.id} to={gc.path || '#'} className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] transition-colors text-sm font-medium">
                {gc.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MobileSection(props) {
  var item = props.item;
  var [expanded, setExpanded] = useState(false);
  var kids = item.children || [];
  var hasKids = kids.length > 0;

  return (
    <div className="mb-4">
      {hasKids ? (
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
      {hasKids && expanded && kids.map(function(child) {
        return (
          <Link key={child.id} to={child.path || '#'} className="block px-4 py-3 text-slate-700 hover:bg-[#0C765B]/5 hover:text-[#0C765B] rounded-lg transition-colors">
            {child.label}
          </Link>
        );
      })}
    </div>
  );
}
