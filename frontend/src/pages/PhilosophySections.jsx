import React from 'react';
import { Gem, Lightbulb, Recycle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const qualityHighlights = [
  'Radioactive detection systems for raw material inspection',
  'Over 90% TKDN (Domestic Component Level Certificate)',
  'SNI and International Standards compliance',
];

const innovationHighlights = [
  'Electric Arc Furnace (EAF) with scrap pre-heater',
  'European-made rolling mill technology',
  'Only mill in Indonesia for High Tensile & Seismic steel',
];

const sustainHighlights = [
  'EAF method using recycled steel scrap',
  '6.5 MW rooftop solar panel system',
  'EPD (Environmental Product Declaration) certified',
];

const HighlightBox = ({ highlights, index, title }) => (
  <div className="sticky top-28">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 bg-[#0C765B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0C765B]/20">
        {index === 0 && <Gem className="w-7 h-7 text-white" />}
        {index === 1 && <Lightbulb className="w-7 h-7 text-white" />}
        {index === 2 && <Recycle className="w-7 h-7 text-white" />}
      </div>
      <div>
        <p className="text-xs font-bold text-[#0C765B] uppercase tracking-widest">
          {'Core Value ' + (index + 1)}
        </p>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      </div>
    </div>
    <div className="bg-[#0C765B]/5 border border-[#0C765B]/10 rounded-xl p-5 mt-6">
      <p className="text-xs font-bold text-[#0C765B] uppercase tracking-widest mb-3">Key Highlights</p>
      <div className="space-y-3">
        {highlights.map(function(h, hi) {
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
);

export const QualitySection = () => (
  <div className="bg-white" data-testid="core-value-quality">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-4">
          <HighlightBox highlights={qualityHighlights} index={0} title="Quality" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="lg:col-span-8">
          <p className="text-slate-600 leading-relaxed mb-5">
            At GYS, we are committed to providing steel products of the highest quality, not only meeting but exceeding industry standards and customer expectations. Our dedication to quality goes beyond product performance — it extends to safety, reliability, and sustainability.
          </p>
          <p className="text-slate-600 leading-relaxed">
            As part of our quality assurance, we employ radioactive detection systems during raw material inspection to guarantee safety from the very beginning stage of our manufacturing process. Furthermore, our major products achieve over 90% TKDN (Domestic Component Level Certificate), supporting local industry and national development. All products comply with SNI, and International Standards, ensuring world-class quality and reliability.
          </p>
        </motion.div>
      </div>
    </div>
  </div>
);

export const InnovationSection = () => (
  <div className="bg-slate-50" data-testid="core-value-innovation">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-4 lg:order-2">
          <HighlightBox highlights={innovationHighlights} index={1} title="Innovation" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="lg:col-span-8 lg:order-1">
          <p className="text-slate-600 leading-relaxed mb-5">
            At GYS, we strive to stay ahead in the highly competitive steel industry by continuously improving our processes, products, and services through innovation and technology.
          </p>
          <p className="text-slate-600 leading-relaxed mb-5">
            Our manufacturing system incorporates an Electric Arc Furnace (EAF) equipped with a scrap pre-heater, enhancing energy efficiency and environmental performance. In addition, we have introduced cutting-edge European-made rolling mill technology, which significantly improves precision and productivity.
          </p>
          <p className="text-slate-600 leading-relaxed mb-5">
            GYS offers a wide variety of products and steel grades to meet diverse construction needs. We integrate Japan's rigorous standards into our production, enabling us to supply High Tensile steel for superior strength and Seismic-resistant steel for earthquake resilience — making us the only mill in Indonesia capable of delivering these advanced solutions.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Through these innovations, GYS continues to create new value for Indonesia's construction industry, combining world-class technology with local expertise to ensure reliability, safety, and sustainability.
          </p>
        </motion.div>
      </div>
    </div>
  </div>
);

export const SustainabilitySection = () => (
  <div className="bg-white" data-testid="core-value-sustainability">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-4">
          <HighlightBox highlights={sustainHighlights} index={2} title="Sustainability" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="lg:col-span-8">
          <p className="text-slate-600 leading-relaxed mb-5">
            GYS is committed to minimizing environmental impact by adopting sustainable manufacturing processes, reducing waste, promoting recycling, and improving energy efficiency.
          </p>
          <p className="text-slate-600 leading-relaxed mb-5">
            Our manufacturing process, the Electric Arc Furnace (EAF) method, uses end-of-life steel scrap as its primary raw material, melting it with electric arc heat to regenerate it into new steel products. This approach enables resource recycling and supports the circular economy, while reducing environmental impact. Furthermore, by introducing scrap preheating systems, we reduce energy consumption and actively lower CO2 emissions.
          </p>
          <p className="text-slate-600 leading-relaxed mb-5">
            GYS supports the development of a sustainable local economy through the use of domestic scrap, local production, and local supply. We actively promote recycling, produce low carbon emission steel, and implement environmentally friendly manufacturing practices, contributing to Indonesia's national Net Zero goals. Furthermore, we have installed a 6.5 MW rooftop solar panel system and continue to adopt renewable energy sources.
          </p>
          <p className="text-slate-600 leading-relaxed">
            In addition, GYS has obtained EPD (Environmental Product Declaration) ensuring that the environmental performance and sustainability of our products. GYS is committed to reducing environmental impact and contributing to the creation of a sustainable society in Indonesia.
          </p>
        </motion.div>
      </div>
    </div>
  </div>
);
