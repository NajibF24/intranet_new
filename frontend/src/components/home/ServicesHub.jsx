import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Pastikan install react-router-dom

export const ServicesHub = () => {
  return (
    <section className="py-24 bg-white" id="services" data-testid="services-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-[#0C765B] font-semibold text-sm uppercase tracking-wider mb-2 block">
            Centralized Access
          </span>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Employee Services Hub
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Access all essential tools (IT, HR, Assets) from one single dashboard.
          </p>
        </motion.div>

        {/* Single Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Link ini mengarah ke route internal yang akan menampilkan ServicePages.jsx */}
          <Link to="/services/portal" className="group relative block">
            
            <div className="glass rounded-3xl p-10 border border-slate-200/50 hover:border-[#0C765B]/30 transition-all duration-300 hover:shadow-2xl flex flex-col md:flex-row items-center gap-8 bg-white">
              
              {/* Icon Visual */}
              <div className="w-24 h-24 bg-gradient-to-br from-[#0C765B] to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
                <LayoutGrid className="w-10 h-10 text-white" />
              </div>

              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#0C765B] transition-colors">
                  Open GYS Portal
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Click here to access <strong>IT Global Services</strong>, <strong>HR Darwinbox</strong>, and <strong>FA E-Asset</strong> management in one integrated system.
                </p>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0C765B]/10 text-[#0C765B] font-semibold group-hover:bg-[#0C765B] group-hover:text-white transition-all duration-300">
                  Access Portal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            {/* Decorative Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesHub;
