import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const milestones = [
  {
    year: '1970',
    position: 'top',
    content: 'PT Gunung Gahapi Sakti was established and became the foundation of what is now known as the Gunung Steel Group. It was among the first rebar steel producers in Indonesia.',
  },
  {
    year: '1989',
    position: 'bottom',
    content: 'PT Gunung Garuda (GRD), the first structural steel manufacturer in Southeast Asia, was established at its current location in Cinitung, West Java.',
  },
  {
    year: '1991',
    position: 'top',
    content: 'PT Gunung Raja Paksi (GRP) was formed, which later acquired the business of GRD in 2017. This strategic move positioned GRP to go public in 2019.',
  },
  {
    year: '2024',
    position: 'bottom',
    content: "Merger took place with new shareholders Yamato, SYS, and Hanwa, leading to the acquisition of GRP's section business.",
    logos: true,
  },
  {
    year: 'Today',
    position: 'top',
    isToday: true,
    content: 'GYS stands as one of the largest private steel companies in Indonesia.',
  },
];

const shareholders = [
  {
    number: 1,
    name: 'Yamato Kogyo Co Ltd',
    percentage: '45%',
    color: '#0C765B',
    logoText: 'Yamato',
    logoStyle: 'italic',
    location: 'Japan',
    established: '1944',
    activity: 'Steel manufacturer operating in six countries, using Electric Arc Furnaces (EAF).',
    product: 'Hot rolled structural steel',
  },
  {
    number: 2,
    name: 'Siam Yamato Steel Co Ltd',
    percentage: '35%',
    subtitle: 'Consolidated subsidiary of Yamato Kogyo',
    color: '#2563EB',
    logoText: 'SYS',
    location: 'Thailand',
    established: '1992',
    activity: 'Steel manufacturer using Electric Arc Furnaces (EAF).',
    product: 'Hot rolled structural steel',
  },
  {
    number: 3,
    name: 'PT Hanwa Indonesia',
    percentage: '15%',
    color: '#0C765B',
    logoText: 'HANWA',
    location: 'Indonesia (Group Company of Hanwa Co., Ltd. Japan)',
    established: '2002 (1947 in Japan)',
    activity: 'Japanese trading company with a strong presence in steel business.',
    product: null,
  },
  {
    number: 4,
    name: 'PT Gunung Raja Paksi Tbk',
    percentage: '5%',
    color: '#DC2626',
    logoText: 'GRP',
    location: 'Indonesia',
    established: '1991',
    activity: 'Steel manufacturer using Electric Arc Furnaces (EAF).',
    product: 'Hot Rolled Coils, Steel Plates',
  },
];

// Timeline pin component
const TimelinePin = ({ isToday }) => (
  <div className={'w-10 h-10 rounded-full flex items-center justify-center shadow-lg ' + (isToday ? 'bg-[#0C765B]' : 'bg-white border-[3px] border-[#0C765B]')}>
    <MapPin className={'w-4 h-4 ' + (isToday ? 'text-white' : 'text-[#0C765B]')} />
  </div>
);

// Shareholder logo component
const ShareholderLogo = ({ sh }) => (
  <div
    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
    style={{ backgroundColor: sh.color + '12', border: '2px solid ' + sh.color + '30' }}
  >
    <span className={'font-black tracking-tight ' + (sh.logoStyle === 'italic' ? 'italic ' : '') + (sh.logoText.length > 4 ? 'text-sm' : 'text-xl')} style={{ color: sh.color }}>
      {sh.logoText}
    </span>
  </div>
);

export const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="history-page">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1666219462105-2909c2d72d01?w=1920&q=80" alt="Corporate History" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6 border border-white/20">Corporate Identity</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" data-testid="history-title">
              Corporate History<br /><span className="text-[#4fd1a5]">& Group Structure</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">Over five decades of excellence — our journey of growth, innovation, and commitment to the steel industry.</p>
          </motion.div>
        </div>
      </div>

      {/* ============ JOURNEY TIMELINE ============ */}
      <div className="bg-[#f5f5f5] py-16 lg:py-24 overflow-hidden" data-testid="journey-timeline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="journey-heading">Our Journey</h2>
            <p className="text-slate-500 max-w-xl mx-auto">From humble beginnings to becoming one of Indonesia's largest private steel companies.</p>
          </motion.div>

          {/* Desktop Horizontal Timeline */}
          <div className="hidden lg:block relative">
            <div className="relative mx-8">
              {/* Green timeline bar */}
              <div className="absolute top-[50%] left-0 right-0 h-3 bg-gradient-to-r from-[#0C765B] via-[#0fa07a] to-[#0C765B] rounded-full transform -translate-y-1/2 shadow-md" />

              <div className="relative grid grid-cols-5 gap-0">
                {milestones.map(function(m, i) {
                  return (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, y: m.position === 'top' ? -30 : 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                      className="relative flex flex-col items-center"
                      data-testid={'milestone-' + m.year.toLowerCase()}
                    >
                      {/* Top content */}
                      {m.position === 'top' && !m.isToday && (
                        <div className="mb-6 px-2">
                          <p className="text-3xl font-black text-[#0C765B] mb-3">{m.year}</p>
                          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-sm text-slate-600 leading-relaxed max-w-[220px]">
                            {m.content}
                          </div>
                        </div>
                      )}

                      {/* Today card (top) */}
                      {m.isToday && (
                        <div className="mb-6 px-2">
                          <div className="bg-[#0C765B] rounded-2xl p-5 shadow-lg text-white max-w-[220px]">
                            <p className="text-2xl font-black mb-2">Today</p>
                            <p className="text-white/90 text-sm leading-relaxed">{m.content}</p>
                          </div>
                        </div>
                      )}

                      {/* Spacer for bottom items */}
                      {m.position === 'bottom' && <div className="mb-6 h-[180px]" />}

                      {/* Pin marker */}
                      <div className="relative z-10 flex-shrink-0">
                        <TimelinePin isToday={m.isToday} />
                        <div className={'absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-[#0C765B]/40 ' + (m.position === 'top' || m.isToday ? 'bottom-full h-6' : 'top-full h-6')} />
                      </div>

                      {/* Bottom content */}
                      {m.position === 'bottom' && (
                        <div className="mt-6 px-2">
                          <p className="text-3xl font-black text-[#0C765B] mb-3">{m.year}</p>
                          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-sm text-slate-600 leading-relaxed max-w-[220px]">
                            {m.content}
                            {m.logos && (
                              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                                <span className="text-xs font-bold text-[#0C765B] italic">Yamato</span>
                                <span className="text-xs font-bold text-[#2563EB]">SYS</span>
                                <span className="text-xs font-bold text-[#0C765B]">HANWA</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bottom spacer for top items */}
                      {(m.position === 'top' || m.isToday) && <div className="mt-6 h-[180px]" />}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="lg:hidden relative">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-[#0C765B]/20 rounded-full" />
            <div className="space-y-8">
              {milestones.map(function(m, i) {
                return (
                  <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative flex gap-6 items-start" data-testid={'mobile-milestone-' + m.year.toLowerCase()}>
                    <div className="relative z-10 flex-shrink-0">
                      <div className={'w-12 h-12 rounded-full flex items-center justify-center shadow-md ' + (m.isToday ? 'bg-[#0C765B]' : 'bg-white border-[3px] border-[#0C765B]')}>
                        <MapPin className={'w-5 h-5 ' + (m.isToday ? 'text-white' : 'text-[#0C765B]')} />
                      </div>
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-2xl font-black text-[#0C765B] mb-2">{m.year}</p>
                      <div className={'rounded-xl p-4 shadow-sm text-sm leading-relaxed ' + (m.isToday ? 'bg-[#0C765B] text-white' : 'bg-white border border-slate-200 text-slate-600')}>
                        {m.content}
                        {m.logos && (
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200">
                            <span className="text-xs font-bold text-[#0C765B] italic">Yamato</span>
                            <span className="text-xs font-bold text-[#2563EB]">SYS</span>
                            <span className="text-xs font-bold text-[#0C765B]">HANWA</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============ SHAREHOLDER STRUCTURE ============ */}
      <div className="bg-white py-16 lg:py-24" data-testid="shareholder-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="shareholder-heading">Shareholder</h2>
            <p className="text-slate-500 max-w-xl mx-auto">The ownership structure of Garuda Yamato Steel — a strong alliance of global steel leaders.</p>
          </motion.div>

          {/* Ownership Diagram */}
          <div className="hidden lg:block mb-16">
            <div className="flex flex-col items-center gap-4">
              {/* Top row */}
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

              {/* Connection top */}
              <div className="flex items-center justify-center">
                <div className="w-24 h-0.5 bg-slate-300" />
                <div className="w-4 h-4 bg-[#0C765B] rounded-full flex-shrink-0" />
                <div className="w-24 h-0.5 bg-slate-300" />
              </div>
              <div className="w-0.5 h-6 bg-slate-300" />

              {/* Center GYS */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-center">
                <div className="w-44 h-44 bg-[#0C765B] rounded-3xl flex flex-col items-center justify-center shadow-xl mx-auto">
                  <span className="text-4xl font-black text-white tracking-tight">GYS</span>
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mt-1">Garuda Yamato Steel</span>
                </div>
              </motion.div>

              {/* Connection bottom */}
              <div className="w-0.5 h-6 bg-slate-300" />
              <div className="flex items-center justify-center">
                <div className="w-24 h-0.5 bg-slate-300" />
                <div className="w-4 h-4 bg-[#0C765B] rounded-full flex-shrink-0" />
                <div className="w-24 h-0.5 bg-slate-300" />
              </div>

              {/* Bottom row */}
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

          {/* Shareholder Detail Cards */}
          <div className="grid md:grid-cols-2 gap-6" data-testid="shareholder-cards">
            {shareholders.map(function(sh, i) {
              return (
                <motion.div key={sh.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow" data-testid={'shareholder-card-' + i}>
                  <div className="flex items-center gap-4 p-6 border-b border-slate-100" style={{ background: sh.color + '08' }}>
                    <ShareholderLogo sh={sh} />
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
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">Location</span>
                      <span className="text-sm text-slate-700">{sh.location}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">Established</span>
                      <span className="text-sm text-slate-700">{sh.established}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">Activity</span>
                      <span className="text-sm text-slate-700">{sh.activity}</span>
                    </div>
                    {sh.product && (
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">Product</span>
                        <span className="text-sm text-slate-700">{sh.product}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
