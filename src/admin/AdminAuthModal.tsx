import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { Lock, Mail, AlertCircle, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  onClose?: () => void;
  onCloseToPublic?: () => void;
  onSuccess?: () => void;
}

export const AdminAuthModal: React.FC<Props> = ({
  currentLang,
  onClose,
  onCloseToPublic,
  onSuccess,
}) => {
  const { login, authError } = useAdmin();
  const [email, setEmail] = useState('mmohab1997@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDismiss = () => {
    if (onClose) onClose();
    else if (onCloseToPublic) onCloseToPublic();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setIsSubmitting(true);
    const success = await login(password, email);
    setIsSubmitting(false);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const isAr = currentLang === 'ar';

  return (
    <div
      id="admin-auth-overlay"
      className="fixed inset-0 z-50 bg-[#07090e]/90 backdrop-blur-md flex items-center justify-center p-4"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        id="admin-auth-card"
        className="w-full max-w-md bg-[#0d121c] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#0084ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff7700]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Mohab's Brand */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0084ff]/20 to-[#ff7700]/20 border border-white/10 mb-4 shadow-lg">
            <Lock className="w-7 h-7 text-[#0084ff]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            {isAr ? 'لوحة تحكم مهاب محمد' : 'Mohab Mohammed Admin'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'إدارة المعرض، الأعمال، الهوية البصرية، والخلفيات'
              : 'Content, Portfolio & Brand Assets Management'}
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div
            id="auth-error-banner"
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isAr ? 'البريد الإلكتروني للإدارة' : 'Admin Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                id="admin-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#0084ff] transition-colors"
                placeholder="mmohab1997@gmail.com"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#0084ff] transition-colors"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-slate-400 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="admin-login-submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0084ff] to-[#0066cc] hover:from-[#1a90ff] hover:to-[#0077ee] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0084ff]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isAr ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{isSubmitting ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'دخول لوحة التحكم' : 'Sign In to Dashboard')}</span>
          </button>

          {/* Quick Auto-Login Button for convenience */}
          <button
            type="button"
            onClick={async () => {
              setEmail('mmohab1997@gmail.com');
              setPassword('MohabCreative2026!');
              setIsSubmitting(true);
              const ok = await login('MohabCreative2026!', 'mmohab1997@gmail.com');
              setIsSubmitting(false);
              if (ok && onSuccess) onSuccess();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>⚡ {isAr ? 'دخول سريع فوري كمدير للنظام' : 'Fast 1-Click Direct Admin Access'}</span>
          </button>
        </form>

        {/* Credentials reminder for the user */}
        <div className="mt-4 p-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-[11px] text-slate-400">
          <p className="font-mono text-slate-300">
            {isAr ? 'بيانات الدخول الافتراضية:' : 'Default credentials:'}
          </p>
          <p className="font-mono text-emerald-400 font-bold mt-0.5">
            mmohab1997@gmail.com / MohabCreative2026!
          </p>
        </div>

        {/* Return to Public Site */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? 'الرجوع إلى الموقع العام' : 'Return to Public Site'}
          </button>
        </div>
      </div>
    </div>
  );
};
