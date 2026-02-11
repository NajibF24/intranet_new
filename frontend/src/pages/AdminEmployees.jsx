import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, User, Upload, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

const emptyEmployee = {
  name: '',
  email: '',
  department: 'Production',
  position: '',
  phone: '',
  avatar_url: '',
};

const departments = [
  'Production',
  'Human Resources',
  'Finance',
  'IT',
  'Quality Control',
  'Safety',
  'Marketing',
  'Logistics',
  'Engineering',
  'Administration',
  'Other',
];

export const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState(emptyEmployee);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [useCustomDept, setUseCustomDept] = useState(false);
  const [customDept, setCustomDept] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await apiService.getEmployees({ limit: 100 });
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      const isCustomDept = !departments.slice(0, -1).includes(employee.department);
      setUseCustomDept(isCustomDept);
      setCustomDept(isCustomDept ? employee.department : '');
      setFormData({
        name: employee.name,
        email: employee.email,
        department: isCustomDept ? 'Other' : employee.department,
        position: employee.position,
        phone: employee.phone || '',
        avatar_url: employee.avatar_url || '',
      });
    } else {
      setEditingEmployee(null);
      setFormData(emptyEmployee);
      setUseCustomDept(false);
      setCustomDept('');
    }
    setIsDialogOpen(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const response = await apiService.uploadPhoto(fd);
      setFormData({ ...formData, avatar_url: response.data.image_url });
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.position) {
      toast.error('Please fill all required fields');
      return;
    }

    const dataToSave = {
      ...formData,
      department: useCustomDept ? customDept : formData.department,
    };

    setSaving(true);
    try {
      if (editingEmployee) {
        await apiService.updateEmployee(editingEmployee.id, dataToSave);
        toast.success('Employee updated successfully');
      } else {
        await apiService.createEmployee(dataToSave);
        toast.success('Employee added successfully');
      }
      await fetchEmployees();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await apiService.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      await fetchEmployees();
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-testid="admin-employees">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-slate-500 mt-1">Manage employee information</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#0C765B] hover:bg-[#095E49]"
          data-testid="add-employee-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="employees-search"
        />
      </div>

      {/* Employees List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="space-y-4">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
              data-testid={`employee-item-${index}`}
            >
              {employee.avatar_url ? (
                <img
                  src={employee.avatar_url}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0C765B]/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-[#0C765B]/50" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                <p className="text-sm text-[#0C765B]">{employee.position}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">{employee.department}</span>
                  <span className="text-xs text-slate-400">{employee.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(employee)}
                  data-testid={`edit-employee-${index}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(employee.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  data-testid={`delete-employee-${index}`}
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
          <p>No employees found</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <DialogDescription>Fill in the employee details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Avatar Upload */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Profile Photo</label>
              <div className="flex items-center gap-4">
                {formData.avatar_url ? (
                  <div className="relative">
                    <img
                      src={formData.avatar_url}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar_url: '' })}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-slate-200 rounded-lg hover:border-[#0C765B]/50 transition-colors">
                      <Upload className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    Recommended: 400x400px, max 2MB
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Employee name"
                data-testid="employee-name-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="employee@gys.co.id"
                data-testid="employee-email-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Position *</label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Job position"
                data-testid="employee-position-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Department</label>
              <Select
                value={useCustomDept ? 'Other' : formData.department}
                onValueChange={(value) => {
                  if (value === 'Other') {
                    setUseCustomDept(true);
                  } else {
                    setUseCustomDept(false);
                    setFormData({ ...formData, department: value });
                  }
                }}
              >
                <SelectTrigger data-testid="employee-department-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {useCustomDept && (
                <Input
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  placeholder="Enter custom department"
                  className="mt-2"
                  data-testid="employee-custom-dept"
                />
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+62 812-3456-7890"
                data-testid="employee-phone-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0C765B] hover:bg-[#095E49]"
              data-testid="save-employee-btn"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmployees;
