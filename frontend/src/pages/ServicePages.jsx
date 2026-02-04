import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { Monitor, Headphones, Laptop, Server, Users, FileText, DollarSign, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const ServicePageTemplate = ({ title, subtitle, breadcrumbs, services, contacts }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageContainer title={title} subtitle={subtitle} breadcrumbs={breadcrumbs}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                <service.icon className={`w-6 h-6 ${service.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-slate-600 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Need Help?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#0C765B]/10 rounded-lg flex items-center justify-center">
                  <contact.icon className="w-5 h-5 text-[#0C765B]" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{contact.label}</p>
                  <p className="font-medium text-slate-900">{contact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const ITServicesPage = () => {
  const services = [
    {
      icon: Headphones,
      title: 'IT Helpdesk',
      description: 'Submit and track IT support tickets for technical issues and requests.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Laptop,
      title: 'Software Requests',
      description: 'Request new software installations and license approvals.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Server,
      title: 'System Access',
      description: 'Request access to company systems and applications.',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Monitor,
      title: 'Hardware Support',
      description: 'Report hardware issues and request equipment repairs or replacements.',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const contacts = [
    { icon: Headphones, label: 'IT Helpdesk', value: 'Ext. 1234' },
    { icon: Monitor, label: 'Email', value: 'it.support@gys.co.id' },
  ];

  return (
    <div data-testid="it-services-page">
      <ServicePageTemplate
        title="IT Global Services"
        subtitle="Access IT support, software requests, and technical assistance through our centralized IT portal."
        breadcrumbs={[
          { label: 'Employee Services', path: '/services' },
          { label: 'IT Global Services' },
        ]}
        services={services}
        contacts={contacts}
      />
    </div>
  );
};

export const HRServicesPage = () => {
  const services = [
    {
      icon: Users,
      title: 'Leave Management',
      description: 'Submit leave requests and view your leave balance and history.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: DollarSign,
      title: 'Payroll Information',
      description: 'Access your payslips, tax documents, and salary information.',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: FileText,
      title: 'Benefits Portal',
      description: 'View and manage your employee benefits and insurance coverage.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Headphones,
      title: 'HR Support',
      description: 'Contact HR for assistance with employment-related queries.',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const contacts = [
    { icon: Users, label: 'HR Department', value: 'Ext. 2345' },
    { icon: FileText, label: 'Email', value: 'hr@gys.co.id' },
  ];

  return (
    <div data-testid="hr-services-page">
      <ServicePageTemplate
        title="HR Darwinbox"
        subtitle="Manage your HR needs including leave requests, payroll information, and employee benefits."
        breadcrumbs={[
          { label: 'Employee Services', path: '/services' },
          { label: 'HR Darwinbox' },
        ]}
        services={services}
        contacts={contacts}
      />
    </div>
  );
};

export const FAServicesPage = () => {
  const services = [
    {
      icon: Package,
      title: 'Asset Request',
      description: 'Request new equipment, furniture, or other company assets.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: FileText,
      title: 'Asset Tracking',
      description: 'View assets assigned to you and their current status.',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Monitor,
      title: 'Asset Transfer',
      description: 'Request asset transfers between departments or locations.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Headphones,
      title: 'FA Support',
      description: 'Contact Fixed Assets team for assistance and inquiries.',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const contacts = [
    { icon: Package, label: 'FA Department', value: 'Ext. 3456' },
    { icon: FileText, label: 'Email', value: 'fa@gys.co.id' },
  ];

  return (
    <div data-testid="fa-services-page">
      <ServicePageTemplate
        title="FA E-Asset"
        subtitle="Track and manage company assets, request equipment, and view asset allocation status."
        breadcrumbs={[
          { label: 'Employee Services', path: '/services' },
          { label: 'FA E-Asset' },
        ]}
        services={services}
        contacts={contacts}
      />
    </div>
  );
};
