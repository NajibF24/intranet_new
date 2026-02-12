import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Gem, Lightbulb, Recycle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const coreValues = [
  {
    icon: Gem,
    title: 'Quality',
    highlights: [
      'Radioactive detection systems for raw material inspection',
      'Over 90% TKDN (Domestic Component Level Certificate)',
      'SNI and International Standards compliance',
    ],
    content: [
      'At GYS, we are committed to providing steel products of the highest quality, not only meeting but exceeding industry standards and customer expectations. Our dedication to quality goes beyond product performance\u2014it extends to safety, reliability, and sustainability.',
      'As part of our quality assurance, we employ radioactive detection systems during raw material inspection to guarantee safety from the very beginning stage of our manufacturing process. Furthermore, our major products achieve over 90% TKDN (Domestic Component Level Certificate), supporting local industry and national development. All products comply with SNI, and International Standards, ensuring world-class quality and reliability.',
    ],
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    highlights: [
      'Electric Arc Furnace (EAF) with scrap pre-heater',
      'European-made rolling mill technology',
      'Only mill in Indonesia for High Tensile & Seismic steel',
    ],
    content: [
      'At GYS, we strive to stay ahead in the highly competitive steel industry by continuously improving our processes, products, and services through innovation and technology.',
      'Our manufacturing system incorporates an Electric Arc Furnace (EAF) equipped with a scrap pre-heater, enhancing energy efficiency and environmental performance. In addition, we have introduced cutting-edge European-made rolling mill technology, which significantly improves precision and productivity.',
      'GYS offers a wide variety of products and steel grades to meet diverse construction needs. We integrate Japan\'s rigorous standards into our production, enabling us to supply High Tensile steel for superior strength and Seismic-resistant steel for earthquake resilience\u2014making us the only mill in Indonesia capable of delivering these advanced solutions.',
      'Through these innovations, GYS continues to create new value for Indonesia\'s construction industry, combining world-class technology with local expertise to ensure reliability, safety, and sustainability.',
    ],
  },
  {
    icon: Recycle,
    title: 'Sustainability',
    highlights: [
      'EAF method using recycled steel scrap',
      '6.5 MW rooftop solar panel system',
      'EPD (Environmental Product Declaration) certified',
    ],
    content: [
      'GYS is committed to minimizing environmental impact by adopting sustainable manufacturing processes, reducing waste, promoting recycling, and improving energy efficiency.',
      'Our manufacturing process, the Electric Arc Furnace (EAF) method, uses end-of-life steel scrap as its primary raw material, melting it with electric arc heat to regenerate it into new steel products. This approach enables resource recycling and supports the circular economy, while reducing environmental impact. Furthermore, by introducing scrap preheating systems, we reduce energy consumption and actively lower CO\u2082 emissions.',
      'GYS supports the development of a sustainable local economy through the use of domestic scrap, local production, and local supply. We actively promote recycling, produce low carbon emission steel, and implement environmentally friendly manufacturing practices, contributing to Indonesia\'s national Net Zero goals. Furthermore, we have installed a 6.5 MW rooftop solar panel system and continue to adopt renewable energy sources.',
      'In addition, GYS has obtained EPD (Environmental Product Declaration) ensuring that the environmental performance and sustainability of our products. GYS is committed to reducing environmental impact and contributing to the creation of a sustainable society in Indonesia.',
    ],
  },
];

export const PhilosophyPage = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="philosophy-page">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=80" alt="Corporate Philosophy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a3d30]/95 via-[#0a3d30]/80 to-[#0a3d30]/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6 border border-white/20">Corporate Identity</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" data-testid="philosophy-title">
              Corporate Philosophy<br /><span className="text-[#4fd1a5]">& Core Value</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Tagline Bar */}
      <div className="bg-[#0C765B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-white/40 rounded-full flex-shrink-0" />
            <p className="text-white text-lg md:text-xl font-medium leading-relaxed" data-testid="philosophy-tagline">
              <span className="font-bold">Strength in Excellence</span> — these words define GYS's unwavering philosophy: to deliver strength and trust for the future.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Philosophy Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl">
          <p className="text-slate-600 text-lg leading-relaxed" data-testid="philosophy-intro">
            We are committed to provide world-class expertise and experience in Indonesia's construction industry through uncompromising quality, innovative technologies, and sustainable practices. As the only manufacturer supplying high-tensile and seismic-grade steel, GYS ensures structural safety while providing reliability and value to society. Guided by our three core values — <span className="font-semibold text-[#0C765B]">Quality</span>, <span className="font-semibold text-[#0C765B]">Innovation</span>, and <span className="font-semibold text-[#0C765B]">Sustainability</span> — we continue to move forward alongside Indonesia's growth and development.
          </p>
        </motion.div>
      </div>

      {/* Core Values */}
      {coreValues.map(function(value, index) {
        const isEven = index % 2 === 0;
        const Icon = value.icon;
        return (
          <div key={value.title} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} data-testid={'core-value-' + value.title.toLowerCase()}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
              <div className={'grid lg:grid-cols-12 gap-12 lg:gap-16 items-start'}>
                <motion.div initial={{ opacity: 0, x: isEven ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={'lg:col-span-4' + (isEven ? '' : ' lg:order-2')}>
                  <div className="sticky top-28">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#0C765B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0C765B]/20">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0C765B] uppercase tracking-widest">Core Value {index + 1}</p>
                        <h2 className="text-3xl font-bold text-slate-900">{value.title}</h2>
                      </div>
                    </div>
                    <div className="bg-[#0C765B]/5 border border-[#0C765B]/10 rounded-xl p-5 mt-6">
                      <p className="text-xs font-bold text-[#0C765B] uppercase tracking-widest mb-3">Key Highlights</p>
                      <div className="space-y-3">
                        {value.highlights.map(function(h, hi) {
                          return (
                            <div key={hi} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-[#0C765B] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-700 leading-snug">{h}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: isEven ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className={'lg:col-span-8' + (isEven ? '' : ' lg:order-1')}>
                  {value.content.map(function(paragraph, pi) {
                    return <p key={pi} className="text-slate-600 leading-relaxed mb-5 last:mb-0">{paragraph}</p>;
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Strength in Excellence</h3>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">Quality, Innovation, and Sustainability — the pillars that drive GYS forward alongside Indonesia's growth.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Quality', 'Innovation', 'Sustainability'].map(function(item, i) {
                return (
                  <motion.span key={item} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="px-6 py-2.5 bg-[#0C765B] text-white font-semibold rounded-full text-sm">
                    {item}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
