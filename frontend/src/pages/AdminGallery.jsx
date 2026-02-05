import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon, FolderPlus, Folder, ChevronLeft, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

const emptyPhoto = {
  title: '',
  description: '',
  image_url: '',
  album_id: '',
};

const emptyAlbum = {
  title: '',
  description: '',
  cover_image_url: '',
};

export const AdminGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeTab, setActiveTab] = useState('photos');
  
  // Photo Dialog
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [photoFormData, setPhotoFormData] = useState(emptyPhoto);
  
  // Album Dialog
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [albumFormData, setAlbumFormData] = useState(emptyAlbum);
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const albumCoverInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [photosRes, albumsRes] = await Promise.all([
        apiService.getPhotos({ limit: 100 }),
        apiService.getAlbums({ limit: 100 }),
      ]);
      setPhotos(photosRes.data);
      setAlbums(albumsRes.data);
    } catch (error) {
      toast.error('Failed to fetch gallery data');
    } finally {
      setLoading(false);
    }
  };

  // Photo Handlers
  const handleOpenPhotoDialog = (photo = null) => {
    if (photo) {
      setEditingPhoto(photo);
      setPhotoFormData({
        title: photo.title,
        description: photo.description || '',
        image_url: photo.image_url,
        album_id: photo.album_id || '',
      });
    } else {
      setEditingPhoto(null);
      setPhotoFormData({
        ...emptyPhoto,
        album_id: selectedAlbum?.id || '',
      });
    }
    setIsPhotoDialogOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      const response = await apiService.uploadPhoto(uploadFormData);
      setPhotoFormData({ ...photoFormData, image_url: response.data.image_url });
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSavePhoto = async () => {
    if (!photoFormData.title || !photoFormData.image_url) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...photoFormData,
        album_id: photoFormData.album_id || null,
      };

      if (editingPhoto) {
        await apiService.updatePhoto(editingPhoto.id, dataToSave);
        toast.success('Photo updated successfully');
      } else {
        await apiService.createPhoto(dataToSave);
        toast.success('Photo added successfully');
      }
      await fetchData();
      setIsPhotoDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save photo');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await apiService.deletePhoto(id);
      toast.success('Photo deleted successfully');
      await fetchData();
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  // Album Handlers
  const handleOpenAlbumDialog = (album = null) => {
    if (album) {
      setEditingAlbum(album);
      setAlbumFormData({
        title: album.title,
        description: album.description || '',
        cover_image_url: album.cover_image_url || '',
      });
    } else {
      setEditingAlbum(null);
      setAlbumFormData(emptyAlbum);
    }
    setIsAlbumDialogOpen(true);
  };

  const handleAlbumCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      const response = await apiService.uploadPhoto(uploadFormData);
      setAlbumFormData({ ...albumFormData, cover_image_url: response.data.image_url });
      toast.success('Cover uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload cover');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAlbum = async () => {
    if (!albumFormData.title) {
      toast.error('Please enter album title');
      return;
    }

    setSaving(true);
    try {
      if (editingAlbum) {
        await apiService.updateAlbum(editingAlbum.id, albumFormData);
        toast.success('Album updated successfully');
      } else {
        await apiService.createAlbum(albumFormData);
        toast.success('Album created successfully');
      }
      await fetchData();
      setIsAlbumDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save album');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm('Are you sure you want to delete this album? Photos in this album will be moved to "Uncategorized".')) return;
    try {
      await apiService.deleteAlbum(id);
      toast.success('Album deleted successfully');
      if (selectedAlbum?.id === id) setSelectedAlbum(null);
      await fetchData();
    } catch (error) {
      toast.error('Failed to delete album');
    }
  };

  // Filtering
  const filteredPhotos = photos.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAlbum = selectedAlbum ? p.album_id === selectedAlbum.id : true;
    return matchesSearch && matchesAlbum;
  });

  const filteredAlbums = albums.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uncategorizedPhotos = photos.filter(p => !p.album_id);

  return (
    <div data-testid="admin-gallery">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gallery Management</h1>
          <p className="text-slate-500 mt-1">Manage photo albums and images</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleOpenAlbumDialog()}
            variant="outline"
            data-testid="add-album-btn"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Album
          </Button>
          <Button
            onClick={() => handleOpenPhotoDialog()}
            className="bg-[#0C765B] hover:bg-[#095E49]"
            data-testid="add-photo-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="photos" data-testid="tab-photos">All Photos ({photos.length})</TabsTrigger>
          <TabsTrigger value="albums" data-testid="tab-albums">Albums ({albums.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder={activeTab === 'photos' ? "Search photos..." : "Search albums..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="gallery-search"
        />
      </div>

      {/* Selected Album Header */}
      {selectedAlbum && activeTab === 'photos' && (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedAlbum(null)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <Folder className="w-5 h-5 text-[#0C765B]" />
            <span className="font-medium text-slate-900">{selectedAlbum.title}</span>
            <span className="text-slate-500 text-sm">({filteredPhotos.length} photos)</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleOpenAlbumDialog(selectedAlbum)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteAlbum(selectedAlbum.id)}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'albums' ? (
        /* Albums Grid */
        filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => { setSelectedAlbum(album); setActiveTab('photos'); }}
                data-testid={`album-item-${index}`}
              >
                {album.cover_image_url ? (
                  <img
                    src={album.cover_image_url}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <Folder className="w-16 h-16 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-white">{album.title}</h3>
                  <p className="text-white/70 text-sm">{album.photo_count} photos</p>
                </div>
                {/* Overlay Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); handleOpenAlbumDialog(album); }}
                    className="h-8 w-8 p-0"
                    data-testid={`edit-album-${index}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.id); }}
                    className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white"
                    data-testid={`delete-album-${index}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            {/* Uncategorized Card */}
            {uncategorizedPhotos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative aspect-[4/3] bg-slate-200 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => { setSelectedAlbum({ id: null, title: 'Uncategorized' }); setActiveTab('photos'); }}
                data-testid="uncategorized-album"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-slate-400" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-white">Uncategorized</h3>
                  <p className="text-white/70 text-sm">{uncategorizedPhotos.length} photos</p>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No albums found</p>
            <Button onClick={() => handleOpenAlbumDialog()} variant="link" className="text-[#0C765B]">
              Create your first album
            </Button>
          </div>
        )
      ) : (
        /* Photos Grid */
        filteredPhotos.length > 0 ? (
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
                      onClick={() => handleOpenPhotoDialog(photo)}
                      className="h-8 w-8 p-0"
                      data-testid={`edit-photo-${index}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white"
                      data-testid={`delete-photo-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm truncate">{photo.title}</p>
                    {photo.album_title && (
                      <p className="text-white/70 text-xs flex items-center mt-1">
                        <Folder className="w-3 h-3 mr-1" />
                        {photo.album_title}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>{selectedAlbum ? 'No photos in this album' : 'No photos found'}</p>
            <Button onClick={() => handleOpenPhotoDialog()} variant="link" className="text-[#0C765B]">
              Add your first photo
            </Button>
          </div>
        )
      )}

      {/* Photo Dialog */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPhoto ? 'Edit Photo' : 'Add Photo'}</DialogTitle>
            <DialogDescription>Fill in the details for the photo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Title *</label>
              <Input
                value={photoFormData.title}
                onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })}
                placeholder="Photo title"
                data-testid="photo-title-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
              <Input
                value={photoFormData.description}
                onChange={(e) => setPhotoFormData({ ...photoFormData, description: e.target.value })}
                placeholder="Photo description (optional)"
                data-testid="photo-description-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Album</label>
              <Select
                value={photoFormData.album_id || 'none'}
                onValueChange={(value) => setPhotoFormData({ ...photoFormData, album_id: value === 'none' ? '' : value })}
              >
                <SelectTrigger data-testid="photo-album-select">
                  <SelectValue placeholder="Select album" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Album (Uncategorized)</SelectItem>
                  {albums.map((album) => (
                    <SelectItem key={album.id} value={album.id}>
                      {album.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Image *</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
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
                <p className="text-xs text-slate-500 text-center">Recommended: 800x800px, max 5MB</p>
                <Input
                  value={photoFormData.image_url}
                  onChange={(e) => setPhotoFormData({ ...photoFormData, image_url: e.target.value })}
                  placeholder="Or paste image URL"
                  data-testid="photo-url-input"
                />
                {photoFormData.image_url && (
                  <div className="relative">
                    <img
                      src={photoFormData.image_url}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg mt-2"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoFormData({ ...photoFormData, image_url: '' })}
                      className="absolute top-4 right-2 p-1 bg-white/90 rounded-full hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPhotoDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSavePhoto}
              disabled={saving}
              className="bg-[#0C765B] hover:bg-[#095E49]"
              data-testid="save-photo-btn"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Album Dialog */}
      <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAlbum ? 'Edit Album' : 'Create Album'}</DialogTitle>
            <DialogDescription>Fill in the details for the album.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Album Title *</label>
              <Input
                value={albumFormData.title}
                onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                placeholder="Album title"
                data-testid="album-title-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
              <Input
                value={albumFormData.description}
                onChange={(e) => setAlbumFormData({ ...albumFormData, description: e.target.value })}
                placeholder="Album description (optional)"
                data-testid="album-description-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Cover Image</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={albumCoverInputRef}
                  onChange={handleAlbumCoverUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => albumCoverInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                  data-testid="upload-album-cover-btn"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Cover'}
                </Button>
                <p className="text-xs text-slate-500 text-center">Recommended: 800x600px (4:3 ratio), max 5MB</p>
                <Input
                  value={albumFormData.cover_image_url}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, cover_image_url: e.target.value })}
                  placeholder="Or paste image URL"
                  data-testid="album-cover-url-input"
                />
                {albumFormData.cover_image_url && (
                  <div className="relative">
                    <img
                      src={albumFormData.cover_image_url}
                      alt="Cover Preview"
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                    <button
                      type="button"
                      onClick={() => setAlbumFormData({ ...albumFormData, cover_image_url: '' })}
                      className="absolute top-4 right-2 p-1 bg-white/90 rounded-full hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlbumDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAlbum}
              disabled={saving}
              className="bg-[#0C765B] hover:bg-[#095E49]"
              data-testid="save-album-btn"
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
