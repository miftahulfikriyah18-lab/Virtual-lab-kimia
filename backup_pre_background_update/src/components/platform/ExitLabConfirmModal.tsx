import React from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

interface ExitLabConfirmModalProps {
  isOpen: boolean;
  onResume: () => void;
  onConfirmExit: () => void;
}

export const ExitLabConfirmModal: React.FC<ExitLabConfirmModalProps> = ({
  isOpen,
  onResume,
  onConfirmExit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/60 backdrop-blur-xs animate-fadeIn selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      <div className="relative w-full max-w-md bg-[#F9F7F2] border-2 border-[#1D1D1B] shadow-[8px_8px_0px_#1D1D1B] p-6">
        <button
          onClick={onResume}
          className="absolute top-4 right-4 p-1 text-[#1D1D1B]/60 hover:text-[#1D1D1B] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-amber-100 border border-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60">
              Konfirmasi Navigasi
            </span>
            <h3 className="text-lg font-serif font-bold text-[#1D1D1B]">
              Keluar dari Praktikum?
            </h3>
          </div>
        </div>

        <p className="text-sm font-serif text-[#1D1D1B]/85 leading-relaxed mb-6">
          Progres percobaan aktif akan disimpan sejauh memungkinkan pada perangkat ini, dan Anda dapat melanjutkannya kembali kapan saja dari Dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[#1D1D1B]/15">
          <button
            onClick={onResume}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#C4A484] cursor-pointer"
          >
            Lanjutkan Praktikum
          </button>
          <button
            onClick={onConfirmExit}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-[#F4EFE6] border border-[#1D1D1B] text-[#1D1D1B] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            Simpan & Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
