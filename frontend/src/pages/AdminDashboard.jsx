import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, Image, Users, TrendingUp, Eye } from 'lucide-react';
import { apiService } from '../lib/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    photos: 0,
    employees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsRes, eventsRes, photosRes, employeesRes] = await Promise.all([
          apiService.getNews({ limit: 100 }),
          apiService.getEvents({ limit: 100 }),
          apiService.getPhotos({ limit: 100 }),
          apiService.getEmployees({ limit: 100 }),
        ]);
        setStats({
          news: newsRes.data.length,
          events: eventsRes.data.length,
          photos: photosRes.data.length,
          employees: employeesRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: Newspaper, label: 'News Articles', value: stats.news, color: 'bg-blue-500', link: '/admin/news' },
    { icon: Calendar, label: 'Events', value: stats.events, color: 'bg-purple-500', link: '/admin/events' },
    { icon: Image, label: 'Photos', value: stats.photos, color: 'bg-amber-500', link: '/admin/gallery' },
    { icon: Users, label: 'Employees', value: stats.employees, color: 'bg-emerald-500', link: '/admin/employees' },
  ];

  return (
    <div data-testid="admin-dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome to GYS Intranet Content Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.a
            key={index}
            href={card.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-slate-500 text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-slate-900">
              {loading ? '...' : card.value}
            </p>
          </motion.a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/news"
            className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl hover:bg-[#0C765B]/5 transition-colors"
          >
            <Newspaper className="w-5 h-5 text-[#0C765B]" />
            <span className="font-medium text-slate-700">Add News Article</span>
          </a>
          <a
            href="/admin/events"
            className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl hover:bg-[#0C765B]/5 transition-colors"
          >
            <Calendar className="w-5 h-5 text-[#0C765B]" />
            <span className="font-medium text-slate-700">Create Event</span>
          </a>
          <a
            href="/admin/gallery"
            className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl hover:bg-[#0C765B]/5 transition-colors"
          >
            <Image className="w-5 h-5 text-[#0C765B]" />
            <span className="font-medium text-slate-700">Upload Photos</span>
          </a>
          <a
            href="/admin/employees"
            className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl hover:bg-[#0C765B]/5 transition-colors"
          >
            <Users className="w-5 h-5 text-[#0C765B]" />
            <span className="font-medium text-slate-700">Manage Directory</span>
          </a>
        </div>
      </div>

      {/* View Site */}
      <div className="mt-8 text-center">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-[#0C765B] font-medium hover:underline"
        >
          <Eye className="w-4 h-4" />
          <span>View Public Intranet</span>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
