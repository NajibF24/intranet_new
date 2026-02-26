import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Image,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Palette,
  UserCog,
  Radio,
  FileText,
  LayoutList,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Palette, label: 'Hero Settings', path: '/admin/hero' },
  { icon: Radio, label: 'Ticker Banner', path: '/admin/ticker' },
  { icon: Newspaper, label: 'News', path: '/admin/news' },
  { icon: Calendar, label: 'Events', path: '/admin/events' },
  { icon: Image, label: 'Gallery', path: '/admin/gallery' },
  { icon: Users, label: 'Employees', path: '/admin/employees' },
  { icon: FileText, label: 'Page Management', path: '/admin/pages' },
  { icon: LayoutList, label: 'Menu Management', path: '/admin/menus' },
  { icon: UserCog, label: 'User Management', path: '/admin/users', adminOnly: true },
];

export const AdminLayout = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  // Menutup sidebar otomatis saat navigasi di mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0C765B] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex" data-testid="admin-layout">
      {/* Mobile Header - Visible only on small screens */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          <img 
            src="https://customer-assets.emergentagent.com/job_intranet-hub-12/artifacts/hotpzocu_Logo%20GYS.png" 
            alt="GYS Logo"
            className="h-8 w-auto"
          />
          <span className="font-bold text-slate-800 text-sm">GYS Admin</span>
        </div>
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
          <Home className="w-5 h-5" />
        </Link>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#0C765B] to-[#074737] z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full text-white">
          {/* Sidebar Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_intranet-hub-12/artifacts/hotpzocu_Logo%20GYS.png" 
                alt="GYS Logo"
                className="h-10 w-auto brightness-0 invert"
              />
              <div className="min-w-0">
                <p className="font-bold leading-none truncate">GYS Admin</p>
                <p className="text-[10px] text-white/60 mt-1 uppercase tracking-wider">CMS v1.0</p>
              </div>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            {sidebarItems
              .filter((item) => !item.adminOnly || user.role === 'admin')
              .map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-white text-[#0C765B] shadow-lg shadow-black/10'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#0C765B]' : 'text-white/50 group-hover:text-white'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && <motion.div layoutId="activeNav" className="ml-auto"><ChevronRight className="w-4 h-4" /></motion.div>}
                  </Link>
                );
              })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-white/10 bg-black/10 shrink-0">
            <div className="flex items-center space-x-3 px-2 mb-4">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-[10px] text-white/50 uppercase truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2.5 w-full text-red-200 hover:bg-red-500/20 hover:text-red-100 rounded-xl transition-all text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Desktop Header - Spacing for mobile fixed header */}
        <div className="h-16 lg:h-0 shrink-0" />
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {/* PENTING: Outlet ini adalah tempat halaman seperti Employees merender tabel.
                Gunakan pembungkus ini agar konten tabel tidak memaksa layar melebar.
            */}
            <div className="overflow-x-auto lg:overflow-visible">
               <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
