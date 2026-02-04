import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Palette, label: 'Hero Settings', path: '/admin/hero' },
  { icon: Newspaper, label: 'News', path: '/admin/news' },
  { icon: Calendar, label: 'Events', path: '/admin/events' },
  { icon: Image, label: 'Gallery', path: '/admin/gallery' },
  { icon: Users, label: 'Employees', path: '/admin/employees' },
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100" data-testid="admin-layout">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg"
          data-testid="mobile-sidebar-toggle"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center space-x-2">
          <img 
            src="https://customer-assets.emergentagent.com/job_intranet-hub-12/artifacts/hotpzocu_Logo%20GYS.png" 
            alt="GYS Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="font-semibold text-slate-900">Admin</span>
        </div>
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-lg">
          <Home className="w-5 h-5" />
        </Link>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0C765B] to-[#074737] z-50 transform transition-transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="admin-sidebar"
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_intranet-hub-12/artifacts/hotpzocu_Logo%20GYS.png" 
              alt="GYS Logo"
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="text-white font-semibold">GYS Admin</p>
              <p className="text-white/60 text-xs">Content Management</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white text-[#0C765B]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                data-testid={`sidebar-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-4 px-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user.name}</p>
              <p className="text-white/60 text-xs">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-white/80 hover:bg-white/10 hover:text-white rounded-xl transition-all"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
