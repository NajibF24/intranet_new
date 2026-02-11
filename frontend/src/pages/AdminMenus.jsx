import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, 
  ChevronRight, ExternalLink, Menu, FolderPlus, Save,
  Building2, FileText, Users, MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

const ICONS = [
  { value: 'building', label: 'Building', icon: Building2 },
  { value: 'file-text', label: 'Document', icon: FileText },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'message-square', label: 'Message', icon: MessageSquare },
];

export function AdminMenus() {
  const [menus, setMenus] = useState([]);
  const [flatMenus, setFlatMenus] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    path: '',
    page_id: '',
    icon: '',
    parent_id: '',
    is_visible: true,
    open_in_new_tab: false,
    order: 0
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menusRes, flatRes, pagesRes] = await Promise.all([
        apiService.getMenus(),
        apiService.getMenusFlat(),
        apiService.getPages({ published_only: true })
      ]);
      setMenus(menusRes.data);
      setFlatMenus(flatRes.data);
      setPages(pagesRes.data);
    } catch (error) {
      toast.error('Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null, parentId = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        path: item.path || '',
        page_id: item.page_id || '',
        icon: item.icon || '',
        parent_id: item.parent_id || '',
        is_visible: item.is_visible,
        open_in_new_tab: item.open_in_new_tab || false,
        order: item.order || 0
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: '',
        path: '',
        page_id: '',
        icon: '',
        parent_id: parentId || '',
        is_visible: true,
        open_in_new_tab: false,
        order: flatMenus.length
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label) {
      toast.error('Please enter a label');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        path: formData.page_id ? `/page/${pages.find(p => p.id === formData.page_id)?.slug}` : formData.path,
        parent_id: formData.parent_id || null
      };

      if (editingItem) {
        await apiService.updateMenuItem(editingItem.id, dataToSave);
        toast.success('Menu item updated');
      } else {
        await apiService.createMenuItem(dataToSave);
        toast.success('Menu item created');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item and its children?')) return;
    try {
      await apiService.deleteMenuItem(id);
      toast.success('Menu item deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await apiService.updateMenuItem(item.id, { is_visible: !item.is_visible });
      toast.success(item.is_visible ? 'Menu item hidden' : 'Menu item visible');
      fetchData();
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleMoveUp = async (item, items) => {
    const currentIndex = items.findIndex(i => i.id === item.id);
    if (currentIndex <= 0) return;
    
    const newOrder = items.map((i, idx) => ({
      id: i.id,
      order: idx === currentIndex ? currentIndex - 1 : idx === currentIndex - 1 ? currentIndex : idx,
      parent_id: i.parent_id
    }));
    
    try {
      await apiService.reorderMenus(newOrder);
      fetchData();
    } catch (error) {
      toast.error('Failed to reorder');
    }
  };

  const handleMoveDown = async (item, items) => {
    const currentIndex = items.findIndex(i => i.id === item.id);
    if (currentIndex >= items.length - 1) return;
    
    const newOrder = items.map((i, idx) => ({
      id: i.id,
      order: idx === currentIndex ? currentIndex + 1 : idx === currentIndex + 1 ? currentIndex : idx,
      parent_id: i.parent_id
    }));
    
    try {
      await apiService.reorderMenus(newOrder);
      fetchData();
    } catch (error) {
      toast.error('Failed to reorder');
    }
  };

  const renderMenuItem = (item, index, parentItems) => {
    const IconComponent = ICONS.find(i => i.value === item.icon)?.icon || Menu;
    
    return (
      <div key={item.id}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 mb-2 ${
            !item.is_visible ? 'opacity-50' : ''
          }`}
        >
          <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
          <div className="w-8 h-8 bg-[#0C765B]/10 rounded-lg flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-[#0C765B]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900">{item.label}</span>
              {!item.is_visible && (
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Hidden</span>
              )}
              {item.open_in_new_tab && (
                <ExternalLink className="w-3 h-3 text-slate-400" />
              )}
            </div>
            <span className="text-sm text-slate-500">{item.path || '(No link)'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleMoveUp(item, parentItems)} title="Move up">
              ↑
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleMoveDown(item, parentItems)} title="Move down">
              ↓
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleToggleVisibility(item)}>
              {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
        
        {/* Children */}
        {item.children && item.children.length > 0 && (
          <div className="ml-8 pl-4 border-l-2 border-slate-200">
            {item.children.map((child, childIndex) => renderMenuItem(child, childIndex, item.children))}
          </div>
        )}
        
        {/* Add submenu button */}
        <div className="ml-8 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDialog(null, item.id)}
            className="text-slate-500 hover:text-[#0C765B]"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add submenu
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div data-testid="admin-menus">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Menu Management</h1>
          <p className="text-slate-500 mt-1">Manage navigation menus and submenus</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#0C765B] hover:bg-[#095E49]"
          data-testid="add-menu-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Menu Tree */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : menus.length > 0 ? (
        <div className="space-y-2">
          {menus.map((item, index) => renderMenuItem(item, index, menus))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <Menu className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>No menu items found</p>
          <Button onClick={() => handleOpenDialog()} variant="link" className="text-[#0C765B]">
            Create your first menu item
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>Configure the menu item properties</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Label *</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Menu Label"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Link To</label>
              <Select
                value={formData.page_id || 'custom'}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setFormData({ ...formData, page_id: '' });
                  } else {
                    setFormData({ ...formData, page_id: value, path: '' });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a page or enter custom URL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom URL</SelectItem>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!formData.page_id && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Custom URL</label>
                <Input
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="/custom-path or https://..."
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Icon</label>
              <Select
                value={formData.icon || 'none'}
                onValueChange={(value) => setFormData({ ...formData, icon: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Icon</SelectItem>
                  {ICONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Parent Menu</label>
              <Select
                value={formData.parent_id || 'root'}
                onValueChange={(value) => setFormData({ ...formData, parent_id: value === 'root' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Top Level (No Parent)</SelectItem>
                  {flatMenus
                    .filter(m => m.id !== editingItem?.id)
                    .map((menu) => {
                      const isL1 = !menu.parent_id;
                      const parentLabel = !isL1 ? flatMenus.find(p => p.id === menu.parent_id)?.label : null;
                      const depth = isL1 ? 0 : parentLabel ? 1 : 0;
                      // Only allow L1 and L2 as parents (max 3 levels deep)
                      if (depth > 1) return null;
                      return (
                        <SelectItem key={menu.id} value={menu.id}>
                          {isL1 ? menu.label : `  └ ${menu.label}`}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Visible</span>
              <Switch
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Open in New Tab</span>
              <Switch
                checked={formData.open_in_new_tab}
                onCheckedChange={(checked) => setFormData({ ...formData, open_in_new_tab: checked })}
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
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminMenus;
