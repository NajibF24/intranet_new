import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { FileText, AlertTriangle, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const SOPCategory = ({ title, count, items, defaultOpen }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen || false);
  
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-[#0C765B]" />
          <span className="font-semibold text-slate-900">{title}</span>
          <span className="text-sm text-slate-500">({count} documents)</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="text-slate-700">{item}</span>
                <button className="text-[#0C765B] text-sm font-medium hover:underline">View Document</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const SOPPage = () => {
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
        category="compliance"
      >
        <SOPCategory 
          title="Production Operations" 
          count={4}
          defaultOpen={true}
          items={[
            'Hot Rolling Mill Standard Operating Procedure',
            'Cold Rolling Mill Standard Operating Procedure',
            'Quality Control Inspection Procedure',
            'Material Handling and Storage Guidelines',
          ]}
        />
        <SOPCategory 
          title="Safety & Emergency" 
          count={4}
          items={[
            'Emergency Evacuation Procedure',
            'Fire Safety Protocol',
            'Chemical Handling Guidelines',
            'Personal Protective Equipment (PPE) Requirements',
          ]}
        />
        <SOPCategory 
          title="Administrative" 
          count={4}
          items={[
            'Document Control Procedure',
            'Visitor Management Protocol',
            'Asset Management Guidelines',
            'Procurement Request Process',
          ]}
        />
        <SOPCategory 
          title="Environmental" 
          count={4}
          items={[
            'Waste Management Procedure',
            'Emission Monitoring Protocol',
            'Water Treatment Guidelines',
            'Environmental Incident Reporting',
          ]}
        />
      </PageContainer>
      <Footer />
    </div>
  );
};

const PolicyCard = ({ icon: Icon, title, description, lastUpdated, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay }} 
    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
  >
    <div className="w-12 h-12 bg-[#0C765B]/10 rounded-xl flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#0C765B]" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm mb-4">{description}</p>
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <span className="text-xs text-slate-500">Last updated: {lastUpdated}</span>
      <button className="text-[#0C765B] text-sm font-medium hover:underline">Read Policy</button>
    </div>
  </motion.div>
);

export const PoliciesPage = () => {
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
        category="compliance"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <PolicyCard 
            icon={Shield}
            title="Information Security Policy"
            description="Guidelines for protecting company data and information systems from unauthorized access."
            lastUpdated="January 2026"
            delay={0}
          />
          <PolicyCard 
            icon={AlertTriangle}
            title="Health & Safety Policy"
            description="Our commitment to maintaining a safe and healthy workplace for all employees."
            lastUpdated="December 2025"
            delay={0.1}
          />
          <PolicyCard 
            icon={FileText}
            title="Code of Conduct"
            description="Standards of behavior and ethical guidelines for all GYS employees and partners."
            lastUpdated="November 2025"
            delay={0.2}
          />
          <PolicyCard 
            icon={CheckCircle}
            title="Quality Assurance Policy"
            description="Our framework for ensuring consistent product quality and continuous improvement."
            lastUpdated="October 2025"
            delay={0.3}
          />
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

const SafetyRule = ({ number, text }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: number * 0.05 }}
    className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl"
  >
    <div className="w-8 h-8 bg-[#0C765B] rounded-full flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-sm">{number}</span>
    </div>
    <p className="text-slate-700">{text}</p>
  </motion.div>
);

export const SafetyPage = () => {
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
        category="compliance"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Safety First</h3>
              <p className="text-amber-800">
                At PT Garuda Yamato Steel, we believe that every accident is preventable. 
                Safety is not just a policy - it is a core value that guides everything we do.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Essential Safety Rules</h2>
        <div className="space-y-4">
          <SafetyRule number={1} text="Always wear appropriate Personal Protective Equipment (PPE)" />
          <SafetyRule number={2} text="Report all incidents and near-misses immediately" />
          <SafetyRule number={3} text="Follow lockout/tagout procedures before maintenance" />
          <SafetyRule number={4} text="Keep work areas clean and organized" />
          <SafetyRule number={5} text="Know the location of emergency exits and assembly points" />
          <SafetyRule number={6} text="Never operate equipment without proper training" />
          <SafetyRule number={7} text="Follow all posted safety signs and warnings" />
          <SafetyRule number={8} text="Participate in regular safety training and drills" />
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};
