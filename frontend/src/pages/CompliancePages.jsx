import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { 
  FileText, AlertTriangle, Shield, CheckCircle, 
  Target, Building2, UserCircle, Cog, Scale, CircleCheck, 
  Network, Workflow, Download, FileBox, MessageSquare, Bot, X, Send,
  Minimize2, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Config Bot ────────────────────────────────────────────────
const BOT_ID     = '69ae8ac11243a25591412b11';
const BOT_ORIGIN = 'https://chat.gyssteel.com';
const ACCENT     = '%23007857';

// Map dept.id → nama folder OneDrive (harus sama persis dengan folder di OneDrive)
const DEPT_FOLDER_MAP = {
  'sms':         '01. GYS_Steel Melting Shop-1 (SMS-1)',
  'bp':          '02. GYS_Beam Plant (BP)',
  'lsm':         '03. GYS_Light Section Mill (LSM)',
  'ssc':         '04. GYS_Steel Service Center (SSC)',
  'iso':         '05. GYS_ISO (Management System)',
  'procurement': '06. GYS_PROCUREMENT (PRC)',
  'sales':       '07. GYS_SALES (SLS)',
  'hrga':        '08. GYS_HRGA',
  'it':          '09. GYS_IT SYSTEM (IT)',
  'gdu-scm':     '11. GYS_GDU & SCM',
  'finance':     '12. GYS_Finance & Accounting',
  'legal':       '13. GYS_Legal (LGL)',
  'qaqc':        '14. GYS_QAQC',
};

// --- Data ---
const departmentsData = [
  {
    id: 'sms',
    title: 'SMS',
    fullName: 'Steel Melting Shop',
    icon: Target,
    description: 'Access procedures, operational guidelines, and policies for the Steel Melting Shop.',
    lastUpdated: 'April 2026',
    procedures: [
      'SMS_Standard_Operating_Procedure_v1.pdf',
      'SMS_Hot_Metal_Handling_Guide.pdf',
      'Furnace_Maintenance_Protocol.pdf'
    ],
    policies: [
      'SMS_General_Safety_Policy.pdf',
      'PPE_Requirements_Steel_Melting.pdf',
      'Scrap_Inspection_Policy.pdf'
    ]
  },
  {
    id: 'bp',
    title: 'BP',
    fullName: 'Beam Plant',
    icon: Building2,
    description: 'View BP operational manuals and quality standards.',
    lastUpdated: 'March 2026',
    procedures: ['BP_Operations_Manual.pdf'],
    policies: ['BP_Quality_Standard.pdf']
  },
  {
    id: 'lsm',
    title: 'LSM',
    fullName: 'Light Section Mill',
    icon: FileBox,
    description: 'Maintain LSM protocols and procedures.',
    lastUpdated: 'February 2026',
    procedures: ['LSM_Operations_Procedure.pdf'],
    policies: []
  },
  {
    id: 'ssc',
    title: 'SSC',
    fullName: 'Steel Service Center',
    icon: UserCircle,
    description: 'SSC Service guidelines and reporting processes.',
    lastUpdated: 'January 2026',
    procedures: ['SSC_Reporting_Procedure.pdf'],
    policies: ['SSC_Service_Guidelines.pdf']
  },
  {
    id: 'iso',
    title: 'ISO Management System',
    fullName: 'Management System',
    icon: Shield,
    description: 'Access ISO 9001, 14001, and 45001 standards.',
    lastUpdated: 'April 2026',
    procedures: [],
    policies: [
      'ISO_9001_Quality_Management.pdf',
      'ISO_14001_Environmental_Management.pdf',
      'ISO_45001_OHS.pdf'
    ]
  },
  {
    id: 'procurement',
    title: 'Procurement',
    fullName: 'Procurement (PRC)',
    icon: Cog,
    description: 'Vendor selection and purchase order workflows.',
    lastUpdated: 'March 2026',
    procedures: ['Purchase_Order_Workflow.pdf'],
    policies: ['Vendor_Selection_Policy.pdf']
  },
  {
    id: 'sales',
    title: 'Sales',
    fullName: 'Sales (SLS)',
    icon: Target,
    description: 'Client onboarding and sales contract procedures.',
    lastUpdated: 'April 2026',
    procedures: ['Client_Onboarding_Process.pdf'],
    policies: ['Sales_Contract_Approval_Policy.pdf']
  },
  {
    id: 'hrga',
    title: 'HRGA',
    fullName: 'Human Resources & General Affairs',
    icon: Workflow,
    description: 'Employee lifecycle and general affairs guidelines.',
    lastUpdated: 'March 2026',
    procedures: ['Leave_Request_Procedure.pdf'],
    policies: ['Employee_Code_of_Conduct.pdf', 'Recruitment_Policy.pdf']
  },
  {
    id: 'it',
    title: 'IT',
    fullName: 'Information Technology',
    icon: Network,
    description: 'IT security, device tracking, and user support.',
    lastUpdated: 'February 2026',
    procedures: ['AI_AIRA_Assistant_Usage.pdf', 'IT_Device_Tracking_Guide.pdf'],
    policies: ['Information_Security_Policy.pdf']
  },
  {
    id: 'gdu-scm',
    title: 'GDU & SCM',
    fullName: 'Supply Chain Management',
    icon: Cog,
    description: 'Supply chain logistics and material handling.',
    lastUpdated: 'January 2026',
    procedures: ['Material_Handling_Operations.pdf'],
    policies: ['Logistics_Policy.pdf']
  },
  {
    id: 'finance',
    title: 'Finance & Accounting',
    fullName: 'Finance & Accounting',
    icon: FileText,
    description: 'Expense reimbursement and financial closing protocols.',
    lastUpdated: 'April 2026',
    procedures: ['Monthly_Financial_Closing.pdf', 'Expense_Reimbursement_Procedure.pdf'],
    policies: ['Financial_Authorization_Policy.pdf']
  },
  {
    id: 'legal',
    title: 'Legal',
    fullName: 'Legal (LGL)',
    icon: Scale,
    description: 'Contract review and NDA guidelines.',
    lastUpdated: 'March 2026',
    procedures: ['Contract_Review_Process.pdf'],
    policies: ['NDA_Guidelines.pdf']
  },
  {
    id: 'qaqc',
    title: 'QA/QC',
    fullName: 'Quality Assurance / Quality Control',
    icon: CircleCheck,
    description: 'Product quality inspection and testing procedures.',
    lastUpdated: 'February 2026',
    procedures: ['Defect_Identification_Reporting.pdf'],
    policies: ['Product_Quality_Inspection_Policy.pdf']
  }
];

// ── Bot Embed Component ───────────────────────────────────────
const AiraAssistantBot = ({ dept }) => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeKey,   setIframeKey]   = useState(0);
  const iframeRef = useRef(null);

  const folderName = DEPT_FOLDER_MAP[dept.id] || dept.title;
  const deptLabel  = dept.fullName || dept.title;

  // iframe src — tanpa ctx param, context dikirim via postMessage
  const iframeSrc = `${BOT_ORIGIN}/embed/${BOT_ID}?theme=light&accent=${ACCENT}&brand=true`;

  // Kirim context dept ke bot via postMessage setelah iframe siap
  const sendDeptContext = () => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type:       'GYS_DEPT_CONTEXT',
        dept:       dept.id,
        deptLabel,
        folderName,
        // Pesan sistem tersembunyi — bot akan inject ini sebagai context awal
        systemNote: `User sedang berada di halaman departemen "${deptLabel}". ` +
                    `Fokuskan jawaban pada dokumen SOP dan Policy dari folder "${folderName}". ` +
                    `Jika pertanyaan tidak relevan dengan departemen ini, tetap jawab namun ` +
                    `sebutkan departemen yang lebih tepat.`,
      },
      BOT_ORIGIN
    );
  };

  // Kirim context saat iframe pertama kali ready
  const handleIframeLoad = () => {
    setIframeReady(true);
    // Beri sedikit delay agar bot widget selesai inisialisasi
    setTimeout(sendDeptContext, 800);
  };

  // Kirim ulang context saat dept berubah (user navigasi antar dept)
  useEffect(() => {
    setIframeReady(false);
    setIframeKey(prev => prev + 1); // reload iframe
  }, [dept.id]);

  // Kirim ulang saat bot dibuka (kalau sudah ready sebelumnya)
  useEffect(() => {
    if (isOpen && iframeReady) {
      setTimeout(sendDeptContext, 400);
    }
  }, [isOpen]);

  const chatWidth  = isMaximized ? 'w-[520px]' : 'w-80 sm:w-96';
  const chatHeight = isMaximized ? 'h-[700px]' : 'h-[500px]';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-2xl shadow-2xl ${chatWidth} overflow-hidden flex flex-col border border-slate-200 mb-4 ${chatHeight} transition-all duration-200`}
          >
            {/* Header */}
            <div className="bg-[#0C765B] px-4 py-3 flex justify-between items-center text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">AIRA Assistant</h3>
                  <p className="text-[10px] text-green-100 truncate max-w-[180px]">
                    📂 {deptLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Maximize / minimize */}
                <button
                  onClick={() => setIsMaximized(v => !v)}
                  className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                  title={isMaximized ? 'Perkecil' : 'Perbesar'}
                >
                  {isMaximized
                    ? <Minimize2 className="w-3.5 h-3.5" />
                    : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bot iframe — embed bot asli */}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={iframeSrc}
              onLoad={handleIframeLoad}
              className="flex-1 w-full border-0 bg-white"
              title={`AIRA Assistant — ${deptLabel}`}
              allow="clipboard-write"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#0C765B] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-[#0a614b] transition-colors flex items-center gap-2.5"
        >
          <Bot className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm whitespace-nowrap">
            Tanya AIRA
          </span>
        </motion.button>
      )}
    </div>
  );
};

// --- Komponen lain tidak berubah ---

const DepartmentCard = ({ dept, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay }} 
    onClick={onClick}
    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-[#0C765B]/30 transition-all cursor-pointer flex flex-col h-full group"
  >
    <div className="w-12 h-12 bg-[#0C765B]/10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 group-hover:scale-110 transition-transform">
      <dept.icon className="w-6 h-6 text-[#0C765B]" />
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-bold text-slate-900 mb-1">{dept.title}</h3>
      {dept.fullName && <p className="text-xs font-semibold text-[#0C765B] mb-2">{dept.fullName}</p>}
      <p className="text-slate-600 text-sm mb-4">{dept.description}</p>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <span className="text-xs text-slate-500">
        {dept.procedures.length + dept.policies.length} Documents
      </span>
      <span className="text-[#0C765B] text-sm font-medium group-hover:underline flex items-center">
        Open
      </span>
    </div>
  </motion.div>
);

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
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title} Policy</h3>
    <p className="text-slate-600 text-sm mb-4">{description}</p>
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <span className="text-xs text-slate-500">Last updated: {lastUpdated}</span>
      <button className="text-[#0C765B] text-sm font-medium hover:underline">Read Policy</button>
    </div>
  </motion.div>
);

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

// --- Pages ---

// 1. Department Detail Page
export const DepartmentDetailPage = () => {
  const { deptId } = useParams();
  const dept = departmentsData.find(d => d.id === deptId);

  if (!dept) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-700">Department Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="dept-detail-page">
      <Header />
      <PageContainer
        title={`${dept.title} Documents`}
        subtitle={dept.fullName ? `${dept.fullName} — ${dept.description}` : dept.description}
        breadcrumbs={[
          { label: 'Procedures & Policies', path: '/compliance/sop' },
          { label: dept.title },
        ]}
        category="compliance"
      >
        <div className="max-w-4xl">

          {/* Banner hint bot */}
          <div className="mb-8 flex items-center gap-3 bg-[#0C765B]/5 border border-[#0C765B]/20 rounded-xl px-5 py-3.5">
            <Bot className="w-5 h-5 text-[#0C765B] flex-shrink-0" />
            <p className="text-sm text-slate-600">
              Punya pertanyaan tentang dokumen <strong>{dept.fullName || dept.title}</strong>?{' '}
              <span className="text-[#0C765B] font-semibold">Klik tombol AIRA</span> di pojok kanan bawah — bot akan otomatis fokus ke departemen ini.
            </p>
          </div>

          {/* Procedures Section */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
              <span className="w-2 h-6 bg-[#0C765B] rounded-full mr-3"></span>
              Standard Operating Procedures
            </h3>
            <div className="space-y-3">
              {dept.procedures.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-[#0C765B]/5 transition-colors group cursor-pointer border border-transparent hover:border-[#0C765B]/20">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium truncate">{doc}</span>
                  </div>
                  <button className="text-slate-400 group-hover:text-[#0C765B] transition-colors flex-shrink-0 ml-4 flex items-center space-x-2">
                    <span className="text-sm font-medium hidden sm:block">Download</span>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {dept.procedures.length === 0 && (
                <p className="text-slate-500 italic p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No procedures currently available for this department.
                </p>
              )}
            </div>
          </div>

          {/* Policies Section */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
              <span className="w-2 h-6 bg-amber-500 rounded-full mr-3"></span>
              Department Policies
            </h3>
            <div className="space-y-3">
              {dept.policies.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors group cursor-pointer border border-transparent hover:border-amber-200">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium truncate">{doc}</span>
                  </div>
                  <button className="text-slate-400 group-hover:text-amber-600 transition-colors flex-shrink-0 ml-4 flex items-center space-x-2">
                    <span className="text-sm font-medium hidden sm:block">Download</span>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {dept.policies.length === 0 && (
                <p className="text-slate-500 italic p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No policies currently available for this department.
                </p>
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Bot embed asli — otomatis tahu dept yang aktif */}
      <AiraAssistantBot dept={dept} />

      <Footer />
    </div>
  );
};

// 2. Main SOP Page
export const SOPPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white" data-testid="sop-page">
      <Header />
      <PageContainer
        title="Procedures & Policies"
        subtitle="Access all department Standard Operating Procedures and Policies documentation."
        breadcrumbs={[
          { label: 'Procedures & Policies', path: '/compliance' },
          { label: 'Procedures & Policies' },
        ]}
        category="compliance"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentsData.map((dept, idx) => (
            <DepartmentCard 
              key={dept.id}
              dept={dept}
              delay={idx * 0.05}
              onClick={() => navigate(`/compliance/department/${dept.id}`)}
            />
          ))}
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const PoliciesPage = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="policies-page">
      <Header />
      <PageContainer
        title="Company Policies"
        subtitle="Essential policies that govern our operations and guide employee conduct at PT Garuda Yamato Steel."
        breadcrumbs={[
          { label: 'Procedures & Policies', path: '/compliance' },
          { label: 'Policies' },
        ]}
        category="compliance"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <PolicyCard icon={Shield}    title="Information Security Policy" description="Guidelines for protecting company data and information systems from unauthorized access." lastUpdated="January 2026" delay={0} />
          <PolicyCard icon={AlertTriangle} title="Health & Safety Policy" description="Our commitment to maintaining a safe and healthy workplace for all employees." lastUpdated="December 2025" delay={0.1} />
          <PolicyCard icon={FileText}  title="Code of Conduct"            description="Standards of behavior and ethical guidelines for all GYS employees and partners." lastUpdated="November 2025" delay={0.2} />
          <PolicyCard icon={CheckCircle} title="Quality Assurance Policy" description="Our framework for ensuring consistent product quality and continuous improvement." lastUpdated="October 2025" delay={0.3} />
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const SafetyPage = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="safety-page">
      <Header />
      <PageContainer
        title="Safety Guidelines"
        subtitle="Your safety is our top priority. Follow these guidelines to ensure a safe working environment."
        breadcrumbs={[
          { label: 'Procedures & Policies', path: '/compliance' },
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
                Safety is not just a policy — it is a core value that guides everything we do.
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
