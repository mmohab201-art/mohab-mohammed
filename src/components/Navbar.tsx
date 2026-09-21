import React, { useState, useEffect } from 'react';
import { Menu, X, MessageSquare, Globe, Lock } from 'lucide-react';
import { Language } from '../types';
import { siteConfig } from '../data/content';
import { Logo } from './Logo';

interface NavbarProps {
  currentLang: Language;
  onToggleLang: () => void;
  activeSection: string;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onToggleLang,
  activeSection,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', labelAr: 'الرئيسية', labelEn: 'Home', href: '#hero' },
    { id: 'about', labelAr: 'من أنا', labelEn: 'About', href: '#about' },
    { id: 'featured-works', labelAr: 'نماذج مختارة', labelEn: 'Featured', href: '#featured-works' },
    { id: 'services', labelAr: 'الخدمات', labelEn: 'Services', href: '#services' },
    { id: 'portfolio', labelAr: 'أعمالي', labelEn: 'Portfolio', href: '#portfolio' },
    { id: 'gallery', labelAr: 'المعرض', labelEn: 'Gallery', href: '#gallery' },
    { id: 'ai-design', labelAr: 'AI × Design', labelEn: 'AI × Design', href: '#ai-design' },
    { id: 'contact', labelAr: 'تواصل معي', labelEn: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07090e]/90 backdrop-blur-md shadow-lg shadow-black/40 border-b border-slate-800/80 py-2.5'
          : 'bg-gradient-to-b from-[#07090e]/80 via-[#07090e]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo with high prominence */}
          <div className="flex items-center">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  id={`nav-link-${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-white bg-[#0084ff]/15 border border-[#0084ff]/30 shadow-sm shadow-[#0084ff]/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {currentLang === 'ar' ? link.labelAr : link.labelEn}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs: Language Switcher, WhatsApp & Admin Access */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick WhatsApp */}
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-quick-whatsapp"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 transition-all duration-200"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Language Switcher Button (AR / EN) */}
            <button
              type="button"
              id="lang-toggle-btn"
              onClick={onToggleLang}
              aria-label="Toggle language between Arabic and English"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#0084ff]" />
              <span className="uppercase tracking-wider">
                {currentLang === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>

            {/* Discrete Admin Dashboard Quick Access Button */}
            {onOpenAdmin && (
              <button
                type="button"
                id="nav-admin-btn"
                onClick={onOpenAdmin}
                title={currentLang === 'ar' ? 'لوحة التحكم (Admin)' : 'Admin Dashboard'}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/5 hover:bg-[#0084ff]/20 border border-white/10 hover:border-[#0084ff]/40 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#ff7700]" />
                <span className="hidden xl:inline font-mono text-[11px]">Admin</span>
              </button>
            )}

            {/* Mobile menu hamburger button */}
            <button
              type="button"
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0084ff]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden fixed inset-x-0 top-[65px] bg-[#07090e]/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl p-5 space-y-3 z-40 transition-all duration-200"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                    isActive
                      ? 'text-white bg-[#0084ff]/20 border border-[#0084ff]/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {currentLang === 'ar' ? link.labelAr : link.labelEn}
                </a>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/10"
              >
                <Lock className="w-4 h-4 text-[#ff7700]" />
                <span>{currentLang === 'ar' ? 'لوحة تحكم الموقع (Admin)' : 'Admin Dashboard'}</span>
              </button>
            )}
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="mobile-whatsapp-btn"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-600"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
