import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Workflow,
  Wand2,
} from 'lucide-react';
import { Language } from '../types';
import { aiWorkflowSteps } from '../data/content';

interface AISectionProps {
  currentLang: Language;
}

const iconMapping: Record<string, React.ElementType> = {
  Lightbulb,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle: CheckCircle2,
};

export const AISection: React.FC<AISectionProps> = ({ currentLang }) => {
  const isArabic = currentLang === 'ar';
  const [activeStep, setActiveStep] = useState(1); // default step 2 (AI)

  return (
    <section id="ai-design" className="py-24 sm:py-32 bg-[#0a0e17] relative overflow-hidden">
      {/* Dynamic Background Grid and Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#0084ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0084ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-[#0084ff]/40 text-[#0084ff] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#0084ff]" />
            <span>AI × DESIGN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            {isArabic
              ? 'عندما يلتقي التصميم بالذكاء الاصطناعي'
              : 'When Human Craftsmanship Meets Artificial Intelligence'}
          </h2>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-sm sm:text-base font-medium leading-relaxed">
              {isArabic
                ? '«أستخدم الذكاء الاصطناعي كجزء من العملية الإبداعية وليس كبديل عن التصميم. الفكرة أولاً، والذكاء الاصطناعي للاستكشاف، واليد الاحترافية في فوتوشوب للإتقان النهائي.»'
                : '"I employ artificial intelligence as an integral creative partner, not a replacement for human design. Idea first, AI for deep exploration, and Photoshop mastery for final perfection."'}
            </p>
          </div>
        </div>

        {/* Workflow Diagram: IDEA -> AI -> PHOTOSHOP -> REFINEMENT -> FINAL DESIGN */}
        <div className="mb-14">
          <div className="hidden lg:grid lg:grid-cols-5 gap-3 relative">
            {aiWorkflowSteps.map((step, idx) => {
              const IconComp = iconMapping[step.icon] || Sparkles;
              const isCurrent = activeStep === idx;
              return (
                <div
                  key={step.key}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#0f172a] border-2 border-[#0084ff] shadow-xl shadow-[#0084ff]/20 -translate-y-2'
                      : 'bg-[#0d121c] border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isCurrent ? 'bg-[#0084ff] text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {step.step}
                      </span>
                      <IconComp className={`w-5 h-5 ${
                        isCurrent ? 'text-[#ff6b00]' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                    </div>

                    <h3 className="font-mono text-sm font-bold text-[#38bdf8] mb-1 tracking-wider">
                      {step.key}
                    </h3>
                    
                    <h4 className="text-sm font-bold text-white mb-2">
                      {isArabic ? step.nameAr : step.nameEn}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isArabic ? step.descAr : step.descEn}
                    </p>
                  </div>

                  {/* Flow Arrow between steps (desktop) */}
                  {idx < aiWorkflowSteps.length - 1 && (
                    <div className="absolute top-1/2 -right-3 rtl:right-auto rtl:-left-3 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                      {isArabic ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile / Tablet Vertical Stepper */}
          <div className="lg:hidden space-y-3">
            {aiWorkflowSteps.map((step, idx) => {
              const IconComp = iconMapping[step.icon] || Sparkles;
              return (
                <div
                  key={step.key}
                  className="p-5 rounded-xl bg-[#0d121c] border border-slate-800 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-850 border border-slate-700 flex items-center justify-center text-[#0084ff] shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-[#ff6b00]">
                        {step.step}. {step.key}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      {isArabic ? step.nameAr : step.nameEn}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isArabic ? step.descAr : step.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlight Feature Comparison: AI speed vs Human Craft */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0d121c] via-[#0f172a] to-[#0d121c] border border-slate-800 shadow-2xl">
          <div className="p-5 rounded-xl bg-[#07090e]/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3">
              <Cpu className="w-5 h-5 text-[#0084ff]" />
              <h4 className="text-base font-bold text-white">
                {isArabic ? 'دور أدوات الذكاء الاصطناعي (AI)' : 'Role of AI Engine'}
              </h4>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff]" />
                {isArabic ? 'توليد أفكار وتكوينات بصرية غير مألوفة بسرعة قياسية' : 'Rapid generation of unconventional visual compositions'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff]" />
                {isArabic ? 'استكشاف زوايا إضاءة وخامات معقدة' : 'Exploring lighting dynamics, textures, and depth'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff]" />
                {isArabic ? 'تسريع مرحلة التغذية البصرية وبناء المزاج العام' : 'Accelerating visual research and moodboard synthesis'}
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-[#07090e]/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3">
              <Wand2 className="w-5 h-5 text-[#ff6b00]" />
              <h4 className="text-base font-bold text-white">
                {isArabic ? 'دور اللمسة الإنسانية وفوتوشوب' : 'Role of Human Polish & Photoshop'}
              </h4>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]" />
                {isArabic ? 'عزل العناصر وضبط التدرجات والألوان ومعالجة العيوب' : 'Precision masking, color grading, and defect correction'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]" />
                {isArabic ? 'تنسيق التايبوجرافي والنصوص بما يحقق الرسالة التسويقية' : 'Typography pairing and hierarchy aligning with marketing goals'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]" />
                {isArabic ? 'التأكد من جاهزية الملفات للطباعة CMYK أو المنصات الرقمية' : 'Ensuring true CMYK print compliance and optimal digital formats'}
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};
