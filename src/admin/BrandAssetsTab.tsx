import React, { useState, useRef } from 'react';
import { useAdmin } from './AdminContext';
import { BrandAssetsConfig, Language } from '../types';
import {
  Sliders,
  Image as ImageIcon,
  User,
  Monitor,
  Smartphone,
  Tablet,
  Upload,
  Check,
  RotateCcw,
  Loader2,
  Sparkles,
  Layers,
  Crop,
  Eye,
} from 'lucide-react';

interface Props {
  currentLang: Language;
}

export const BrandAssetsTab: React.FC<Props> = ({ currentLang }) => {
  const { branding, updateBranding, uploadImageFile } = useAdmin();
  const isAr = currentLang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'logo' | 'profile' | 'hero'>('logo');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Screen preview device for Hero
  const [heroPreviewDevice, setHeroPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Local editable copies of branding config
  const [logoConfig, setLogoConfig] = useState(branding.logo);
  const [profileConfig, setProfileConfig] = useState(branding.profile);
  const [heroConfig, setHeroConfig] = useState(branding.hero);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const profileFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, 'branding/logo');
      setLogoConfig({
        ...logoConfig,
        activeUrl: url,
        previousUrls: [logoConfig.activeUrl, ...(logoConfig.previousUrls || [])].slice(0, 8),
      });
    } catch (err: any) {
      alert(err.message || 'فشل رفع الشعار');
    } finally {
      setIsUploading(false);
      if (logoFileRef.current) logoFileRef.current.value = '';
    }
  };

  // Handle Profile Upload
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, 'branding/profile');
      setProfileConfig({
        ...profileConfig,
        activeUrl: url,
        previousUrls: [profileConfig.activeUrl, ...(profileConfig.previousUrls || [])].slice(0, 8),
      });
    } catch (err: any) {
      alert(err.message || 'فشل رفع الصورة الشخصية');
    } finally {
      setIsUploading(false);
      if (profileFileRef.current) profileFileRef.current.value = '';
    }
  };

  // Handle Hero Background Upload
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, 'branding/hero');
      setHeroConfig({
        ...heroConfig,
        activeUrl: url,
        previousUrls: [heroConfig.activeUrl, ...(heroConfig.previousUrls || [])].slice(0, 8),
      });
    } catch (err: any) {
      alert(err.message || 'فشل رفع خلفية الهيرو');
    } finally {
      setIsUploading(false);
      if (heroFileRef.current) heroFileRef.current.value = '';
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const success = await updateBranding({
      logo: logoConfig,
      profile: profileConfig,
      hero: heroConfig,
    });
    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleResetToCurrent = () => {
    setLogoConfig(branding.logo);
    setProfileConfig(branding.profile);
    setHeroConfig(branding.hero);
  };

  return (
    <div id="admin-brand-assets-tab" className="space-y-6">
      {/* Top Main Banner */}
      <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-[#ff7700]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isAr ? 'إدارة الهوية البصرية وخلفية الهيرو (Brand Assets & Hero)' : 'Brand Assets & Hero Management'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'تحكم كامل ودقيق في الشعار الرسمي، الصورة الشخصية، وخلفية الـ Hero مع معاينة تفاعلية حية للشاشات المختلفة.'
              : 'Precision control over brand logo, Mohab portrait, and responsive Hero background positioning.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToCurrent}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إلغاء التعديلات' : 'Reset'}</span>
          </button>
          <button
            type="button"
            disabled={isSaving || isUploading}
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0084ff] to-[#0066cc] hover:from-[#1a90ff] hover:to-[#0077ee] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[#0084ff]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{isAr ? 'حفظ كافة التغييرات' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-green-400" />
          <span>{isAr ? 'تم حفظ وتحديث إعدادات الهوية بنجاح! التغييرات منعكسة الآن على الموقع العام.' : 'Brand assets saved and synchronized with public portfolio!'}</span>
        </div>
      )}

      {/* Subtabs Switcher */}
      <div className="flex border-b border-white/10 gap-2 pb-2">
        <button
          onClick={() => setActiveSubTab('logo')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'logo'
              ? 'bg-[#0084ff] text-white shadow-lg shadow-[#0084ff]/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{isAr ? '1. الشعار الرسمي (Logo)' : '1. Official Logo'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-[#0084ff] text-white shadow-lg shadow-[#0084ff]/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{isAr ? '2. الصورة الشخصية (Portrait)' : '2. Personal Portrait'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hero')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'hero'
              ? 'bg-[#ff7700] text-black font-bold shadow-lg shadow-[#ff7700]/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isAr ? '3. خلفية الهيرو التفاعلية (Hero Background)' : '3. Responsive Hero BG'}</span>
        </button>
      </div>

      {/* SUBTAB 1: LOGO MANAGEMENT */}
      {activeSubTab === 'logo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Settings Column */}
          <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#0084ff]" />
              <span>{isAr ? 'إعدادات الشعار' : 'Logo Settings'}</span>
            </h3>

            {/* File Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'رفع شعار جديد (PNG شفاف أو SVG أو WEBP)' : 'Upload New Logo'}
              </label>
              <input
                type="file"
                ref={logoFileRef}
                onChange={handleLogoUpload}
                accept="image/png,image/svg+xml,image/webp,image/jpeg"
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => logoFileRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0084ff]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#0084ff]" />
                )}
                <span>{isAr ? 'اختيار ملف الشعار واستبداله' : 'Upload & Replace Logo'}</span>
              </button>
            </div>

            {/* URL Fallback */}
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                {isAr ? 'رابط ملف الشعار المباشر' : 'Direct Logo URL'}
              </label>
              <input
                type="text"
                value={logoConfig.activeUrl}
                onChange={(e) => setLogoConfig({ ...logoConfig, activeUrl: e.target.value })}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0084ff]"
              />
            </div>

            {/* Dimensions Sliders */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">
                    {isAr ? 'عرض الشعار على أجهزة الكمبيوتر (Desktop Width):' : 'Desktop Width:'}
                  </span>
                  <span className="text-[#0084ff] font-mono font-bold">
                    {logoConfig.widthDesktop}px
                  </span>
                </div>
                <input
                  type="range"
                  min={120}
                  max={450}
                  step={5}
                  value={logoConfig.widthDesktop}
                  onChange={(e) =>
                    setLogoConfig({ ...logoConfig, widthDesktop: Number(e.target.value) })
                  }
                  className="w-full accent-[#0084ff] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">
                    {isAr ? 'عرض الشعار على الهواتف (Mobile Width):' : 'Mobile Width:'}
                  </span>
                  <span className="text-[#0084ff] font-mono font-bold">
                    {logoConfig.widthMobile}px
                  </span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={280}
                  step={5}
                  value={logoConfig.widthMobile}
                  onChange={(e) =>
                    setLogoConfig({ ...logoConfig, widthMobile: Number(e.target.value) })
                  }
                  className="w-full accent-[#0084ff] cursor-pointer"
                />
              </div>
            </div>

            {/* Logo Position */}
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                {isAr ? 'موضع الشعار في شريط التنقل (Position)' : 'Navbar Alignment'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['right', 'center', 'left'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setLogoConfig({ ...logoConfig, position: pos })}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      logoConfig.position === pos
                        ? 'bg-[#0084ff]/20 border-[#0084ff] text-[#0084ff]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pos === 'right' ? (isAr ? 'يمين' : 'Right') : pos === 'center' ? (isAr ? 'وسط' : 'Center') : (isAr ? 'يسار' : 'Left')}
                  </button>
                ))}
              </div>
            </div>

            {/* Alt Text */}
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                {isAr ? 'النص البديل للشعار (Alt Text)' : 'Logo Alt Text'}
              </label>
              <input
                type="text"
                value={logoConfig.altText}
                onChange={(e) => setLogoConfig({ ...logoConfig, altText: e.target.value })}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0084ff]"
              />
            </div>

            {/* Version History */}
            {logoConfig.previousUrls && logoConfig.previousUrls.length > 0 && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-xs text-slate-400 font-medium">
                  {isAr ? 'سجل الشعارات السابقة (استرجاع بنقرة واحدة):' : 'Previous Logos History:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {logoConfig.previousUrls.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLogoConfig({ ...logoConfig, activeUrl: url })}
                      className="p-1.5 rounded-lg border border-white/10 bg-black/40 hover:border-[#0084ff] transition-colors cursor-pointer"
                      title={isAr ? 'استرجاع هذا الشعار' : 'Restore'}
                    >
                      <img src={url} alt="History" className="h-7 max-w-[60px] object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Box */}
          <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 flex flex-col space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#0084ff]" />
              <span>{isAr ? 'معاينة الشعار الحية' : 'Live Logo Preview'}</span>
            </h3>

            {/* Mockup on Dark Header */}
            <div className="rounded-xl border border-white/10 bg-[#07090e] p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                {isAr ? 'المعاينة على خلفية داكنة' : 'Preview on Dark Background'}
              </div>
              <img
                src={logoConfig.activeUrl}
                alt={logoConfig.altText}
                style={{ width: `${logoConfig.widthDesktop}px` }}
                className="max-h-24 object-contain filter drop-shadow-md transition-all duration-300"
              />
            </div>

            {/* Mockup with Checkerboard (Transparency test) */}
            <div className="rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:12px_12px] bg-slate-900">
              <div className="absolute top-2 left-3 text-[10px] text-slate-400 font-mono">
                {isAr ? 'فحص شفافية الخلفية (Transparency Check)' : 'Transparency Check'}
              </div>
              <img
                src={logoConfig.activeUrl}
                alt={logoConfig.altText}
                style={{ width: `${logoConfig.widthMobile}px` }}
                className="max-h-20 object-contain filter drop-shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PROFILE PORTRAIT MANAGEMENT */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Settings Column */}
          <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#0084ff]" />
              <span>{isAr ? 'إعدادات صورة مهاب الشخصية' : 'Portrait Settings'}</span>
            </h3>

            {/* File Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'رفع صورة شخصية جديدة' : 'Upload New Portrait'}
              </label>
              <input
                type="file"
                ref={profileFileRef}
                onChange={handleProfileUpload}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => profileFileRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0084ff]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#0084ff]" />
                )}
                <span>{isAr ? 'اختيار صورة من الجهاز واستبدالها' : 'Upload & Replace Portrait'}</span>
              </button>
            </div>

            {/* Position Sliders (X & Y) */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <span className="text-xs text-slate-300 font-semibold block">
                {isAr ? 'تحديد موضع الصورة داخل الإطار (Cropping & Focus):' : 'Focal Position (X & Y):'}
              </span>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">
                    {isAr ? 'الموضع الأفقي (Horizontal X):' : 'Horizontal X:'}
                  </span>
                  <span className="text-[#0084ff] font-mono font-bold">
                    {profileConfig.positionX}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={profileConfig.positionX}
                  onChange={(e) =>
                    setProfileConfig({ ...profileConfig, positionX: Number(e.target.value) })
                  }
                  className="w-full accent-[#0084ff] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">
                    {isAr ? 'الموضع الرأسي (Vertical Y):' : 'Vertical Y:'}
                  </span>
                  <span className="text-[#0084ff] font-mono font-bold">
                    {profileConfig.positionY}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={profileConfig.positionY}
                  onChange={(e) =>
                    setProfileConfig({ ...profileConfig, positionY: Number(e.target.value) })
                  }
                  className="w-full accent-[#0084ff] cursor-pointer"
                />
              </div>
            </div>

            {/* Object Fit */}
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                {isAr ? 'طريقة الاحتواء (Object Fit)' : 'Object Fit'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['cover', 'contain'] as const).map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setProfileConfig({ ...profileConfig, objectFit: fit })}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      profileConfig.objectFit === fit
                        ? 'bg-[#0084ff]/20 border-[#0084ff] text-[#0084ff]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fit === 'cover' ? (isAr ? 'تغطية كاملة (Cover)' : 'Cover') : (isAr ? 'احتواء (Contain)' : 'Contain')}
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            {profileConfig.previousUrls && profileConfig.previousUrls.length > 0 && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-xs text-slate-400 font-medium">
                  {isAr ? 'الصور السابقة:' : 'Previous Portraits:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {profileConfig.previousUrls.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProfileConfig({ ...profileConfig, activeUrl: url })}
                      className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 hover:border-[#0084ff] cursor-pointer"
                    >
                      <img src={url} alt="History" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Box */}
          <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-base font-bold text-white self-start flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#0084ff]" />
              <span>{isAr ? 'المعاينة في إطار الهوية' : 'Identity Frame Preview'}</span>
            </h3>

            {/* Frame mimicking the exact About Section frame */}
            <div className="relative w-64 h-80 rounded-3xl overflow-hidden border-2 border-white/15 bg-[#07090e] shadow-2xl group">
              <img
                src={profileConfig.activeUrl}
                alt={profileConfig.altText}
                className="w-full h-full"
                style={{
                  objectFit: profileConfig.objectFit,
                  objectPosition: `${profileConfig.positionX}% ${profileConfig.positionY}%`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none flex flex-col justify-end p-4">
                <span className="text-xs font-bold text-white">مهاب محمد</span>
                <span className="text-[10px] text-slate-300">مصمم جرافيك ومخرج فني</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-xs">
              {isAr
                ? 'هذه المعاينة تطابق الإطار الذي يظهر في قسم "من هو مهاب محمد" في الصفحة الرئيسية.'
                : 'Exact frame alignment rendered in the About Mohab Mohammed section.'}
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 3: HERO BACKGROUND MANAGEMENT & LIVE RESPONSIVE PREVIEW */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6 animate-fade-in">
          {/* Responsive Preview Controls */}
          <div className="bg-[#0d121c] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-white">
                {isAr ? 'معاينة محاكاة الشاشات:' : 'Preview Screen Size:'}
              </span>
              <div className="flex items-center gap-1.5 p-1 bg-[#07090e] rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setHeroPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    heroPreviewDevice === 'desktop'
                      ? 'bg-[#0084ff] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroPreviewDevice('tablet')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    heroPreviewDevice === 'tablet'
                      ? 'bg-[#0084ff] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet (768px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    heroPreviewDevice === 'mobile'
                      ? 'bg-[#0084ff] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile (380px)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={heroFileRef}
                onChange={handleHeroUpload}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => heroFileRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#ff7700]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#ff7700]" />
                )}
                <span>{isAr ? 'رفع خلفية جديدة' : 'Upload Hero Image'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Hero Mockup Frame */}
          <div className="w-full flex justify-center bg-[#07090e] p-4 sm:p-6 rounded-2xl border border-white/10 overflow-hidden">
            <div
              className="transition-all duration-300 relative rounded-2xl overflow-hidden shadow-2xl border border-white/20"
              style={{
                width:
                  heroPreviewDevice === 'desktop'
                    ? '100%'
                    : heroPreviewDevice === 'tablet'
                    ? '768px'
                    : '380px',
                height: `${
                  heroPreviewDevice === 'desktop'
                    ? heroConfig.heroHeightDesktop
                    : heroPreviewDevice === 'tablet'
                    ? heroConfig.heroHeightTablet
                    : heroConfig.heroHeightMobile
                }px`,
              }}
            >
              {/* Background Image with Dynamic Position */}
              <img
                src={heroConfig.activeUrl}
                alt={heroConfig.altText}
                className="absolute inset-0 w-full h-full transition-all duration-300"
                style={{
                  objectFit: heroConfig.objectFit,
                  objectPosition: `${
                    heroPreviewDevice === 'desktop'
                      ? heroConfig.desktopPosition.x
                      : heroPreviewDevice === 'tablet'
                      ? heroConfig.tabletPosition.x
                      : heroConfig.mobilePosition.x
                  }% ${
                    heroPreviewDevice === 'desktop'
                      ? heroConfig.desktopPosition.y
                      : heroPreviewDevice === 'tablet'
                      ? heroConfig.tabletPosition.y
                      : heroConfig.mobilePosition.y
                  }%`,
                }}
              />

              {/* Dynamic Gradient Overlay */}
              {heroConfig.overlayEnabled && (
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    opacity: heroConfig.overlayOpacity / 100,
                    background:
                      heroConfig.gradientDirection === 'right'
                        ? 'linear-gradient(to left, rgba(7,9,14,0.95) 0%, rgba(7,9,14,0.7) 45%, rgba(7,9,14,0.1) 100%)'
                        : heroConfig.gradientDirection === 'left'
                        ? 'linear-gradient(to right, rgba(7,9,14,0.95) 0%, rgba(7,9,14,0.7) 45%, rgba(7,9,14,0.1) 100%)'
                        : 'linear-gradient(to top, rgba(7,9,14,0.95) 0%, rgba(7,9,14,0.7) 45%, rgba(7,9,14,0.1) 100%)',
                  }}
                />
              )}

              {/* Simulated Hero Content */}
              <div
                className="relative h-full flex flex-col justify-center px-6 sm:px-12 pointer-events-none"
                style={{
                  maxWidth: `${heroConfig.textMaxWidth}px`,
                  textAlign: isAr ? 'right' : 'left',
                }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff7700]/20 border border-[#ff7700]/40 text-[#ff7700] text-xs font-bold w-fit mb-3">
                  ★ المصمم الجرافيكي المعتمد
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
                  مهاب محمد — رؤية بصرية لا تُنسى
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  تصاميم إعلانية وهوية بصرية تجذب العملاء وتبني علامة فارقة في السوق.
                </p>
              </div>

              {/* Tag indicator */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white font-mono border border-white/10">
                {heroPreviewDevice.toUpperCase()} • {heroConfig.heroHeightDesktop}px
              </div>
            </div>
          </div>

          {/* Controls Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Panel 1: Position Controls */}
            <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Crop className="w-4 h-4 text-[#ff7700]" />
                <span>{isAr ? 'موضع الصورة (Position X & Y)' : 'Image Position (X & Y)'}</span>
              </h4>

              {/* Desktop sliders */}
              <div className="space-y-3 pt-2">
                <span className="text-xs text-[#0084ff] font-semibold block">
                  Desktop Position ({heroConfig.desktopPosition.x}%, {heroConfig.desktopPosition.y}%)
                </span>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>X</span>
                    <span>{heroConfig.desktopPosition.x}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={heroConfig.desktopPosition.x}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        desktopPosition: {
                          ...heroConfig.desktopPosition,
                          x: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[#0084ff]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Y</span>
                    <span>{heroConfig.desktopPosition.y}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={heroConfig.desktopPosition.y}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        desktopPosition: {
                          ...heroConfig.desktopPosition,
                          y: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[#0084ff]"
                  />
                </div>
              </div>

              {/* Mobile sliders */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <span className="text-xs text-[#ff7700] font-semibold block">
                  Mobile Position ({heroConfig.mobilePosition.x}%, {heroConfig.mobilePosition.y}%)
                </span>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>X</span>
                    <span>{heroConfig.mobilePosition.x}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={heroConfig.mobilePosition.x}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        mobilePosition: {
                          ...heroConfig.mobilePosition,
                          x: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[#ff7700]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Y</span>
                    <span>{heroConfig.mobilePosition.y}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={heroConfig.mobilePosition.y}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        mobilePosition: {
                          ...heroConfig.mobilePosition,
                          y: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[#ff7700]"
                  />
                </div>
              </div>
            </div>

            {/* Panel 2: Height Controls */}
            <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#ff7700]" />
                <span>{isAr ? 'ارتفاع قسم الهيرو (Hero Height)' : 'Hero Heights'}</span>
              </h4>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Desktop Height</span>
                  <span className="text-[#0084ff] font-mono">{heroConfig.heroHeightDesktop}px</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={950}
                  step={10}
                  value={heroConfig.heroHeightDesktop}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, heroHeightDesktop: Number(e.target.value) })
                  }
                  className="w-full accent-[#0084ff]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Tablet Height</span>
                  <span className="text-[#0084ff] font-mono">{heroConfig.heroHeightTablet}px</span>
                </div>
                <input
                  type="range"
                  min={450}
                  max={800}
                  step={10}
                  value={heroConfig.heroHeightTablet}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, heroHeightTablet: Number(e.target.value) })
                  }
                  className="w-full accent-[#0084ff]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Mobile Height</span>
                  <span className="text-[#0084ff] font-mono">{heroConfig.heroHeightMobile}px</span>
                </div>
                <input
                  type="range"
                  min={450}
                  max={850}
                  step={10}
                  value={heroConfig.heroHeightMobile}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, heroHeightMobile: Number(e.target.value) })
                  }
                  className="w-full accent-[#0084ff]"
                />
              </div>

              {/* Text Max Width */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{isAr ? 'أقصى عرض للنص:' : 'Text Max Width:'}</span>
                  <span className="text-[#0084ff] font-mono">{heroConfig.textMaxWidth}px</span>
                </div>
                <input
                  type="range"
                  min={350}
                  max={850}
                  step={10}
                  value={heroConfig.textMaxWidth}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, textMaxWidth: Number(e.target.value) })
                  }
                  className="w-full accent-[#0084ff]"
                />
              </div>
            </div>

            {/* Panel 3: Overlay & Gradient Controls */}
            <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff7700]" />
                <span>{isAr ? 'تدرج التعتيم (Overlay & Gradients)' : 'Overlay & Gradients'}</span>
              </h4>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heroConfig.overlayEnabled}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, overlayEnabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#ff7700]"
                />
                <span className="text-xs text-white">
                  {isAr ? 'تفعيل طبقة التعتيم والتدرج (Overlay)' : 'Enable Dark Gradient Overlay'}
                </span>
              </label>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{isAr ? 'نسبة الشفافية:' : 'Opacity:'}</span>
                  <span className="text-[#ff7700] font-mono">{heroConfig.overlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={heroConfig.overlayOpacity}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, overlayOpacity: Number(e.target.value) })
                  }
                  className="w-full accent-[#ff7700]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  {isAr ? 'اتجاه التدرج' : 'Gradient Direction'}
                </label>
                <select
                  value={heroConfig.gradientDirection}
                  onChange={(e) =>
                    setHeroConfig({ ...heroConfig, gradientDirection: e.target.value as any })
                  }
                  className="w-full bg-[#07090e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#ff7700]"
                >
                  <option value="right">{isAr ? 'من اليمين إلى اليسار (للعربية)' : 'Right to Left'}</option>
                  <option value="left">{isAr ? 'من اليسار إلى اليمين' : 'Left to Right'}</option>
                  <option value="bottom">{isAr ? 'من الأسفل إلى الأعلى' : 'Bottom to Top'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  {isAr ? 'رابط مباشر للخلفية' : 'Direct Background URL'}
                </label>
                <input
                  type="text"
                  value={heroConfig.activeUrl}
                  onChange={(e) => setHeroConfig({ ...heroConfig, activeUrl: e.target.value })}
                  className="w-full bg-[#07090e] border border-white/10 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#ff7700]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
