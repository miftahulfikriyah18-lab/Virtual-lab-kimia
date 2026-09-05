import React from 'react';
import { ExperimentProgressRecord, StudentDashboardSummary } from '../../platform/types';
import { Award, CheckCircle2, AlertCircle, ShieldCheck, Target, Calculator, Eye } from 'lucide-react';

interface ProgressViewProps {
  summary: StudentDashboardSummary;
  titrationProgress: ExperimentProgressRecord | null;
  onGoToLab: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  summary,
  titrationProgress,
  onGoToLab
}) => {
  const isCompleted = titrationProgress?.status === 'completed';
  const evalData = titrationProgress?.reportData?.scores;

  return (
    <div className="space-y-8 animate-fadeIn selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* Header */}
      <div className="border-b border-[#1D1D1B]/20 pb-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1D1D1B]/60">
          Evaluasi Kompetensi
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B] tracking-tight mt-1">
          Progres Belajar Praktikan
        </h1>
        <p className="text-sm font-serif text-[#1D1D1B]/80 mt-1">
          Ringkasan pencapaian keterampilan psikomotorik virtual, ketelitian pengukuran analitis, dan pemahaman konsep stoikiometri.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border-2 border-[#1D1D1B] p-6 shadow-[4px_4px_0px_#1D1D1B]">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60">
            Penyelesaian Laboratorium Aktif
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-[#1D1D1B]">
              {summary.completionPercentage}%
            </span>
            <span className="text-xs font-mono text-[#1D1D1B]/60">
              ({summary.completedCount} / {summary.availableCount} Modul Aktif)
            </span>
          </div>
          <div className="mt-3 w-full bg-[#F4EFE6] h-2 border border-[#1D1D1B]/20">
            <div
              className="bg-[#1D1D1B] h-full transition-all duration-500"
              style={{ width: `${summary.completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-[#1D1D1B]/60 mt-2">
            Hanya menghitung modul yang telah tersedia di kurikulum aktif.
          </p>
        </div>

        <div className="bg-white border-2 border-[#1D1D1B] p-6 shadow-[4px_4px_0px_#1D1D1B]">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60">
            Nilai Terbaik Praktikum
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-[#1D1D1B]">
              {summary.bestScore !== null ? summary.bestScore : '—'}
            </span>
            <span className="text-xs font-mono text-[#1D1D1B]/60">/ 100</span>
          </div>
          <p className="text-xs font-serif text-[#1D1D1B]/80 mt-3">
            {titrationProgress?.latestResult?.ratingTitle
              ? `Predikat: ${titrationProgress.latestResult.ratingTitle}`
              : 'Selesaikan modul untuk mendapatkan sertifikasi nilai.'}
          </p>
        </div>

        <div className="bg-white border-2 border-[#1D1D1B] p-6 shadow-[4px_4px_0px_#1D1D1B]">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60">
            Total Frekuensi Percobaan
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-[#1D1D1B]">
              {summary.totalAttempts}
            </span>
            <span className="text-xs font-mono text-[#1D1D1B]/60">Sesi Uji Coba</span>
          </div>
          <p className="text-xs font-serif text-[#1D1D1B]/80 mt-3">
            Pengulangan titrasi (titrasi konkordan) meningkatkan presisi data eksperimen.
          </p>
        </div>
      </div>

      {/* Rubric Competency Breakdown if available */}
      <div className="bg-white border-2 border-[#1D1D1B] shadow-[6px_6px_0px_#1D1D1B] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D1D1B]/15 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#F4EFE6] border border-[#1D1D1B]/30 text-[#1D1D1B]">
              Modul XI-06 • Titrasi Asam–Basa
            </span>
            <h2 className="text-xl font-serif font-bold text-[#1D1D1B] mt-1">
              Rubrik Penilaian Standar Analis Kimia
            </h2>
          </div>
          {isCompleted ? (
            <span className="px-3 py-1 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono font-bold uppercase">
              Telah Dinilai Resmi
            </span>
          ) : (
            <button
              onClick={onGoToLab}
              className="px-4 py-2 bg-[#1D1D1B] text-[#F9F7F2] text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#C4A484] cursor-pointer"
            >
              Mulai Penilaian di Lab
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Skill 1 */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C4A484]" />
                <h3 className="font-bold text-sm text-[#1D1D1B]">Teknik & Prosedur Praktikum (Bobot: 30)</h3>
              </div>
              <span className="font-mono text-xs font-bold">
                {evalData ? `${evalData.techniqueScore} / 30` : '—'}
              </span>
            </div>
            <p className="text-xs text-[#1D1D1B]/70 font-serif">
              Pembilasan buret (air suling & NaOH), inspeksi gelembung udara pada ujung buret, pengenceran, dan teknik penggoyangan labu erlenmeyer.
            </p>
          </div>

          {/* Skill 2 */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#C4A484]" />
                <h3 className="font-bold text-sm text-[#1D1D1B]">Akurasi Titrasi & Titik Akhir (Bobot: 30)</h3>
              </div>
              <span className="font-mono text-xs font-bold">
                {evalData ? `${evalData.accuracyScore} / 30` : '—'}
              </span>
            </div>
            <p className="text-xs text-[#1D1D1B]/70 font-serif">
              Penghentian titrasi tepat pada titik ekuivalen indikator fenolftalein (merah muda seulas bertahan 30 detik tanpa terjadi lewat-titrasi).
            </p>
          </div>

          {/* Skill 3 */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C4A484]" />
                <h3 className="font-bold text-sm text-[#1D1D1B]">Presisi & Data Konkordan (Bobot: 20)</h3>
              </div>
              <span className="font-mono text-xs font-bold">
                {evalData ? `${evalData.precisionScore} / 20` : '—'}
              </span>
            </div>
            <p className="text-xs text-[#1D1D1B]/70 font-serif">
              Konsistensi pembacaan meniskus awal dan akhir pada minimal 2 kali titrasi teliti dengan selisih volume titre ≤ 0,10 mL.
            </p>
          </div>

          {/* Skill 4 */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#C4A484]" />
                <h3 className="font-bold text-sm text-[#1D1D1B]">Perhitungan Stoikiometri (Bobot: 15)</h3>
              </div>
              <span className="font-mono text-xs font-bold">
                {evalData ? `${evalData.calculationScore} / 15` : '—'}
              </span>
            </div>
            <p className="text-xs text-[#1D1D1B]/70 font-serif">
              Penentuan volume rata-rata titran, perhitungan mol NaOH, kesetaraan reaksi mol 1:1, dan konsentrasi molaritas analit HCl.
            </p>
          </div>

          {/* Skill 5 */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C4A484]" />
                <h3 className="font-bold text-sm text-[#1D1D1B]">Keselamatan Kerja / APD (Bobot: 5)</h3>
              </div>
              <span className="font-mono text-xs font-bold">
                {evalData ? `${evalData.safetyScore} / 5` : '—'}
              </span>
            </div>
            <p className="text-xs text-[#1D1D1B]/70 font-serif">
              Kepatuhan terhadap standar keselamatan kerja di laboratorium kimia basah (penggunaan jas lab, kacamata goggle, dan sarung tangan nitril).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
