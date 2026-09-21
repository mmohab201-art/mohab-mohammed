import React, { useRef, useState } from 'react';
import { useAdmin } from './AdminContext';
import { Language } from '../types';
import { Download, Upload, Shield, Database, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  currentLang: Language;
}

export const SettingsTab: React.FC<Props> = ({ currentLang }) => {
  const { exportBackupJson, importBackupJson } = useAdmin();
  const isAr = currentLang === 'ar';
  const importFileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        const success = await importBackupJson(json);
        if (success) {
          setImportStatus(isAr ? 'تم استيراد البيانات بنجاح!' : 'Backup imported successfully!');
        } else {
          setImportStatus(isAr ? 'فشل استيراد الملف.' : 'Import failed.');
        }
      } catch (err: any) {
        setImportStatus(isAr ? 'الملف غير صالح أو تالف.' : 'Invalid JSON backup file.');
      } finally {
        setIsImporting(false);
        if (importFileRef.current) importFileRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="admin-settings-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-5 h-5 text-[#0084ff]" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {isAr ? 'النسخ الاحتياطي وإعدادات النظام' : 'Backup & System Settings'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          {isAr
            ? 'تصدير واستيراد قاعدة البيانات بالكامل، وإدارة استقرار وأمان المحتوى.'
            : 'Export and restore complete database backups, manage persistence, and verify security.'}
        </p>
      </div>

      {/* Backup & Restore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'تصدير نسخة احتياطية كاملة (Export)' : 'Export Full Backup (JSON)'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'قم بتنزيل ملف JSON يحتوي على كافة الأعمال، معرض الصور، إعدادات الهوية، والشعار، والترتيب لحفظها بأمان على جهازك.'
              : 'Download a full JSON dump containing all projects, gallery items, categories, and brand assets.'}
          </p>
          <button
            type="button"
            onClick={exportBackupJson}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0084ff] hover:bg-[#1a90ff] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0084ff]/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تحميل ملف النسخة الاحتياطية' : 'Download Backup JSON'}</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'استعادة نسخة احتياطية (Restore)' : 'Restore from Backup (JSON)'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'اختر ملف JSON للنسخة الاحتياطية لاسترجاع كافة البيانات والإعدادات بضغطة زر واحدة.'
              : 'Upload a previously exported JSON backup file to instantly restore database state.'}
          </p>

          <input
            type="file"
            ref={importFileRef}
            onChange={handleFileImport}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            type="button"
            disabled={isImporting}
            onClick={() => importFileRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isImporting ? 'animate-spin' : ''}`} />
            <span>{isImporting ? (isAr ? 'جاري الاستيراد...' : 'Importing...') : (isAr ? 'اختيار ملف الاستعادة' : 'Choose JSON File')}</span>
          </button>

          {importStatus && (
            <p className="text-xs text-green-400 font-medium text-center">
              {importStatus}
            </p>
          )}
        </div>
      </div>

      {/* Cloud & Security Status */}
      <div className="bg-[#0d121c] p-6 rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-400" />
          <span>{isAr ? 'الأمان وحالة التخزين' : 'Security & Storage Status'}</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {isAr
            ? 'لوحة التحكم محمية بنظام جلسات مشفر ورموز تصريح عشوائية (Bearer Token). جميع الصور تُحفظ في المسار العام للموقع بروابط دائمة، والبيانات مسجلة في ملف قاعدة بيانات مهيأ للترحيل السحابي في أي وقت.'
            : 'Admin sessions are cryptographically secured with bearer tokens. All uploaded visual assets are permanently written to public storage.'}
        </p>
      </div>
    </div>
  );
};
