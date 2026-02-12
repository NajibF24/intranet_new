import React from 'react';
import { motion } from 'framer-motion';

const shareholders = [
  { number: 1, name: 'Yamato Kogyo Co Ltd', percentage: '45%', color: '#0C765B', logoText: 'Yamato', logoStyle: 'italic', location: 'Japan', established: '1944', activity: 'Steel manufacturer operating in six countries, using Electric Arc Furnaces (EAF).', product: 'Hot rolled structural steel' },
  { number: 2, name: 'Siam Yamato Steel Co Ltd', percentage: '35%', subtitle: 'Consolidated subsidiary of Yamato Kogyo', color: '#2563EB', logoText: 'SYS', location: 'Thailand', established: '1992', activity: 'Steel manufacturer using Electric Arc Furnaces (EAF).', product: 'Hot rolled structural steel' },
  { number: 3, name: 'PT Hanwa Indonesia', percentage: '15%', color: '#0C765B', logoText: 'HANWA', location: 'Indonesia (Group Company of Hanwa Co., Ltd. Japan)', established: '2002 (1947 in Japan)', activity: 'Japanese trading company with a strong presence in steel business.', product: null },
  { number: 4, name: 'PT Gunung Raja Paksi Tbk', percentage: '5%', color: '#DC2626', logoText: 'GRP', location: 'Indonesia', established: '1991', activity: 'Steel manufacturer using Electric Arc Furnaces (EAF).', product: 'Hot Rolled Coils, Steel Plates' },
];

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{label}</span>
    <span className="text-sm text-slate-700">{value}</span>
  </div>
);

export const ShareholderSection = () => (
  <div className="bg-white py-16 lg:py-24" data-testid="shareholder-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="shareholder-heading">Shareholder</h2>
        <p className="text-slate-500 max-w-xl mx-auto">The ownership structure of Garuda Yamato Steel — a strong alliance of global steel leaders.</p>
      </motion.div>

      {/* Diagram */}
      <div className="hidden lg:block mb-16">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-16">
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <div className="w-32 h-32 bg-white border-2 border-[#0C765B] rounded-2xl flex items-center justify-center shadow-lg mb-2 mx-auto">
                <span className="text-2xl font-black text-[#0C765B] italic tracking-tight">Yamato</span>
              </div>
              <p className="text-sm font-bold text-slate-900">45%</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-center">
              <div className="w-32 h-32 bg-white border-2 border-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg mb-2 mx-auto">
                <span className="text-2xl font-black text-[#2563EB] tracking-tight">SYS</span>
              </div>
              <p className="text-sm font-bold text-slate-900">35%</p>
            </motion.div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-24 h-0.5 bg-slate-300" />
            <div className="w-4 h-4 bg-[#0C765B] rounded-full flex-shrink-0" />
            <div className="w-24 h-0.5 bg-slate-300" />
          </div>
          <div className="w-0.5 h-6 bg-slate-300" />
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="w-44 h-44 bg-[#0C765B] rounded-3xl flex flex-col items-center justify-center shadow-xl mx-auto">
              <span className="text-4xl font-black text-white tracking-tight">GYS</span>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mt-1">Garuda Yamato Steel</span>
            </div>
          </motion.div>
          <div className="w-0.5 h-6 bg-slate-300" />
          <div className="flex items-center justify-center">
            <div className="w-24 h-0.5 bg-slate-300" />
            <div className="w-4 h-4 bg-[#0C765B] rounded-full flex-shrink-0" />
            <div className="w-24 h-0.5 bg-slate-300" />
          </div>
          <div className="flex items-center justify-center gap-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-center">
              <div className="w-32 h-32 bg-white border-2 border-[#DC2626] rounded-2xl flex flex-col items-center justify-center shadow-lg mb-2 mx-auto">
                <span className="text-2xl font-black text-[#DC2626] tracking-tight">GRP</span>
                <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Shaping Tomorrow</span>
              </div>
              <p className="text-sm font-bold text-slate-900">5%</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-center">
              <div className="w-32 h-32 bg-white border-2 border-[#0C765B] rounded-2xl flex items-center justify-center shadow-lg mb-2 mx-auto">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 border-2 border-[#0C765B] rotate-45 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-[#0C765B] -rotate-45">HK</span>
                  </div>
                  <span className="text-lg font-black text-[#0C765B] tracking-tight">HANWA</span>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-900">15%</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6" data-testid="shareholder-cards">
        {shareholders.map(function(sh, i) {
          const textSize = sh.logoText.length > 4 ? 'text-sm' : 'text-xl';
          const isItalic = sh.logoStyle === 'italic' ? 'italic ' : '';
          return (
            <motion.div key={sh.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow" data-testid={'shareholder-card-' + i}>
              <div className="flex items-center gap-4 p-6 border-b border-slate-100" style={{ background: sh.color + '08' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: sh.color + '12', border: '2px solid ' + sh.color + '30' }}>
                  <span className={'font-black tracking-tight ' + isItalic + textSize} style={{ color: sh.color }}>{sh.logoText}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: sh.color }}>{sh.number}</span>
                    <span className="text-lg font-bold text-slate-900 truncate">{sh.name}</span>
                  </div>
                  {sh.subtitle && <p className="text-xs text-slate-500">{sh.subtitle}</p>}
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: sh.color }}>{sh.percentage}</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <InfoRow label="Location" value={sh.location} />
                <InfoRow label="Established" value={sh.established} />
                <InfoRow label="Activity" value={sh.activity} />
                {sh.product && <InfoRow label="Product" value={sh.product} />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);
