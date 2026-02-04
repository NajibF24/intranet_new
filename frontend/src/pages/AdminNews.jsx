import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Star, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
      setFormData({
        title: newsItem.title,
        summary: newsItem.summary,
        content: newsItem.content,
        image_url: newsItem.image_url || '',
        category: newsItem.category,
        is_featured: newsItem.is_featured,
      });
    } else {
      setEditingNews(null);
      setFormData(emptyNews);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.summary || !formData.content) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingNews) {
        await apiService.updateNews(editingNews.id, formData);
        toast.success('News updated successfully');
      } else {
        await apiService.createNews(formData);
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? 'Edit News' : 'Add News'}</DialogTitle>
            <DialogDescription>Fill in the details for the news article.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full article content"
                className="w-full h-32 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C765B]/20 focus:border-[#0C765B]"
                data-testid="news-content-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Image URL</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                data-testid="news-image-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
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
                  </SelectContent>
                </Select>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNews;
