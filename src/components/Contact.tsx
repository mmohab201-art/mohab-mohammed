import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  Facebook,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Language, ContactFormData } from '../types';
import { siteConfig } from '../data/content';

interface ContactProps {
  currentLang: Language;
}

export const Contact: React.FC<ContactProps> = ({ currentLang }) => {
  const isArabic = currentLang === 'ar';

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<ContactFormData> = {};
    if (!formData.name.trim()) {
      errs.name = isArabic ? 'يرجى إدخال الاسم' : 'Please enter your name';
    }
    if (!formData.email.trim()) {
      errs.email = isArabic ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = isArabic ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email address format';
    }
    if (!formData.subject.trim()) {
      errs.subject = isArabic ? 'يرجى إدخال موضوع الرسالة' : 'Please enter the subject';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = isArabic ? 'الرسالة يجب ألا تقل عن 10 أحرف' : 'Message must be at least 10 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate frontend submission feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccessfully(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 600);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0084ff]/15 border border-[#0084ff]/30 text-[#0084ff] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span>{isArabic ? 'تواصل معي' : 'Get In Touch'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            {isArabic ? 'لديك فكرة؟ دعنا نحولها إلى تصميم.' : 'Have an Idea? Let’s Turn It Into a Masterpiece.'}
          </h2>

          <p className="text-base sm:text-lg text-slate-400">
            {isArabic
              ? 'سواء كنت بحاجة إلى هوية بصرية، حملة إعلانية، مطبوعات راقية، أو دمج فني بالذكاء الاصطناعي، يسعدني التحدث معك.'
              : 'Whether you need visual branding, advertising campaigns, premium print, or creative AI art direction, reach out today.'}
          </p>
        </div>

        {/* 2-Column Layout: Direct Contact Info (Left/Right) & Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Direct Channels Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Phone & WhatsApp Dual Action Card */}
            <div className="p-6 rounded-2xl bg-[#0d121c] border border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-[#0084ff]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isArabic ? 'رقم الهاتف والتواصل المباشر' : 'Phone & Direct Contact'}
                  </h3>
                  <p className="text-sm font-mono text-slate-300 font-semibold mt-0.5">
                    {siteConfig.contact.phoneDisplay}
                  </p>
                </div>
              </div>

              {/* Both Buttons: Call + WhatsApp */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Call Button */}
                <a
                  href={siteConfig.contact.phoneTel}
                  id="contact-call-btn"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#0084ff] transition-all duration-200"
                >
                  <Phone className="w-4 h-4 text-[#0084ff]" />
                  <span>{isArabic ? 'اتصال مباشر' : 'Direct Call'}</span>
                </a>

                {/* WhatsApp Button */}
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-whatsapp-btn"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30 transition-all duration-200"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Email Channels Card */}
            <div className="p-6 rounded-2xl bg-[#0d121c] border border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-[#ff6b00]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Addresses'}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {isArabic ? 'للطلبات والاستفسارات الرسمية' : 'For inquiries & business proposals'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`mailto:${siteConfig.contact.email1}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-sm font-mono text-slate-200 hover:text-white transition-colors"
                >
                  <span>{siteConfig.contact.email1}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </a>

                <a
                  href={`mailto:${siteConfig.contact.email2}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-sm font-mono text-slate-200 hover:text-white transition-colors"
                >
                  <span>{siteConfig.contact.email2}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </a>
              </div>
            </div>

            {/* Facebook Card (Official ONLY) */}
            <div className="p-6 rounded-2xl bg-[#0d121c] border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1877f2]/15 border border-[#1877f2]/30 flex items-center justify-center text-[#1877f2]">
                    <Facebook className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Facebook</h3>
                    <p className="text-xs text-slate-400">Mr.mohabMohammed</p>
                  </div>
                </div>

                <a
                  href={siteConfig.contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-facebook-link"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1877f2] hover:bg-[#166fe5] shadow-md transition-all"
                >
                  <span>{isArabic ? 'زيارة الصفحة' : 'Visit Page'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d121c] border border-slate-800 shadow-xl relative">
              
              <h3 className="text-xl font-bold text-white mb-6">
                {isArabic ? 'أرسل رسالتك وسأرد عليك في أقرب وقت' : 'Send a Message & Let’s Collaborate'}
              </h3>

              {submittedSuccessfully && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">
                      {isArabic ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!'}
                    </h4>
                    <p className="text-xs text-emerald-300 mt-1">
                      {isArabic
                        ? 'شكراً لتواصلك. سأراجع طلبك وأرد عليك عبر البريد الإلكتروني أو الهاتف في أقرب فرصة.'
                        : 'Thank you for reaching out. I will review your inquiry and get back to you promptly.'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isArabic ? 'الاسم بالكامل' : 'Full Name'} <span className="text-[#ff6b00]">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isArabic ? 'مثال: أحمد علي' : 'e.g., John Doe'}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900 text-sm text-white placeholder-slate-500 border ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-[#0084ff]'
                      } focus:outline-none transition-colors`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isArabic ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-[#ff6b00]">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900 text-sm text-white placeholder-slate-500 border ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-[#0084ff]'
                      } focus:outline-none transition-colors`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isArabic ? 'الموضوع / نوع المشروع' : 'Subject / Project Type'} <span className="text-[#ff6b00]">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={isArabic ? 'مثال: تصميم هوية بصرية كاملة لشركة' : 'e.g., Visual identity for corporate brand'}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 text-sm text-white placeholder-slate-500 border ${
                      errors.subject ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-[#0084ff]'
                    } focus:outline-none transition-colors`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isArabic ? 'تفاصيل الرسالة' : 'Message Details'} <span className="text-[#ff6b00]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isArabic ? 'اكتب تفاصيل فكرتك، الموعد المطلوب، وأي متطلبات خاصة...' : 'Share project objectives, timeline, and deliverables...'}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 text-sm text-white placeholder-slate-500 border ${
                      errors.message ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-[#0084ff]'
                    } focus:outline-none transition-colors resize-y`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0084ff] to-[#0066cc] hover:from-[#0095ff] hover:to-[#0077ee] shadow-lg shadow-[#0084ff]/30 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (isArabic ? 'جاري الإرسال...' : 'Sending...')
                      : (isArabic ? 'إرسال الرسالة' : 'Send Message')}
                  </span>
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
