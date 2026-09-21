import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  ArrowUpRight,
  Eye,
  EyeOff,
  Layers,
  Check,
  ExternalLink,
  Plus,
  Edit2,
  Sliders,
  Settings,
} from 'lucide-react';
import { Language, ProjectItem } from '../types';
import { useBrandContent } from '../context/BrandContext';
import { useAdmin } from '../admin/AdminContext';
import { ProjectModal } from '../admin/ProjectModal';

interface Props {
  currentLang: Language;
  onOpenAdminTab?: (tab: string) => void;
  onOpenLoginModal?: () => void;
}

export const FeaturedWorks: React.FC<Props> = ({
  currentLang,
  onOpenAdminTab,
  onOpenLoginModal,
}) => {
  const { featuredProjects, categories } = useBrandContent();
  const { isAuthenticated, updateProject } = useAdmin();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAr = currentLang === 'ar';

  const handleEditClick = (e: React.MouseEvent, project: ProjectItem) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleToggleFeatured = async (e: React.MouseEvent, project: ProjectItem) => {
    e.stopPropagation();
    await updateProject(project.id, { featured: !project.featured });
  };

  const handleToggleVisible = async (e: React.MouseEvent, project: ProjectItem) => {
    e.stopPropagation();
    await updateProject(project.id, { visible: !project.visible });
  };

  return (
    <section id="featured-works" className="py-20 sm:py-28 bg-[#0a0e17] relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{isAr ? 'القسم الأول: نماذج مختارة' : 'Section 1: Featured Showcase'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {isAr ? 'نماذج مختارة من الأعمال والتصاميم' : 'Featured Works & Key Creations'}
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <p className="max-w-md text-sm sm:text-base text-slate-400">
              {isAr
                ? 'مجموعة مختارة من أبرز الحملات الإعلانية والهويات البصرية التي حققت نجاحاً وتميزاً استثنائياً.'
                : 'A prestigious selection of standout commercial advertising campaigns and distinctive visual brand identities.'}
            </p>

            {/* Quick Admin Access Trigger if not logged in */}
            {!isAuthenticated && onOpenLoginModal && (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="text-xs text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isAr ? 'إدارة وتعديل هذا القسم (دخول المدير)' : 'Manage this section (Admin)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dedicated In-Page Admin Control Bar for Featured Works */}
        {isAuthenticated && (
          <div
            id="featured-works-admin-bar"
            className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-amber-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {isAr ? 'التحكم المباشر في النماذج المختارة' : 'Direct Featured Works Management'}
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  {isAr
                    ? `${featuredProjects.length} أعمال معروضة حاليًا في هذا القسم`
                    : `${featuredProjects.length} projects currently active`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة نموذج مميز جديد' : 'Add New Featured Work'}</span>
              </button>

              {onOpenAdminTab && (
                <button
                  type="button"
                  onClick={() => onOpenAdminTab('featured')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isAr ? 'ترتيب وإدارة النماذج' : 'Reorder & Manage'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Featured Projects Grid or Empty State */}
        {featuredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0d121c] border border-amber-500/20">
            <Star className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              {isAr ? 'لا توجد نماذج مختارة معروضة حاليًا' : 'No Featured Works Selected'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4">
              {isAr
                ? 'يمكنك إضافة أعمال جديدة لهذا القسم أو تمييز أعمال موجودة من قسم Portfolio.'
                : 'Add a new featured work or feature existing portfolio projects from the admin panel.'}
            </p>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer shadow-lg"
              >
                {isAr ? '+ إضافة أول نموذج مميز' : '+ Add First Featured Work'}
              </button>
            ) : onOpenLoginModal ? (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-medium text-xs cursor-pointer hover:bg-white/20"
              >
                {isAr ? 'تسجيل دخول الإدارة لإضافة نماذج' : 'Admin Login to Add Works'}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                id={`featured-card-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-2xl overflow-hidden bg-[#0d121c] border border-amber-500/20 hover:border-amber-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer flex flex-col"
              >
                {/* Admin Quick Action Hover Overlay */}
                {isAuthenticated && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 left-2 z-20 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity bg-[#07090e]/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={(e) => handleEditClick(e, project)}
                      className="px-2 py-1 rounded-lg bg-[#0084ff]/20 hover:bg-[#0084ff]/40 text-[#38bdf8] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title={isAr ? 'تعديل سريع' : 'Quick Edit'}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleFeatured(e, project)}
                      className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title={isAr ? 'إلغاء من النماذج المميزة' : 'Remove from Featured'}
                    >
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{isAr ? 'إلغاء التمييز' : 'Unfeature'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleVisible(e, project)}
                      className={`p-1 rounded-lg text-[10px] font-bold flex items-center cursor-pointer transition-colors ${
                        project.visible !== false
                          ? 'bg-slate-800 text-slate-300 hover:text-white'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                      title={project.visible !== false ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار' : 'Show')}
                    >
                      {project.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                )}

                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/50">
                  <img
                    src={project.image}
                    alt={isAr ? project.titleAr : project.titleEn}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute bottom-3 inset-x-3 flex justify-between items-center pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-black shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-black" />
                      <span>{isAr ? 'مميز' : 'Featured'}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#07090e]/85 backdrop-blur-md text-[#38bdf8] border border-slate-700/60 shadow-xs">
                      {isAr ? project.categoryAr : project.categoryEn}
                    </span>
                  </div>

                  {/* Multi-image indicator */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white flex items-center gap-1 backdrop-blur-xs">
                      <Layers className="w-3 h-3 text-amber-400" />
                      <span>+{project.images.length - 1} {isAr ? 'صور' : 'more'}</span>
                    </div>
                  )}
                </div>

                {/* Text Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-200 line-clamp-1 mb-2">
                      {isAr ? project.titleAr : project.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {isAr ? project.descAr : project.descEn}
                    </p>
                  </div>

                  {/* Footer Tools & Details Link */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.tools || []).slice(0, 2).map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                      <span>{isAr ? 'عرض التفاصيل' : 'View Details'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Modal for Details */}
      {selectedProject && (
        <div
          id="featured-modal-overlay"
          className="fixed inset-0 z-50 bg-[#07090e]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            id="featured-modal-content"
            className="w-full max-w-3xl bg-[#0d121c] border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] w-full bg-black">
              <img
                src={selectedProject.image}
                alt={isAr ? selectedProject.titleAr : selectedProject.titleEn}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-black" />
                  <span>{isAr ? 'نموذج مميز' : 'Featured Work'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0084ff]/20 text-[#0084ff] border border-[#0084ff]/30">
                  {isAr ? selectedProject.categoryAr : selectedProject.categoryEn}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                {isAr ? selectedProject.titleAr : selectedProject.titleEn}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {isAr
                  ? selectedProject.descAr || selectedProject.descriptionAr
                  : selectedProject.descEn || selectedProject.descriptionEn}
              </p>

              {/* Tools & Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mb-6 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">{isAr ? 'العميل' : 'Client'}</span>
                  <span className="font-semibold text-white">
                    {isAr ? selectedProject.clientAr || 'عميل خاص' : selectedProject.clientEn || 'Private Client'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">{isAr ? 'سنة التنفيذ' : 'Year'}</span>
                  <span className="font-semibold text-white">{selectedProject.year || '2026'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-1">{isAr ? 'البرامج المستخدمة' : 'Tools'}</span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedProject.tools || ['Photoshop', 'Illustrator']).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extra images gallery if available */}
              {selectedProject.images && selectedProject.images.length > 1 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {isAr ? 'صور إضافية من المشروع' : 'Additional Project Shots'}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="rounded-lg object-cover aspect-[4/3] border border-white/10"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(null);
                      setEditingProject(selectedProject);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0084ff] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تعديل هذا العمل' : 'Edit This Project'}</span>
                  </button>
                ) : <span />}

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-Page Project Add / Edit Modal */}
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
    </section>
  );
};
