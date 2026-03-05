import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Star, X, Upload, Maximize2, Minimize2, Eye, FileEdit, Calendar, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

var RichTextEditor = lazy(function() { return import('../components/RichTextEditor'); });

const PRESET_CATEGORIES = ['general', 'production', 'safety', 'hr', 'business', 'sustainability'];

const emptyNews = {
  title: '',
  summary: '',
  content: '',
  image_url: '',
  category: 'general',
  is_featured: false,
};

export const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(emptyNews);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await apiService.getNews({ limit: 100 });
      setNews(response.data);
    } catch (error) {
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (newsItem = null) => {
    if (newsItem) {
      setEditingNews(newsItem);
      const isCustom = !PRESET_CATEGORIES.includes(newsItem.category);
      setUseCustomCategory(isCustom);
      setCustomCategory(isCustom ? newsItem.category : '');
      setFormData({
        title: newsItem.title,
        summary: newsItem.summary,
        content: newsItem.content,
        image_url: newsItem.image_url || '',
        category: isCustom ? 'other' : newsItem.category,
        is_featured: newsItem.is_featured,
      });
    } else {
      setEditingNews(null);
      setFormData(emptyNews);
      setUseCustomCategory(false);
      setCustomCategory('');
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const response = await apiService.uploadPhoto(fd);
      setFormData({ ...formData, image_url: response.data.image_url });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.summary || !formData.content) {
      toast.error('Please fill all required fields');
      return;
    }

    const dataToSave = {
      ...formData,
      category: useCustomCategory ? customCategory : formData.category,
    };

    setSaving(true);
    try {
      if (editingNews) {
        await apiService.updateNews(editingNews.id, dataToSave);
        toast.success('News updated successfully');
      } else {
        await apiService.createNews(dataToSave);
        toast.success('News created successfully');
      }
      await fetchNews();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save news');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;
    try {
      await apiService.deleteNews(id);
      toast.success('News deleted successfully');
      await fetchNews();
    } catch (error) {
      toast.error('Failed to delete news');
    }
  };

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-testid="admin-news">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">News Management</h1>
          <p className="text-slate-500 mt-1">Create and manage news articles</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#0C765B] hover:bg-[#095E49]"
          data-testid="add-news-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add News
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="news-search"
        />
      </div>

      {/* News List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-4">
          {filteredNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
              data-testid={`news-item-${index}`}
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                  {item.is_featured && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-1">{item.summary}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">{item.category}</span>
                  <span className="text-xs text-slate-400">
                    {format(new Date(item.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(item)}
                  data-testid={`edit-news-${index}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  data-testid={`delete-news-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No news articles found
        </div>
      )}

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className={'fixed inset-0 z-50 flex items-center justify-center ' + (isFullscreen ? '' : 'p-4')}>
          <div className="absolute inset-0 bg-black/50" onClick={() => { setIsDialogOpen(false); setIsFullscreen(false); setShowPreview(false); }} />
          <div
            className={'relative bg-white shadow-xl transition-all duration-300 ' +
              (isFullscreen ? 'w-full h-screen' : 'max-w-2xl w-full max-h-[90vh] rounded-xl')}
            data-testid="news-dialog"
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingNews ? 'Edit News' : 'Add News'}</h2>
                <p className="text-sm text-slate-500">Fill in the details for the news article</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={'px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ' +
                    (showPreview ? 'bg-[#0C765B] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                  data-testid="news-preview-toggle"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  data-testid="news-fullscreen-toggle"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setIsDialogOpen(false); setIsFullscreen(false); setShowPreview(false); }}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="overflow-hidden flex" style={{ height: 'calc(100% - 130px)' }}>
              {/* Editor Panel */}
              <div className={'overflow-y-auto p-6 ' + (showPreview ? 'w-1/2 border-r border-slate-200' : 'w-full')}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="News title"
                      data-testid="news-title-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Summary *</label>
                    <Input
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Brief summary"
                      data-testid="news-summary-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Content *</label>
                    <Suspense fallback={<div className="h-48 bg-slate-100 rounded-lg animate-pulse" />}>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        placeholder="Write the full article content..."
                        dataTestId="news-content-input"
                      />
                    </Suspense>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Image</label>
                    <div className="space-y-3">
                      <label className="cursor-pointer block">
                        <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-200 rounded-lg hover:border-[#0C765B]/50 transition-colors">
                          <Upload className="w-5 h-5 mr-2 text-slate-400" />
                          <span className="text-sm text-slate-500">
                            {uploading ? 'Uploading...' : 'Click to upload image'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                          data-testid="news-image-upload"
                        />
                      </label>
                      <p className="text-xs text-slate-500">Recommended: 800x450px (16:9 ratio), max 5MB</p>
                      {formData.image_url && (
                        <div className="mt-2 relative">
                          <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
                      <Select
                        value={useCustomCategory ? 'other' : formData.category}
                        onValueChange={(value) => {
                          if (value === 'other') {
                            setUseCustomCategory(true);
                          } else {
                            setUseCustomCategory(false);
                            setFormData({ ...formData, category: value });
                          }
                        }}
                      >
                        <SelectTrigger data-testid="news-category-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="sustainability">Sustainability</SelectItem>
                          <SelectItem value="other">Other (Custom)</SelectItem>
                        </SelectContent>
                      </Select>
                      {useCustomCategory && (
                        <Input
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter custom category"
                          className="mt-2"
                          data-testid="news-custom-category"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Featured</label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                          data-testid="news-featured-switch"
                        />
                        <span className="text-sm text-slate-600">
                          {formData.is_featured ? 'Featured' : 'Not featured'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Panel */}
              {showPreview && (
                <div className="w-1/2 overflow-y-auto bg-white" data-testid="news-live-preview">
                  <div className="sticky top-0 bg-slate-50 px-4 py-2 border-b border-slate-200 z-10">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Live Preview
                    </span>
                  </div>
                  {/* Preview: simulates the published news detail page */}
                  <div className="preview-content">
                    {/* Hero */}
                    <div className="relative h-56 bg-slate-800 overflow-hidden">
                      {formData.image_url ? (
                        <img src={formData.image_url} alt="" className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-3 text-white/80 text-xs mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(), 'MMMM d, yyyy')}
                          </span>
                          <span className="bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {useCustomCategory ? customCategory : formData.category}
                          </span>
                          {formData.is_featured && (
                            <span className="bg-amber-500 px-2 py-0.5 rounded-full text-white text-xs font-semibold">Featured</span>
                          )}
                        </div>
                        <h1 className="text-xl font-bold text-white leading-tight">
                          {formData.title || 'Untitled Article'}
                        </h1>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-5">
                      {formData.summary && (
                        <p className="text-base text-slate-600 leading-relaxed mb-4 font-medium">
                          {formData.summary}
                        </p>
                      )}
                      <div
                        className="prose prose-sm prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-slate-400">Start writing content to see the preview...</p>' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
              <Button variant="outline" onClick={() => { setIsDialogOpen(false); setIsFullscreen(false); setShowPreview(false); }}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#0C765B] hover:bg-[#095E49]"
                data-testid="save-news-btn"
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

export default AdminNews;
