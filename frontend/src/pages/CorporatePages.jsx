import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { Building2, Target, Eye, Heart, Users, Award, Globe, Factory, Shield, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

// Corporate Overview Page
export const OverviewPage = () => {
  const highlights = [
    { icon: Factory, value: '500K+', label: 'Metric Tons', desc: 'Annual Production Capacity' },
    { icon: Users, value: '2,500+', label: 'Employees', desc: 'Across Indonesia' },
    { icon: Shield, value: '1000+', label: 'Safety Days', desc: 'Without Incident' },
    { icon: Globe, value: '30+', label: 'Years', desc: 'Industry Experience' },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="overview-page">
      <Header />
      <PageContainer
        title="Corporate Overview"
        subtitle="PT Garuda Yamato Steel - Leading Indonesia's steel industry with excellence, innovation, and sustainability."
        breadcrumbs={[
          { label: 'Corporate Identity', path: '/' },
          { label: 'Corporate Overview' },
        ]}
        category="corporate"
      >
        {/* Company Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0C765B]/5 to-[#0C765B]/10 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#0C765B] rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About PT Garuda Yamato Steel</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Established in 1994 as a strategic joint venture between Indonesian and Japanese investors, 
                PT Garuda Yamato Steel has evolved into one of Southeast Asia's most trusted steel manufacturers. 
                Our commitment to quality, innovation, and sustainable practices has positioned us as a leader 
                in the Indonesian steel industry.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We specialize in producing high-quality steel products for construction, automotive, 
                infrastructure, and various industrial applications. Our state-of-the-art facilities 
                combine Japanese precision manufacturing with Indonesian operational excellence.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0C765B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-[#0C765B]" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="text-[#0C765B] font-semibold">{item.label}</p>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Business Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Business Segments</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Hot Rolled Steel', desc: 'Premium quality hot rolled coils and sheets for construction and manufacturing.' },
              { title: 'Cold Rolled Steel', desc: 'Precision cold rolled products for automotive and appliance industries.' },
              { title: 'Specialty Steel', desc: 'Custom steel solutions for specific industrial applications.' },
            ].map((segment, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-2">{segment.title}</h4>
                <p className="text-slate-600 text-sm">{segment.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </PageContainer>
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
