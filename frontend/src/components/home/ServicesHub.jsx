import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Users, BarChart3, ArrowUpRight } from 'lucide-react';

const services = [
  {
    icon: Monitor,
    title: 'IT Global Services',
    description: 'Access IT support, software requests, and technical assistance through our centralized IT portal.',
    link: '/services/it',
    color: 'from-blue-500/20 to-blue-600/20',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Users,
    title: 'HR Darwinbox',
    description: 'Manage your HR needs including leave requests, payroll information, and employee benefits.',
    link: '/services/hr',
    color: 'from-purple-500/20 to-purple-600/20',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: BarChart3,
    title: 'FA E-Asset',
    description: 'Track and manage company assets, request equipment, and view asset allocation status.',
    link: '/services/fa',
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
];

export const ServicesHub = () => {
  return (
    <section className="py-24 bg-white" id="services" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#0C765B] font-semibold text-sm uppercase tracking-wider mb-2 block">
            Tools Dashboard
          </span>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Employee Services Hub
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Quick access to essential employee tools and services. Everything you need to manage your work efficiently.
          </p>
        </motion.div>

        {/* Services Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.a
              key={index}
              href={service.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
              data-testid={`service-card-${index}`}
            >
              <div className="glass rounded-2xl p-8 h-full border border-slate-200/50 hover:border-[#0C765B]/30 transition-all duration-300 hover:shadow-xl">
                {/* Icon */}
                <div className={`w-14 h-14 ${service.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#0C765B] transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Link */}
                <div className="flex items-center text-[#0C765B] font-semibold">
                  <span>Access Portal</span>
                  <ArrowUpRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>

              {/* Decorative gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHub;
