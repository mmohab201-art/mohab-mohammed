import React from 'react';
import { useAdmin } from './AdminContext';
import { Briefcase, Star, Image as ImageIcon, EyeOff, Plus, Sparkles, Sliders, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<Props> = ({ currentLang, onNavigateTab }) => {
  const { stats, branding, projects, gallery } = useAdmin();
  const isAr = currentLang === 'ar';

  const cards = [
    {
      id: 'stat-total-works',
      title: isAr ? 'إجمالي الأعمال' : 'Total Works',
      value: stats.totalWorks,
      icon: Briefcase,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30',
      tab: 'portfolio',
    },
    {
      id: 'stat-featured-works',
      title: isAr ? 'الأعمال المميزة' : 'Featured Works',
      value: stats.featuredWorks,
      icon: Star,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
      tab: 'featured',
    },
    {
      id: 'stat-gallery-photos',
      title: isAr ? 'صور المعرض' : 'Gallery Items',
      value: stats.galleryCount,
      icon: ImageIcon,
      color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
      tab: 'gallery',
    },
    {
      id: 'stat-hidden-works',
      title: isAr ? 'أعمال مخفية' : 'Hidden Items',
      value: stats.hiddenWorks,
      icon: EyeOff,
      color: 'from-slate-500/20 to-slate-600/10 text-slate-400 border-slate-500/30',
      tab: 'portfolio',
    },
  ];

  return (
    <div id="admin-dashboard-overview" className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0d121c] via-[#101826] to-[#0d121c] border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0084ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0084ff]/15 border border-[#0084ff]/30 text-[#0084ff] text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'مركز التحكم بالمحتوى الرقمي' : 'Digital Content Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {isAr ? 'أهلاً بك، مهاب محمد 👋' : 'Welcome, Mohab Mohammed 👋'}
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              {isAr
                ? 'تحكم كامل في جميع أعمالك وتصاميمك ومعرض الصور والهوية البصرية بدون الحاجة إلى تعديل الأكواد. تنعكس جميع التغييرات مباشرة وبشكل حي على الموقع.'
                : 'Complete control over your portfolio projects, gallery showcases, and brand identity assets without manual code changes. Live instant synchronization.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              id="dash-quick-add-project"
              onClick={() => onNavigateTab('portfolio')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0084ff] to-[#0066cc] text-white text-xs sm:text-sm font-medium hover:brightness-110 flex items-center gap-2 shadow-lg shadow-[#0084ff]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة عمل جديد' : 'New Project'}</span>
            </button>
            <button
              id="dash-quick-brand-assets"
              onClick={() => onNavigateTab('branding')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#ff7700]" />
              <span>{isAr ? 'الهوية البصرية والـ Hero' : 'Brand Assets & Hero'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              id={c.id}
              onClick={() => onNavigateTab(c.tab)}
              className={`p-5 sm:p-6 rounded-2xl bg-[#0d121c] border transition-all hover:-translate-y-0.5 cursor-pointer shadow-lg bg-gradient-to-br ${c.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm text-slate-300 font-medium">{c.title}</span>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {c.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Assets Quick Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{isAr ? 'حالة الأصول والهوية البصرية النشطة' : 'Active Brand Assets Status'}</span>
          </h2>
          <button
            onClick={() => onNavigateTab('branding')}
            className="text-xs text-[#0084ff] hover:underline flex items-center gap-1"
          >
            <span>{isAr ? 'إدارة الهوية الكاملة' : 'Manage All Assets'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Logo Status */}
          <div
            onClick={() => onNavigateTab('branding')}
            className="p-5 rounded-2xl bg-[#0d121c] border border-white/10 hover:border-[#0084ff]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isAr ? 'الشعار النشط (Logo)' : 'Active Logo'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                {isAr ? 'نشط' : 'Active'}
              </span>
            </div>
            <div className="h-28 rounded-xl bg-[#07090e] border border-white/5 flex items-center justify-center p-3 relative overflow-hidden group-hover:border-[#0084ff]/30 transition-all">
              <img
                src={branding.logo.activeUrl}
                alt={branding.logo.altText}
                className="max-h-20 max-w-full object-contain filter drop-shadow-md"
              />
            </div>
            <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
              <span>{isAr ? 'عرض الشعار على الديسكتوب:' : 'Desktop Width:'} {branding.logo.widthDesktop}px</span>
              <span className="text-[#0084ff] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Profile Status */}
          <div
            onClick={() => onNavigateTab('branding')}
            className="p-5 rounded-2xl bg-[#0d121c] border border-white/10 hover:border-[#0084ff]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isAr ? 'الصورة الشخصية (Portrait)' : 'Active Portrait'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                {isAr ? 'نشطة' : 'Active'}
              </span>
            </div>
            <div className="h-28 rounded-xl bg-[#07090e] border border-white/5 flex items-center justify-center p-2 relative overflow-hidden group-hover:border-[#0084ff]/30 transition-all">
              <img
                src={branding.profile.activeUrl}
                alt={branding.profile.altText}
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-md"
                style={{
                  objectPosition: `${branding.profile.positionX}% ${branding.profile.positionY}%`,
                }}
              />
            </div>
            <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
              <span>{isAr ? 'الموضع:' : 'Position:'} X={branding.profile.positionX}% Y={branding.profile.positionY}%</span>
              <span className="text-[#0084ff] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Hero Background Status */}
          <div
            onClick={() => onNavigateTab('branding')}
            className="p-5 rounded-2xl bg-[#0d121c] border border-white/10 hover:border-[#0084ff]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isAr ? 'خلفية الـ Hero (Background)' : 'Active Hero BG'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                {isAr ? 'نشطة' : 'Active'}
              </span>
            </div>
            <div className="h-28 rounded-xl bg-[#07090e] border border-white/5 relative overflow-hidden group-hover:border-[#0084ff]/30 transition-all">
              <img
                src={branding.hero.activeUrl}
                alt={branding.hero.altText}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `${branding.hero.desktopPosition.x}% ${branding.hero.desktopPosition.y}%`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-4">
                <span className="text-[11px] font-bold text-white truncate max-w-[80%]">
                  مهاب محمد — مصمم جرافيك
                </span>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
              <span>{isAr ? 'ارتفاع Hero:' : 'Hero Height:'} {branding.hero.heroHeightDesktop}px</span>
              <span className="text-[#0084ff] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Snippet */}
      <div className="bg-[#0d121c] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {isAr ? 'أحدث الأعمال في الموقع' : 'Latest Projects'}
          </h2>
          <button
            onClick={() => onNavigateTab('portfolio')}
            className="text-xs text-[#0084ff] hover:underline"
          >
            {isAr ? 'عرض الكل' : 'View all'}
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {projects.slice(0, 4).map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={p.image}
                  alt={p.titleAr}
                  className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {isAr ? p.titleAr : p.titleEn}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {isAr ? p.categoryAr : p.categoryEn}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                    {isAr ? 'مميز' : 'Featured'}
                  </span>
                )}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
