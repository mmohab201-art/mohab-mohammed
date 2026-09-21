import React, { useState, useRef } from 'react';
import { useAdmin } from './AdminContext';
import { ProjectItem, CategoryItem, Language } from '../types';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Check, Loader2, Sparkles } from 'lucide-react';

interface Props {
  currentLang: Language;
  project?: ProjectItem | null;
  categories: CategoryItem[];
  isOpen: boolean;
  onClose: () => void;
  defaultFeatured?: boolean;
}

export const ProjectModal: React.FC<Props> = ({
  currentLang,
  project,
  categories,
  isOpen,
  onClose,
  defaultFeatured = false,
}) => {
  const { createProject, updateProject, uploadImageFile } = useAdmin();
  const isAr = currentLang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileInputRef = useRef<HTMLInputElement>(null);

  const [titleAr, setTitleAr] = useState(project?.titleAr || '');
  const [titleEn, setTitleEn] = useState(project?.titleEn || '');
  const [category, setCategory] = useState(project?.category || 'advertising');
  const [descAr, setDescAr] = useState(project?.descAr || project?.descriptionAr || '');
  const [descEn, setDescEn] = useState(project?.descEn || project?.descriptionEn || '');
  const [image, setImage] = useState(project?.image || '/assets/images/project_coffee.jpg');
  const [images, setImages] = useState<string[]>(
    Array.isArray(project?.images) && project.images.length > 0
      ? project.images
      : [project?.image || '/assets/images/project_coffee.jpg']
  );
  const [toolsStr, setToolsStr] = useState((project?.tools || ['Photoshop']).join(', '));
  const [tagsStr, setTagsStr] = useState((project?.tags || []).join(', '));
  const [clientAr, setClientAr] = useState(project?.clientAr || '');
  const [clientEn, setClientEn] = useState(project?.clientEn || '');
  const [year, setYear] = useState(project?.year || String(new Date().getFullYear()));
  const [featured, setFeatured] = useState<boolean>(
    project ? (project.featured ?? false) : defaultFeatured
  );
  const [visible, setVisible] = useState<boolean>(
    project ? (project.visible ?? true) : true
  );
  const [order, setOrder] = useState<number>(project?.order || 1);
  const [slug, setSlug] = useState(project?.slug || '');
  const [seoTitle, setSeoTitle] = useState(project?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(project?.seoDescription || '');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever modal opens or project changes
  React.useEffect(() => {
    if (isOpen) {
      setTitleAr(project?.titleAr || '');
      setTitleEn(project?.titleEn || '');
      setCategory(project?.category || 'advertising');
      setDescAr(project?.descAr || project?.descriptionAr || '');
      setDescEn(project?.descEn || project?.descriptionEn || '');
      setImage(project?.image || '/assets/images/project_coffee.jpg');
      setImages(
        Array.isArray(project?.images) && project.images.length > 0
          ? project.images
          : [project?.image || '/assets/images/project_coffee.jpg']
      );
      setToolsStr((project?.tools || ['Photoshop']).join(', '));
      setTagsStr((project?.tags || []).join(', '));
      setClientAr(project?.clientAr || '');
      setClientEn(project?.clientEn || '');
      setYear(project?.year || String(new Date().getFullYear()));
      setFeatured(project ? (project.featured ?? false) : defaultFeatured);
      setVisible(project ? (project.visible ?? true) : true);
      setOrder(project?.order || 1);
      setSlug(project?.slug || '');
      setSeoTitle(project?.seoTitle || '');
      setSeoDescription(project?.seoDescription || '');
      setUploadError(null);
    }
  }, [project, isOpen, defaultFeatured]);

  if (!isOpen) return null;

  // Handle Main Image Upload
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, 'portfolio');
      setImage(url);
      if (!images.includes(url)) {
        setImages([url, ...images]);
      }
    } catch (err: any) {
      setUploadError(err.message || 'فشل رفع الصورة');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Extra Image Upload
  const handleExtraImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, 'portfolio');
      setImages([...images, url]);
    } catch (err: any) {
      setUploadError(err.message || 'فشل رفع الصورة الإضافية');
    } finally {
      setIsUploading(false);
      if (extraFileInputRef.current) extraFileInputRef.current.value = '';
    }
  };

  const removeExtraImage = (urlToRemove: string) => {
    const next = images.filter((img) => img !== urlToRemove);
    setImages(next);
    if (image === urlToRemove && next.length > 0) {
      setImage(next[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() && !titleEn.trim()) return;

    setIsSaving(true);
    const selectedCategoryObj = categories.find((c) => c.slug === category);

    const projectData: Partial<ProjectItem> = {
      title: titleAr || titleEn,
      titleAr: titleAr || titleEn,
      titleEn: titleEn || titleAr,
      category,
      categoryAr: selectedCategoryObj?.nameAr || 'إعلانات',
      categoryEn: selectedCategoryObj?.nameEn || 'Advertising',
      image,
      images: images.length > 0 ? images : [image],
      descAr,
      descEn,
      descriptionAr: descAr,
      descriptionEn: descEn,
      tools: toolsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      tags: tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      clientAr,
      clientEn,
      year,
      featured,
      visible,
      order: Number(order) || 1,
      slug: slug || (titleEn || titleAr).toLowerCase().replace(/[^a-z0-9]/g, '-'),
      seoTitle: seoTitle || titleAr,
      seoDescription: seoDescription || descAr,
    };

    let success = false;
    if (project?.id) {
      success = await updateProject(project.id, projectData);
    } else {
      success = await createProject(projectData);
    }

    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#07090e]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        id="project-modal-card"
        className="w-full max-w-3xl bg-[#0d121c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111723]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0084ff]/20 text-[#0084ff] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {project
                  ? isAr
                    ? 'تعديل بيانات العمل'
                    : 'Edit Project'
                  : isAr
                  ? 'إضافة عمل جديد'
                  : 'Add New Project'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'قم بإدخال بيانات المشروع والصور والتحكم في ظهوره'
                  : 'Specify project details, multimedia assets, and visibility'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6">
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {uploadError}
            </div>
          )}

          {/* Section 1: Main Image & Multi-Images */}
          <div className="space-y-4 bg-[#07090e] p-4 sm:p-5 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#0084ff]" />
                <span>{isAr ? 'الصور والأصول البصرية للعمل' : 'Project Visual Assets'}</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {isAr ? 'يدعم JPG, PNG, WEBP, SVG حتى 15MB' : 'Supports JPG, PNG, WEBP, SVG (max 15MB)'}
              </span>
            </div>

            {/* Main Image Preview & Upload Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative w-full sm:w-56 h-40 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 group">
                <img
                  src={image}
                  alt="Main Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-[10px] text-white backdrop-blur-xs">
                  {isAr ? 'الصورة الرئيسية' : 'Main Image'}
                </div>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMainImageChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0084ff]" />
                  ) : (
                    <Upload className="w-4 h-4 text-[#0084ff]" />
                  )}
                  <span>{isAr ? 'رفع / استبدال الصورة الرئيسية' : 'Upload / Replace Main Image'}</span>
                </button>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    {isAr ? 'أو رابط الصورة المباشر:' : 'Or direct Image URL:'}
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-[#0d121c] border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0084ff]"
                    placeholder="/assets/images/..."
                  />
                </div>
              </div>
            </div>

            {/* Additional Project Images (Mockups, Details, Process) */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  {isAr ? 'صور إضافية للمشروع (Mockups / تفاصيل / زوايا أخرى):' : 'Additional Project Images:'}
                </span>
                <input
                  type="file"
                  ref={extraFileInputRef}
                  onChange={handleExtraImageChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => extraFileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-[#0084ff]/20 hover:bg-[#0084ff]/30 text-[#0084ff] text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة صورة' : 'Add Image'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-black/30 group shrink-0"
                  >
                    <img src={imgUrl} alt={`Asset ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(imgUrl)}
                      className="absolute inset-0 bg-red-600/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title={isAr ? 'حذف الصورة' : 'Remove Image'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {imgUrl === image && (
                      <span className="absolute bottom-1 left-1 right-1 bg-black/80 text-white text-[8px] text-center rounded py-0.5 pointer-events-none">
                        {isAr ? 'رئيسية' : 'Main'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Titles & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'عنوان العمل (بالعربية) *' : 'Project Title (Arabic) *'}
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff]"
                placeholder={isAr ? 'مثال: قهوة بطعم مختلف — Golden Bean' : 'Arabic Title'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'عنوان العمل (بالإنجليزية) *' : 'Project Title (English) *'}
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff]"
                placeholder="e.g. Golden Bean Coffee Poster"
              />
            </div>
          </div>

          {/* Section 3: Category & Year & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'التصنيف *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#0084ff]"
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
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'العميل / الجهة' : 'Client / Brand'}
              </label>
              <input
                type="text"
                value={clientAr}
                onChange={(e) => setClientAr(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff]"
                placeholder={isAr ? 'اسم العميل' : 'Client Name'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'سنة التنفيذ' : 'Year'}
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff]"
                placeholder="2026"
              />
            </div>
          </div>

          {/* Section 4: Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'وصف العمل (بالعربية)' : 'Description (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff]"
                placeholder={isAr ? 'شرح فكرة التصميم والتقنيات المستخدمة...' : 'Description in Arabic'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'وصف العمل (بالإنجليزية)' : 'Description (English)'}
              </label>
              <textarea
                rows={3}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff]"
                placeholder="Description in English..."
              />
            </div>
          </div>

          {/* Section 5: Tools & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'الأدوات المستخدمة (مفصولة بفواصل)' : 'Tools Used (comma separated)'}
              </label>
              <input
                type="text"
                value={toolsStr}
                onChange={(e) => setToolsStr(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff]"
                placeholder="Adobe Photoshop, AI Generation, Illustrator"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAr ? 'الكلمات المفتاحية / Tags' : 'Tags (comma separated)'}
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff]"
                placeholder="إعلانات, فوتوشوب, هوية"
              />
            </div>
          </div>

          {/* Section 6: Featured, Visible, Order Toggles */}
          <div className="p-4 rounded-xl bg-[#07090e] border border-white/5 flex flex-wrap items-center justify-between gap-4">
            {/* Featured Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#0084ff] focus:ring-0 focus:outline-none bg-black/40 border-white/20"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  {isAr ? 'عرض في "نماذج مختارة من أعمالي" (Featured)' : 'Featured Work'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isAr ? 'يظهر في قسم النماذج المختارة المميزة' : 'Highlight in Featured section'}
                </span>
              </div>
            </label>

            {/* Visibility Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="w-4 h-4 rounded text-green-500 focus:ring-0 focus:outline-none bg-black/40 border-white/20"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  {isAr ? 'حالة الظهور (Visible)' : 'Visible to Public'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isAr ? 'إذا تم إلغاؤه يختفي من الموقع دون حذفه' : 'Hide without deleting from database'}
                </span>
              </div>
            </label>

            {/* Order */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-300">
                {isAr ? 'الترتيب:' : 'Order:'}
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-16 bg-[#0d121c] border border-white/10 rounded-lg py-1 px-2 text-xs text-white text-center focus:outline-none focus:border-[#0084ff]"
                min={1}
              />
            </div>
          </div>

          {/* Section 7: SEO Settings (Collapsible / Compact) */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isAr ? 'إعدادات تحسين محركات البحث (SEO & Slug)' : 'SEO & URL Slug'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {isAr ? 'الرابط المخصص (Slug)' : 'URL Slug'}
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#07090e] border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0084ff]"
                  placeholder="golden-bean-coffee"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {isAr ? 'عنوان SEO' : 'SEO Title'}
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-[#07090e] border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0084ff]"
                  placeholder={isAr ? 'عنوان الصفحة لمحركات البحث' : 'Page meta title'}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0084ff] to-[#0066cc] hover:from-[#1a90ff] hover:to-[#0077ee] text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-lg shadow-[#0084ff]/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'حفظ العمل' : 'Save Project'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
