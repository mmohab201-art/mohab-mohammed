import React from 'react';
import {
  Palette,
  Megaphone,
  Share2,
  Sparkles,
  Printer,
  Layers,
  Cpu,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { Language } from '../types';
import { servicesData } from '../data/content';

interface ServicesProps {
  currentLang: Language;
}

const iconMap: Record<string, React.ElementType> = {
  Palette,
  Megaphone,
  Share2,
  Sparkles,
  Printer,
  Layers,
  Cpu,
  Eye,
};

export const Services: React.FC<ServicesProps> = ({ currentLang }) => {
  const isArabic = currentLang === 'ar';

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#ff6b00]/15 border border-[#ff6b00]/30 text-[#ff6b00] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span>{isArabic ? 'خدماتي الإبداعية' : 'Creative Services'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            {isArabic ? 'حلول بصرية متكاملة تحول أفكارك لواقع' : 'End-to-End Visual Solutions for Ambitious Brands'}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            {isArabic
              ? 'مجموعة من الخدمات المتخصصة تجمع بين الخبرة الفنية في برامج أدوبي وقوة تقنيات الذكاء الاصطناعي التوليدي.'
              : 'Specialized services uniting master-level Adobe craftsmanship with next-generation generative AI innovation.'}
          </p>
        </div>

        {/* The 8 Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Palette;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative p-6 sm:p-7 rounded-2xl bg-[#0d121c] border border-slate-800/80 hover:border-[#0084ff]/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0084ff]/10 flex flex-col justify-between"
              >
                {/* Subtle top card accent line on hover */}
                <div className="absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#0084ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Top Bar: Icon + Sequential Number Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-[#0084ff] group-hover:text-[#ff6b00] group-hover:border-[#ff6b00]/40 transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-500 group-hover:text-slate-400">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#38bdf8] transition-colors duration-200">
                    {isArabic ? service.titleAr : service.titleEn}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {isArabic ? service.descAr : service.descEn}
                  </p>
                </div>

                {/* Card Footer: Badge + Arrow */}
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-300 bg-slate-850 px-2.5 py-1 rounded-md border border-slate-700/50">
                    {isArabic ? service.badgeAr : service.badgeEn}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#0084ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
