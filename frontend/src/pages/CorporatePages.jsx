import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { Building2, Target, Eye, Heart, Users, Award, Globe, Factory, Shield, Leaf, Gem, Lightbulb, Recycle, MapPin, ChevronRight, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// ==========================================
// Corporate Overview Page (unchanged)
// ==========================================
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
              <p>We are a pioneer in high-tensile and seismic steel solutions in Indonesia, delivering innovative products that meet the highest standards of strength and safety. In addition, GYS actively contributes to infrastructure and construction development in Indonesia by complying with TKDN (Domestic Component Level Certificate), reinforcing our commitment to regional economic development and the principle of local production for local consumption.</p>
              <p>Our manufacturing process, the Electric Arc Furnace (EAF) technology, uses end-of-life steel scrap as its primary raw material, melting it with electric arc heat to regenerate new steel products. This approach enables resource recycling and promotes a circular economy, reducing environmental impact while supporting sustainable development.</p>
              <p>In 2024, GYS became a member of the Yamato Kogyo Group, a global leader operating electric arc furnace steelmaking businesses in six countries. Guided by our vision to lead in structural steel and our mission to achieve customer satisfaction through innovation, sustainability, and quality, we combine advanced EAF steelmaking technology with the Yamato Kogyo Group's global manufacturing expertise.</p>
              <p>Since our founding in 1970, we have consistently supported Indonesia's infrastructure development and economic growth through steel products. We have also contributed to the revitalization of local industries through the transfer of technology. By balancing local engagement with global competitiveness, we provide reliable steel solutions to construction companies, fabricators, and distributors across Indonesia.</p>
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
                <p className="text-white/70 text-lg leading-relaxed">To deliver unparalleled customer satisfaction through product innovation, productivity, and exceptional quality in both our products and services. We are committed to upholding environmental and corporate social responsibility, essential pillars for ensuring long-term corporate sustainability.</p>
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
            { icon: Globe, title: 'Global Expertise', desc: 'Leveraging the Yamato Kogyo Group\'s decades of international manufacturing knowledge.' },
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


// ==========================================
// Corporate Philosophy Page (REDESIGNED)
// ==========================================
export const PhilosophyPage = () => {
  const coreValues = [
    {
      icon: Gem,
      title: 'Quality',
      color: '#0C765B',
      highlights: [
        'Radioactive detection systems for raw material inspection',
        'Over 90% TKDN (Domestic Component Level Certificate)',
        'SNI and International Standards compliance',
      ],
      content: 'At GYS, we are committed to providing steel products of the highest quality, not only meeting but exceeding industry standards and customer expectations. Our dedication to quality goes beyond product performance\u2014it extends to safety, reliability, and sustainability.\n\nAs part of our quality assurance, we employ radioactive detection systems during raw material inspection to guarantee safety from the very beginning stage of our manufacturing process. Furthermore, our major products achieve over 90% TKDN (Domestic Component Level Certificate), supporting local industry and national development. All products comply with SNI, and International Standards, ensuring world-class quality and reliability.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      color: '#0C765B',
      highlights: [
        'Electric Arc Furnace (EAF) with scrap pre-heater',
        'European-made rolling mill technology',
        'Only mill in Indonesia for High Tensile & Seismic steel',
      ],
      content: 'At GYS, we strive to stay ahead in the highly competitive steel industry by continuously improving our processes, products, and services through innovation and technology.\n\nOur manufacturing system incorporates an Electric Arc Furnace (EAF) equipped with a scrap pre-heater, enhancing energy efficiency and environmental performance. In addition, we have introduced cutting-edge European-made rolling mill technology, which significantly improves precision and productivity.\n\nGYS offers a wide variety of products and steel grades to meet diverse construction needs. We integrate Japan\'s rigorous standards into our production, enabling us to supply High Tensile steel for superior strength and Seismic-resistant steel for earthquake resilience\u2014making us the only mill in Indonesia capable of delivering these advanced solutions.\n\nThrough these innovations, GYS continues to create new value for Indonesia\'s construction industry, combining world-class technology with local expertise to ensure reliability, safety, and sustainability.',
    },
    {
      icon: Recycle,
      title: 'Sustainability',
      color: '#0C765B',
      highlights: [
        'EAF method using recycled steel scrap',
        '6.5 MW rooftop solar panel system',
        'EPD (Environmental Product Declaration) certified',
      ],
      content: 'GYS is committed to minimizing environmental impact by adopting sustainable manufacturing processes, reducing waste, promoting recycling, and improving energy efficiency.\n\nOur manufacturing process, the Electric Arc Furnace (EAF) method, uses end-of-life steel scrap as its primary raw material, melting it with electric arc heat to regenerate it into new steel products. This approach enables resource recycling and supports the circular economy, while reducing environmental impact. Furthermore, by introducing scrap preheating systems, we reduce energy consumption and actively lower CO\u2082 emissions.\n\nGYS supports the development of a sustainable local economy through the use of domestic scrap, local production, and local supply. We actively promote recycling, produce low carbon emission steel, and implement environmentally friendly manufacturing practices, contributing to Indonesia\'s national Net Zero goals. Furthermore, we have installed a 6.5 MW rooftop solar panel system and continue to adopt renewable energy sources.\n\nIn addition, GYS has obtained EPD (Environmental Product Declaration) ensuring that the environmental performance and sustainability of our products. GYS is committed to reducing environmental impact and contributing to the creation of a sustainable society in Indonesia.',
    },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="philosophy-page">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=80"
            alt="Corporate Philosophy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a3d30]/95 via-[#0a3d30]/80 to-[#0a3d30]/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6 border border-white/20">
              Corporate Identity
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" data-testid="philosophy-title">
              Corporate Philosophy<br />
              <span className="text-[#4fd1a5]">& Core Value</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Tagline Bar */}
      <div className="bg-[#0C765B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="w-1.5 h-12 bg-white/40 rounded-full flex-shrink-0" />
            <p className="text-white text-lg md:text-xl font-medium leading-relaxed" data-testid="philosophy-tagline">
              <span className="font-bold">Strength in Excellence</span> — these words define GYS's unwavering philosophy: to deliver strength and trust for the future.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Philosophy Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <p className="text-slate-600 text-lg leading-relaxed" data-testid="philosophy-intro">
            We are committed to provide world-class expertise and experience in Indonesia's construction industry through uncompromising quality, innovative technologies, and sustainable practices. As the only manufacturer supplying high-tensile and seismic-grade steel, GYS ensures structural safety while providing reliability and value to society. Guided by our three core values — <span className="font-semibold text-[#0C765B]">Quality</span>, <span className="font-semibold text-[#0C765B]">Innovation</span>, and <span className="font-semibold text-[#0C765B]">Sustainability</span> — we continue to move forward alongside Indonesia's growth and development.
          </p>
        </motion.div>
      </div>

      {/* Core Values Sections */}
      {coreValues.map(function(value, index) {
        const isEven = index % 2 === 0;
        return (
          <div
            key={value.title}
            className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
            data-testid={'core-value-' + value.title.toLowerCase()}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
              <div className={'grid lg:grid-cols-12 gap-12 lg:gap-16 items-start' + (isEven ? '' : ' direction-rtl')}>
                {/* Left: Header + Highlights */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={'lg:col-span-4' + (isEven ? '' : ' lg:order-2')}
                >
                  <div className="sticky top-28">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#0C765B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0C765B]/20">
                        <value.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0C765B] uppercase tracking-widest">Core Value {index + 1}</p>
                        <h2 className="text-3xl font-bold text-slate-900">{value.title}</h2>
                      </div>
                    </div>

                    {/* Key Highlights */}
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

                {/* Right: Content */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className={'lg:col-span-8' + (isEven ? '' : ' lg:order-1')}
                >
                  <div className="prose prose-slate max-w-none">
                    {value.content.split('\n\n').map(function(paragraph, pi) {
                      return (
                        <p key={pi} className="text-slate-600 leading-relaxed mb-5 last:mb-0">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom CTA */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Strength in Excellence</h3>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">Quality, Innovation, and Sustainability — the pillars that drive GYS forward alongside Indonesia's growth.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Quality', 'Innovation', 'Sustainability'].map(function(item, i) {
                return (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="px-6 py-2.5 bg-[#0C765B] text-white font-semibold rounded-full text-sm"
                  >
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


// ==========================================
// Corporate History & Group Structure Page (REDESIGNED)
// ==========================================
export const HistoryPage = () => {
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
      content: 'Merger took place with new shareholders Yamato, SYS, and Hanwa, leading to the acquisition of GRP\'s section business.',
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

  return (
    <div className="min-h-screen bg-white" data-testid="history-page">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1666219462105-2909c2d72d01?w=1920&q=80"
            alt="Corporate History"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6 border border-white/20">
              Corporate Identity
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" data-testid="history-title">
              Corporate History<br />
              <span className="text-[#4fd1a5]">& Group Structure</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              Over five decades of excellence — our journey of growth, innovation, and commitment to the steel industry.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ============ JOURNEY TIMELINE ============ */}
      <div className="bg-[#f5f5f5] py-16 lg:py-24 overflow-hidden" data-testid="journey-timeline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="journey-heading">Our Journey</h2>
            <p className="text-slate-500 max-w-xl mx-auto">From humble beginnings to becoming one of Indonesia's largest private steel companies.</p>
          </motion.div>

          {/* Desktop Horizontal Timeline */}
          <div className="hidden lg:block relative">
            {/* The green timeline bar */}
            <div className="relative mx-8">
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

                      {/* Spacer for bottom-positioned items */}
                      {m.position === 'bottom' && <div className="mb-6 h-[140px]" />}

                      {/* Pin marker on timeline */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className={'w-10 h-10 rounded-full flex items-center justify-center shadow-lg ' + (m.isToday ? 'bg-[#0C765B]' : 'bg-white border-[3px] border-[#0C765B]')}>
                          <MapPin className={'w-4 h-4 ' + (m.isToday ? 'text-white' : 'text-[#0C765B]')} />
                        </div>
                        {/* Vertical connector line */}
                        <div className={'absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-[#0C765B]/40 ' + (m.position === 'top' ? 'bottom-full h-6' : 'top-full h-6')} />
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

                      {/* Bottom spacer for top-positioned items */}
                      {m.position === 'top' && !m.isToday && <div className="mt-6 h-[140px]" />}
                      {m.isToday && <div className="mt-6 h-[140px]" />}
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
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex gap-6 items-start"
                    data-testid={'mobile-milestone-' + m.year.toLowerCase()}
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div className={'w-12 h-12 rounded-full flex items-center justify-center shadow-md ' + (m.isToday ? 'bg-[#0C765B]' : 'bg-white border-[3px] border-[#0C765B]')}>
                        <MapPin className={'w-5 h-5 ' + (m.isToday ? 'text-white' : 'text-[#0C765B]')} />
                      </div>
                    </div>
                    <div className="flex-1 pb-2">
                      <p className={'text-2xl font-black mb-2 ' + (m.isToday ? 'text-[#0C765B]' : 'text-[#0C765B]')}>{m.year}</p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="shareholder-heading">Shareholder</h2>
            <p className="text-slate-500 max-w-xl mx-auto">The ownership structure of Garuda Yamato Steel — a strong alliance of global steel leaders.</p>
          </motion.div>

          {/* Ownership Diagram - Desktop */}
          <div className="hidden lg:block mb-16">
            <div className="flex flex-col items-center gap-4">
              {/* Top row: Yamato + SYS */}
              <div className="flex items-center justify-center gap-16">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-white border-2 border-[#0C765B] rounded-2xl flex items-center justify-center shadow-lg mb-2 mx-auto">
                    <span className="text-2xl font-black text-[#0C765B] italic tracking-tight">Yamato</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">45%</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-white border-2 border-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg mb-2 mx-auto">
                    <span className="text-2xl font-black text-[#2563EB] tracking-tight">SYS</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">35%</p>
                </motion.div>
              </div>

              {/* Connection lines */}
              <div className="flex items-center justify-center gap-0">
                <div className="w-24 h-0.5 bg-slate-300" />
                <div className="w-4 h-4 bg-[#0C765B] rounded-full flex-shrink-0" />
                <div className="w-24 h-0.5 bg-slate-300" />
              </div>
              <div className="w-0.5 h-6 bg-slate-300" />

              {/* Center: GYS */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-44 h-44 bg-[#0C765B] rounded-3xl flex flex-col items-center justify-center shadow-xl mx-auto">
                  <span className="text-4xl font-black text-white tracking-tight">GYS</span>
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mt-1">Garuda Yamato Steel</span>
                </div>
              </motion.div>

              <div className="w-0.5 h-6 bg-slate-300" />
              <div className="flex items-center justify-center gap-0">
                <div className="w-24 h-0.5 bg-slate-300" />
                <div className="w-4 h-4 bg-[#0C765B] rounded-full flex-shrink-0" />
                <div className="w-24 h-0.5 bg-slate-300" />
              </div>

              {/* Bottom row: GRP + Hanwa */}
              <div className="flex items-center justify-center gap-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-white border-2 border-[#DC2626] rounded-2xl flex flex-col items-center justify-center shadow-lg mb-2 mx-auto">
                    <span className="text-2xl font-black text-[#DC2626] tracking-tight">GRP</span>
                    <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Shaping Tomorrow</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">5%</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
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
                <motion.div
                  key={sh.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                  data-testid={'shareholder-card-' + i}
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-4 p-6 border-b border-slate-100" style={{ background: sh.color + '08' }}>
                    {/* Logo Badge */}
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: sh.color + '12', border: '2px solid ' + sh.color + '30' }}
                    >
                      <span className={'font-black tracking-tight ' + (sh.logoStyle === 'italic' ? 'italic ' : '') + (sh.logoText.length > 4 ? 'text-sm' : 'text-xl')} style={{ color: sh.color }}>
                        {sh.logoText}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: sh.color }}>
                          {sh.number}
                        </span>
                        <span className="text-lg font-bold text-slate-900 truncate">{sh.name}</span>
                      </div>
                      {sh.subtitle && <p className="text-xs text-slate-500">{sh.subtitle}</p>}
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: sh.color }}>
                        {sh.percentage}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
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
