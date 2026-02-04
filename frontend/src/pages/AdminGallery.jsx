import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

const emptyPhoto = {
  title: '',
  description: '',
  image_url: '',
  category: 'general',
};

export const AdminGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [formData, setFormData] = useState(emptyPhoto);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await apiService.getPhotos({ limit: 100 });
      setPhotos(response.data);
    } catch (error) {
      toast.error('Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (photo = null) => {
    if (photo) {
      setEditingPhoto(photo);
      setFormData({
        title: photo.title,
        description: photo.description || '',
        image_url: photo.image_url,
        category: photo.category,
      });
    } else {
      setEditingPhoto(null);
      setFormData(emptyPhoto);
    }
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      const response = await apiService.uploadPhoto(uploadFormData);
      setFormData({ ...formData, image_url: response.data.image_url });
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image_url) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingPhoto) {
        await apiService.updatePhoto(editingPhoto.id, formData);
        toast.success('Photo updated successfully');
      } else {
        await apiService.createPhoto(formData);
        toast.success('Photo added successfully');
      }
      await fetchPhotos();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save photo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await apiService.deletePhoto(id);
      toast.success('Photo deleted successfully');
      await fetchPhotos();
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  const filteredPhotos = photos.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div data-testid="admin-gallery">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gallery Management</h1>
          <p className="text-slate-500 mt-1">Upload and manage photo gallery</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#0C765B] hover:bg-[#095E49]"
          data-testid="add-photo-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search photos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="gallery-search"
        />
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden"
              data-testid={`photo-item-${index}`}
            >
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleOpenDialog(photo)}
                    className="h-8 w-8 p-0"
                    data-testid={`edit-photo-${index}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDelete(photo.id)}
                    className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white"
                    data-testid={`delete-photo-${index}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <p className="text-white font-medium text-sm truncate">{photo.title}</p>
                  <p className="text-white/70 text-xs">{photo.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>No photos found</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPhoto ? 'Edit Photo' : 'Add Photo'}</DialogTitle>
            <DialogDescription>Fill in the details for the photo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Photo title"
                data-testid="photo-title-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Photo description (optional)"
                data-testid="photo-description-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Image *</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                  data-testid="upload-photo-btn"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Or paste image URL"
                  data-testid="photo-url-input"
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger data-testid="photo-category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="facility">Facility</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
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
              data-testid="save-photo-btn"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
