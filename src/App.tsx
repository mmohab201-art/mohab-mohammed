import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { BrandProvider, useBrandContent } from './context/BrandContext';
import { AdminProvider, useAdmin } from './admin/AdminContext';
import { AdminAuthModal } from './admin/AdminAuthModal';
import { AdminDashboard } from './admin/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { FeaturedWorks } from './components/FeaturedWorks';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Gallery } from './components/Gallery';
import { AISection } from './components/AISection';
import { Contact } from './components/Contact';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { AdminFloatingBar } from './components/AdminFloatingBar';
import { ProjectModal } from './admin/ProjectModal';
import { GalleryModal } from './admin/GalleryModal';

function MainAppContent() {
  const { isAuthenticated, adminUser } = useAdmin();
  const { categories } = useBrandContent();

  // Language state with localStorage persistence
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'ar'; // Default to Arabic as requested
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('overview');
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      return (
        path === '/admin' ||
        path === '/admin.html' ||
        hash === '#admin' ||
        search.includes('admin=true')
      );
    }
    return false;
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Quick modals from floating dock
  const [floatingProjectModalOpen, setFloatingProjectModalOpen] = useState(false);
  const [floatingProjectIsFeatured, setFloatingProjectIsFeatured] = useState(false);
  const [floatingGalleryModalOpen, setFloatingGalleryModalOpen] = useState(false);

  // Synchronize URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      const isAdm =
        path === '/admin' ||
        path === '/admin.html' ||
        hash === '#admin' ||
        search.includes('admin=true');
      setIsAdminRoute(isAdm);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Synchronize document dir and lang attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLang;
      try {
        localStorage.setItem('language', currentLang);
      } catch (e) {
        console.warn('localStorage not available', e);
      }
    }
  }, [currentLang]);

  // Active section observer on scroll (only in public view)
  useEffect(() => {
    if (isAdminRoute && isAuthenticated) return;

    const sections = [
      'hero',
      'about',
      'featured-works',
      'services',
      'portfolio',
      'gallery',
      'ai-design',
      'contact',
    ];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminRoute, isAuthenticated]);

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleOpenAdmin = (tab = 'overview') => {
    setAdminActiveTab(tab);
    if (isAuthenticated) {
      setIsAdminRoute(true);
      if (window.location.hash !== '#admin') {
        window.history.pushState(null, '', '#admin');
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminRoute(false);
    setShowLoginModal(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  // If on admin route and authenticated: render complete Admin Dashboard
  if (isAdminRoute && isAuthenticated) {
    return (
      <AdminDashboard
        currentLang={currentLang}
        onLanguageToggle={toggleLanguage}
        onCloseToPublic={handleCloseAdmin}
        initialTab={adminActiveTab}
      />
    );
  }

  // If on admin route but not authenticated: show Login Modal on top of public site
  return (
    <div
      id="mohab-brand-app"
      className="min-h-screen bg-[#07090e] text-[#f1f5f9] flex flex-col selection:bg-[#0084ff]/30 selection:text-white relative"
    >
      {/* Sticky Top Header Navigation */}
      <Navbar
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        activeSection={activeSection}
        onOpenAdmin={() => handleOpenAdmin('overview')}
      />

      {/* Main Page Sections */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Full-width Hero Section with responsive live background & right alignment */}
        <Hero currentLang={currentLang} />

        {/* About Section with Mohab's Portrait Photo */}
        <About currentLang={currentLang} />

        {/* 1. نماذج مختارة من الأعمال والتصاميم (Featured Works) */}
        <FeaturedWorks
          currentLang={currentLang}
          onOpenAdminTab={(tab) => handleOpenAdmin(tab)}
          onOpenLoginModal={() => setShowLoginModal(true)}
        />

        {/* 8 Specialized Creative Services */}
        <Services currentLang={currentLang} />

        {/* 2. Portfolio / أعمالي (Categorized Showcase Grid & Project Modal) */}
        <Portfolio
          currentLang={currentLang}
          onOpenAdminTab={(tab) => handleOpenAdmin(tab)}
          onOpenLoginModal={() => setShowLoginModal(true)}
        />

        {/* 3. معرض الأعمال / Gallery (Grid with Full-Screen Lightbox) */}
        <Gallery
          currentLang={currentLang}
          onOpenAdminTab={(tab) => handleOpenAdmin(tab)}
          onOpenLoginModal={() => setShowLoginModal(true)}
        />

        {/* AI × Design Workflow Section */}
        <AISection currentLang={currentLang} />

        {/* Contact Section with Phone, WhatsApp, Facebook, and Form */}
        <Contact currentLang={currentLang} />

        {/* Newsletter Subscription */}
        <Newsletter currentLang={currentLang} />
      </main>

      {/* Official Footer with Discrete Admin Login Button */}
      <Footer currentLang={currentLang} onOpenAdmin={() => handleOpenAdmin('overview')} />

      {/* Floating Bottom Admin Control Dock (Direct Control Over All 3 Sections) */}
      <AdminFloatingBar
        currentLang={currentLang}
        onOpenAdminPanel={(tab) => handleOpenAdmin(tab || 'overview')}
        onOpenNewProject={(isFeatured) => {
          setFloatingProjectIsFeatured(!!isFeatured);
          setFloatingProjectModalOpen(true);
        }}
        onOpenNewGallery={() => setFloatingGalleryModalOpen(true)}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* Quick Project Modal from Dock */}
      {floatingProjectModalOpen && (
        <ProjectModal
          currentLang={currentLang}
          project={null}
          categories={categories}
          isOpen={floatingProjectModalOpen}
          onClose={() => setFloatingProjectModalOpen(false)}
          defaultFeatured={floatingProjectIsFeatured}
        />
      )}

      {/* Quick Gallery Modal from Dock */}
      {floatingGalleryModalOpen && (
        <GalleryModal
          currentLang={currentLang}
          item={null}
          categories={categories}
          isOpen={floatingGalleryModalOpen}
          onClose={() => setFloatingGalleryModalOpen(false)}
        />
      )}

      {/* Admin Login Modal (Triggered when user clicks Admin or visits #admin while logged out) */}
      {(showLoginModal || (isAdminRoute && !isAuthenticated)) && (
        <AdminAuthModal
          currentLang={currentLang}
          onClose={handleCloseAdmin}
          onSuccess={() => {
            setShowLoginModal(false);
            setIsAdminRoute(true);
            if (window.location.hash !== '#admin') {
              window.history.pushState(null, '', '#admin');
            }
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrandProvider>
      <AdminProvider>
        <MainAppContent />
      </AdminProvider>
    </BrandProvider>
  );
}
