import React from 'react';
import { Target, FlaskConical, Beaker, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { LabMode, StudentProfile } from '../../types';

interface ExperimentBriefViewProps {
  profile?: StudentProfile;
  mode?: LabMode;
  onStartExperiment?: () => void;
  onContinue?: () => void;
  onBack: () => void;
}

export const ExperimentBriefView: React.FC<ExperimentBriefViewProps> = ({
  profile,
  mode = 'guided',
  onStartExperiment,
  onContinue,
  onBack
}) => {
  const handleStart = onStartExperiment || onContinue || (() => {});
  const studentName = profile?.name || 'Praktikan';
  const studentClass = profile?.className || 'Kelas XI';
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F9F7F2] text-[#1D1D1B]">
      <div className="w-full max-w-3xl bg-[#FFFFFF] border border-[#1D1D1B] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Header Badge */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#1D1D1B]/15">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-1 px-3 border border-[#1D1D1B]">
            Misi Analisis Volumetri
          </span>
          <span className="h-[1px] w-12 bg-[#1D1D1B]/30" />
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
            Kurikulum Kimia SMA Kelas XI
          </span>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D1D1B] tracking-tight mb-2">
            Penetapan Kadar <span className="italic text-[#C4A484]">HCl Melalui Titrasi.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#1D1D1B]/75 font-serif italic leading-relaxed">
            Selamat datang, <strong className="text-[#1D1D1B] not-italic">{studentName}</strong> ({studentClass}). Suatu alikuot asam klorida belum diketahui konsentrasinya. Tugas Anda adalah melakukan standarisasi dan titrasi alkalimetri presisi.
          </p>
        </div>

        {/* Known Chemistry Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Analit HCl */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1D1D1B]/60">01 / Analit</span>
              <FlaskConical className="w-4 h-4 text-[#C4A484] stroke-[1.5]" />
            </div>
            <p className="text-lg font-serif font-bold text-[#1D1D1B]">HCl (aq)</p>
            <div className="text-xs text-[#1D1D1B]/70 mt-2 space-y-0.5">
              <p>Alikuot: <strong className="font-semibold text-[#1D1D1B]">25.00 mL</strong></p>
              <p>Kadar: <span className="font-serif italic text-[#C4A484] font-bold">Misteri (Dicari)</span></p>
            </div>
          </div>

          {/* Titran NaOH */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1D1D1B]/60">02 / Titran Baku</span>
              <Beaker className="w-4 h-4 text-[#1D1D1B] stroke-[1.5]" />
            </div>
            <p className="text-lg font-serif font-bold text-[#1D1D1B]">NaOH (aq)</p>
            <div className="text-xs text-[#1D1D1B]/70 mt-2 space-y-0.5">
              <p>Konsentrasi: <strong className="font-semibold text-[#1D1D1B]">0.1000 M</strong></p>
              <p>Kapasitas buret: <span className="font-serif text-[#1D1D1B]">50.00 mL</span></p>
            </div>
          </div>

          {/* Indikator Fenolftalein */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1D1D1B]/60">03 / Indikator</span>
              <BookOpen className="w-4 h-4 text-[#C4A484] stroke-[1.5]" />
            </div>
            <p className="text-lg font-serif font-bold text-[#1D1D1B]">Fenolftalein (PP)</p>
            <div className="text-xs text-[#1D1D1B]/70 mt-2 space-y-0.5">
              <p>Trayek pH: <strong className="font-semibold text-[#1D1D1B]">8.2 – 10.0</strong></p>
              <p>Titik akhir: <span className="font-serif italic text-[#C4A484]">Merah muda seulas</span></p>
            </div>
          </div>
        </div>

        {/* Stoichiometric Reaction Box */}
        <div className="p-4 bg-[#F4EFE6] border border-[#1D1D1B]/15 mb-6 text-center font-serif text-sm text-[#1D1D1B]">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/50 block font-sans mb-1">
            Persamaan Reaksi Netralisasi
          </span>
          <div className="text-base font-semibold">
            HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l)
          </div>
          <span className="text-xs text-[#C4A484] font-serif italic block mt-1">
            Rasio Stoikiometri Mol = 1 : 1 (n HCl = n NaOH)
          </span>
        </div>

        {/* Mode Indicator Callout */}
        <div className="flex items-center gap-2 text-xs text-[#1D1D1B]/70 mb-8">
          <AlertCircle className="w-4 h-4 text-[#C4A484] shrink-0" />
          <span>
            Mode aktif:{' '}
            <strong className="text-[#1D1D1B] font-bold capitalize">
              {mode === 'guided' ? 'Laboratorium Terbimbing (Dengan Asistensi)' : 'Tantangan Mandiri'}
            </strong>
          </span>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-[#1D1D1B]/15">
          <button
            type="button"
            onClick={onBack}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-colors cursor-pointer"
          >
            ← Kembali
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="py-3 px-6 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-colors cursor-pointer"
          >
            <span>Masuk Meja Praktikum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
