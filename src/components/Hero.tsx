import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { useBrandContent } from '../context/BrandContext';

interface HeroProps {
  currentLang: Language;
}

export const Hero: React.FC<HeroProps> = ({ currentLang }) => {
  const isArabic = currentLang === 'ar';
  const { branding } = useBrandContent();

  const logoSrc = branding?.logo?.activeUrl || '/assets/images/mohab_logo.png';
  const bgTextureSrc = branding?.hero?.activeUrl || '/assets/images/hero_banner.jpg';

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      aria-label={isArabic ? 'القسم الرئيسي' : 'Hero Section'}
      className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#07090e] pt-28 pb-20 lg:py-32"
    >
      {/* =========================================================================
          CINEMATIC BACKGROUND LAYERS
          Minimal, atmospheric studio depth with subtle ambient lighting
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
        {/* Cinematic Background Texture at gentle opacity */}
        <img
          src={bgTextureSrc}
          alt=""
          role="presentation"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          className="w-full h-full object-cover object-center opacity-[0.12] filter contrast-[1.05] saturate-[1.02] scale-[1.01]"
        />

        {/* Ambient Lighting Accents: Soft Blue & Gentle Warm Amber */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[26rem] bg-[#0084ff]/[0.07] rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 w-[30rem] h-[22rem] bg-[#ff7700]/[0.04] rounded-full blur-[150px]" />

        {/* Cinematic Vignettes */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#07090e] via-[#07090e]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#07090e] via-[#07090e]/90 to-transparent" />

        {/* Minimal Grid Accent Overlay for Creative Designer Touch */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Subtle dark gradient overlay ensuring pristine readability */}
        <div className="absolute inset-0 bg-[#07090e]/65 backdrop-blur-[0.5px]" />
      </div>

      {/* =========================================================================
          HERO MAIN CONTENT CONTAINER
          Clean, Centered, Elegant Typographic Hierarchy & Generous Whitespace
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* 1. BRAND IDENTITY & LOGO */}
        <div className="inline-flex items-center gap-3.5 mb-6 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-sm">
          <img
            src={logoSrc}
            alt="MOHAB MOHAMMED Logo"
            referrerPolicy="no-referrer"
            className="h-7 sm:h-8 w-auto object-contain opacity-95 filter drop-shadow-sm"
          />
          <div className="h-3.5 w-px bg-slate-700/80" />
          <span
            id="hero-designer-name"
            className="font-mono text-xs sm:text-sm font-bold tracking-[0.24em] text-slate-200 uppercase select-none"
          >
            MOHAB MOHAMMED
          </span>
        </div>

        {/* 2. MAIN HEADLINE (Largest text element, Arabic typography) */}
        <h1
          id="hero-main-headline"
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.2] sm:leading-[1.18] mb-6 max-w-4xl text-balance drop-shadow-sm"
        >
          {isArabic ? 'أحوّل الأفكار إلى واقع بصري.' : 'Turning Ideas into Visual Reality.'}
        </h1>

        {/* 3. PROFESSIONAL TITLE */}
        <div className="inline-flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-[#0084ff] shrink-0 opacity-80" />
          <p
            id="hero-professional-title"
            className="text-base sm:text-xl md:text-2xl font-semibold text-slate-200 tracking-wide text-balance"
          >
            {isArabic
              ? 'مصمم جرافيك وصانع محتوى بصري — Graphic Design • AI Creative • Photoshop'
              : 'Graphic Designer & Visual Content Creator — Graphic Design • AI Creative • Photoshop'}
          </p>
        </div>

        {/* 4. SUPPORTING DESCRIPTION (Max width around 550-650px) */}
        <p
          id="hero-supporting-description"
          className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed max-w-[640px] mb-10 font-normal text-pretty"
        >
          {isArabic
            ? 'أحوّل الأفكار إلى تصاميم بصرية احترافية، وأدمج بين التصميم الإبداعي والذكاء الاصطناعي لصناعة محتوى مميز يجمع بين قوة الفكرة وجودة التنفيذ.'
            : 'I transform ideas into professional visual designs, blending creative design craft with artificial intelligence to produce distinctive content combining conceptual power with execution excellence.'}
        </p>

        {/* 5. HERO CTA BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mb-12">
          {/* Primary CTA: "استكشف أعمالي" */}
          <button
            type="button"
            id="hero-primary-cta"
            onClick={() => scrollToSection('#featured-works')}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-[#0084ff] hover:bg-[#0070d9] shadow-lg shadow-[#0084ff]/25 hover:shadow-[#0084ff]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{isArabic ? 'استكشف أعمالي' : 'Explore My Work'}</span>
            {isArabic ? (
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </button>

          {/* Secondary CTA: "تواصل معي" */}
          <button
            type="button"
            id="hero-secondary-cta"
            onClick={() => scrollToSection('#contact')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-slate-700/80 hover:border-slate-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{isArabic ? 'تواصل معي' : 'Contact Me'}</span>
          </button>
        </div>

        {/* Status indicator below CTAs */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {isArabic
              ? 'متاح للمشاريع الجديدة والتعاقدات الإبداعية'
              : 'Available for New Projects & Creative Contracts'}
          </span>
        </div>
      </div>

      {/* Floating Scroll Cue */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => scrollToSection('#about')}
          className="text-slate-400 hover:text-slate-200 flex flex-col items-center gap-1 cursor-pointer"
          aria-label="Scroll down to about"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">
            {isArabic ? 'التمرير للأسفل' : 'Scroll Down'}
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-[#0084ff] animate-bounce" />
        </button>
      </div>
    </section>
  );
};
