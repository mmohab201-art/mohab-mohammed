import React, { useState, useMemo } from 'react';
import { useAdmin } from './AdminContext';
import { ProjectItem, Language } from '../types';
import { ProjectModal } from './ProjectModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Square,
  Layers,
} from 'lucide-react';

interface Props {
  currentLang: Language;
}

export const PortfolioTab: React.FC<Props> = ({ currentLang }) => {
  const {
    projects,
    categories,
    updateProject,
    deleteProject,
    reorderProjects,
    bulkProjects,
  } = useAdmin();
  const isAr = currentLang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'visible' | 'hidden' | 'featured'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Status
      if (statusFilter === 'visible' && !p.visible) return false;
      if (statusFilter === 'hidden' && p.visible) return false;
      if (statusFilter === 'featured' && !p.featured) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (p.titleAr + ' ' + p.titleEn).toLowerCase().includes(q);
        const descMatch = ((p.descAr || '') + ' ' + (p.descEn || '')).toLowerCase().includes(q);
        const toolsMatch = (p.tools || []).some((t) => t.toLowerCase().includes(q));
        const tagsMatch = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || toolsMatch || tagsMatch;
      }
      return true;
    });
  }, [projects, selectedCategory, statusFilter, searchQuery]);

  // Bulk selection
  const allFilteredSelected =
    filteredProjects.length > 0 &&
    filteredProjects.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'hide' | 'show' | 'feature' | 'unfeature') => {
    if (selectedIds.length === 0) return;
    if (action === 'delete') {
      setIsBulkDeleting(true);
      return;
    }
    await bulkProjects(action, selectedIds);
    setSelectedIds([]);
  };

  const confirmBulkDelete = async () => {
    await bulkProjects('delete', selectedIds);
    setSelectedIds([]);
    setIsBulkDeleting(false);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const newList = [...projects];
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;

    await reorderProjects(newList.map((p) => p.id));
  };

  return (
    <div id="admin-portfolio-tab" className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-[#0084ff]" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isAr ? 'إدارة معرض الأعمال (Portfolio)' : 'Portfolio Projects Management'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? 'إضافة، تعديل، ترتيب، وحذف جميع مشاريع وتصاميم الهوية والإعلانات مع تحكم كامل بالصور والمحتوى.'
                : 'Add, update, reorder, and remove portfolio projects and creative case studies.'}
            </p>
          </div>

          <button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0084ff] to-[#0066cc] hover:from-[#1a90ff] hover:to-[#0077ee] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0084ff]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة عمل جديد' : 'New Project'}</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search Box */}
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
              placeholder={
                isAr ? 'البحث بالاسم، الوصف، أو الأدوات...' : 'Search by title, tool, tags...'
              }
              className={`w-full bg-[#07090e] border border-white/10 rounded-xl py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0084ff] ${
                isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0084ff]"
            >
              <option value="all">
                {isAr ? 'جميع التصنيفات (All Categories)' : 'All Categories'}
              </option>
              {categories
                .filter((c) => c.slug !== 'all')
                .map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {isAr ? cat.nameAr : cat.nameEn}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0084ff]"
            >
              <option value="all">{isAr ? 'كافة الحالات' : 'All Statuses'}</option>
              <option value="visible">{isAr ? 'الأعمال المعروضة فقط' : 'Visible Only'}</option>
              <option value="hidden">{isAr ? 'الأعمال المخفية فقط' : 'Hidden Only'}</option>
              <option value="featured">{isAr ? 'الأعمال المميزة فقط' : 'Featured Only'}</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-xl bg-[#0084ff]/10 border border-[#0084ff]/30 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs text-[#0084ff] font-medium">
              <CheckSquare className="w-4 h-4" />
              <span>
                {isAr
                  ? `تم تحديد ${selectedIds.length} عنصر`
                  : `${selectedIds.length} items selected`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkAction('show')}
                className="px-2.5 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium cursor-pointer"
              >
                {isAr ? 'إظهار المحدد' : 'Make Visible'}
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction('hide')}
                className="px-2.5 py-1 rounded-lg bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 text-xs font-medium cursor-pointer"
              >
                {isAr ? 'إخفاء المحدد' : 'Hide Selected'}
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction('feature')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium cursor-pointer"
              >
                {isAr ? 'تمييز المحدد (Feature)' : 'Feature Selected'}
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction('delete')}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium cursor-pointer"
              >
                {isAr ? 'حذف المحدد' : 'Delete Selected'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Projects Table / Grid */}
      <div className="bg-[#0d121c] rounded-2xl border border-white/10 overflow-hidden">
        {/* Table Header */}
        <div className="p-4 bg-[#111723] border-b border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-slate-400 hover:text-white cursor-pointer"
              title={isAr ? 'تحديد الكل' : 'Select All'}
            >
              {allFilteredSelected ? (
                <CheckSquare className="w-4 h-4 text-[#0084ff]" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
            <span>{isAr ? 'الترتيب / العمل' : 'Order / Project'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <span>{isAr ? 'التصنيف' : 'Category'}</span>
            <span>{isAr ? 'الصور' : 'Assets'}</span>
            <span>{isAr ? 'الحالة' : 'Status'}</span>
            <span>{isAr ? 'الإجراءات' : 'Actions'}</span>
          </div>
        </div>

        {/* Rows */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs sm:text-sm">
            {isAr
              ? 'لا توجد أعمال مطابقة لشروط البحث والفلاتر.'
              : 'No projects match your current search and filter criteria.'}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredProjects.map((p, idx) => {
              const isSelected = selectedIds.includes(p.id);
              const realIndex = projects.findIndex((item) => item.id === p.id);

              return (
                <div
                  key={p.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isSelected ? 'bg-[#0084ff]/5' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Left info & checkbox */}
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleSelect(p.id)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0084ff]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    {/* Order buttons */}
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        disabled={realIndex === 0}
                        onClick={() => handleMove(realIndex, 'up')}
                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.order || realIndex + 1}
                      </span>
                      <button
                        type="button"
                        disabled={realIndex === projects.length - 1}
                        onClick={() => handleMove(realIndex, 'down')}
                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <img
                      src={p.image}
                      alt={p.titleAr}
                      className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                    />

                    {/* Titles */}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {isAr ? p.titleAr : p.titleEn}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {isAr ? p.descAr || p.titleEn : p.descEn || p.titleAr}
                      </p>
                      <div className="flex items-center gap-2 mt-1 sm:hidden flex-wrap">
                        <span className="text-[10px] text-[#0084ff]">
                          {isAr ? p.categoryAr : p.categoryEn}
                        </span>
                        {p.featured && (
                          <span className="text-[10px] text-amber-400 font-medium">
                            ★ {isAr ? 'مميز' : 'Featured'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right Metadata for Desktop */}
                  <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center">
                    <span className="hidden sm:inline text-xs text-slate-400 w-24 truncate">
                      {isAr ? p.categoryAr : p.categoryEn}
                    </span>

                    {/* Multi-images count */}
                    <div
                      className="hidden sm:flex items-center gap-1 text-xs text-slate-400 w-16"
                      title={isAr ? 'عدد الصور المرفوعة' : 'Uploaded assets count'}
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>{p.images?.length || 1}</span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-1.5 w-24">
                      {p.featured && (
                        <span
                          className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold"
                          title={isAr ? 'معروض في النماذج المميزة' : 'Featured on home'}
                        >
                          {isAr ? 'مميز' : 'Featured'}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => updateProject(p.id, { visible: !p.visible })}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border cursor-pointer ${
                          p.visible
                            ? 'bg-green-500/10 text-green-400 border-green-500/30'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                        }`}
                      >
                        {p.visible ? (isAr ? 'ظاهر' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Toggle Featured */}
                      <button
                        type="button"
                        onClick={() => updateProject(p.id, { featured: !p.featured })}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                          p.featured
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title={isAr ? 'تبديل التمييز (Featured)' : 'Toggle Featured'}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(p);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                        title={isAr ? 'تعديل' : 'Edit'}
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#0084ff]" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeletingProject(p)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 cursor-pointer"
                        title={isAr ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
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
        />
      )}

      {/* Delete Single Project Modal */}
      {deletingProject && (
        <DeleteConfirmModal
          currentLang={currentLang}
          isOpen={!!deletingProject}
          itemTitle={isAr ? deletingProject.titleAr : deletingProject.titleEn}
          onConfirm={async () => {
            await deleteProject(deletingProject.id);
            setDeletingProject(null);
          }}
          onCancel={() => setDeletingProject(null)}
        />
      )}

      {/* Bulk Delete Modal */}
      {isBulkDeleting && (
        <DeleteConfirmModal
          currentLang={currentLang}
          isOpen={isBulkDeleting}
          title={
            isAr
              ? `هل أنت متأكد من حذف ${selectedIds.length} أعمال دفعة واحدة؟`
              : `Are you sure you want to delete ${selectedIds.length} projects?`
          }
          onConfirm={confirmBulkDelete}
          onCancel={() => setIsBulkDeleting(false)}
        />
      )}
    </div>
  );
};
