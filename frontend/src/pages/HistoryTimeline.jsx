import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const milestones = [
  { year: '1970', position: 'top', content: 'PT Gunung Gahapi Sakti was established and became the foundation of what is now known as the Gunung Steel Group. It was among the first rebar steel producers in Indonesia.' },
  { year: '1989', position: 'bottom', content: 'PT Gunung Garuda (GRD), the first structural steel manufacturer in Southeast Asia, was established at its current location in Cinitung, West Java.' },
  { year: '1991', position: 'top', content: 'PT Gunung Raja Paksi (GRP) was formed, which later acquired the business of GRD in 2017. This strategic move positioned GRP to go public in 2019.' },
  { year: '2024', position: 'bottom', content: "Merger took place with new shareholders Yamato, SYS, and Hanwa, leading to the acquisition of GRP's section business.", logos: true },
  { year: 'Today', position: 'top', isToday: true, content: 'GYS stands as one of the largest private steel companies in Indonesia.' },
];

const LogoBadges = () => (
  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
    <span className="text-xs font-bold text-[#0C765B] italic">Yamato</span>
    <span className="text-xs font-bold text-[#2563EB]">SYS</span>
    <span className="text-xs font-bold text-[#0C765B]">HANWA</span>
  </div>
);

export const JourneyTimeline = () => (
  <div className="bg-[#f5f5f5] py-16 lg:py-24 overflow-hidden" data-testid="journey-timeline">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="journey-heading">Our Journey</h2>
        <p className="text-slate-500 max-w-xl mx-auto">From humble beginnings to becoming one of Indonesia's largest private steel companies.</p>
      </motion.div>

      {/* Desktop Timeline */}
      <div className="hidden lg:block relative">
        <div className="relative mx-8">
          <div className="absolute top-[50%] left-0 right-0 h-3 bg-gradient-to-r from-[#0C765B] via-[#0fa07a] to-[#0C765B] rounded-full transform -translate-y-1/2 shadow-md" />
          <div className="relative grid grid-cols-5 gap-0">
            {milestones.map(function(m, i) {
              const pinClass = m.isToday ? 'bg-[#0C765B]' : 'bg-white border-[3px] border-[#0C765B]';
              const iconClass = m.isToday ? 'text-white' : 'text-[#0C765B]';
              const linePos = (m.position === 'top' || m.isToday) ? 'bottom-full h-6' : 'top-full h-6';
              return (
                <motion.div key={m.year} initial={{ opacity: 0, y: m.position === 'top' ? -30 : 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }} className="relative flex flex-col items-center" data-testid={'milestone-' + m.year.toLowerCase()}>
                  {m.position === 'top' && !m.isToday && (
                    <div className="mb-6 px-2">
                      <p className="text-3xl font-black text-[#0C765B] mb-3">{m.year}</p>
                      <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-sm text-slate-600 leading-relaxed max-w-[220px]">{m.content}</div>
                    </div>
                  )}
                  {m.isToday && (
                    <div className="mb-6 px-2">
                      <div className="bg-[#0C765B] rounded-2xl p-5 shadow-lg text-white max-w-[220px]">
                        <p className="text-2xl font-black mb-2">Today</p>
                        <p className="text-white/90 text-sm leading-relaxed">{m.content}</p>
                      </div>
                    </div>
                  )}
                  {m.position === 'bottom' && <div className="mb-6 h-[180px]" />}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={'w-10 h-10 rounded-full flex items-center justify-center shadow-lg ' + pinClass}>
                      <MapPin className={'w-4 h-4 ' + iconClass} />
                    </div>
                    <div className={'absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-[#0C765B]/40 ' + linePos} />
                  </div>
                  {m.position === 'bottom' && (
                    <div className="mt-6 px-2">
                      <p className="text-3xl font-black text-[#0C765B] mb-3">{m.year}</p>
                      <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-sm text-slate-600 leading-relaxed max-w-[220px]">
                        {m.content}
                        {m.logos && <LogoBadges />}
                      </div>
                    </div>
                  )}
                  {(m.position === 'top' || m.isToday) && <div className="mt-6 h-[180px]" />}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden relative">
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-[#0C765B]/20 rounded-full" />
        <div className="space-y-8">
          {milestones.map(function(m, i) {
            const mobPin = m.isToday ? 'bg-[#0C765B]' : 'bg-white border-[3px] border-[#0C765B]';
            const mobIcon = m.isToday ? 'text-white' : 'text-[#0C765B]';
            const mobCard = m.isToday ? 'bg-[#0C765B] text-white' : 'bg-white border border-slate-200 text-slate-600';
            return (
              <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative flex gap-6 items-start">
                <div className="relative z-10 flex-shrink-0">
                  <div className={'w-12 h-12 rounded-full flex items-center justify-center shadow-md ' + mobPin}>
                    <MapPin className={'w-5 h-5 ' + mobIcon} />
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-2xl font-black text-[#0C765B] mb-2">{m.year}</p>
                  <div className={'rounded-xl p-4 shadow-sm text-sm leading-relaxed ' + mobCard}>
                    {m.content}
                    {m.logos && <LogoBadges />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
