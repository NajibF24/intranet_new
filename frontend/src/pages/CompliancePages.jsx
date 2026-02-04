import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { FileText, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export const SOPPage = () => {
  const sopCategories = [
    {
      title: 'Production Operations',
      items: [
        'Hot Rolling Mill Standard Operating Procedure',
        'Cold Rolling Mill Standard Operating Procedure',
        'Quality Control Inspection Procedure',
        'Material Handling and Storage Guidelines',
      ],
    },
    {
      title: 'Safety & Emergency',
      items: [
        'Emergency Evacuation Procedure',
        'Fire Safety Protocol',
        'Chemical Handling Guidelines',
        'Personal Protective Equipment (PPE) Requirements',
      ],
    },
    {
      title: 'Administrative',
      items: [
        'Document Control Procedure',
        'Visitor Management Protocol',
        'Asset Management Guidelines',
        'Procurement Request Process',
      ],
    },
    {
      title: 'Environmental',
      items: [
        'Waste Management Procedure',
        'Emission Monitoring Protocol',
        'Water Treatment Guidelines',
        'Environmental Incident Reporting',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="sop-page">
      <Header />
      <PageContainer
        title="Standard Operating Procedures"
        subtitle="Comprehensive guidelines ensuring consistent, safe, and efficient operations across all departments."
        breadcrumbs={[
          { label: 'Operational/Compliance', path: '/compliance' },
          { label: 'SOP' },
        ]}
      >
        <Accordion type="single" collapsible className="space-y-4">
          {sopCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border border-slate-200 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-[#0C765B]" />
                    <span className="font-semibold text-slate-900">{category.title}</span>
                    <span className="text-sm text-slate-500">({category.items.length} documents)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <span className="text-slate-700">{item}</span>
                        <button className="text-[#0C765B] text-sm font-medium hover:underline">
                          View Document
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const PoliciesPage = () => {
  const policies = [
    {
      icon: Shield,
      title: 'Information Security Policy',
      description: 'Guidelines for protecting company data and information systems from unauthorized access.',
      lastUpdated: 'January 2026',
    },
    {
      icon: AlertTriangle,
      title: 'Health & Safety Policy',
      description: 'Our commitment to maintaining a safe and healthy workplace for all employees.',
      lastUpdated: 'December 2025',
    },
    {
      icon: FileText,
      title: 'Code of Conduct',
      description: 'Standards of behavior and ethical guidelines for all GYS employees and partners.',
      lastUpdated: 'November 2025',
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance Policy',
      description: 'Our framework for ensuring consistent product quality and continuous improvement.',
      lastUpdated: 'October 2025',
    },
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="policies-page">
      <Header />
      <PageContainer
        title="Company Policies"
        subtitle="Essential policies that govern our operations and guide employee conduct at PT Garuda Yamato Steel."
        breadcrumbs={[
          { label: 'Operational/Compliance', path: '/compliance' },
          { label: 'Policies' },
        ]}
      >
        <div className="grid md:grid-cols-2 gap-6">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0C765B]/10 rounded-xl flex items-center justify-center mb-4">
                <policy.icon className="w-6 h-6 text-[#0C765B]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{policy.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{policy.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">Last updated: {policy.lastUpdated}</span>
                <button className="text-[#0C765B] text-sm font-medium hover:underline">
                  Read Policy
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const SafetyPage = () => {
  const safetyRules = [
    'Always wear appropriate Personal Protective Equipment (PPE)',
    'Report all incidents and near-misses immediately',
    'Follow lockout/tagout procedures before maintenance',
    'Keep work areas clean and organized',
    'Know the location of emergency exits and assembly points',
    'Never operate equipment without proper training',
    'Follow all posted safety signs and warnings',
    'Participate in regular safety training and drills',
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="safety-page">
      <Header />
      <PageContainer
        title="Safety Guidelines"
        subtitle="Your safety is our top priority. Follow these guidelines to ensure a safe working environment."
        breadcrumbs={[
          { label: 'Operational/Compliance', path: '/compliance' },
          { label: 'Safety Guidelines' },
        ]}
      >
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Safety First</h3>
              <p className="text-amber-800">
                At PT Garuda Yamato Steel, we believe that every accident is preventable. 
                Safety is not just a policy – it&apos;s a core value that guides everything we do.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Essential Safety Rules</h2>
        <div className="space-y-4">
          {safetyRules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl"
            >
              <div className="w-8 h-8 bg-[#0C765B] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <p className="text-slate-700">{rule}</p>
            </motion.div>
          ))}
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};
