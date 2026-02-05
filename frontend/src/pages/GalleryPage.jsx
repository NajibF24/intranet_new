import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight, Folder, ArrowLeft } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/button';
import { apiService } from '../lib/api';

export const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [viewMode, setViewMode] = useState('albums'); // 'albums' or 'photos'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, albumsRes] = await Promise.all([
          apiService.getPhotos({ limit: 100 }),
          apiService.getAlbums({ limit: 50 }),
        ]);
        setPhotos(photosRes.data);
        setAlbums(albumsRes.data);
        // If no albums exist, show photos directly
        if (albumsRes.data.length === 0) {
          setViewMode('photos');
        }
      } catch (error) {
        console.error('Error fetching gallery data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedPhotos = selectedAlbum 
    ? photos.filter(p => p.album_id === selectedAlbum.id)
    : photos;

  const uncategorizedPhotos = photos.filter(p => !p.album_id);

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    const newIndex = selectedIndex === 0 ? displayedPhotos.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(displayedPhotos[newIndex]);
  };

  const goToNext = () => {
    const newIndex = selectedIndex === displayedPhotos.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(displayedPhotos[newIndex]);
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setViewMode('photos');
  };

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    setViewMode('albums');
  };

  const getHeight = (index) => {
    const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-80', 'h-72', 'h-64'];
    return heights[index % heights.length];
  };

  return (
    <div className="min-h-screen bg-white" data-testid="gallery-page">
      <Header />
      <PageContainer
        title="Photo Gallery"
        subtitle="Explore moments captured across our facilities, events, and team activities at PT Garuda Yamato Steel."
        breadcrumbs={[
          { label: 'Communication', path: '/' },
          { label: 'Photo Gallery' },
        ]}
        category="gallery"
      >
        {/* Album/Photos Navigation */}
        {albums.length > 0 && (
          <div className="flex items-center gap-4 mb-8">
            {selectedAlbum && (
              <Button variant="ghost" onClick={handleBackToAlbums} className="text-slate-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Albums
              </Button>
            )}
            {selectedAlbum && (
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-[#0C765B]" />
                <span className="font-semibold text-slate-900">{selectedAlbum.title}</span>
                <span className="text-slate-500 text-sm">({displayedPhotos.length} photos)</span>
              </div>
            )}
            {!selectedAlbum && viewMode === 'albums' && (
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'albums' ? 'default' : 'outline'}
                  onClick={() => setViewMode('albums')}
                  className={viewMode === 'albums' ? 'bg-[#0C765B] hover:bg-[#095E49]' : ''}
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Albums
                </Button>
                <Button
                  variant={viewMode === 'photos' ? 'default' : 'outline'}
                  onClick={() => setViewMode('photos')}
                  className={viewMode === 'photos' ? 'bg-[#0C765B] hover:bg-[#095E49]' : ''}
                >
                  All Photos
                </Button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : viewMode === 'albums' && !selectedAlbum ? (
          /* Albums Grid View */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album, index) => {
              const albumPhotos = photos.filter(p => p.album_id === album.id);
              return (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleAlbumClick(album)}
                  data-testid={`album-${index}`}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : albumPhotos.length > 0 ? (
                      <img
                        src={albumPhotos[0].image_url}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <Folder className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Folder className="w-4 h-4" />
                        <span className="text-sm">{albumPhotos.length} photos</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-slate-900 group-hover:text-[#0C765B] transition-colors">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{album.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
            {/* Uncategorized Album */}
            {uncategorizedPhotos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer"
                onClick={() => { setSelectedAlbum({ id: null, title: 'All Photos' }); setViewMode('photos'); }}
                data-testid="uncategorized-album"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={uncategorizedPhotos[0].image_url}
                    alt="Uncategorized"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-slate-900 group-hover:text-[#0C765B] transition-colors">
                    Other Photos
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{uncategorizedPhotos.length} photos</p>
                </div>
              </motion.div>
            )}
          </div>
        ) : displayedPhotos.length > 0 ? (
          /* Photos Grid View */
          <div className="masonry-grid">
            {displayedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group cursor-pointer ${getHeight(index)} rounded-xl overflow-hidden`}
                onClick={() => openLightbox(photo, index)}
                data-testid={`photo-${index}`}
              >
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-semibold text-lg">{photo.title}</p>
                  {photo.description && (
                    <p className="text-white/80 text-sm mt-1">{photo.description}</p>
                  )}
                  {photo.album_title && (
                    <span className="text-white/60 text-xs mt-2 bg-white/20 px-2 py-1 rounded w-fit flex items-center gap-1">
                      <Folder className="w-3 h-3" />
                      {photo.album_title}
                    </span>
                  )}
                </div>
                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-5 h-5 text-slate-900" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            {selectedAlbum ? 'No photos in this album yet.' : 'No photos available.'}
          </div>
        )}
      </PageContainer>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-50"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[80vh] px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-white font-semibold text-xl">{selectedPhoto.title}</p>
                {selectedPhoto.description && (
                  <p className="text-white/70 mt-2">{selectedPhoto.description}</p>
                )}
                <p className="text-white/50 text-sm mt-2">
                  {selectedIndex + 1} / {displayedPhotos.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
