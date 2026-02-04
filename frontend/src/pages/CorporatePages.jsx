import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { Target, Eye, Lightbulb, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const VisionPage = () => {
  const visions = [
    {
      icon: Target,
      title: 'Industry Leadership',
      description: 'To become the leading steel manufacturer in Southeast Asia, recognized for quality, innovation, and sustainable practices.',
    },
    {
      icon: Eye,
      title: 'Global Recognition',
      description: 'To establish PT Garuda Yamato Steel as a globally respected brand synonymous with excellence in steel manufacturing.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Pioneer',
      description: 'To lead the industry in adopting cutting-edge technologies and manufacturing processes that set new standards.',
    },
    {
      icon: Heart,
      title: 'Community Impact',
      description: 'To positively impact the communities we serve through sustainable practices and meaningful social contributions.',
    },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="vision-page">
      <Header />
      <PageContainer
        title="Company Vision"
        subtitle="Our aspirations and long-term goals that guide PT Garuda Yamato Steel towards excellence."
        breadcrumbs={[
          { label: 'Corporate Identity', path: '/corporate' },
          { label: 'Vision' },
        ]}
      >
        <div className="prose prose-slate max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0C765B]/5 border border-[#0C765B]/10 rounded-2xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision Statement</h2>
            <p className="text-xl text-slate-700 leading-relaxed">
              "To be the premier steel manufacturer in Indonesia and Southeast Asia, driving industrial growth 
              through innovation, quality excellence, and sustainable practices while creating lasting value 
              for our stakeholders and contributing to nation-building."
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {visions.map((vision, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#0C765B]/10 rounded-xl flex items-center justify-center mb-4">
                  <vision.icon className="w-6 h-6 text-[#0C765B]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{vision.title}</h3>
                <p className="text-slate-600">{vision.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const MissionPage = () => {
  const missions = [
    {
      number: '01',
      title: 'Quality Excellence',
      description: 'Deliver premium quality steel products that meet and exceed international standards, ensuring customer satisfaction and trust.',
    },
    {
      number: '02',
      title: 'Innovation & Technology',
      description: 'Continuously invest in research, development, and state-of-the-art technology to improve our products and processes.',
    },
    {
      number: '03',
      title: 'Safety First',
      description: 'Maintain the highest standards of workplace safety, creating a secure environment for all employees and stakeholders.',
    },
    {
      number: '04',
      title: 'Environmental Stewardship',
      description: 'Commit to sustainable manufacturing practices that minimize environmental impact and promote ecological responsibility.',
    },
    {
      number: '05',
      title: 'Employee Development',
      description: 'Foster a culture of continuous learning and growth, empowering our workforce to reach their full potential.',
    },
    {
      number: '06',
      title: 'Community Engagement',
      description: 'Actively contribute to the development and well-being of the communities where we operate.',
    },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="mission-page">
      <Header />
      <PageContainer
        title="Company Mission"
        subtitle="Our commitments and guiding principles that drive everything we do at PT Garuda Yamato Steel."
        breadcrumbs={[
          { label: 'Corporate Identity', path: '/corporate' },
          { label: 'Mission' },
        ]}
      >
        <div className="space-y-8">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 items-start"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-[#0C765B] rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{mission.number}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{mission.title}</h3>
                <p className="text-slate-600 leading-relaxed">{mission.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="about-page">
      <Header />
      <PageContainer
        title="About GYS"
        subtitle="Learn about our history, values, and commitment to excellence in steel manufacturing."
        breadcrumbs={[
          { label: 'Corporate Identity', path: '/corporate' },
          { label: 'About GYS' },
        ]}
      >
        <div className="prose prose-slate max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Story</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              PT Garuda Yamato Steel was established in 1994 as a joint venture between Indonesian and Japanese 
              investors, combining local expertise with world-class Japanese manufacturing technology. Over the 
              past three decades, we have grown to become one of Indonesia&apos;s leading steel manufacturers, 
              serving diverse industries including construction, automotive, and infrastructure development.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {['Integrity', 'Excellence', 'Innovation', 'Safety'].map((value, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-bold text-[#0C765B] mb-2">{value}</h3>
                  <p className="text-slate-600 text-sm">
                    We uphold {value.toLowerCase()} as a core principle in everything we do.
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Facilities</h2>
            <p className="text-slate-600 leading-relaxed">
              Our state-of-the-art manufacturing facilities span over 50 hectares in Cikarang Industrial Estate, 
              equipped with advanced hot rolling mills, cold rolling lines, and quality control laboratories. 
              We maintain ISO 9001:2015 certification and continuously invest in upgrading our technology 
              to meet evolving market demands.
            </p>
          </motion.div>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};
