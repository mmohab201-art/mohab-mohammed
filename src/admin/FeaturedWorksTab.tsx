import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { ProjectItem, Language } from '../types';
import { ProjectModal } from './ProjectModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Star, Plus, Edit2, Eye, EyeOff, Trash2, ArrowUp, ArrowDown, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  currentLang: Language;
}

export const FeaturedWorksTab: React.FC<Props> = ({ currentLang }) => {
  const { projects, categories, updateProject, deleteProject, reorderProjects } = useAdmin();
  const isAr = currentLang === 'ar';

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);

  // Filter only featured works
  const featuredProjects = projects.filter((p) => p.featured === true);

  const handleToggleFeatured = async (p: ProjectItem) => {
    await updateProject(p.id, { featured: !p.featured });
  };

  const handleToggleVisible = async (p: ProjectItem) => {
    await updateProject(p.id, { visible: !p.visible });
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= featuredProjects.length) return;

    // Swap
    const newFeaturedList = [...featuredProjects];
    const temp = newFeaturedList[index];
    newFeaturedList[index] = newFeaturedList[targetIdx];
    newFeaturedList[targetIdx] = temp;

    // Update orders
    const allOrderedIds = projects.map((p) => {
      const foundIdx = newFeaturedList.findIndex((f) => f.id === p.id);
      return { id: p.id, order: foundIdx !== -1 ? foundIdx + 1 : (p.order ?? 99) + 10 };
    });
    allOrderedIds.sort((a, b) => a.order - b.order);
    await reorderProjects(allOrderedIds.map((o) => o.id));
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    await deleteProject(deletingProject.id);
    setDeletingProject(null);
  };

  return (
    <div id="admin-featured-works-tab" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d121c] p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isAr ? 'نماذج مختارة من أعمالي (Featured Works)' : 'Featured Works Management'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'الأعمال التي تظهر في قسم النماذج المميزة في الصفحة الرئيسية. يمكنك التحكم بترتيبها، إخفائها، وتعديلها بسهولة.'
              : 'Curated projects highlighted prominently on the homepage. Manage order, visibility, and details.'}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة عمل مميز جديد' : 'Add Featured Work'}</span>
        </button>
      </div>

      {/* Featured Works List */}
      {featuredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d121c] border border-white/10">
          <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {isAr ? 'لا توجد أعمال مميزة محددة حاليًا' : 'No Featured Works Selected'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {isAr
              ? 'يمكنك إضافة عمل جديد أو تفعيل خيار Featured من قسم أعمالي (Portfolio).'
              : 'Add a new featured work or toggle the Featured option on any project in Portfolio.'}
          </p>
          <button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0084ff] text-white text-xs font-medium cursor-pointer"
          >
            {isAr ? '+ إضافة أول عمل مميز' : '+ Add First Featured Work'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {featuredProjects.map((p, idx) => (
            <div
              key={p.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0d121c] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Info */}
              <div className="flex items-center gap-4 min-w-0">
                {/* Order Badge & Reorder Arrows */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    title={isAr ? 'تحريك للأعلى' : 'Move Up'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 h-6 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-amber-400 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    disabled={idx === featuredProjects.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    title={isAr ? 'تحريك للأسفل' : 'Move Down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail */}
                <img
                  src={p.image}
                  alt={p.titleAr}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0"
                />

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{isAr ? 'مميز' : 'Featured'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0084ff]/10 text-[#0084ff] border border-[#0084ff]/20 text-[10px] font-medium">
                      {isAr ? p.categoryAr : p.categoryEn}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        p.visible
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {p.visible ? (isAr ? 'ظاهر' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {isAr ? p.titleAr : p.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {isAr ? p.descAr : p.descEn}
                  </p>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Toggle Visibility */}
                <button
                  onClick={() => handleToggleVisible(p)}
                  className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    p.visible
                      ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}
                  title={p.visible ? (isAr ? 'إخفاء العمل' : 'Hide') : (isAr ? 'إظهار العمل' : 'Show')}
                >
                  {p.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="text-xs hidden sm:inline">
                    {p.visible ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار' : 'Show')}
                  </span>
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => {
                    setEditingProject(p);
                    setIsModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={isAr ? 'تعديل بيانات العمل' : 'Edit'}
                >
                  <Edit2 className="w-4 h-4 text-[#0084ff]" />
                  <span className="text-xs hidden sm:inline">{isAr ? 'تعديل' : 'Edit'}</span>
                </button>

                {/* Toggle Off Featured */}
                <button
                  onClick={() => handleToggleFeatured(p)}
                  className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={isAr ? 'إلغاء من النماذج المميزة' : 'Remove from Featured'}
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs hidden sm:inline">
                    {isAr ? 'إلغاء التمييز' : 'Unfeature'}
                  </span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setDeletingProject(p)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={isAr ? 'حذف العمل' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal for Add / Edit */}
      {isModalOpen && (
        <ProjectModal
          currentLang={currentLang}
          project={editingProject}
          categories={categories}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          defaultFeatured={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <DeleteConfirmModal
          currentLang={currentLang}
          isOpen={!!deletingProject}
          itemTitle={isAr ? deletingProject.titleAr : deletingProject.titleEn}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProject(null)}
        />
      )}
    </div>
  );
};
