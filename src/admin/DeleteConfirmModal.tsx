import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  isOpen: boolean;
  title?: string;
  itemTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<Props> = ({
  currentLang,
  isOpen,
  title,
  itemTitle,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;
  const isAr = currentLang === 'ar';

  return (
    <div
      id="delete-confirm-overlay"
      className="fixed inset-0 z-50 bg-[#07090e]/85 backdrop-blur-sm flex items-center justify-center p-4"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        id="delete-confirm-card"
        className="w-full max-w-md bg-[#0d121c] border border-red-500/30 rounded-2xl p-6 shadow-2xl relative"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1">
              {title || (isAr ? 'هل أنت متأكد من حذف هذا العمل؟' : 'Are you sure you want to delete this?')}
            </h3>
            {itemTitle && (
              <p className="text-xs text-[#ff7700] font-medium mb-2 truncate">
                «{itemTitle}»
              </p>
            )}
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'هذا الإجراء نهائي ولا يمكن التراجع عنه. سيتم مسح العنصر بالكامل من قاعدة البيانات ومن الموقع.'
                : 'This action cannot be undone. The item will be permanently removed from the database and public views.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : (isAr ? 'تأكيد الحذف' : 'Delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
