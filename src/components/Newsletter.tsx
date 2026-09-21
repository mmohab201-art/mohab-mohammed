import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface NewsletterProps {
  currentLang: Language;
}

export const Newsletter: React.FC<NewsletterProps> = ({ currentLang }) => {
  const isArabic = currentLang === 'ar';
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(isArabic ? 'يرجى إدخال بريدك الإلكتروني' : 'Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(isArabic ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email address format');
      return;
    }

    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section id="newsletter" className="py-16 sm:py-20 bg-[#0a0e17] border-t border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0084ff] to-[#ff6b00] p-[1px] mx-auto mb-4">
          <div className="w-full h-full rounded-2xl bg-[#07090e] flex items-center justify-center text-[#0084ff]">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          {isArabic
            ? 'اشترك للحصول على أحدث الأعمال والأفكار الإبداعية'
            : 'Subscribe for the Latest Creative Works & Visual Insights'}
        </h3>

        <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8">
          {isArabic
            ? 'احصل على نشرة دورية تضم أحدث التصاميم وتجارب دمج الذكاء الاصطناعي مع التصميم الجرافيكي.'
            : 'Receive occasional showcases of new design case studies and AI-driven creative experiments.'}
        </p>

        {subscribed ? (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">
              {isArabic ? 'شكراً لاشتراكك! ستصلك أحدث الأعمال قريباً.' : 'Thank you for subscribing! Updates coming soon.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                id="newsletter-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder={isArabic ? 'أدخل بريدك الإلكتروني هنا...' : 'Enter your email address...'}
                className={`flex-1 px-4 py-3 rounded-xl bg-slate-900 text-sm text-white placeholder-slate-500 border ${
                  error ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-[#0084ff]'
                } focus:outline-none transition-colors`}
              />
              <button
                type="submit"
                id="newsletter-submit-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0084ff] to-[#0066cc] hover:from-[#0095ff] hover:to-[#0077ee] transition-all cursor-pointer shadow-md shadow-[#0084ff]/20"
              >
                <span>{isArabic ? 'اشتراك' : 'Subscribe'}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </form>
        )}

      </div>
    </section>
  );
};
