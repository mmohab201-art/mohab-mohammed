import React, { useRef } from 'react';
import { Sparkles, Cpu, Layers, Eye } from 'lucide-react';
import { Language } from '../types';
import { siteConfig } from '../data/content';
import { useBrandContent } from '../context/BrandContext';

interface AboutProps {
  currentLang: Language;
}

export const About: React.FC<AboutProps> = ({ currentLang }) => {
  const isArabic = currentLang === 'ar';
  const { branding } = useBrandContent();
  const profileConfig = branding?.profile;

  const portraitSrc = profileConfig?.activeUrl || '/assets/images/mohab_portrait.jpg';
  const positionX = typeof profileConfig?.positionX === 'number' ? profileConfig.positionX : 50;
  const positionY = typeof profileConfig?.positionY === 'number' ? profileConfig.positionY : 20;
  const objectFit = profileConfig?.objectFit || 'cover';
  const altText = profileConfig?.altText || 'Mohab Mohammed Original Portrait';

  const pillars = [
    {
      icon: Eye,
      titleAr: 'الرؤية البصرية',
      titleEn: 'Visual Vision',
      descAr: 'تحويل الأفكار المجردة إلى لغة بصرية متماسكة تترك أثراً دائماً في ذهن المتلقي.',
      descEn: 'Translating abstract ideas into a coherent visual language that resonates deeply.',
    },
    {
      icon: Cpu,
      titleAr: 'دمج الذكاء الاصطناعي',
      titleEn: 'AI Synergy',
      descAr: 'استثمار قوة الذكاء الاصطناعي كأداة إبداعية تعزز السرعة والتجريب والابتكار.',
      descEn: 'Harnessing generative AI as a catalyst to amplify experimentation and innovation.',
    },
    {
      icon: Layers,
      titleAr: 'دقة التنفيذ (Photoshop)',
      titleEn: 'Photoshop Craft',
      descAr: 'إتقان تفاصيل الإضاءة والدمج واللون بدقة متناهية تليق بأرقى العلامات التجارية.',
      descEn: 'Obsessive attention to lighting, color grading, and composition to deliver perfection.',
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#0a0e17] relative overflow-hidden">
      {/* Subtle background glow accents */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-[#0084ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-48 w-96 h-96 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Portrait Image Column (5 cols on Desktop) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Decorative dynamic neon frame accent */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#0084ff] via-[#38bdf8] to-[#ff6b00] rounded-3xl opacity-30 group-hover:opacity-60 blur-xl transition-all duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 transition-all duration-300 bg-[#07090e] shadow-2xl">
                <img
                  src={portraitSrc}
                  alt={altText}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  style={{
                    objectFit: objectFit,
                    objectPosition: `${positionX}% ${positionY}%`,
                  }}
                  className="w-full h-auto aspect-square filter saturate-[1.05] contrast-[1.02] transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Floating badge over photo */}
                <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-xl bg-[#07090e]/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-between text-xs z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-white">
                      {isArabic ? 'متاح للمشاريع الإبداعية' : 'Available for Creative Projects'}
                    </span>
                  </div>
                  <span className="text-[#38bdf8] font-mono font-medium">Cairo, Egypt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Information Column (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0084ff]/15 border border-[#0084ff]/30 text-[#0084ff] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>{isArabic ? 'من أنا' : 'About Me'}</span>
            </div>

            {/* Heading: Mohab Mohammed */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {siteConfig.name}
                <span className="text-[#0084ff] ml-2">.</span>
              </h2>
              <p className="text-lg sm:text-xl font-semibold text-slate-300 mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#ff9e00] to-[#ff6b00]">
                {isArabic ? siteConfig.taglineAr : siteConfig.taglineEn}
              </p>
            </div>

            {/* Core Philosophy Paragraphs */}
            <div className="space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              <p className="border-r-2 rtl:border-r-2 ltr:border-l-2 ltr:border-r-0 border-[#0084ff] px-4 py-1 bg-slate-900/40 rounded-r-none rtl:rounded-r-none ltr:rounded-l-none">
                {isArabic ? siteConfig.heroBioAr : siteConfig.heroBioEn}
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                {isArabic ? siteConfig.detailedBioAr : siteConfig.detailedBioEn}
              </p>
            </div>

            {/* Domains Pills */}
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
                {isArabic ? 'مجالات العمل والتخصص' : 'Core Disciplines & Expertise'}
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {['Graphic Design', 'Photoshop', 'Illustrator', 'AI Creative', 'Visual Content'].map((domain) => (
                  <span
                    key={domain}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 border border-slate-700/70 hover:border-[#0084ff]/50 hover:bg-slate-800 transition-colors duration-200"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* 3 Visual Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5 text-[#0084ff] mb-2" />
                    <h3 className="text-sm font-bold text-white mb-1">
                      {isArabic ? pillar.titleAr : pillar.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isArabic ? pillar.descAr : pillar.descEn}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
