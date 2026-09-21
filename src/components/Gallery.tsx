import React, { useState, useEffect, useCallback } from 'react';
import {
  Camera,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Trash2,
  Sliders,
  Settings,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import { Language, GalleryItem } from '../types';
import { useBrandContent } from '../context/BrandContext';
import { useAdmin } from '../admin/AdminContext';
import { GalleryModal } from '../admin/GalleryModal';
import { DeleteConfirmModal } from '../admin/DeleteConfirmModal';

interface GalleryProps {
  currentLang: Language;
  onOpenAdminTab?: (tab: string) => void;
  onOpenLoginModal?: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  currentLang,
  onOpenAdminTab,
  onOpenLoginModal,
}) => {
  const isArabic = currentLang === 'ar';
  const { gallery, branding, categories } = useBrandContent();
  const { isAuthenticated, updateGalleryItem, deleteGalleryItem } = useAdmin();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);

  // If authenticated, show all items (with hidden indicator); if not, only visible ones
  const displayGallery = gallery.filter((item) => {
    if (!isAuthenticated && item.visible === false) return false;
    return true;
  });

  const getItemImage = (item: GalleryItem) => {
    if (item.id === 'gal-6' && branding?.profile?.activeUrl) {
      return branding.profile.activeUrl;
    }
    return item.image;
  };

  const activeItem =
    lightboxIndex !== null && displayGallery[lightboxIndex]
      ? displayGallery[lightboxIndex]
      : null;

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || displayGallery.length === 0) return;
    setLightboxIndex((prev) => (prev! + 1) % displayGallery.length);
  }, [lightboxIndex, displayGallery.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || displayGallery.length === 0) return;
    setLightboxIndex((prev) => (prev! - 1 + displayGallery.length) % displayGallery.length);
  }, [lightboxIndex, displayGallery.length]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') isArabic ? handlePrev() : handleNext();
      if (e.key === 'ArrowLeft') isArabic ? handleNext() : handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, isArabic, handleNext, handlePrev, handleClose]);

  const handleEditClick = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleVisible = async (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    await updateGalleryItem(item.id, { visible: !item.visible });
  };

  const handleDeleteClick = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    setDeletingItem(item);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    await deleteGalleryItem(deletingItem.id);
    setDeletingItem(null);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#0a0e17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span>{isArabic ? 'القسم الثالث: معرض الأعمال (Gallery)' : 'Section 3: Visual Gallery'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            {isArabic ? 'معرض الأعمال وتجارب التصميم' : 'Visual Gallery & Creative Renderings'}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 mb-3">
            {isArabic
              ? 'تصفح التفاصيل الدقيقة للأعمال الفنية والإعلانية وتجارب الذكاء الاصطناعي بدقة متناهية.'
              : 'Immerse yourself in pixel-perfect compositions, studio shots, and editorial print designs.'}
          </p>

          {/* Quick Admin Access Trigger if not logged in */}
          {!isAuthenticated && onOpenLoginModal && (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="text-xs text-purple-400 hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إدارة صور المعرض (دخول المدير)' : 'Manage Gallery (Admin Login)'}</span>
            </button>
          )}
        </div>

        {/* Dedicated In-Page Admin Control Bar for Gallery */}
        {isAuthenticated && (
          <div
            id="gallery-admin-bar"
            className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 text-purple-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {isArabic ? 'التحكم المباشر في معرض الصور (Gallery)' : 'Direct Gallery Management'}
                </span>
                <span className="text-[11px] text-purple-300 font-mono">
                  {isArabic
                    ? `${gallery.length} صورة مسجلة في المعرض`
                    : `${gallery.length} total gallery images`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isArabic ? 'رفع صورة جديدة للمعرض' : 'Upload New Image'}</span>
              </button>

              {onOpenAdminTab && (
                <button
                  type="button"
                  onClick={() => onOpenAdminTab('gallery')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إدارة وترتيب المعرض' : 'Manage & Reorder'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {displayGallery.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0d121c] border border-purple-500/20">
            <Camera className="w-12 h-12 text-purple-500/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              {isArabic ? 'لا توجد صور في المعرض حاليًا' : 'No Gallery Images Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              {isArabic
                ? 'يمكنك رفع صور وتصاميم جديدة لتظهر مباشرة هنا في المعرض.'
                : 'Upload photos and designs to showcase them immediately here.'}
            </p>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer shadow-lg"
              >
                {isArabic ? '+ رفع أول صورة للمعرض' : '+ Upload First Image'}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGallery.map((item, index) => {
              const currentImg = getItemImage(item);

              return (
                <div
                  key={item.id}
                  id={`gallery-item-${item.id}`}
                  onClick={() => setLightboxIndex(index)}
                  className={`group relative rounded-2xl overflow-hidden bg-[#0d121c] border transition-all duration-300 hover:shadow-2xl cursor-pointer aspect-[4/3] sm:aspect-[1/1] ${
                    item.visible === false
                      ? 'border-dashed border-red-500/50 opacity-75'
                      : 'border-slate-800 hover:border-purple-500/60 hover:shadow-purple-500/10'
                  }`}
                >
                  {/* Admin Quick Action Pill on Hover */}
                  {isAuthenticated && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 left-2 z-20 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity bg-[#07090e]/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg"
                    >
                      <button
                        type="button"
                        onClick={(e) => handleEditClick(e, item)}
                        className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title={isArabic ? 'تعديل الصورة' : 'Edit Image'}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleVisible(e, item)}
                        className={`p-1 rounded-lg text-[10px] font-bold flex items-center cursor-pointer transition-colors ${
                          item.visible !== false
                            ? 'bg-slate-800 text-slate-300 hover:text-white'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                        title={item.visible !== false ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'إظهار' : 'Show')}
                      >
                        {item.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(e, item)}
                        className="p-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 text-[10px] font-bold flex items-center cursor-pointer transition-colors"
                        title={isArabic ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Hidden Indicator */}
                  {isAuthenticated && item.visible === false && (
                    <div className="absolute top-12 left-2 z-20 px-2 py-0.5 rounded bg-red-500/80 text-white text-[9px] font-bold">
                      {isArabic ? 'مخفي' : 'Hidden'}
                    </div>
                  )}

                  {/* Background Image */}
                  <img
                    src={currentImg}
                    alt={isArabic ? item.titleAr : item.titleEn}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Top Badge (Featured) */}
                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex items-center gap-1.5">
                    {item.featured && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-black flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        <span>{isArabic ? 'مميز' : 'Featured'}</span>
                      </span>
                    )}
                  </div>

                  {/* Hover Information Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
                    <span className="text-xs font-semibold text-[#0084ff] uppercase tracking-wider mb-1">
                      {isArabic ? item.categoryAr : item.categoryEn}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                      {isArabic ? item.titleAr : item.titleEn}
                    </h3>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-0.5 text-[10px] rounded bg-white/10 text-slate-300 backdrop-blur-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* View Button */}
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Maximize2 className="w-4 h-4 text-[#ff6b00]" />
                      <span>{isArabic ? 'عرض بدقة كاملة' : 'View Fullscreen'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeItem && lightboxIndex !== null && (
        <div
          id="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center select-none"
          onClick={handleClose}
        >
          {/* Close Button */}
          <button
            type="button"
            id="lightbox-close-btn"
            onClick={handleClose}
            aria-label="Close fullscreen view"
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow */}
          <button
            type="button"
            id="lightbox-prev-btn"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous artwork"
            className="absolute left-4 rtl:left-auto rtl:right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            {isArabic ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            id="lightbox-next-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next artwork"
            className="absolute right-4 rtl:right-auto rtl:left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            {isArabic ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>

          {/* Lightbox Content Container */}
          <div
            className="max-w-5xl max-h-[85vh] w-full p-4 flex flex-col items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getItemImage(activeItem)}
              alt={isArabic ? activeItem.titleAr : activeItem.titleEn}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
            />

            {/* Artwork Metadata */}
            <div className="mt-4 text-center">
              <span className="text-xs font-semibold text-[#0084ff] uppercase tracking-wider">
                {isArabic ? activeItem.categoryAr : activeItem.categoryEn}
              </span>
              <h4 className="text-xl font-bold text-white mt-1">
                {isArabic ? activeItem.titleAr : activeItem.titleEn}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {lightboxIndex + 1} / {displayGallery.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* In-Page Gallery Add / Edit Modal */}
      {isModalOpen && (
        <GalleryModal
          currentLang={currentLang}
          item={editingItem}
          categories={categories}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <DeleteConfirmModal
          currentLang={currentLang}
          isOpen={!!deletingItem}
          itemTitle={isArabic ? deletingItem.titleAr : deletingItem.titleEn}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingItem(null)}
        />
      )}
    </section>
  );
};
