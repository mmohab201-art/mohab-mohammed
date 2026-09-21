import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { GalleryItem, CategoryItem, Language } from '../types';
import { X, Upload, Check, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface Props {
  currentLang: Language;
  item?: GalleryItem | null;
  categories: CategoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryModal: React.FC<Props> = ({
  currentLang,
  item,
  categories,
  isOpen,
  onClose,
}) => {
  const { createGalleryItem, updateGalleryItem, uploadImageFile } = useAdmin();
  const isAr = currentLang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titleAr, setTitleAr] = useState(item?.titleAr || '');
  const [titleEn, setTitleEn] = useState(item?.titleEn || '');
  const [category, setCategory] = useState(item?.category || 'advertising');
  const [image, setImage] = useState(item?.image || '/assets/images/project_coffee.jpg');
  const [aspect, setAspect] = useState(item?.aspect || 'aspect-square');
  const [visible, setVisible] = useState(item ? (item.visible ?? true) : true);
  const [featured, setFeatured] = useState(item ? Boolean(item.featured) : false);
  const [tagsStr, setTagsStr] = useState((item?.tags || []).join(', '));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitleAr(item?.titleAr || '');
      setTitleEn(item?.titleEn || '');
      setCategory(item?.category || 'advertising');
      setImage(item?.image || '/assets/images/project_coffee.jpg');
      setAspect(item?.aspect || 'aspect-square');
      setVisible(item ? (item.visible ?? true) : true);
      setFeatured(item ? Boolean(item.featured) : false);
      setTagsStr((item?.tags || []).join(', '));
      setUploadError(null);
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, 'gallery');
      setImage(url);
    } catch (err: any) {
      setUploadError(err.message || (isAr ? 'فشل رفع الصورة' : 'Failed to upload image'));
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
      categoryAr: catObj?.nameAr || (isAr ? 'إعلانات تجارية' : 'Advertising'),
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
    if (item?.id) {
      success = await updateGalleryItem(item.id, payload);
    } else {
      success = await createGalleryItem(payload);
    }

    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      id="gallery-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#07090e]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        id="gallery-modal-card"
        className="w-full max-w-2xl bg-[#0d121c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111723]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0084ff]/20 text-[#0084ff] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {item
                  ? isAr
                    ? 'تعديل صورة في المعرض'
                    : 'Edit Gallery Photo'
                  : isAr
                  ? 'إضافة صورة جديدة للمعرض'
                  : 'Add New Gallery Photo'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'رفع الصورة وتحديد التصنيف والعنوان للظهور فورًا بالمعرض'
                  : 'Upload image and configure metadata for instant showcase'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {uploadError}
            </div>
          )}

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'صورة المعرض' : 'Gallery Image'}
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/20 bg-black/50 shrink-0">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-xs gap-1">
                    <Loader2 className="w-5 h-5 animate-spin text-[#0084ff]" />
                    <span>{isAr ? 'جاري الرفع...' : 'Uploading...'}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0084ff]/10 hover:bg-[#0084ff]/20 border border-[#0084ff]/30 text-[#0084ff] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isAr ? 'رفع صورة من جهازك' : 'Upload From Device'}</span>
                </button>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>{isAr ? 'أو أدخل رابط مباشر للصورة:' : 'Or enter direct image URL:'}</p>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... or /assets/images/..."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#07090e] border border-white/10 text-xs text-white focus:outline-none focus:border-[#0084ff]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'عنوان الصورة (عربي)' : 'Title (Arabic)'} *
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-[#0084ff]"
                placeholder={isAr ? 'مثال: تصميم بوستر إعلاني' : 'e.g. Creative Poster'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'عنوان الصورة (إنجليزي)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-[#0084ff]"
                placeholder="e.g. Creative Advertising Poster"
              />
            </div>
          </div>

          {/* Category & Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-[#0084ff]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {isAr ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'نسبة الأبعاد' : 'Aspect Ratio'}
              </label>
              <select
                value={aspect}
                onChange={(e) => setAspect(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-[#0084ff]"
              >
                <option value="aspect-square">{isAr ? 'مربع (1:1)' : 'Square (1:1)'}</option>
                <option value="aspect-[4/3]">{isAr ? 'أفقي (4:3)' : 'Landscape (4:3)'}</option>
                <option value="aspect-[16/9]">{isAr ? 'عريض (16:9)' : 'Widescreen (16:9)'}</option>
                <option value="aspect-[3/4]">{isAr ? 'رأسي بورتريه (3:4)' : 'Portrait (3:4)'}</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isAr ? 'الوسوم (مفصولة بفاصلة)' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder={isAr ? 'فوتوشوب, هوية, بوستر' : 'Photoshop, Branding, Poster'}
              className="w-full px-3.5 py-2 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-[#0084ff]"
            />
          </div>

          {/* Visibility and Featured Options */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="w-4 h-4 rounded text-[#0084ff] focus:ring-[#0084ff]"
              />
              <span className="text-xs text-slate-300">{isAr ? 'الظهور في المعرض العام' : 'Visible in public gallery'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span className="text-xs text-amber-400 font-medium">
                ★ {isAr ? 'تمييز كصورة بارزة' : 'Featured Image'}
              </span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0084ff] to-[#0066cc] hover:from-[#1a90ff] hover:to-[#0077ee] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#0084ff]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{item ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة للصورة' : 'Add Image')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
