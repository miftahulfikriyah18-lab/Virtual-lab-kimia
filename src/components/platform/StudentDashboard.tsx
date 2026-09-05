import React from 'react';
import {
  ExperimentProgressRecord,
  ExperimentRegistryItem,
  PlatformNavigationTab,
  StudentDashboardSummary,
  StudentUser
} from '../../platform/types';
import { EXPERIMENTS_REGISTRY } from '../../platform/experimentsRegistry';
import { ExperimentThumbnail } from './ExperimentThumbnails';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Award,
  Clock,
  BookOpen,
  FlaskConical,
  Compass,
  FileText
} from 'lucide-react';

interface StudentDashboardProps {
  user: StudentUser;
  summary: StudentDashboardSummary;
  titrationProgress: ExperimentProgressRecord | null;
  onNavigateTab: (tab: PlatformNavigationTab) => void;
  onStartTitration: () => void;
  onResumeTitration: () => void;
  onSelectExperiment: (exp: ExperimentRegistryItem) => void;
  onViewReport: () => void;
  justCompletedScore?: number | null;
  onDismissCompletionNotice?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  summary,
  titrationProgress,
  onNavigateTab,
  onStartTitration,
  onResumeTitration,
  onSelectExperiment,
  onViewReport,
  justCompletedScore,
  onDismissCompletionNotice
}) => {
  const isTitrationCompleted = titrationProgress?.status === 'completed';
  const isTitrationInProgress = titrationProgress?.status === 'in_progress';
  const titrationExp = EXPERIMENTS_REGISTRY.find((e) => e.id === 'XI-06')!;

  return (
    <div className="space-y-8 animate-fadeIn selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* 1. SUCCESS BANNER AFTER EXPERIMENT COMPLETION */}
      {justCompletedScore !== undefined && justCompletedScore !== null && (
        <div className="p-5 bg-[#F4EFE6] border-2 border-[#1D1D1B] shadow-[4px_4px_0px_#1D1D1B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1D1D1B]/70">
                  Praktikum Selesai
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-100 border border-emerald-400 text-emerald-800 text-[10px] font-mono font-bold">
                  Nilai: {justCompletedScore}
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#1D1D1B]">
                Titrasi Asam–Basa telah berhasil diselesaikan!
              </h3>
              <p className="text-xs text-[#1D1D1B]/80 font-serif">
                Laporan praktikum resmi dan nilai kompetensi telah tersimpan di riwayat belajar Anda.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onViewReport}
              className="px-4 py-2 bg-white hover:bg-[#F9F7F2] border border-[#1D1D1B] text-xs font-mono font-bold uppercase tracking-wider text-[#1D1D1B] cursor-pointer"
            >
              Lihat Laporan
            </button>
            {onDismissCompletionNotice && (
              <button
                onClick={onDismissCompletionNotice}
                className="px-3 py-2 text-[#1D1D1B]/60 hover:text-[#1D1D1B] text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. DASHBOARD HERO */}
      <div className="relative bg-white border-2 border-[#1D1D1B] shadow-[6px_6px_0px_#1D1D1B] p-6 sm:p-10 overflow-hidden">
        {/* Subtle background graph lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1D1D1B 1px, transparent 1px), linear-gradient(to bottom, #1D1D1B 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 max-w-2xl">
          {/* Greeting Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EFE6] border border-[#1D1D1B]/30 text-[10px] font-mono uppercase tracking-[0.2em] text-[#1D1D1B] mb-4">
            <Sparkles className="w-3 h-3 text-[#C4A484]" />
            <span>Selamat datang, {user.name}</span>
            <span className="text-[#1D1D1B]/40">•</span>
            <span>{user.grade}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1D1D1B] tracking-tight leading-tight mb-3">
            Laboratorium Virtual Kimia
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base font-serif text-[#1D1D1B]/85 leading-relaxed mb-8">
            Jelajahi eksperimen kimia, lakukan praktikum secara virtual, dan pantau perkembangan belajarmu dengan simulasi kuantitatif presisi tinggi.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('katalog')}
              className="px-6 py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold font-mono uppercase tracking-[0.2em] shadow-[2px_2px_0px_#C4A484] flex items-center gap-2 transition cursor-pointer"
            >
              <span>Jelajahi Praktikum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Secondary button if unfinished available experiment exists */}
            {isTitrationInProgress && (
              <button
                onClick={onResumeTitration}
                className="px-5 py-3 bg-white hover:bg-[#F4EFE6] border border-[#1D1D1B] text-[#1D1D1B] text-xs font-bold font-mono uppercase tracking-[0.2em] shadow-[2px_2px_0px_#1D1D1B] flex items-center gap-2 transition cursor-pointer"
              >
                <span>Lanjutkan Praktikum</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C4A484]" />
              </button>
            )}

            {!isTitrationInProgress && !isTitrationCompleted && (
              <button
                onClick={onStartTitration}
                className="px-5 py-3 bg-white hover:bg-[#F4EFE6] border border-[#1D1D1B] text-[#1D1D1B] text-xs font-bold font-mono uppercase tracking-[0.2em] shadow-[2px_2px_0px_#1D1D1B] flex items-center gap-2 transition cursor-pointer"
              >
                <span>Mulai Titrasi Asam-Basa</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C4A484]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. STUDENT PROGRESS SUMMARY (PROGRES SAYA) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#1D1D1B] font-bold">
            Progres Saya
          </h2>
          <button
            onClick={() => onNavigateTab('progres')}
            className="text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/70 hover:text-[#1D1D1B] underline cursor-pointer"
          >
            Lihat Analisis Lengkap →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Praktikum Selesai */}
          <div className="bg-white border-2 border-[#1D1D1B] p-5 shadow-[3px_3px_0px_#1D1D1B]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60">
              Praktikum Selesai
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B]">
                {summary.completedCount}
              </span>
              <span className="text-xs font-mono text-[#1D1D1B]/60">
                / {summary.availableCount} Modul Aktif
              </span>
            </div>
            <div className="mt-3 w-full bg-[#F4EFE6] h-1.5 border border-[#1D1D1B]/20">
              <div
                className="bg-[#1D1D1B] h-full transition-all duration-500"
                style={{ width: `${summary.completionPercentage}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-[#1D1D1B]/60 mt-1.5">
              {summary.completionPercentage}% laboratorium selesai
            </p>
          </div>

          {/* Card 2: Sedang Dikerjakan */}
          <div className="bg-white border-2 border-[#1D1D1B] p-5 shadow-[3px_3px_0px_#1D1D1B]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60">
              Sedang Dikerjakan
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B]">
                {summary.inProgressCount}
              </span>
              <span className="text-xs font-mono text-[#1D1D1B]/60">Sesi Aktif</span>
            </div>
            <p className="text-[10px] font-mono text-[#1D1D1B]/60 mt-4">
              {summary.inProgressCount > 0
                ? 'Titrasi Asam–Basa siap dilanjutkan'
                : 'Tidak ada sesi tertunda'}
            </p>
          </div>

          {/* Card 3: Nilai Terbaik */}
          <div className="bg-white border-2 border-[#1D1D1B] p-5 shadow-[3px_3px_0px_#1D1D1B]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60">
              Nilai Terbaik
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B]">
                {summary.bestScore !== null ? summary.bestScore : '—'}
              </span>
              <span className="text-xs font-mono text-[#1D1D1B]/60">/ 100</span>
            </div>
            <p className="text-[10px] font-mono text-[#1D1D1B]/60 mt-4">
              {summary.bestScore !== null ? 'Standar Evaluasi Rubrik Resmi' : 'Belum ada penilaian'}
            </p>
          </div>

          {/* Card 4: Total Percobaan */}
          <div className="bg-white border-2 border-[#1D1D1B] p-5 shadow-[3px_3px_0px_#1D1D1B]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60">
              Total Percobaan
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B]">
                {summary.totalAttempts}
              </span>
              <span className="text-xs font-mono text-[#1D1D1B]/60">Kali</span>
            </div>
            <p className="text-[10px] font-mono text-[#1D1D1B]/60 mt-4">
              Latihan berulang mengasah ketelitian
            </p>
          </div>
        </div>
      </div>

      {/* 4. CONTINUE LEARNING (LANJUTKAN PRAKTIKUM / LIHAT HASIL) */}
      <div className="bg-[#F4EFE6] border-2 border-[#1D1D1B] p-6 shadow-[4px_4px_0px_#1D1D1B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white border border-[#1D1D1B] p-2 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1D1D1B]">
              <ExperimentThumbnail type="titration" className="w-10 h-10 text-[#1D1D1B]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-white border border-[#1D1D1B]/30 text-[9px] font-mono uppercase tracking-wider text-[#1D1D1B]">
                  {titrationExp.code} • {titrationExp.topic}
                </span>
                {isTitrationCompleted ? (
                  <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-400 text-emerald-800 text-[9px] font-mono font-bold uppercase tracking-wider">
                    Selesai
                  </span>
                ) : isTitrationInProgress ? (
                  <span className="px-2 py-0.5 bg-sky-100 border border-sky-400 text-sky-800 text-[9px] font-mono font-bold uppercase tracking-wider">
                    Sedang Dikerjakan
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-[#1D1D1B] text-[#F9F7F2] text-[9px] font-mono font-bold uppercase tracking-wider">
                    Tersedia
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1D1D1B]">
                Titrasi Asam–Basa
              </h3>

              <p className="text-xs font-serif text-[#1D1D1B]/80 max-w-xl mt-1">
                Tentukan konsentrasi larutan analit HCl yang tidak diketahui melalui titrasi kuantitatif menggunakan larutan standar NaOH 0.1 M dan indikator fenolftalein.
              </p>

              {isTitrationCompleted && (
                <div className="flex items-center gap-4 mt-3 text-xs font-mono">
                  <span>Nilai Terbaik: <strong>{titrationProgress?.bestScore}</strong></span>
                  <span>•</span>
                  <span>Percobaan: <strong>{titrationProgress?.attempts} kali</strong></span>
                  {titrationProgress?.latestResult?.ratingTitle && (
                    <>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 bg-white border border-[#1D1D1B]/30 text-[10px]">
                        {titrationProgress.latestResult.ratingTitle}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isTitrationCompleted ? (
              <>
                <button
                  onClick={onViewReport}
                  className="px-4 py-2.5 bg-white hover:bg-[#F9F7F2] border border-[#1D1D1B] text-xs font-mono font-bold uppercase tracking-wider text-[#1D1D1B] shadow-[2px_2px_0px_#1D1D1B] cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lihat Hasil</span>
                </button>
                <button
                  onClick={onStartTitration}
                  className="px-4 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#C4A484] cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi Praktikum</span>
                </button>
              </>
            ) : isTitrationInProgress ? (
              <button
                onClick={onResumeTitration}
                className="px-6 py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#C4A484] cursor-pointer flex items-center gap-2"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onStartTitration}
                className="px-6 py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#C4A484] cursor-pointer flex items-center gap-2"
              >
                <span>Mulai Praktikum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. ROADMAP NOTICE & QUICK PREVIEW */}
      <div className="border border-[#1D1D1B]/20 bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D1D1B]/15 pb-4 mb-6">
          <div>
            <h3 className="text-base font-serif font-bold text-[#1D1D1B]">
              Laboratorium Terus Berkembang
            </h3>
            <p className="text-xs font-mono text-[#1D1D1B]/70 mt-0.5">
              Praktikum baru akan ditambahkan secara bertahap sesuai kurikulum nasional.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('katalog')}
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D1D1B] hover:text-[#C4A484] underline cursor-pointer"
          >
            Lihat Semua 24 Modul di Katalog →
          </button>
        </div>

        {/* Quick horizontal preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPERIMENTS_REGISTRY.slice(0, 3).map((exp) => (
            <div
              key={exp.id}
              onClick={() => onSelectExperiment(exp)}
              className="p-4 border border-[#1D1D1B]/20 bg-[#F9F7F2] hover:border-[#1D1D1B] hover:bg-[#F4EFE6] transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 bg-amber-100 text-amber-800 border border-amber-300">
                  SEGERA HADIR
                </span>
                <span className="text-[10px] font-mono text-[#1D1D1B]/60">{exp.code}</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#1D1D1B] line-clamp-1">
                {exp.title}
              </h4>
              <p className="text-xs font-serif text-[#1D1D1B]/75 line-clamp-2 mt-1">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
