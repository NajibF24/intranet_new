import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

const roles = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'editor', label: 'Editor', description: 'Can create and edit content' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
];

const permissionsList = [
  { id: 'news', label: 'News Management' },
  { id: 'events', label: 'Events Management' },
  { id: 'gallery', label: 'Gallery Management' },
  { id: 'employees', label: 'Employee Directory' },
  { id: 'hero', label: 'Hero Settings' },
];

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'editor',
  permissions: [],
};

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyUser);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        permissions: user.permissions || [],
      });
    } else {
      setEditingUser(null);
      setFormData(emptyUser);
    }
    setIsDialogOpen(true);
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!editingUser && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }

    setSaving(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiService.deleteUser(id);
      toast.success('User deleted successfully');
      await fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'editor': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div data-testid="admin-users">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Manage admin users and their permissions</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#0C765B] hover:bg-[#095E49]"
          data-testid="add-user-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="users-search"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4 border border-slate-100"
              data-testid={`user-item-${index}`}
            >
              <div className="w-12 h-12 rounded-full bg-[#0C765B]/10 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-[#0C765B]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900">{user.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{user.email}</p>
                {user.permissions && user.permissions.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {user.permissions.map(p => (
                      <span key={p} className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(user)}
                  data-testid={`edit-user-${index}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  data-testid={`delete-user-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <User className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>No users found</p>
        </div>
      )}

      {/* Add/Edit Dialog - Using native modal instead */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDialogOpen(false)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingUser ? 'Edit User' : 'Add User'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">Manage user access and permissions</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  data-testid="user-name-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@gys.co.id"
                  data-testid="user-email-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  data-testid="user-password-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C765B]/20 focus:border-[#0C765B]"
                  data-testid="user-role-select"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
              {formData.role !== 'admin' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">Permissions</label>
                  <div className="space-y-3">
                    {permissionsList.map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{perm.label}</span>
                        <button
                          type="button"
                          onClick={() => handlePermissionToggle(perm.id)}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            formData.permissions.includes(perm.id)
                              ? 'bg-[#0C765B]'
                              : 'bg-slate-200'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform shadow ${
                              formData.permissions.includes(perm.id)
                                ? 'translate-x-5'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#0C765B] hover:bg-[#095E49]"
                data-testid="save-user-btn"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
