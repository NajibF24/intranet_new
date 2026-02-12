import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2 } from 'lucide-react';

const GYS_LOGO = 'https://customer-assets.emergentagent.com/job_39fb6c95-d97a-4bed-8a0a-484ac8ea1dc9/artifacts/jqc0zqcj_Logo%20GYS.png';
const YAMATO_LOGO = 'https://customer-assets.emergentagent.com/job_39fb6c95-d97a-4bed-8a0a-484ac8ea1dc9/artifacts/kvhd76cb_yamato_logo.png';
const SYS_LOGO = 'https://customer-assets.emergentagent.com/job_39fb6c95-d97a-4bed-8a0a-484ac8ea1dc9/artifacts/sasah9ha_syssteel-logo.png';
const HANWA_LOGO = 'https://customer-assets.emergentagent.com/job_39fb6c95-d97a-4bed-8a0a-484ac8ea1dc9/artifacts/5m4u3l0k_hanwa-logo.png';
const GRP_LOGO = 'https://customer-assets.emergentagent.com/job_39fb6c95-d97a-4bed-8a0a-484ac8ea1dc9/artifacts/t4s3wpqj_grp-logo.png';

const shareholders = [
  {
    number: 1,
    name: 'Yamato Kogyo Co Ltd',
    percentage: '45%',
    color: '#0C765B',
    logo: YAMATO_LOGO,
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
    logo: SYS_LOGO,
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
    logo: HANWA_LOGO,
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
    logo: GRP_LOGO,
    location: 'Indonesia',
    established: '1991',
    activity: 'Steel manufacturer using Electric Arc Furnaces (EAF).',
    product: 'Hot Rolled Coils, Steel Plates',
  },
];

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{label}</span>
    <span className="text-sm text-slate-700">{value}</span>
  </div>
);

const ShareholderCard = ({ sh, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
    data-testid={'shareholder-card-' + index}
  >
    {/* Card Header with Logo */}
    <div className="p-6 border-b border-slate-100 bg-slate-50">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 flex-shrink-0 shadow-sm">
          <img src={sh.logo} alt={sh.name} className="w-full h-full object-contain" />
        </div>
        {/* Name + Percentage */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white" style={{ backgroundColor: sh.color }}>
              {sh.number}
            </span>
            <h3 className="text-lg font-bold text-slate-900 truncate">{sh.name}</h3>
          </div>
          {sh.subtitle && <p className="text-xs text-slate-500 mb-1">{sh.subtitle}</p>}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: sh.color }}>
            {sh.percentage}
          </span>
        </div>
      </div>
    </div>

    {/* Card Details */}
    <div className="p-6 space-y-3">
      <InfoRow label="Location" value={sh.location} />
      <InfoRow label="Established" value={sh.established} />
      <InfoRow label="Activity" value={sh.activity} />
      {sh.product && <InfoRow label="Product" value={sh.product} />}
    </div>
  </motion.div>
);

export const ShareholderSection = () => (
  <div className="bg-white py-16 lg:py-24" data-testid="shareholder-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="shareholder-heading">Shareholder</h2>
        <p className="text-slate-500 max-w-xl mx-auto">The ownership structure of Garuda Yamato Steel — a strong alliance of global steel leaders.</p>
      </motion.div>

      {/* GYS Center Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex justify-center mb-12"
      >
        <div className="bg-[#0C765B] rounded-3xl p-6 shadow-xl flex flex-col items-center">
          <img src={GYS_LOGO} alt="GYS" className="h-16 object-contain mb-2" />
          <span className="text-xs font-bold text-white/70 uppercase tracking-[0.15em]">Garuda Yamato Steel</span>
        </div>
      </motion.div>

      {/* Shareholder Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6" data-testid="shareholder-cards">
        {shareholders.map(function(sh, i) {
          return <ShareholderCard key={sh.name} sh={sh} index={i} />;
        })}
      </div>
    </div>
  </div>
);
