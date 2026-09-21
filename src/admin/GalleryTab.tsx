import React, { useState, useRef } from 'react';
import { useAdmin } from './AdminContext';
import { GalleryItem, Language } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  Image as ImageIcon,
  Plus,
  Upload,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Check,
  X,
  Loader2,
  Search,
} from 'lucide-react';

interface Props {
  currentLang: Language;
}

export const GalleryTab: React.FC<Props> = ({ currentLang }) => {
  const {
    gallery,
    categories,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    uploadImageFile,
  } = useAdmin();
  const isAr = currentLang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);

  // Form state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState('advertising');
  const [image, setImage] = useState('/assets/images/project_coffee.jpg');
  const [aspect, setAspect] = useState('aspect-square');
  const [visible, setVisible] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [tagsStr, setTagsStr] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setTitleAr('');
    setTitleEn('');
    setCategory('advertising');
    setImage('/assets/images/project_coffee.jpg');
    setAspect('aspect-square');
    setVisible(true);
    setFeatured(false);
    setTagsStr('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitleAr(item.titleAr);
    setTitleEn(item.titleEn);
    setCategory(item.category || '');
    setImage(item.image);
    setAspect(item.aspect || 'aspect-square');
    setVisible(item.visible ?? true);
    setFeatured(Boolean(item.featured));
    setTagsStr((item.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, 'gallery');
      setImage(url);
    } catch (err: any) {
      alert(err.message || 'فشل رفع الصورة');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() && !titleEn.trim()) return;

    setIsSaving(true);
    const catObj = categories.find((c) => c.slug === category);

    const payload: Partial<GalleryItem> = {
      title: titleAr || titleEn,
      titleAr: titleAr || titleEn,
      titleEn: titleEn || titleAr,
      category,
      categoryAr: catObj?.nameAr || 'إعلانات تجارية',
      categoryEn: catObj?.nameEn || 'Advertising',
      image,
      aspect,
      visible,
      featured,
      tags: tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    let success = false;
    if (editingItem) {
      success = await updateGalleryItem(editingItem.id, payload);
    } else {
      success = await createGalleryItem(payload);
    }

    setIsSaving(false);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (item.titleAr + ' ' + item.titleEn).toLowerCase().includes(q);
      const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));
      return titleMatch || tagMatch;
    }
    return true;
  });

  return (
    <div id="admin-gallery-tab" className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isAr ? 'إدارة معرض الأعمال (Gallery Showcase)' : 'Gallery Showcase Management'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? 'إدارة الصور واللقطات الإبداعية في المعرض العام، ورفع صور جديدة مع تحديد الأبعاد والنسب والظهور.'
                : 'Upload, manage, and arrange standalone photographic and creative design showcases.'}
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة صورة للمعرض' : 'Add to Gallery'}</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search
              className={`absolute top-3 w-4 h-4 text-slate-400 ${
                isAr ? 'right-3' : 'left-3'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'البحث بالاسم أو الوسوم...' : 'Search gallery items...'}
              className={`w-full bg-[#07090e] border border-white/10 rounded-xl py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 ${
                isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">{isAr ? 'جميع التصنيفات' : 'All Categories'}</option>
              {categories
                .filter((c) => c.slug !== 'all')
                .map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {isAr ? cat.nameAr : cat.nameEn}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-[#0d121c] border border-white/10 hover:border-purple-500/40 transition-all shadow-lg flex flex-col"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-square w-full bg-black/40 overflow-hidden">
              <img
                src={item.image}
                alt={item.titleAr}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Status Badges Overlay */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md shadow-xs ${
                    item.visible
                      ? 'bg-green-500/80 text-white'
                      : 'bg-black/80 text-slate-300 border border-white/20'
                  }`}
                >
                  {item.visible ? (isAr ? 'ظاهر' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}
                </span>

                {item.featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-black" />
                    <span>{isAr ? 'مميز' : 'Featured'}</span>
                  </span>
                )}
              </div>

              {/* Quick Action Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => updateGalleryItem(item.id, { visible: !item.visible })}
                  className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  title={item.visible ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار' : 'Show')}
                >
                  {item.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-2.5 rounded-xl bg-[#0084ff] hover:bg-[#1a90ff] text-white transition-colors cursor-pointer"
                  title={isAr ? 'تعديل' : 'Edit'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(item)}
                  className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Details */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-purple-400 font-medium block truncate">
                  {isAr ? item.categoryAr : item.categoryEn}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                  {isAr ? item.titleAr : item.titleEn}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                <span className="truncate">{item.aspect || 'Square'}</span>
                <span>#{item.order || 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Gallery Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#07090e]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="w-full max-w-lg bg-[#0d121c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111723]">
              <h3 className="text-base font-bold text-white">
                {editingItem
                  ? isAr
                    ? 'تعديل صورة المعرض'
                    : 'Edit Gallery Photo'
                  : isAr
                  ? 'إضافة صورة جديدة للمعرض'
                  : 'Add New Gallery Photo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  {isAr ? 'الصورة *' : 'Image *'}
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      ) : (
                        <Upload className="w-4 h-4 text-purple-400" />
                      )}
                      <span>{isAr ? 'رفع صورة من الجهاز' : 'Upload Image'}</span>
                    </button>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-[#07090e] border border-white/10 rounded-lg py-1 px-2 text-[11px] text-white focus:outline-none focus:border-purple-500"
                      placeholder="Image URL"
                    />
                  </div>
                </div>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isAr ? 'العنوان بالعربية *' : 'Arabic Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isAr ? 'العنوان بالإنجليزية *' : 'English Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Category & Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {categories
                      .filter((c) => c.slug !== 'all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {isAr ? cat.nameAr : cat.nameEn}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isAr ? 'نسبة العرض للأبعاد (Aspect)' : 'Aspect Ratio'}
                  </label>
                  <select
                    value={aspect}
                    onChange={(e) => setAspect(e.target.value)}
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="aspect-square">{isAr ? 'مربع (1:1)' : 'Square (1:1)'}</option>
                    <option value="aspect-[4/5]">{isAr ? 'طولي بورتوريه (4:5)' : 'Portrait (4:5)'}</option>
                    <option value="aspect-[16/9]">{isAr ? 'عرضي لاندسكيب (16:9)' : 'Landscape (16:9)'}</option>
                    <option value="aspect-[3/4]">{isAr ? 'طولي (3:4)' : 'Vertical (3:4)'}</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="p-3 rounded-xl bg-[#07090e] border border-white/5 flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-500"
                  />
                  <span className="text-xs text-white">
                    {isAr ? 'عرض في المعرض' : 'Visible'}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span className="text-xs text-white">
                    {isAr ? 'صورة مميزة' : 'Featured'}
                  </span>
                </label>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{isAr ? 'حفظ الصورة' : 'Save Photo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <DeleteConfirmModal
          currentLang={currentLang}
          isOpen={!!deletingItem}
          itemTitle={isAr ? deletingItem.titleAr : deletingItem.titleEn}
          onConfirm={async () => {
            await deleteGalleryItem(deletingItem.id);
            setDeletingItem(null);
          }}
          onCancel={() => setDeletingItem(null)}
        />
      )}
    </div>
  );
};
