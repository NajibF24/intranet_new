import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Eye, Target, Globe, Factory, Shield, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export const OverviewPage = () => {
  const stats = [
    { value: '50+', label: 'Years of Experience', delay: 0 },
    { value: '1K+', label: 'Projects Completed', delay: 0.1 },
    { value: '1K+', label: 'Employees', delay: 0.2 },
    { value: '2K+', label: 'Customers', delay: 0.3 },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="overview-page">
      <Header />
      <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1624027492684-327af1fb7559?w=1920&q=80" alt="GYS Factory" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-[#0C765B] text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6">Corporate Overview</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Garuda Yamato<br /><span className="text-[#0C765B]">Steel</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">The largest structural steel manufacturer in Indonesia and the first company in Southeast Asia to produce structural steel.</p>
          </motion.div>
        </div>
      </div>

      <div className="bg-[#0C765B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(function(stat, i) {
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: stat.delay, type: 'spring', stiffness: 120 }} className="text-center" data-testid={'stat-' + i}>
                  <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: stat.delay + 0.2 }} className="text-4xl lg:text-5xl font-black text-white mb-1">{stat.value}</motion.p>
                  <p className="text-white/70 text-sm font-medium tracking-wide">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">A Pioneer in High-Tensile and Seismic Steel Solutions</h2>
            <div className="space-y-5 text-slate-600 leading-relaxed">
              <p>Garuda Yamato Steel (GYS) is a leading structural steel manufacturer based in Cikarang, West Java, Indonesia. GYS is the largest structural steel manufacturer in Indonesia and the first company in Southeast Asia to produce structural steel.</p>
              <p>We are a pioneer in high-tensile and seismic steel solutions in Indonesia, delivering innovative products that meet the highest standards of strength and safety.</p>
              <p>Our manufacturing process, the Electric Arc Furnace (EAF) technology, uses end-of-life steel scrap as its primary raw material, melting it with electric arc heat to regenerate new steel products.</p>
              <p>In 2024, GYS became a member of the Yamato Kogyo Group, a global leader operating electric arc furnace steelmaking businesses in six countries.</p>
              <p>Since our founding in 1970, we have consistently supported Indonesia's infrastructure development and economic growth through steel products.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2">
            <div className="sticky top-28 space-y-6">
              <img src="https://images.unsplash.com/photo-1761414500570-0b835cdcf3c8?w=800&q=80" alt="GYS Steel Manufacturing" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-lg" />
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Leaf className="w-5 h-5 text-[#0C765B]" />
                  <span className="font-bold text-slate-900">Circular Economy</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">Our EAF technology recycles end-of-life steel scrap into new products, promoting sustainability and reducing environmental impact.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#0C765B]/20 rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#0C765B] rounded-lg flex items-center justify-center"><Eye className="w-5 h-5 text-white" /></div>
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">To become a leading company in the long steel category, equipped with international standards and top-notch expertise, while simultaneously contributing to the advancement of the domestic steel industry.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#0C765B]/20 rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#0C765B] rounded-lg flex items-center justify-center"><Target className="w-5 h-5 text-white" /></div>
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">To deliver unparalleled customer satisfaction through product innovation, productivity, and exceptional quality in both our products and services.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Part of a Global Network</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Since 2024, GYS is a proud member of the Yamato Kogyo Group, operating EAF steelmaking in six countries worldwide.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: 'Global Expertise', desc: "Leveraging the Yamato Kogyo Group's decades of international manufacturing knowledge." },
            { icon: Factory, title: 'Advanced EAF Technology', desc: 'State-of-the-art Electric Arc Furnace steelmaking for sustainable production.' },
            { icon: Shield, title: 'TKDN Compliant', desc: 'Committed to Domestic Component Level certification, supporting local economy.' },
          ].map(function(item, i) {
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }} className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#0C765B]/30 transition-all group">
                <div className="w-14 h-14 bg-[#0C765B]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#0C765B] transition-colors">
                  <item.icon className="w-7 h-7 text-[#0C765B] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};
