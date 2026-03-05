import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, User, Shield, Eye, Edit3, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

var CMS_SECTIONS = [
  { key: 'news', label: 'News' },
  { key: 'events', label: 'Events' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'employees', label: 'Employees' },
  { key: 'pages', label: 'Page Management' },
  { key: 'menus', label: 'Menu Management' },
  { key: 'hero', label: 'Hero Settings' },
  { key: 'ticker', label: 'Ticker Banner' },
];

function RoleBadge({ role }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
        <Shield className="w-3 h-3" /> Admin
      </span>
    );
  }
  if (role === 'editor') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
        <Edit3 className="w-3 h-3" /> Editor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
      <Eye className="w-3 h-3" /> Viewer
    </span>
  );
}

function PermCheckbox({ sectionKey, label, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={'flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm text-left transition-all ' +
        (checked ? 'border-[#0C765B] bg-[#0C765B]/5 text-[#0C765B]' : 'border-slate-200 text-slate-500 hover:border-slate-300')}
      data-testid={'perm-' + sectionKey}
    >
      <div className={'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ' +
        (checked ? 'bg-[#0C765B] border-[#0C765B]' : 'border-slate-300')}>
        {checked ? <Check className="w-2.5 h-2.5 text-white" /> : null}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function UserCard({ user, index, onEdit, onDelete }) {
  var perms = user.permissions || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
      data-testid={'user-item-' + index}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#0C765B]/10 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-[#0C765B]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{user.name}</h3>
            <RoleBadge role={user.role} />
          </div>
          <p className="text-sm text-slate-500">{user.email}</p>
          {user.role !== 'admin' && perms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {perms.map(function(p) {
                return <span key={p} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{p}</span>;
              })}
            </div>
          )}
          {user.role !== 'admin' && perms.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">No sections assigned</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={function() { onEdit(user); }} data-testid={'edit-user-' + index}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={function() { onDelete(user.id); }} className="text-red-500 hover:text-red-600 hover:bg-red-50" data-testid={'delete-user-' + index}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function AdminUsers() {
  var [users, setUsers] = useState([]);
  var [loading, setLoading] = useState(true);
  var [searchQuery, setSearchQuery] = useState('');
  var [isDialogOpen, setIsDialogOpen] = useState(false);
  var [editingUser, setEditingUser] = useState(null);
  var [saving, setSaving] = useState(false);
  var [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'editor', permissions: [],
  });

  useEffect(function() { fetchUsers(); }, []);

  var fetchUsers = async function() {
    try {
      var response = await apiService.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  var handleOpenDialog = function(user) {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name, email: user.email, password: '',
        role: user.role, permissions: user.permissions || [],
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'editor', permissions: [] });
    }
    setIsDialogOpen(true);
  };

  var handleSave = async function() {
    if (!formData.name || !formData.email) { toast.error('Please fill all required fields'); return; }
    if (!editingUser && !formData.password) { toast.error('Password is required for new users'); return; }
    setSaving(true);
    try {
      var dataToSend = { ...formData };
      if (dataToSend.role === 'admin') dataToSend.permissions = [];
      if (!dataToSend.password) delete dataToSend.password;
      if (editingUser) {
        await apiService.updateUser(editingUser.id, dataToSend);
        toast.success('User updated successfully');
      } else {
        await apiService.createUser(dataToSend);
        toast.success('User created successfully');
      }
      await fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  var handleDelete = async function(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiService.deleteUser(id);
      toast.success('User deleted successfully');
      await fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  var togglePermission = function(key) {
    setFormData(function(prev) {
      var has = prev.permissions.includes(key);
      return {
        ...prev,
        permissions: has ? prev.permissions.filter(function(p) { return p !== key; }) : [...prev.permissions, key],
      };
    });
  };

  var toggleAll = function() {
    var allKeys = CMS_SECTIONS.map(function(s) { return s.key; });
    var hasAll = allKeys.every(function(k) { return formData.permissions.includes(k); });
    setFormData(function(prev) { return { ...prev, permissions: hasAll ? [] : allKeys }; });
  };

  var filteredUsers = users.filter(function(u) {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  var allSelected = CMS_SECTIONS.every(function(s) { return formData.permissions.includes(s.key); });

  return (
    <div data-testid="admin-users">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Manage users, roles and granular permissions</p>
        </div>
        <Button onClick={function() { handleOpenDialog(null); }} className="bg-[#0C765B] hover:bg-[#095E49]" data-testid="add-user-btn">
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input placeholder="Search users..." value={searchQuery} onChange={function(e) { setSearchQuery(e.target.value); }} className="pl-10" data-testid="users-search" />
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map(function(user, index) {
            return <UserCard key={user.id} user={user} index={index} onEdit={handleOpenDialog} onDelete={handleDelete} />;
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <User className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>No users found</p>
        </div>
      )}

      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={function() { setIsDialogOpen(false); }} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-xl" data-testid="user-dialog">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingUser ? 'Edit User' : 'Add User'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">Set role and configure section access</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Name *</label>
                <Input value={formData.name} onChange={function(e) { setFormData({ ...formData, name: e.target.value }); }} placeholder="Full name" data-testid="user-name-input" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email *</label>
                <Input type="email" value={formData.email} onChange={function(e) { setFormData({ ...formData, email: e.target.value }); }} placeholder="email@gys.co.id" data-testid="user-email-input" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  {editingUser ? 'Password (leave blank to keep current)' : 'Password *'}
                </label>
                <Input type="password" value={formData.password} onChange={function(e) { setFormData({ ...formData, password: e.target.value }); }} placeholder="********" data-testid="user-password-input" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Role</label>
                <select
                  value={formData.role}
                  onChange={function(e) {
                    var newRole = e.target.value;
                    setFormData({ ...formData, role: newRole, permissions: newRole === 'admin' ? [] : formData.permissions });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C765B]/20 focus:border-[#0C765B]"
                  data-testid="user-role-select"
                >
                  <option value="admin">Admin — Full access to all features</option>
                  <option value="editor">Editor — Can view and edit assigned sections</option>
                  <option value="viewer">Viewer — Read-only access to assigned sections</option>
                </select>
              </div>

              {formData.role !== 'admin' ? (
                <div data-testid="permissions-grid">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">
                      Section Access
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        ({formData.role === 'editor' ? 'can view & edit' : 'view only'})
                      </span>
                    </label>
                    <button type="button" onClick={toggleAll} className="text-xs text-[#0C765B] hover:underline font-medium" data-testid="toggle-all-permissions">
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {CMS_SECTIONS.map(function(section) {
                      var checked = formData.permissions.includes(section.key);
                      return (
                        <PermCheckbox
                          key={section.key}
                          sectionKey={section.key}
                          label={section.label}
                          checked={checked}
                          onToggle={function() { togglePermission(section.key); }}
                        />
                      );
                    })}
                  </div>
                  {formData.permissions.length === 0 ? (
                    <p className="text-xs text-amber-600 mt-2">Select at least one section for the user to access</p>
                  ) : null}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Admin has full access to all sections
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={function() { setIsDialogOpen(false); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-[#0C765B] hover:bg-[#095E49]" data-testid="save-user-btn">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminUsers;
