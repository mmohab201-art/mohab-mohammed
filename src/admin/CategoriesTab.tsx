import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { CategoryItem, Language } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { FolderTree, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Props {
  currentLang: Language;
}

export const CategoriesTab: React.FC<Props> = ({ currentLang }) => {
  const { categories, projects, createCategory, updateCategory, deleteCategory } = useAdmin();
  const isAr = currentLang === 'ar';

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');

  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [deletingCat, setDeletingCat] = useState<CategoryItem | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) return;

    await createCategory(nameAr, nameEn, slug);
    setNameAr('');
    setNameEn('');
    setSlug('');
  };

  const startEdit = (cat: CategoryItem) => {
    setEditingCat(cat);
    setEditNameAr(cat.nameAr);
    setEditNameEn(cat.nameEn);
  };

  const handleSaveEdit = async () => {
    if (!editingCat || !editNameAr.trim() || !editNameEn.trim()) return;
    await updateCategory(editingCat.id, {
      nameAr: editNameAr.trim(),
      nameEn: editNameEn.trim(),
    });
    setEditingCat(null);
  };

  return (
    <div id="admin-categories-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <FolderTree className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {isAr ? 'إدارة التصنيفات والأقسام (Categories)' : 'Categories & Taxonomy'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          {isAr
            ? 'تصنيف الأعمال الإبداعية وتنظيم فلاتر التصفح في الموقع العام.'
            : 'Organize projects and gallery items by creative discipline and filter tags.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Category Form */}
        <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 h-fit space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'إضافة تصنيف جديد' : 'Add New Category'}</span>
          </h3>

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                {isAr ? 'اسم التصنيف (بالعربية) *' : 'Name in Arabic *'}
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder={isAr ? 'مثال: تغليف المنتجات' : 'e.g. Packaging Design'}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                {isAr ? 'اسم التصنيف (بالإنجليزية) *' : 'Name in English *'}
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Packaging"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                {isAr ? 'المعرّف الإنجليزي (Slug - اختياري)' : 'Slug (Optional)'}
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="packaging"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة التصنيف' : 'Create Category'}</span>
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="lg:col-span-2 bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">
            {isAr ? 'التصنيفات الحالية' : 'Current Categories'}
          </h3>

          <div className="divide-y divide-white/5">
            {categories.map((cat) => {
              const projectCount = projects.filter((p) => p.category === cat.slug).length;
              const isEditing = editingCat?.id === cat.id;

              return (
                <div
                  key={cat.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editNameAr}
                        onChange={(e) => setEditNameAr(e.target.value)}
                        className="bg-[#07090e] border border-white/10 rounded-lg py-1 px-2 text-xs text-white flex-1"
                      />
                      <input
                        type="text"
                        value={editNameEn}
                        onChange={(e) => setEditNameEn(e.target.value)}
                        className="bg-[#07090e] border border-white/10 rounded-lg py-1 px-2 text-xs text-white flex-1"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingCat(null)}
                        className="p-1.5 rounded-lg bg-white/10 text-slate-300 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {isAr ? cat.nameAr : cat.nameEn}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500">
                            ({cat.slug})
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {isAr ? cat.nameEn : cat.nameAr}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                          {projectCount} {isAr ? 'أعمال' : 'works'}
                        </span>

                        {cat.slug !== 'all' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(cat)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                              title={isAr ? 'تعديل' : 'Edit'}
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#0084ff]" />
                            </button>
                            <button
                              onClick={() => setDeletingCat(cat)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                              title={isAr ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {deletingCat && (
        <DeleteConfirmModal
          currentLang={currentLang}
          isOpen={!!deletingCat}
          itemTitle={isAr ? deletingCat.nameAr : deletingCat.nameEn}
          onConfirm={async () => {
            await deleteCategory(deletingCat.id);
            setDeletingCat(null);
          }}
          onCancel={() => setDeletingCat(null)}
        />
      )}
    </div>
  );
};
