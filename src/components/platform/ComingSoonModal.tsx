import React from 'react';
import { ExperimentRegistryItem } from '../../platform/types';
import { ExperimentThumbnail } from './ExperimentThumbnails';
import { Calendar, Clock, BookOpen, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface ComingSoonModalProps {
  experiment: ExperimentRegistryItem | null;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ experiment, onClose }) => {
  if (!experiment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/60 backdrop-blur-xs animate-fadeIn selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      <div className="relative w-full max-w-lg bg-[#F9F7F2] border-2 border-[#1D1D1B] shadow-[8px_8px_0px_#1D1D1B] p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 p-1.5 text-[#1D1D1B]/60 hover:text-[#1D1D1B] border border-transparent hover:border-[#1D1D1B] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with thumbnail & badge */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 bg-white border border-[#1D1D1B] p-2 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1D1D1B]">
            <ExperimentThumbnail type={experiment.thumbnailType} className="w-12 h-12 text-[#1D1D1B]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#F4EFE6] border border-[#1D1D1B]/30 text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]">
                {experiment.code}
              </span>
              <span className="px-2 py-0.5 bg-amber-100 border border-amber-400 text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                SEGERA HADIR
              </span>
              <span className="px-2 py-0.5 bg-white border border-[#1D1D1B]/20 text-[10px] font-mono text-[#1D1D1B]/70">
                {experiment.grade.join(', ')}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1D1D1B] leading-snug">
              {experiment.title}
            </h2>
          </div>
        </div>

        {/* Metadata info strip */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-white border border-[#1D1D1B]/20 text-xs font-mono mb-5">
          <div className="flex items-center gap-2 text-[#1D1D1B]/80">
            <BookOpen className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>Materi: <strong>{experiment.topic}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[#1D1D1B]/80">
            <Clock className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>Estimasi: <strong>{experiment.durationMinutes} Menit</strong></span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <h3 className="text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/60 mb-1.5">
            Deskripsi Praktikum
          </h3>
          <p className="text-sm font-serif text-[#1D1D1B] leading-relaxed">
            {experiment.description}
          </p>
        </div>

        {/* Future interaction roadmap */}
        {experiment.futureActivities && experiment.futureActivities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/60 mb-2">
              Aktivitas Simulasi Mendatang
            </h3>
            <div className="space-y-1.5 bg-white border border-[#1D1D1B]/20 p-3 max-h-44 overflow-y-auto">
              {experiment.futureActivities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-sans text-[#1D1D1B]/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap notice */}
        <div className="p-3 bg-[#F4EFE6] border border-[#1D1D1B]/20 flex items-start gap-2.5 text-xs font-mono text-[#1D1D1B]/80 mb-6">
          <AlertCircle className="w-4 h-4 text-[#C4A484] shrink-0 mt-0.5" />
          <span>
            Modul ini sedang dalam tahap pengembangan kurikulum kuantitatif. Praktikum baru akan ditambahkan secara bertahap.
          </span>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold uppercase tracking-[0.2em] shadow-[2px_2px_0px_#C4A484] transition cursor-pointer"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    </div>
  );
};
