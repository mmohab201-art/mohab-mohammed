import React, { useState } from 'react';
import { useAdmin } from '../admin/AdminContext';
import { useBrandContent } from '../context/BrandContext';
import { Language } from '../types';
import {
  Sliders,
  Star,
  Briefcase,
  Image as ImageIcon,
  Plus,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Lock,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  currentLang: Language;
  onOpenAdminPanel: (tab?: string) => void;
  onOpenNewProject: (isFeatured?: boolean) => void;
  onOpenNewGallery: () => void;
  onOpenLogin: () => void;
}

export const AdminFloatingBar: React.FC<Props> = ({
  currentLang,
  onOpenAdminPanel,
  onOpenNewProject,
  onOpenNewGallery,
  onOpenLogin,
}) => {
  const { isAuthenticated, logout, adminUser } = useAdmin();
  const { projects, featuredProjects, gallery } = useBrandContent();
  const isAr = currentLang === 'ar';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If NOT authenticated, show a sleek pill button in the bottom corner
  if (!isAuthenticated) {
    return (
      <aside
        aria-label={isAr ? 'وصول سريع للوحة الإدارة' : 'Quick Admin Access'}
        id="public-admin-launcher"
        className="fixed bottom-4 left-4 z-40"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onOpenLogin}
          className="group px-3.5 py-2 rounded-full bg-[#0d121c]/90 hover:bg-[#111827] border border-[#0084ff]/40 hover:border-[#0084ff] text-slate-300 hover:text-white shadow-xl shadow-black/50 backdrop-blur-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
        >
          <div className="w-5 h-5 rounded-full bg-[#0084ff]/20 text-[#0084ff] flex items-center justify-center">
            <Lock className="w-3 h-3" />
          </div>
          <span>{isAr ? 'لوحة تحكم الموقع والأعمال' : 'Admin & Content Management'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </aside>
    );
  }

  // If Authenticated: show rich, full direct-control floating dock
  return (
    <aside
      aria-label={isAr ? 'شريط التحكم المباشر' : 'Direct Control Toolbar'}
      id="admin-live-dock"
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-5xl w-full"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="bg-[#0d121c]/95 border border-[#0084ff]/40 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-md p-2.5 sm:p-3 text-white">
        {/* Top Mini Header / Collapse Toggle */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#0084ff] to-[#ff7700] p-0.5">
              <div className="w-full h-full bg-[#0d121c] rounded-[6px] flex items-center justify-center font-bold text-[10px] text-white">
                M
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-200">
                {isAr ? 'التحكم المباشر في الأقسام الثلاثة' : 'Direct Live Control'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{adminUser?.email || 'Admin'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAdminPanel('overview')}
              className="px-2.5 py-1 rounded-lg bg-[#0084ff]/15 hover:bg-[#0084ff]/25 border border-[#0084ff]/30 text-[#0084ff] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{isAr ? 'فتح اللوحة الكاملة' : 'Full Dashboard'}</span>
            </button>

            <button
              onClick={logout}
              className="p-1 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isCollapsed ? (isAr ? 'توسيع' : 'Expand') : (isAr ? 'طي' : 'Collapse')}
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Action Buttons for the 3 Required Sections */}
        {!isCollapsed && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* 3 Section Jump / Manage Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* 1. Featured Works Shortcut */}
              <button
                type="button"
                onClick={() => {
                  scrollToSection('featured-works');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isAr ? 'الانتقال إلى قسم النماذج المختارة' : 'Jump to Featured Works'}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{isAr ? '1. نماذج مختارة' : '1. Featured'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-mono font-bold">
                  {featuredProjects.length}
                </span>
              </button>

              {/* 2. Portfolio Shortcut */}
              <button
                type="button"
                onClick={() => {
                  scrollToSection('portfolio');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#0084ff]/10 hover:bg-[#0084ff]/20 border border-[#0084ff]/30 text-[#0084ff] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isAr ? 'الانتقال إلى قسم أعمالي' : 'Jump to Portfolio'}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{isAr ? '2. أعمالي (Portfolio)' : '2. Portfolio'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#0084ff]/20 text-[10px] font-mono font-bold">
                  {projects.length}
                </span>
              </button>

              {/* 3. Gallery Shortcut */}
              <button
                type="button"
                onClick={() => {
                  scrollToSection('gallery');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isAr ? 'الانتقال إلى معرض الصور' : 'Jump to Gallery'}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{isAr ? '3. معرض الصور (Gallery)' : '3. Gallery'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-[10px] font-mono font-bold">
                  {gallery.length}
                </span>
              </button>
            </div>

            {/* Quick Creation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenNewProject(true)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? '+ نموذج مميز' : '+ Featured'}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenNewProject(false)}
                className="px-2.5 py-1.5 rounded-xl bg-[#0084ff] hover:bg-[#1a90ff] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-[#0084ff]/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? '+ عمل جديد' : '+ Project'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenNewGallery}
                className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? '+ صورة للمعرض' : '+ Gallery Photo'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
