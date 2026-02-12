import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { Building2, Target, Eye, Heart, Users, Award, Globe, Factory, Shield, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

// Corporate Overview Page
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

      {/* Hero Banner */}
      <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1624027492684-327af1fb7559?w=1920&q=80"
            alt="GYS Factory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-[#0C765B] text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6">Corporate Overview</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Garuda Yamato<br />
              <span className="text-[#0C765B]">Steel</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              The largest structural steel manufacturer in Indonesia and the first company in Southeast Asia to produce structural steel.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="bg-[#0C765B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(function(stat, i) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: stat.delay, type: 'spring', stiffness: 120 }}
                  className="text-center"
                  data-testid={'stat-' + i}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: stat.delay + 0.2 }}
                    className="text-4xl lg:text-5xl font-black text-white mb-1"
                  >{stat.value}</motion.p>
                  <p className="text-white/70 text-sm font-medium tracking-wide">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
              A Pioneer in High-Tensile and Seismic Steel Solutions
            </h2>
            <div className="space-y-5 text-slate-600 leading-relaxed">
              <p>
                Garuda Yamato Steel (GYS) is a leading structural steel manufacturer based in Cikarang, West Java, Indonesia. GYS is the largest structural steel manufacturer in Indonesia and the first company in Southeast Asia to produce structural steel.
              </p>
              <p>
                We are a pioneer in high-tensile and seismic steel solutions in Indonesia, delivering innovative products that meet the highest standards of strength and safety. In addition, GYS actively contributes to infrastructure and construction development in Indonesia by complying with TKDN (Domestic Component Level Certificate), reinforcing our commitment to regional economic development and the principle of local production for local consumption.
              </p>
              <p>
                Our manufacturing process, the Electric Arc Furnace (EAF) technology, uses end-of-life steel scrap as its primary raw material, melting it with electric arc heat to regenerate new steel products. This approach enables resource recycling and promotes a circular economy, reducing environmental impact while supporting sustainable development.
              </p>
              <p>
                In 2024, GYS became a member of the Yamato Kogyo Group, a global leader operating electric arc furnace steelmaking businesses in six countries. Guided by our vision to lead in structural steel and our mission to achieve customer satisfaction through innovation, sustainability, and quality, we combine advanced EAF steelmaking technology with the Yamato Kogyo Group's global manufacturing expertise.
              </p>
              <p>
                Since our founding in 1970, we have consistently supported Indonesia's infrastructure development and economic growth through steel products. We have also contributed to the revitalization of local industries through the transfer of technology. By balancing local engagement with global competitiveness, we provide reliable steel solutions to construction companies, fabricators, and distributors across Indonesia.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-28 space-y-6">
              <img
                src="https://images.unsplash.com/photo-1761414500570-0b835cdcf3c8?w=800&q=80"
                alt="GYS Steel Manufacturing"
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-lg"
              />
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Leaf className="w-5 h-5 text-[#0C765B]" />
                  <span className="font-bold text-slate-900">Circular Economy</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our EAF technology recycles end-of-life steel scrap into new products, promoting sustainability and reducing environmental impact.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#0C765B]/20 rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#0C765B] rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">
                  To become a leading company in the long steel category, equipped with international standards and top-notch expertise, while simultaneously contributing to the advancement of the domestic steel industry.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#0C765B]/20 rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#0C765B] rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">
                  To deliver unparalleled customer satisfaction through product innovation, productivity, and exceptional quality in both our products and services. We are committed to upholding environmental and corporate social responsibility, essential pillars for ensuring long-term corporate sustainability.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Yamato Kogyo Group */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#0C765B]/30 transition-all group"
              >
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

// Corporate Philosophy Page
export const PhilosophyPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Vision',
      subtitle: 'Where We Are Going',
      description: 'To be the premier steel manufacturer in Indonesia and Southeast Asia, driving industrial growth through innovation, quality excellence, and sustainable practices.',
    },
    {
      icon: Eye,
      title: 'Mission',
      subtitle: 'What We Do',
      description: 'Delivering premium quality steel products that exceed international standards while maintaining the highest levels of safety, environmental responsibility, and customer satisfaction.',
    },
    {
      icon: Heart,
      title: 'Core Values',
      subtitle: 'What We Believe',
      description: 'Integrity, Excellence, Innovation, Safety, and Sustainability form the foundation of everything we do at GYS.',
    },
  ];

  const principles = [
    { icon: Award, title: 'Quality First', desc: 'Never compromise on product quality and standards.' },
    { icon: Shield, title: 'Safety Always', desc: 'Every employee goes home safe, every day.' },
    { icon: Leaf, title: 'Sustainable Growth', desc: 'Grow responsibly with minimal environmental impact.' },
    { icon: Users, title: 'People Matter', desc: 'Our employees are our greatest asset.' },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="philosophy-page">
      <Header />
      <PageContainer
        title="Corporate Philosophy"
        subtitle="Our vision, mission, and the core values that guide PT Garuda Yamato Steel."
        breadcrumbs={[
          { label: 'Corporate Identity', path: '/' },
          { label: 'Corporate Philosophy' },
        ]}
        category="corporate"
      >
        {/* Vision, Mission, Values */}
        <div className="space-y-8 mb-12">
          {values.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-[#0C765B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#0C765B] font-semibold mb-1">{item.subtitle}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guiding Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Guiding Principles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="flex items-start gap-4 bg-slate-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-[#0C765B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <principle.icon className="w-5 h-5 text-[#0C765B]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{principle.title}</h4>
                  <p className="text-slate-600 text-sm">{principle.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </PageContainer>
      <Footer />
    </div>
  );
};

// Corporate History & Group Structure Page
export const HistoryPage = () => {
  const milestones = [
    { year: '1994', title: 'Foundation', description: 'PT Garuda Yamato Steel established as a joint venture between Indonesian and Japanese investors.' },
    { year: '1996', title: 'First Production', description: 'Commenced commercial production with initial capacity of 100,000 metric tons annually.' },
    { year: '2000', title: 'Expansion Phase I', description: 'Doubled production capacity with new hot rolling mill installation.' },
    { year: '2005', title: 'ISO Certification', description: 'Achieved ISO 9001:2000 certification for quality management systems.' },
    { year: '2010', title: 'Environmental Leadership', description: 'Implemented comprehensive environmental management system with ISO 14001 certification.' },
    { year: '2015', title: 'Technology Upgrade', description: 'Major modernization program with state-of-the-art Japanese technology integration.' },
    { year: '2020', title: 'Safety Milestone', description: 'Achieved 500 consecutive days without lost-time incidents.' },
    { year: '2024', title: 'Carbon Neutral Initiative', description: 'Launched ambitious sustainability program targeting carbon neutrality by 2030.' },
    { year: '2025', title: 'Record Production', description: 'Achieved historic production milestone of 500,000 metric tons.' },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="history-page">
      <Header />
      <PageContainer
        title="Corporate History & Group Structure"
        subtitle="Three decades of excellence - our journey of growth, innovation, and commitment to the steel industry."
        breadcrumbs={[
          { label: 'Corporate Identity', path: '/' },
          { label: 'History & Group Structure' },
        ]}
        category="corporate"
      >
        {/* Group Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Group Structure</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200 w-full md:w-64">
              <p className="text-sm text-slate-500 mb-1">Parent Company</p>
              <p className="font-bold text-slate-900">Yamato Steel Corporation</p>
              <p className="text-sm text-slate-500">Japan</p>
            </div>
            <div className="text-[#0C765B] font-bold text-2xl hidden md:block">+</div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200 w-full md:w-64">
              <p className="text-sm text-slate-500 mb-1">Local Partner</p>
              <p className="font-bold text-slate-900">Garuda Industrial Group</p>
              <p className="text-sm text-slate-500">Indonesia</p>
            </div>
            <div className="text-[#0C765B] font-bold text-2xl hidden md:block">=</div>
            <div className="bg-[#0C765B] rounded-xl p-6 text-center w-full md:w-64">
              <p className="text-sm text-white/70 mb-1">Joint Venture</p>
              <p className="font-bold text-white">PT Garuda Yamato Steel</p>
              <p className="text-sm text-white/70">Est. 1994</p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Journey</h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#0C765B]/20 hidden md:block" />
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative flex gap-8"
              >
                {/* Year Dot */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#0C765B] rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-[#0C765B]/30">
                    {milestone.year}
                  </div>
                </div>
                
                {/* Content Card */}
                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <span className="md:hidden inline-block px-3 py-1 bg-[#0C765B] text-white text-sm font-bold rounded mb-3">
                    {milestone.year}
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{milestone.title}</h4>
                  <p className="text-slate-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};
