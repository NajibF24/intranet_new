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

const YAMATO_LOGO = 'https://customer-assets.emergentagent.com/job_39fb6c95-d97a-4bed-8a0a-484ac8ea1dc9/artifacts/kvhd76cb_yamato_logo.png';
const SYS_LOGO = 'https://customer-assets.emergentagent.com/job_39fb6c95-d97a-4bed-8a0a-484ac8ea1dc9/artifacts/sasah9ha_syssteel-logo.png';
const HANWA_LOGO = 'https://customer-assets.emergentagent.com/job_39fb6c95-d97a-4bed-8a0a-484ac8ea1dc9/artifacts/5m4u3l0k_hanwa-logo.png';

const LogoBadges = () => (
  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
    <img src={YAMATO_LOGO} alt="Yamato" className="h-4 object-contain" />
    <img src={SYS_LOGO} alt="SYS" className="h-4 object-contain" />
    <img src={HANWA_LOGO} alt="Hanwa" className="h-4 object-contain" />
  </div>
);

const TopCard = ({ m }) => (
  <div className="px-3 pb-8">
    <p className="text-3xl font-black text-[#0C765B] mb-3">{m.year}</p>
    <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-sm text-slate-600 leading-relaxed">
      {m.content}
    </div>
  </div>
);

const TodayCard = ({ m }) => (
  <div className="px-3 pb-8">
    <div className="bg-[#0C765B] rounded-2xl p-5 shadow-lg text-white">
      <p className="text-2xl font-black mb-2">Today</p>
      <p className="text-white/90 text-sm leading-relaxed">{m.content}</p>
    </div>
  </div>
);

const BottomCard = ({ m }) => (
  <div className="px-3 pt-8">
    <p className="text-3xl font-black text-[#0C765B] mb-3">{m.year}</p>
    <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-sm text-slate-600 leading-relaxed">
      {m.content}
      {m.logos && <LogoBadges />}
    </div>
  </div>
);

export const JourneyTimeline = () => (
  <div className="bg-[#f5f5f5] py-16 lg:py-24 overflow-hidden" data-testid="journey-timeline">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="journey-heading">Our Journey</h2>
        <p className="text-slate-500 max-w-xl mx-auto">From humble beginnings to becoming one of Indonesia's largest private steel companies.</p>
      </motion.div>

      {/* Desktop Horizontal Timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Top row: cards for top-positioned milestones */}
          <div className="grid grid-cols-5 gap-0 mb-0">
            {milestones.map(function(m) {
              if (m.isToday) return <div key={m.year} className="flex flex-col justify-end"><TodayCard m={m} /></div>;
              if (m.position === 'top') return <div key={m.year} className="flex flex-col justify-end"><TopCard m={m} /></div>;
              return <div key={m.year} className="min-h-[200px]" />;
            })}
          </div>

          {/* Connector lines from top cards */}
          <div className="grid grid-cols-5 gap-0">
            {milestones.map(function(m) {
              const showLine = m.position === 'top' || m.isToday;
              return (
                <div key={m.year} className="flex justify-center">
                  <div className={'w-0.5 h-6 ' + (showLine ? 'bg-[#0C765B]/50' : 'bg-transparent')} />
                </div>
              );
            })}
          </div>

          {/* Green timeline bar with pins */}
          <div className="relative mx-4">
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-[#0C765B] via-[#0fa07a] to-[#0C765B] rounded-full transform -translate-y-1/2 shadow-md" />
            <div className="relative grid grid-cols-5 gap-0">
              {milestones.map(function(m, i) {
                const isFilled = m.isToday;
                return (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex justify-center"
                    data-testid={'milestone-' + m.year.toLowerCase()}
                  >
                    <div className={'w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 ' + (isFilled ? 'bg-[#0C765B]' : 'bg-white border-[3px] border-[#0C765B]')}>
                      <MapPin className={'w-4 h-4 ' + (isFilled ? 'text-white' : 'text-[#0C765B]')} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Connector lines to bottom cards */}
          <div className="grid grid-cols-5 gap-0">
            {milestones.map(function(m) {
              const showLine = m.position === 'bottom';
              return (
                <div key={m.year} className="flex justify-center">
                  <div className={'w-0.5 h-6 ' + (showLine ? 'bg-[#0C765B]/50' : 'bg-transparent')} />
                </div>
              );
            })}
          </div>

          {/* Bottom row: cards for bottom-positioned milestones */}
          <div className="grid grid-cols-5 gap-0 mt-0">
            {milestones.map(function(m) {
              if (m.position === 'bottom') return <div key={m.year}><BottomCard m={m} /></div>;
              return <div key={m.year} className="min-h-[200px]" />;
            })}
          </div>
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
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
