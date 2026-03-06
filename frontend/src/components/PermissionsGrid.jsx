import React from 'react';
import { Check } from 'lucide-react';

var CMS_SECTIONS = [
  { key: 'news', label: 'News' },
  { key: 'events', label: 'Events' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'employees', label: 'Employees' },
  { key: 'pages', label: 'Page Management' },
  { key: 'menus', label: 'Menu Management' },
  { key: 'hero', label: 'Hero Settings' },
  { key: 'ticker', label: 'Ticker Banner' },
];

function PermCheckbox({ sectionKey, label, checked, onToggle }) {
  var cls = checked
    ? 'border-[#0C765B] bg-[#0C765B]/5 text-[#0C765B]'
    : 'border-slate-200 text-slate-500 hover:border-slate-300';
  var boxCls = checked ? 'bg-[#0C765B] border-[#0C765B]' : 'border-slate-300';
  return (
    <button type="button" onClick={onToggle} className={'flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm text-left transition-all ' + cls} data-testid={'perm-' + sectionKey}>
      <div className={'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ' + boxCls}>
        {checked ? <Check className="w-2.5 h-2.5 text-white" /> : null}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function PermissionsGrid({ permissions, onToggle, onToggleAll, role }) {
  var allKeys = CMS_SECTIONS.map(function(s) { return s.key; });
  var allSelected = allKeys.every(function(k) { return permissions.indexOf(k) >= 0; });

  return (
    <div data-testid="permissions-grid">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-slate-700">
          Section Access
          <span className="text-xs font-normal text-slate-400 ml-1">
            ({role === 'editor' ? 'can view & edit' : 'view only'})
          </span>
        </label>
        <button type="button" onClick={onToggleAll} className="text-xs text-[#0C765B] hover:underline font-medium" data-testid="toggle-all-permissions">
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {CMS_SECTIONS.map(function(section) {
          var isChecked = permissions.indexOf(section.key) >= 0;
          return (
            <PermCheckbox
              key={section.key}
              sectionKey={section.key}
              label={section.label}
              checked={isChecked}
              onToggle={function() { onToggle(section.key); }}
            />
          );
        })}
      </div>
      {permissions.length === 0 ? (
        <p className="text-xs text-amber-600 mt-2">Select at least one section for the user to access</p>
      ) : null}
    </div>
  );
}

export { CMS_SECTIONS, PermissionsGrid };
export default PermissionsGrid;
