import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, FileText, Eye, EyeOff, ExternalLink, Copy, LayoutTemplate, Blocks, Building2, Megaphone, Briefcase, Users, Newspaper, ImageIcon, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export function AdminPages() {
  const [pages, setPages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', template: 'blank' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pagesRes, templatesRes] = await Promise.all([
        apiService.getPages(),
        apiService.getTemplates()
      ]);
      setPages(pagesRes.data);
      setTemplates(templatesRes.data);
    } catch (error) {
      toast.error('Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleCreatePage = async () => {
    if (!newPage.title || !newPage.slug) {
      toast.error('Please fill in title and slug');
      return;
    }

    setSaving(true);
    try {
      const template = templates.find(t => t.id === newPage.template);
      const pageData = {
        title: newPage.title,
        slug: newPage.slug,
        template: newPage.template,
        blocks: template?.blocks || [],
        is_published: false
      };
      
      const response = await apiService.createPage(pageData);
      toast.success('Page created successfully');
      setIsCreateDialogOpen(false);
      setNewPage({ title: '', slug: '', template: 'blank' });
      
      // Navigate to editor
      navigate(`/admin/pages/${response.data.id}/edit`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create page');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (page) => {
    try {
      await apiService.updatePage(page.id, { is_published: !page.is_published });
      toast.success(page.is_published ? 'Page unpublished' : 'Page published');
      fetchData();
    } catch (error) {
      toast.error('Failed to update page');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await apiService.deletePage(id);
      toast.success('Page deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const handleDuplicate = async (page) => {
    try {
      const newPageData = {
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy-${Date.now()}`,
        template: page.template,
        blocks: page.blocks,
        is_published: false
      };
      await apiService.createPage(newPageData);
      toast.success('Page duplicated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to duplicate page');
    }
  };

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-testid="admin-pages">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Page Management</h1>
          <p className="text-slate-500 mt-1">Create and manage website pages</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[#0C765B] hover:bg-[#095E49]"
          data-testid="create-page-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Page
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="pages-search"
        />
      </div>

      {/* Pages List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredPages.length > 0 ? (
        <div className="space-y-4">
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4"
              data-testid={`page-item-${index}`}
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900">{page.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    page.is_published 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {page.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-slate-500">/{page.slug}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Updated {format(new Date(page.updated_at), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePublish(page)}
                  title={page.is_published ? 'Unpublish' : 'Publish'}
                >
                  {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(page)}
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/pages/${page.id}/edit`)}
                  data-testid={`edit-page-${index}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/page/${page.slug}`, '_blank')}
                  title="Preview"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(page.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  data-testid={`delete-page-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>No pages found</p>
          <Button onClick={() => setIsCreateDialogOpen(true)} variant="link" className="text-[#0C765B]">
            Create your first page
          </Button>
        </div>
      )}

      {/* Create Page Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>Choose a template and enter page details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Page Title *</label>
              <Input
                value={newPage.title}
                onChange={(e) => {
                  setNewPage({ 
                    ...newPage, 
                    title: e.target.value,
                    slug: generateSlug(e.target.value)
                  });
                }}
                placeholder="My New Page"
                data-testid="page-title-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">URL Slug *</label>
              <div className="flex items-center">
                <span className="text-slate-400 text-sm mr-1">/page/</span>
                <Input
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: generateSlug(e.target.value) })}
                  placeholder="my-new-page"
                  data-testid="page-slug-input"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Template</label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setNewPage({ ...newPage, template: template.id })}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      newPage.template === template.id
                        ? 'border-[#0C765B] bg-[#0C765B]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <h4 className="font-medium text-slate-900 text-sm">{template.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePage}
              disabled={saving}
              className="bg-[#0C765B] hover:bg-[#095E49]"
              data-testid="create-page-submit"
            >
              {saving ? 'Creating...' : 'Create Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminPages;
