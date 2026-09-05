import React from 'react';
import {
  FlaskConical,
  Play,
  BookOpen,
  Beaker,
  Award,
  ArrowRight,
  CheckCircle2,
  FileText,
  RotateCcw,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { ActiveExperimentSession, SavedExperimentReport } from '../../types';

interface HomePageProps {
  lastReport: SavedExperimentReport | null;
  activeSession: ActiveExperimentSession | null;
  onStart: () => void;
  onResumeActive: () => void;
  onStartNew: () => void;
  onLearnConcept: () => void;
  onEquipmentGuide: () => void;
  onViewLastReport: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  lastReport,
  activeSession,
  onStart,
  onResumeActive,
  onStartNew,
  onLearnConcept,
  onEquipmentGuide,
  onViewLastReport
}) => {
  const hasActiveProgress = Boolean(
    activeSession &&
    (activeSession.trials.length > 0 ||
     activeSession.currentScreen === 'LAB' ||
     activeSession.currentScreen === 'CALCULATION' ||
     activeSession.currentScreen === 'CURVE_ANALYSIS' ||
     activeSession.currentScreen === 'CONCEPT_QUESTIONS')
  );

  const getScreenLabel = (screen?: string) => {
    switch (screen) {
      case 'LAB':
        return 'Meja Laboratorium';
      case 'CALCULATION':
        return 'Lembar Hitung Kadar';
      case 'CURVE_ANALYSIS':
        return 'Analisis Kurva pH';
      case 'CONCEPT_QUESTIONS':
        return 'Evaluasi Konseptual';
      case 'FINAL_REPORT':
        return 'Laporan Akhir';
      default:
        return 'Praktikum Berjalan';
    }
  };
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1D1D1B] flex flex-col justify-between selection:bg-[#1D1D1B] selection:text-[#F9F7F2] relative overflow-hidden">
      {/* Top Header Navbar - Editorial Style */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-7 flex items-center justify-between border-b border-[#1D1D1B]/10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#1D1D1B] flex items-center justify-center text-[#1D1D1B] bg-transparent">
            <FlaskConical className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1D1D1B] block leading-none">
              V-LAB KIMIA<span className="text-[#C4A484]">.</span>
            </span>
            <span className="text-[9px] block font-sans text-[#1D1D1B]/60 font-bold tracking-[0.25em] uppercase mt-1">
              Fascicle XI • Analisis Volumetri
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={onLearnConcept}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-opacity hidden sm:inline-block cursor-pointer"
          >
            Konsep Titrasi
          </button>
          <button
            onClick={onEquipmentGuide}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-opacity hidden sm:inline-block cursor-pointer"
          >
            Aparatus Lab
          </button>
          {hasActiveProgress ? (
            <button
              onClick={onResumeActive}
              className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lanjut Praktikum</span>
            </button>
          ) : (
            <button
              onClick={onStart}
              className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              Mulai Praktikum
            </button>
          )}
        </nav>
      </header>

      {/* Main Editorial Hero Grid */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center flex-1">
        {/* Left Column: Monograph Title & Action */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-1 px-3 border border-[#1D1D1B]">
              Vol. 11 / Asam–Basa
            </span>
            <span className="h-[1px] w-10 sm:w-16 bg-[#1D1D1B]/30" />
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
              Simulasi Netralisasi Presisi
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1D1D1B] leading-[0.95] tracking-tight mb-8">
            Laboratorium Virtual <br />
            <span className="italic text-[#C4A484] ml-2 sm:ml-6">Titrasi Volumetri.</span>
          </h1>

          <div className="flex gap-6 sm:gap-8 items-start mb-10">
            <div className="w-16 sm:w-24 h-[1px] bg-[#1D1D1B] mt-3.5 shrink-0" />
            <p className="text-base sm:text-lg leading-relaxed text-[#1D1D1B]/80 font-serif italic max-w-xl">
              Eksplorasi stoikiometri analitik netralisasi HCl dengan titran baku NaOH 0.1000 M.
              Atur stopcock buret tetes demi tetes, goyang labu Erlenmeyer, amati transisi semu fenolftalein,
              dan baca meniskus sejajar garis mata.
            </p>
          </div>

          {/* Action Row */}
          <div className="space-y-4">
            {hasActiveProgress && activeSession ? (
              <div className="p-4 sm:p-5 bg-white border-2 border-[#1D1D1B] max-w-xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-sans font-bold text-[10px] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Sesi Praktikum Berjalan (Tersimpan)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#1D1D1B]/70 bg-[#F4EFE6] px-2 py-0.5 border border-[#1D1D1B]/15">
                    {activeSession.trials.length} Percobaan Dicatat
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#1D1D1B]/10">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1D1D1B] leading-snug">
                      {activeSession.profile.name || 'Praktikan Kimia'}
                      {activeSession.profile.className ? ` • ${activeSession.profile.className}` : ''}
                    </h3>
                    <p className="text-xs text-[#1D1D1B]/70 font-serif italic mt-0.5">
                      Tahap terakhir: <strong>{getScreenLabel(activeSession.currentScreen)}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onResumeActive}
                      className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Lanjut Sesi</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C4A484]" />
                    </button>
                    <button
                      onClick={onStartNew}
                      className="p-2.5 border border-[#1D1D1B]/30 hover:border-[#1D1D1B] text-[#1D1D1B] text-[10px] transition-colors cursor-pointer"
                      title="Mulai Praktikum Baru (Reset)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={onStart}
                  className="cursor-pointer flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full border border-[#1D1D1B] flex items-center justify-center group-hover:bg-[#1D1D1B] group-hover:text-[#F9F7F2] transition-colors">
                    <ArrowRight className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]">
                      Masuk ke Meja Praktikum
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-[#1D1D1B]/50 mt-0.5">
                      Mode Terbimbing & Tantangan
                    </span>
                  </div>
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLearnConcept}
                className="px-4 py-2 border border-[#1D1D1B]/30 hover:border-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B] transition-colors cursor-pointer"
              >
                Teori Titrasi
              </button>
              <button
                onClick={onEquipmentGuide}
                className="px-4 py-2 border border-[#1D1D1B]/30 hover:border-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B] transition-colors cursor-pointer"
              >
                Aparatus
              </button>
              {hasActiveProgress && (
                <button
                  onClick={onStartNew}
                  className="px-4 py-2 border border-[#1D1D1B]/30 hover:border-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Mulai Baru</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Featured Card / Recent Experiment */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#1D1D1B] text-[#F9F7F2] p-8 sm:p-10 flex flex-col justify-between border-b border-[#F9F7F2]/10 relative">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
                Log Praktikum
              </span>
              <span className="text-3xl font-serif italic text-[#C4A484]">
                01
              </span>
            </div>

            <div className="mb-6">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C4A484] font-bold block mb-1">
                Catatan Eksperimen
              </span>
              <h2 className="text-2xl font-serif leading-tight text-[#F9F7F2]">
                {lastReport ? lastReport.student.name || 'Praktikan Kimia' : 'Standarisasi Larutan & Analisis Sampel'}
              </h2>
              <p className="text-[11px] opacity-60 leading-relaxed font-sans uppercase tracking-[0.15em] font-medium mt-2">
                {lastReport ? `${lastReport.student.className} • ${lastReport.timestamp}` : 'Reaksi HCl (aq) + NaOH (aq) → NaCl (aq) + H2O (l)'}
              </p>
            </div>

            {lastReport ? (
              <div className="border-t border-[#F9F7F2]/15 pt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 block">Konsentrasi Ditemukan</span>
                    <span className="text-xl font-serif text-[#C4A484] font-semibold">
                      {lastReport.calculatedConcentration.toFixed(4)} M
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 block">Skor Rubrik</span>
                    <span className="text-xl font-serif text-[#F9F7F2] font-bold">
                      {lastReport.scores.totalScore} <span className="text-xs opacity-50 font-sans">/ 100</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4A484]">
                    Galat: {lastReport.percentError.toFixed(2)}%
                  </span>
                  <button
                    onClick={onViewLastReport}
                    className="px-4 py-2 border border-[#F9F7F2]/40 hover:border-[#F9F7F2] text-[9px] font-bold uppercase tracking-[0.2em] text-[#F9F7F2] transition-colors cursor-pointer"
                  >
                    Buka Laporan
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-[#F9F7F2]/15 pt-5 text-xs opacity-70 font-serif italic">
                Belum ada berkas tersimpan. Tekan &ldquo;Mulai Praktikum&rdquo; untuk merakit buret dan memulai penetapan kadar sampel misteri.
              </div>
            )}
          </div>

          {/* Secondary Journal Panel */}
          <div className="p-8 bg-[#FFFFFF] border border-[#1D1D1B]/10 border-t-0 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1D1D1B]/40">
                Spesifikasi Standar
              </span>
              <span className="text-xl font-serif italic text-[#1D1D1B]/30">
                02
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#1D1D1B]/50 block font-bold">Titran Baku</span>
                <span className="text-sm font-serif font-bold text-[#1D1D1B]">NaOH 0.1000 M</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#1D1D1B]/50 block font-bold">Volume Analit</span>
                <span className="text-sm font-serif font-bold text-[#1D1D1B]">25.00 mL HCl</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#1D1D1B]/50 block font-bold">Indikator</span>
                <span className="text-sm font-serif font-bold text-[#1D1D1B]">Fenolftalein (PP)</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#1D1D1B]/50 block font-bold">Titik Akhir</span>
                <span className="text-sm font-serif font-bold text-[#C4A484]">Merah Muda Seulas</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Editorial Publication Colophon */}
      <footer className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-6 border-t border-[#1D1D1B]/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-[#1D1D1B]/60 relative z-10 gap-3">
        <div>© Laboratorium Kimia SMA/MA • Analisis Volumetri Titrasi</div>
        <div className="flex gap-8 text-[#1D1D1B]/40">
          <span>Titrasi Asam–Basa</span>
          <span>•</span>
          <span>Buret 50 mL</span>
          <span>•</span>
          <span>Fenolftalein</span>
        </div>
        <div className="italic font-serif normal-case tracking-normal text-xs text-[#C4A484]">
          Ref: Kemdikbud Kurikulum Merdeka
        </div>
      </footer>
    </div>
  );
};
