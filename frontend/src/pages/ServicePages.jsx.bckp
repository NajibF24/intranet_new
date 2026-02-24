import React from 'react';
import EmbeddedServicePage from '../components/EmbeddedServicePage';
import { Headphones, Users, Package } from 'lucide-react';

// IT Global Services - IT Helpdesk
export const ITServicesPage = () => {
  return (
    <EmbeddedServicePage
      title="IT Global Services"
      subtitle="Access IT support, submit tickets, and manage technical requests"
      externalUrl="https://globalservices.gyssteel.com"
      icon={Headphones}
      breadcrumbs={[
        { label: 'Employee Services', path: '/' },
        { label: 'IT Global Services' },
      ]}
      fallbackMessage="The IT Helpdesk portal cannot be embedded due to security settings. Please click below to access the ticketing system directly."
    />
  );
};

// HR Darwinbox
export const HRServicesPage = () => {
  return (
    <EmbeddedServicePage
      title="GYS Darwinbox"
      subtitle="Manage HR needs including leave, payroll, and employee benefits"
      externalUrl="https://gys.darwinbox.com"
      icon={Users}
      breadcrumbs={[
        { label: 'Employee Services', path: '/' },
        { label: 'GYS Darwinbox' },
      ]}
      fallbackMessage="Darwinbox cannot be embedded due to security settings. Please click below to access the HR portal directly."
    />
  );
};

// FA E-Asset
export const FAServicesPage = () => {
  return (
    <EmbeddedServicePage
      title="FA E-Asset"
      subtitle="Track and manage company assets, request equipment, and view allocations"
      externalUrl="https://garudayamatosteel.outsystemsenterprise.com/eAsset_Web/"
      icon={Package}
      breadcrumbs={[
        { label: 'Employee Services', path: '/' },
        { label: 'FA E-Asset' },
      ]}
      fallbackMessage="The E-Asset portal cannot be embedded due to security settings. Please click below to access the asset management system directly."
    />
  );
};
