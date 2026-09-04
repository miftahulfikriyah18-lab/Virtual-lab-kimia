import React from 'react';
import { Compass, Flame, ArrowRight, X, Check } from 'lucide-react';
import { LabMode } from '../../types';

interface ModeSelectModalProps {
  onSelectMode: (mode: LabMode) => void;
  onClose: () => void;
}

export const ModeSelectModal: React.FC<ModeSelectModalProps> = ({ onSelectMode, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#F9F7F2] border border-[#1D1D1B] p-6 md:p-8 overflow-hidden flex flex-col text-[#1D1D1B]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1D1D1B]/15 mb-6">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C4A484] mb-1">
              Fascicle / Konfigurasi
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1D1D1B]">Pilih Mode Praktikum</h3>
            <p className="text-xs text-[#1D1D1B]/70 font-serif italic mt-0.5">
              Sesuaikan tingkat asistensi simulasi analitik dengan tingkat kemandirian praktikan
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#1D1D1B]/20 flex items-center justify-center text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Guided Mode - Editorial Light Paper Card */}
          <div className="p-6 bg-[#FFFFFF] border border-[#1D1D1B]/20 hover:border-[#1D1D1B] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#1D1D1B]/50">
                  Mode 01
                </span>
                <span className="text-2xl font-serif italic text-[#C4A484]">A</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-[#1D1D1B] mb-1">Laboratorium Terbimbing</h4>
              <p className="text-xs text-[#C4A484] font-serif italic mb-4">
                Disarankan untuk pengenalan pertama kali teknik volumetri.
              </p>
              <ul className="text-xs text-[#1D1D1B]/80 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D1D1B] shrink-0 mt-0.5" />
                  <span>Panduan langkah demi langkah (Step-by-step)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D1D1B] shrink-0 mt-0.5" />
                  <span>Penyorotan alat aktif yang harus digunakan</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D1D1B] shrink-0 mt-0.5" />
                  <span>Bantuan garis pandang sejajar pada skala meniskus</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D1D1B] shrink-0 mt-0.5" />
                  <span>Peringatan laju alir stopcock di sekitar titik akhir</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectMode('guided')}
              className="w-full py-3 px-4 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pilih Mode Terbimbing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Challenge Mode - Editorial Inverted Obsidian Card */}
          <div className="p-6 bg-[#1D1D1B] text-[#F9F7F2] border border-[#1D1D1B] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#F9F7F2]/40">
                  Mode 02
                </span>
                <span className="text-2xl font-serif italic text-[#C4A484]">B</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-[#F9F7F2] mb-1">Tantangan Mandiri</h4>
              <p className="text-xs text-[#C4A484] font-serif italic mb-4">
                Simulasi penuh tanpa asistensi visual, menguji kepekaan analitis.
              </p>
              <ul className="text-xs text-[#F9F7F2]/80 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                  <span>Instruksi minimal tanpa petunjuk otomatis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                  <span>Bebas tanpa penyorotan alat aktif</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                  <span>Tentukan sendiri titik akhir dari warna larutan</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                  <span>Penilaian objektif komprehensif di lembar akhir</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectMode('challenge')}
              className="w-full py-3 px-4 bg-[#C4A484] hover:bg-[#b59575] text-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <span>Pilih Mode Tantangan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
