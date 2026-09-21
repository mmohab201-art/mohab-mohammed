import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  EyeOff,
  X,
  Layers,
  Star,
  Plus,
  Edit2,
  Sliders,
  Settings,
  Briefcase,
  ArrowUpRight,
} from 'lucide-react';
import { Language, ProjectItem } from '../types';
import { siteConfig } from '../data/content';
import { useBrandContent } from '../context/BrandContext';
import { useAdmin } from '../admin/AdminContext';
import { ProjectModal } from '../admin/ProjectModal';

interface PortfolioProps {
  currentLang: Language;
  onOpenAdminTab?: (tab: string) => void;
  onOpenLoginModal?: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  currentLang,
  onOpenAdminTab,
  onOpenLoginModal,
}) => {
  const isArabic = currentLang === 'ar';
  const { projects, categories } = useBrandContent();
  const { isAuthenticated, updateProject } = useAdmin();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // All category option + active database categories
  const allCategoryOption = {
    id: 'all',
    slug: 'all',
    nameAr: 'الكل',
    nameEn: 'All',
    order: 0,
    isActive: true,
  };

  const displayCategories = [
    allCategoryOption,
    ...categories.filter((c) => c.isActive !== false),
  ];

  // Filter projects (if admin is authenticated, they can see even hidden ones with a badge)
  const filteredProjects = projects.filter((p) => {
    // If not authenticated, hide visible: false
    if (!isAuthenticated && p.visible === false) return false;
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

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
    <section id="portfolio" className="py-24 sm:py-32 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0084ff]/15 border border-[#0084ff]/30 text-[#0084ff] text-xs font-bold uppercase tracking-wider mb-4">
              <Briefcase className="w-3.5 h-3.5 text-[#0084ff]" />
              <span>{isArabic ? 'القسم الثاني: أعمالي (Portfolio)' : 'Section 2: Creative Portfolio'}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {isArabic ? 'أعمالي وتصاميمي الكاملة' : 'Full Project & Design Portfolio'}
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <p className="max-w-md text-sm sm:text-base text-slate-400">
              {isArabic
                ? 'تشكيلة شاملة من المشاريع الإعلانية، المطبوعات التجارية، وتصاميم الهوية الرقمية المنفذة بأعلى معايير الإتقان.'
                : 'A curated selection of advertising campaigns, print collaterals, and brand visuals executed with high precision.'}
            </p>

            {/* Quick Admin Access Trigger if not logged in */}
            {!isAuthenticated && onOpenLoginModal && (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="text-xs text-[#0084ff] hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إدارة أعمال Portfolio (دخول المدير)' : 'Manage Portfolio (Admin Login)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dedicated In-Page Admin Control Bar for Portfolio */}
        {isAuthenticated && (
          <div
            id="portfolio-admin-bar"
            className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-[#0084ff]/10 border border-[#0084ff]/30 flex flex-wrap items-center justify-between gap-3 text-cyan-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0084ff]/20 text-[#0084ff] flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {isArabic ? 'التحكم المباشر في أعمالي (Portfolio)' : 'Direct Portfolio Management'}
                </span>
                <span className="text-[11px] text-[#38bdf8] font-mono">
                  {isArabic
                    ? `${projects.length} مشاريع مسجلة في قاعدة البيانات`
                    : `${projects.length} total projects in database`}
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
                className="px-3 py-1.5 rounded-xl bg-[#0084ff] hover:bg-[#1a90ff] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#0084ff]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isArabic ? 'إضافة مشروع جديد' : 'Add New Project'}</span>
              </button>

              {onOpenAdminTab && (
                <button
                  type="button"
                  onClick={() => onOpenAdminTab('portfolio')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#0084ff]/30 text-[#38bdf8] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'لوحة إدارة المشاريع' : 'Manage Projects'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 pb-4 border-b border-slate-800/80">
          {displayCategories.map((cat) => {
            const isActive = activeCategory === (cat.slug || cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                id={`filter-btn-${cat.id}`}
                onClick={() => setActiveCategory(cat.slug || cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0084ff] to-[#0066cc] text-white shadow-md shadow-[#0084ff]/25'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {isArabic ? cat.nameAr : cat.nameEn}
              </button>
            );
          })}
        </div>

        {/* Portfolio Grid or Empty */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0d121c] border border-slate-800">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              {isArabic ? 'لا توجد أعمال في هذا التصنيف' : 'No Projects in this category'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              {isArabic
                ? 'يمكنك إضافة أعمال جديدة أو تغيير فلتر التصنيف المختار.'
                : 'Add a new project or select a different category filter.'}
            </p>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#0084ff] text-white font-bold text-xs cursor-pointer shadow-lg"
              >
                {isArabic ? '+ إضافة مشروع لهذا التصنيف' : '+ Add Project to Category'}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`portfolio-item-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className={`group relative rounded-2xl overflow-hidden bg-[#0d121c] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0084ff]/10 cursor-pointer flex flex-col ${
                  project.visible === false
                    ? 'border-dashed border-red-500/40 opacity-75'
                    : 'border-slate-800 hover:border-[#0084ff]/50'
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
                      onClick={(e) => handleEditClick(e, project)}
                      className="px-2 py-1 rounded-lg bg-[#0084ff]/20 hover:bg-[#0084ff]/40 text-[#38bdf8] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title={isArabic ? 'تعديل المشروع' : 'Edit Project'}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleFeatured(e, project)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        project.featured
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                      title={
                        project.featured
                          ? isArabic
                            ? 'إلغاء التمييز'
                            : 'Unfeature'
                          : isArabic
                          ? 'تمييز بالصفحة الأولى'
                          : 'Feature on Home'
                      }
                    >
                      <Star className={`w-3 h-3 ${project.featured ? 'fill-amber-400' : ''}`} />
                      <span>{project.featured ? (isArabic ? 'مميز' : 'Featured') : (isArabic ? 'تمييز' : 'Feature')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleVisible(e, project)}
                      className={`p-1 rounded-lg text-[10px] font-bold flex items-center cursor-pointer transition-colors ${
                        project.visible !== false
                          ? 'bg-slate-800 text-slate-300 hover:text-white'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                      title={project.visible !== false ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'إظهار' : 'Show')}
                    >
                      {project.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                )}

                {/* Hidden indicator banner for admin */}
                {isAuthenticated && project.visible === false && (
                  <div className="absolute top-12 left-2 z-20 px-2 py-0.5 rounded bg-red-500/80 text-white text-[9px] font-bold">
                    {isArabic ? 'مخفي عن الزوار' : 'Hidden from Public'}
                  </div>
                )}

                {/* Image Container with Zoom Effect */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-slate-950">
                  <img
                    src={project.image}
                    alt={isArabic ? project.titleAr : project.titleEn}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Category Pill Tag */}
                  <div className="absolute bottom-3 inset-x-3 flex justify-between items-center">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#07090e]/85 backdrop-blur-md text-[#0084ff] border border-slate-700/60 shadow-xs">
                      {isArabic ? project.categoryAr : project.categoryEn}
                    </span>

                    {/* Featured star badge */}
                    {project.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{isArabic ? 'مميز' : 'Featured'}</span>
                      </span>
                    )}
                  </div>

                  {/* Multiple images indicator */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white flex items-center gap-1 backdrop-blur-xs">
                      <Layers className="w-3 h-3 text-[#0084ff]" />
                      <span>+{project.images.length - 1}</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#0084ff] transition-colors duration-200 line-clamp-1 mb-2">
                      {isArabic ? project.titleAr : project.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {isArabic ? project.descAr : project.descEn}
                    </p>
                  </div>

                  {/* Tools and Year */}
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

                    <span className="text-xs text-slate-400 font-mono">
                      {project.year || '2026'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Modal for Selected Project */}
      {selectedProject && (
        <div
          id="project-modal-backdrop"
          className="fixed inset-0 z-50 bg-[#07090e]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            id="project-modal-card"
            className="w-full max-w-4xl bg-[#0d121c] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Carousel / Main Image */}
            <div className="relative aspect-[16/9] w-full bg-slate-950">
              <img
                src={selectedProject.image}
                alt={isArabic ? selectedProject.titleAr : selectedProject.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                id="close-project-modal-btn"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#0084ff]/20 text-[#0084ff] border border-[#0084ff]/30">
                  {isArabic ? selectedProject.categoryAr : selectedProject.categoryEn}
                </span>
                {selectedProject.featured && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{isArabic ? 'عمل مميز' : 'Featured Work'}</span>
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                {isArabic ? selectedProject.titleAr : selectedProject.titleEn}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {isArabic
                  ? selectedProject.descAr || selectedProject.descriptionAr
                  : selectedProject.descEn || selectedProject.descriptionEn}
              </p>

              {/* Project Metadata Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-6 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">{isArabic ? 'العميل' : 'Client'}</span>
                  <span className="font-semibold text-white">
                    {isArabic ? selectedProject.clientAr || 'عميل خاص' : selectedProject.clientEn || 'Private Client'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">{isArabic ? 'سنة التنفيذ' : 'Year'}</span>
                  <span className="font-semibold text-white">{selectedProject.year || '2026'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-1">{isArabic ? 'الأدوات المستخدمة' : 'Tools Used'}</span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedProject.tools || ['Photoshop', 'Illustrator']).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extra images if available */}
              {selectedProject.images && selectedProject.images.length > 1 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {isArabic ? 'لقطات إضافية من المشروع' : 'Project Gallery'}
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
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
                    <span>{isArabic ? 'تعديل هذا المشروع' : 'Edit This Project'}</span>
                  </button>
                ) : <span />}

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                >
                  {isArabic ? 'إغلاق النافذة' : 'Close'}
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
          defaultFeatured={false}
        />
      )}
    </section>
  );
};
