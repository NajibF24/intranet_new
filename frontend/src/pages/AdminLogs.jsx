import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  Filter,
  LogIn,
  FileText,
  Settings,
  UserCog,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiService } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const CATEGORIES = [
  { value: '', label: 'All Categories', icon: Activity },
  { value: 'auth', label: 'Authentication', icon: LogIn },
  { value: 'content', label: 'Content', icon: FileText },
  { value: 'settings', label: 'Settings', icon: Settings },
  { value: 'admin', label: 'Admin', icon: UserCog },
];

const CATEGORY_COLORS = {
  auth: 'bg-blue-100 text-blue-700',
  content: 'bg-emerald-100 text-emerald-700',
  settings: 'bg-amber-100 text-amber-700',
  admin: 'bg-purple-100 text-purple-700',
};

const ACTION_LABELS = {
  login: 'Login',
  create_news: 'Create News',
  update_news: 'Update News',
  delete_news: 'Delete News',
  create_event: 'Create Event',
  update_event: 'Update Event',
  delete_event: 'Delete Event',
  create_employee: 'Create Employee',
  update_employee: 'Update Employee',
  delete_employee: 'Delete Employee',
  create_page: 'Create Page',
  update_page: 'Update Page',
  delete_page: 'Delete Page',
  create_menu: 'Create Menu',
  update_menu: 'Update Menu',
  delete_menu: 'Delete Menu',
  reorder_menu: 'Reorder Menu',
  create_album: 'Create Album',
  update_album: 'Update Album',
  delete_album: 'Delete Album',
  create_photo: 'Create Photo',
  update_photo: 'Update Photo',
  delete_photo: 'Delete Photo',
  create_user: 'Create User',
  update_user: 'Update User',
  delete_user: 'Delete User',
  update_hero: 'Update Hero',
  update_ticker: 'Update Ticker',
};

const PAGE_SIZE = 20;

export const AdminLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: PAGE_SIZE, skip: page * PAGE_SIZE };
      if (category) params.category = category;
      const [logsRes, countRes] = await Promise.all([
        apiService.getLogs(params),
        apiService.getLogsCount(category ? { category } : {}),
      ]);
      setLogs(logsRes.data);
      setTotalCount(countRes.data.count);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(0);
  }, [category]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64" data-testid="admin-logs-denied">
        <p className="text-slate-500">Admin access required to view activity logs.</p>
      </div>
    );
  }

  const filtered = searchTerm
    ? logs.filter(
        (l) =>
          l.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.details?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : logs;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div data-testid="admin-logs-page">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" data-testid="logs-page-title">Activity Log</h1>
            <p className="text-sm text-slate-500 mt-1">Track all user activities across the portal</p>
          </div>
          <button
            onClick={fetchLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0C765B] text-white rounded-lg hover:bg-[#0a6550] transition-colors text-sm font-medium self-start"
            data-testid="logs-refresh-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user, action or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C765B]/20 focus:border-[#0C765B]"
              data-testid="logs-search-input"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C765B]/20 focus:border-[#0C765B] bg-white"
              data-testid="logs-category-filter"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {CATEGORIES.filter((c) => c.value).map((cat) => {
            const count = category === cat.value ? totalCount : '-';
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  category === cat.value
                    ? 'border-[#0C765B] bg-[#0C765B]/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                data-testid={`logs-filter-${cat.value}`}
              >
                <cat.icon className="w-4 h-4 text-slate-500 mb-1" />
                <p className="text-xs text-slate-500">{cat.label}</p>
                <p className="text-lg font-semibold text-slate-900">{count}</p>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center" data-testid="logs-loading">
              <div className="animate-spin w-8 h-8 border-4 border-[#0C765B] border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading activity logs...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center" data-testid="logs-empty">
              <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No activity logs found</p>
              <p className="text-sm text-slate-400 mt-1">Logs will appear here as users interact with the portal</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="logs-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors" data-testid={`log-row-${log.id}`}>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                        {log.user_email}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                        {ACTION_LABELS[log.action] || log.action}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[log.category] || 'bg-slate-100 text-slate-600'}`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">
                        {log.details || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-500">
                Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  data-testid="logs-prev-page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-600 px-2">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  data-testid="logs-next-page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogs;
