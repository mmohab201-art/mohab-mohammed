import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { DashboardOverview } from './DashboardOverview';
import { FeaturedWorksTab } from './FeaturedWorksTab';
import { PortfolioTab } from './PortfolioTab';
import { GalleryTab } from './GalleryTab';
import { CategoriesTab } from './CategoriesTab';
import { BrandAssetsTab } from './BrandAssetsTab';
import { SettingsTab } from './SettingsTab';
import { Language } from '../types';
import {
  LayoutDashboard,
  Star,
  Briefcase,
  Image as ImageIcon,
  FolderTree,
  Sliders,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Globe,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  currentLang: Language;
  onLanguageToggle: () => void;
  onCloseToPublic: () => void;
  initialTab?: string;
}

export const AdminDashboard: React.FC<Props> = ({
  currentLang,
  onLanguageToggle,
  onCloseToPublic,
  initialTab,
}) => {
  const { adminUser, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<string>(initialTab || 'overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = currentLang === 'ar';

  const menuItems = [
    { id: 'overview', labelAr: 'الرئيسية والإحصائيات', labelEn: 'Overview', icon: LayoutDashboard },
    { id: 'featured', labelAr: 'نماذج مختارة من أعمالي', labelEn: 'Featured Works', icon: Star },
    { id: 'portfolio', labelAr: 'معرض الأعمال (Portfolio)', labelEn: 'Portfolio', icon: Briefcase },
    { id: 'gallery', labelAr: 'معرض الصور (Gallery)', labelEn: 'Gallery', icon: ImageIcon },
    { id: 'categories', labelAr: 'التصنيفات والأقسام', labelEn: 'Categories', icon: FolderTree },
    { id: 'branding', labelAr: 'الهوية البصرية والـ Hero', labelEn: 'Brand Assets & Hero', icon: Sliders },
    { id: 'settings', labelAr: 'النسخ الاحتياطي والنظام', labelEn: 'Backup & Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div
      id="admin-dashboard-container"
      className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row antialiased"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0d121c] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0084ff]/20 text-[#0084ff] flex items-center justify-center font-bold">
            M
          </div>
          <span className="text-sm font-bold text-white">
            {isAr ? 'لوحة تحكم مهاب محمد' : 'Mohab Studio Admin'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLanguageToggle}
            className="p-2 rounded-lg bg-white/5 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 z-50 md:static w-72 bg-[#0d121c] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          isAr ? 'md:border-l md:border-r-0' : 'md:border-r'
        } ${
          mobileMenuOpen
            ? 'translate-x-0'
            : isAr
            ? 'translate-x-full md:translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0084ff] to-[#ff7700] p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#0d121c] rounded-[10px] flex items-center justify-center font-black text-white text-base">
                  M
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  {isAr ? 'مهاب محمد' : 'Mohab Mohammed'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {isAr ? 'المصمم الإبداعي' : 'Creative Director'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="truncate">{adminUser?.email || 'mmohab1997@gmail.com'}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0084ff] to-[#0066cc] text-white shadow-lg shadow-[#0084ff]/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Public website link */}
          <button
            id="admin-sidebar-public-link"
            onClick={onCloseToPublic}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#0084ff]" />
              <span>{isAr ? 'عرض الموقع العام' : 'View Public Site'}</span>
            </span>
            <span className="text-[10px] text-slate-500">Live</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onLanguageToggle}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAr ? 'Switch to English' : 'التحويل للغة العربية'}</span>
          </button>

          {/* Logout */}
          <button
            id="admin-sidebar-logout"
            onClick={logout}
            className="w-full px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Desktop Top Nav Bar */}
        <div className="hidden md:flex items-center justify-between pb-6 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isAr ? 'لوحة التحكم' : 'Admin Panel'}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-white">
              {isAr
                ? menuItems.find((m) => m.id === activeTab)?.labelAr
                : menuItems.find((m) => m.id === activeTab)?.labelEn}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCloseToPublic}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#0084ff]" />
              <span>{isAr ? 'معاينة الموقع العام' : 'View Public Site'}</span>
            </button>
            <button
              onClick={onLanguageToggle}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Tab Router */}
        {activeTab === 'overview' && (
          <DashboardOverview currentLang={currentLang} onNavigateTab={handleTabClick} />
        )}
        {activeTab === 'featured' && <FeaturedWorksTab currentLang={currentLang} />}
        {activeTab === 'portfolio' && <PortfolioTab currentLang={currentLang} />}
        {activeTab === 'gallery' && <GalleryTab currentLang={currentLang} />}
        {activeTab === 'categories' && <CategoriesTab currentLang={currentLang} />}
        {activeTab === 'branding' && <BrandAssetsTab currentLang={currentLang} />}
        {activeTab === 'settings' && <SettingsTab currentLang={currentLang} />}
      </main>
    </div>
  );
};
