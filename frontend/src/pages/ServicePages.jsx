import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  PenTool, 
  Users, 
  Utensils, 
  Package, 
  UserPlus, 
  BarChart3, 
  MessageCircle, 
  Headphones, 
  ShoppingCart, 
  Truck, 
  FileSignature, 
  Activity,
  LayoutGrid,
  FileCheck
} from 'lucide-react';

// Daftar Aplikasi & Linknya
const apps = [
  {
    name: "IT Global Services",
    url: "https://globalservices.gyssteel.com/login",
    icon: Headphones,
    color: "bg-blue-500",
    desc: "IT Helpdesk & Ticketing"
  },
  {
    name: "GYS Darwinbox",
    url: "https://gys.darwinbox.com/user/login",
    icon: Users,
    color: "bg-purple-500",
    desc: "HRIS, Payroll & Leave"
  },
  {
    name: "FA E-Asset",
    url: "https://garudayamatosteel.outsystemsenterprise.com/eAsset_Web/Login2",
    icon: Package,
    color: "bg-emerald-500",
    desc: "Asset Management System"
  },
  // --- MEKARI SIGN (External) ---
  {
    name: "Mekari Sign",
    url: "https://account.mekari.com/users/sign_in?client_id=e1urNpS68IK6US5e&return_to=L2F1dGg_Y2xpZW50X2lkPWUxdXJOcFM2OElLNlVTNWUmcmVzcG9uc2VfdHlwZT1jb2RlJnNjb3BlPXNzbzpwcm9maWxl",
    icon: PenTool,
    color: "bg-red-600",
    desc: "External Digital Signature Platform"
  },
  // --- GYS ESIGN (Internal) ---
  {
    name: "GYS eSign",
    url: "https://esign.gyssteel.com/",
    icon: FileCheck, // Menggunakan icon berbeda agar visualnya beda
    color: "bg-rose-500",
    desc: "Internal Document Signing System"
  },
  {
    name: "Lunch Coupon",
    url: "https://coupon.gyssteel.com/login",
    icon: Utensils,
    color: "bg-orange-500",
    desc: "Canteen & Meal Coupons"
  },
  {
    name: "ChatGYS",
    url: "https://chat.gyssteel.com/login",
    icon: MessageCircle,
    color: "bg-indigo-500",
    desc: "Internal Chatbot Apps"
  },
  {
    name: "PowerBI Dashboard",
    url: "https://app.powerbi.com/?noSignUpCheck=1",
    icon: BarChart3,
    color: "bg-yellow-500",
    desc: "Data Analytics & Reports"
  },
  {
    name: "Bon Order",
    url: "https://bonorder.gyssteel.com/",
    icon: ShoppingCart,
    color: "bg-cyan-500",
    desc: "Ordering System"
  },
  {
    name: "Customer Pre-Registration",
    url: "https://project.gyssteel.com/grp_preregistration/",
    icon: UserPlus,
    color: "bg-teal-500",
    desc: "Visitor & Customer Reg"
  },
  {
    name: "Vendor Pre-Registration",
    url: "https://project.gyssteel.com/venpreg/login",
    icon: Truck,
    color: "bg-slate-600",
    desc: "Supplier Registration"
  },
  {
    name: "OSS Management",
    url: "https://oss.gyssteel.com/login",
    icon: Activity,
    color: "bg-green-600",
    desc: "Operational Support System"
  }
];

export const UnifiedPortalPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Hero Header */}
      <div className="bg-[#0C765B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">GYS Applications Portal</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Centralized access to all Garuda Yamato Steel operational applications and services.
          </p>
        </div>
      </div>

      {/* Apps Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app, index) => (
            <motion.a
              key={index}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Card Header with Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${app.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <app.icon className="w-6 h-6" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#0C765B] transition-colors" />
              </div>

              {/* Card Content */}
              <div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-[#0C765B] transition-colors line-clamp-1">
                  {app.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {app.desc}
                </p>
              </div>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </motion.a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
