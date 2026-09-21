import React from 'react';
import { Phone, MessageSquare, Mail, Facebook, ArrowUp, Lock } from 'lucide-react';
import { Language } from '../types';
import { siteConfig } from '../data/content';
import { Logo } from './Logo';

interface FooterProps {
  currentLang: Language;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onOpenAdmin }) => {
  const isArabic = currentLang === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#05070a] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <Logo size="lg" />

            <div className="pt-2">
              <h4 className="text-base font-bold text-white">
                {siteConfig.name}
                <span className="text-xs font-normal text-slate-400 mx-2">|</span>
                <span className="text-xs font-medium text-slate-300">{siteConfig.nameAr}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#0084ff] font-semibold mt-0.5">
                Graphic Designer • AI Creative • Photoshop Expert • Visual Designer
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {isArabic ? siteConfig.heroBioAr : siteConfig.heroBioEn}
            </p>
          </div>

          {/* Quick Links Col (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isArabic ? 'روابط سريعة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {isArabic ? 'من أنا' : 'About Me'}
                </a>
              </li>
              <li>
                <a href="#featured-works" className="hover:text-white transition-colors">
                  {isArabic ? 'نماذج مختارة' : 'Featured Works'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {isArabic ? 'الخدمات' : 'Services'}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">
                  {isArabic ? 'أعمالي' : 'Portfolio'}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  {isArabic ? 'المعرض' : 'Gallery'}
                </a>
              </li>
              <li>
                <a href="#ai-design" className="hover:text-white transition-colors">
                  AI × Design
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  {isArabic ? 'تواصل معي' : 'Contact'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Direct Links Col (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isArabic ? 'قنوات التواصل المعتمدة' : 'Official Channels'}
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm">
              {/* Facebook */}
              <a
                href={siteConfig.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#1877f2] transition-colors"
              >
                <Facebook className="w-4 h-4 text-[#1877f2]" />
                <span>Facebook Page</span>
              </a>

              {/* Email 1 */}
              <a
                href={`mailto:${siteConfig.contact.email1}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#ff6b00]" />
                <span className="font-mono text-xs">{siteConfig.contact.email1}</span>
              </a>

              {/* Email 2 */}
              <a
                href={`mailto:${siteConfig.contact.email2}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#ff6b00]" />
                <span className="font-mono text-xs">{siteConfig.contact.email2}</span>
              </a>

              {/* Phone Call */}
              <a
                href={siteConfig.contact.phoneTel}
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#0084ff] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#0084ff]" />
                <span className="font-mono text-xs">{siteConfig.contact.phoneDisplay}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Direct Chat</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <p>© 2026 Mohab Mohammed. All Rights Reserved.</p>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3 text-[#ff7700]" />
                <span>{isArabic ? 'لوحة التحكم' : 'Admin'}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <span>{isArabic ? 'الرجوع للأعلى' : 'Back to top'}</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
