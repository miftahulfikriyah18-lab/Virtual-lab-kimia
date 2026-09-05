import React from 'react';
import {
  FileText,
  Printer,
  RotateCcw,
  Home,
  CheckCircle2,
  Award,
  AlertCircle,
  TrendingUp,
  FlaskConical
} from 'lucide-react';
import { FinalEvaluation, LabMode, StudentProfile, TrialData } from '../../types';
import { formatDecimals } from '../../utils/chemistry';

interface FinalReportViewProps {
  profile: StudentProfile;
  mode: LabMode;
  trials: TrialData[];
  evaluation: FinalEvaluation;
  onRestart: () => void;
  onSwitchMode: () => void;
  onHome: () => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  profile,
  mode,
  trials,
  evaluation,
  onRestart,
  onSwitchMode,
  onHome
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const accurateTrials = trials.filter((t) => !t.isRough && t.deliveredVolume > 0);
  const avgTitre =
    accurateTrials.length > 0
      ? accurateTrials.reduce((a, b) => a + b.deliveredVolume, 0) / accurateTrials.length
      : 0;

  const handlePrint = () => {
    window.print();
  };

  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'Master Titrasi':
        return 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]';
      case 'Analis Terampil':
        return 'bg-[#F4EFE6] text-[#1D1D1B] border-[#1D1D1B]';
      case 'Praktikan Berkembang':
        return 'bg-[#F9F7F2] text-[#1D1D1B] border-[#C4A484]';
      default:
        return 'bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/40';
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 bg-[#F9F7F2] text-[#1D1D1B] flex flex-col items-center">
      {/* Top Action Bar (No Print) */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 no-print">
        <button
          onClick={onHome}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F4EFE6] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B] border border-[#1D1D1B] transition cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>Beranda</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#F4EFE6] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B] border border-[#1D1D1B] transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>Cetak Dokumen (A4)</span>
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[10px] font-bold uppercase tracking-[0.2em] text-[#F9F7F2] transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>Ulangi Praktikum</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="w-full max-w-4xl bg-white border border-[#1D1D1B] p-8 md:p-12 shadow-sm text-[#1D1D1B] print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-[#1D1D1B]/20 pb-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-0.5 px-2.5 border border-[#1D1D1B]">
                  Laporan Resmi Analitik
                </span>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
                  Laboratorium Virtual Kimia
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#1D1D1B] tracking-tight">
                LAPORAN PRAKTIKUM <span className="italic text-[#C4A484]">VIRTUAL.</span>
              </h1>
              <p className="text-xs md:text-sm text-[#1D1D1B]/70 font-serif italic mt-1">
                Titrasi Asam–Basa: Penentuan Kadar Konsentrasi Analit HCl dengan Titran Standar Sekunder NaOH
              </p>
            </div>

            {/* Score Badge */}
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1D1D1B]/60 block">
                Total Skor
              </span>
              <div className="text-3xl md:text-5xl font-serif font-black text-[#1D1D1B] mt-1">
                {evaluation.totalScore} <span className="text-sm font-sans font-normal text-[#1D1D1B]/40">/ 100</span>
              </div>
              <div
                className={`inline-block mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${getRatingBadgeColor(
                  evaluation.ratingTitle
                )}`}
              >
                {evaluation.ratingTitle}
              </div>
            </div>
          </div>

          {/* Student Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs">
            <div>
              <span className="text-[#1D1D1B]/50 block text-[10px] font-bold uppercase tracking-wider">Nama Praktikan</span>
              <strong className="text-[#1D1D1B] font-serif font-bold text-sm block mt-0.5">
                {profile.name || 'Praktikan Kimia'}
              </strong>
            </div>
            <div>
              <span className="text-[#1D1D1B]/50 block text-[10px] font-bold uppercase tracking-wider">Kelas / Jurusan</span>
              <strong className="text-[#1D1D1B] font-serif font-bold text-sm block mt-0.5">
                {profile.className || 'XI MIPA'}
              </strong>
            </div>
            <div>
              <span className="text-[#1D1D1B]/50 block text-[10px] font-bold uppercase tracking-wider">Institusi / Sekolah</span>
              <strong className="text-[#1D1D1B] font-serif font-bold text-sm block mt-0.5">
                {profile.school || 'SMA Negeri'}
              </strong>
            </div>
            <div>
              <span className="text-[#1D1D1B]/50 block text-[10px] font-bold uppercase tracking-wider">Tanggal & Mode</span>
              <strong className="text-[#1D1D1B] font-serif font-bold block mt-0.5">
                {currentDate} ({mode === 'guided' ? 'Terbimbing' : 'Tantangan'})
              </strong>
            </div>
          </div>
        </div>

        {/* Section 1: Quantitative Results */}
        <div className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1D1B] mb-4 flex items-center gap-2 pb-2 border-b border-[#1D1D1B]/15">
            <FlaskConical className="w-3.5 h-3.5 text-[#C4A484]" />
            1. Hasil Pengukuran & Penentuan Konsentrasi Analit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/60 block">
                Konsentrasi HCl Terhitung:
              </span>
              <div className="text-2xl font-mono font-bold text-[#1D1D1B] mt-1.5">
                {evaluation.calculatedConcentration.toFixed(4)} M
              </div>
              <span className="text-xs font-serif italic text-[#1D1D1B]/60 mt-1 block">
                Rata-rata titrasi teliti berulang
              </span>
            </div>

            <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/60 block">
                Konsentrasi Sebenarnya (Sampel):
              </span>
              <div className="text-2xl font-mono font-bold text-[#1D1D1B] mt-1.5">
                {evaluation.trueConcentration.toFixed(4)} M
              </div>
              <span className="text-xs font-serif italic text-[#1D1D1B]/60 mt-1 block">
                Nilai analitik botol misteri
              </span>
            </div>

            <div className="p-5 bg-[#F4EFE6] border-l-2 border-[#1D1D1B]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/60 block">
                Galat Akurasi Relatif:
              </span>
              <div className="text-2xl font-mono font-bold text-[#1D1D1B] mt-1.5">
                {evaluation.percentError.toFixed(2)} %
              </div>
              <span className="text-xs font-serif italic text-[#1D1D1B]/60 mt-1 block">
                {evaluation.percentError <= 2.0 ? 'Akurasi Kategori Sangat Tinggi' : 'Akurasi Kategori Memadai'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Experimental Data Table */}
        <div className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1D1B] mb-4 pb-2 border-b border-[#1D1D1B]/15">
            2. Tabel Data Pengamatan Titrasi Volumetri
          </h2>
          <div className="border border-[#1D1D1B]/20 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-[#F9F7F2] text-[10px] font-bold text-[#1D1D1B] uppercase tracking-wider border-b border-[#1D1D1B]/20">
                  <th className="py-3 px-4 font-serif">Percobaan</th>
                  <th className="py-3 px-3 text-right">Vol Awal (mL)</th>
                  <th className="py-3 px-3 text-right">Vol Akhir (mL)</th>
                  <th className="py-3 px-3 text-right">Vol Terpakai (mL)</th>
                  <th className="py-3 px-3 text-center">Status Titrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D1B]/10 font-mono text-xs">
                {trials.map((trial) => {
                  const initial = trial.studentInitialReading ?? trial.initialReading;
                  const final = trial.studentFinalReading ?? trial.finalReading;
                  return (
                    <tr
                      key={trial.id}
                      className={trial.isRough ? 'text-[#1D1D1B]/50' : 'text-[#1D1D1B] font-medium'}
                    >
                      <td className="py-3 px-4 font-serif flex items-center gap-2">
                        {trial.title}
                        {trial.isRough && (
                          <span className="text-[9px] border border-[#1D1D1B]/30 px-1.5 py-0.2 font-sans uppercase tracking-wider">
                            Estimasi
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">{formatDecimals(initial, 2)}</td>
                      <td className="py-3 px-3 text-right">{formatDecimals(final, 2)}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#1D1D1B]">
                        {formatDecimals(trial.deliveredVolume, 2)}
                      </td>
                      <td className="py-3 px-3 text-center font-serif text-xs">
                        {trial.isRough ? (
                          <span className="text-[#1D1D1B]/50 italic">Titrasi Kasar</span>
                        ) : trial.overtitration ? (
                          <span className="text-[#1D1D1B] font-bold underline">Lewat Titik Akhir</span>
                        ) : (
                          <span className="text-[#1D1D1B] font-semibold">Konkordan / Sah</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#F9F7F2] font-serif border-t-2 border-[#1D1D1B] text-xs">
                  <td colSpan={3} className="py-3 px-4 text-[#1D1D1B] font-bold">
                    Rata-Rata Volume Titran NaOH (Titrasi Teliti Sah):
                  </td>
                  <td className="py-3 px-3 text-right text-[#1D1D1B] font-mono font-bold text-sm">
                    {avgTitre.toFixed(2)} mL
                  </td>
                  <td className="py-3 px-3 text-center text-[#1D1D1B]/60 italic">
                    (V_rata-rata)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 3: Performance Category Breakdown */}
        <div className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1D1B] mb-4 flex items-center gap-2 pb-2 border-b border-[#1D1D1B]/15">
            <Award className="w-3.5 h-3.5 text-[#C4A484]" />
            3. Rincian Rubrik Penilaian Kinerja Laboratorium
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/60 block">Teknik Lab</span>
              <strong className="text-lg font-serif font-bold text-[#1D1D1B] block mt-1">
                {evaluation.techniqueScore} <span className="text-xs font-normal text-[#1D1D1B]/50">/ 30</span>
              </strong>
            </div>

            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/60 block">Akurasi Nilai</span>
              <strong className="text-lg font-serif font-bold text-[#1D1D1B] block mt-1">
                {evaluation.accuracyScore} <span className="text-xs font-normal text-[#1D1D1B]/50">/ 30</span>
              </strong>
            </div>

            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/60 block">Presisi Data</span>
              <strong className="text-lg font-serif font-bold text-[#1D1D1B] block mt-1">
                {evaluation.precisionScore} <span className="text-xs font-normal text-[#1D1D1B]/50">/ 20</span>
              </strong>
            </div>

            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/60 block">Perhitungan</span>
              <strong className="text-lg font-serif font-bold text-[#1D1D1B] block mt-1">
                {evaluation.calculationScore} <span className="text-xs font-normal text-[#1D1D1B]/50">/ 15</span>
              </strong>
            </div>

            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B]/60 block">Keselamatan</span>
              <strong className="text-lg font-serif font-bold text-[#1D1D1B] block mt-1">
                {evaluation.safetyScore} <span className="text-xs font-normal text-[#1D1D1B]/50">/ 5</span>
              </strong>
            </div>
          </div>
        </div>

        {/* Section 4: Qualitative Feedback & Teacher Notes */}
        <div className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D1D1B] mb-4 pb-2 border-b border-[#1D1D1B]/15">
            4. Catatan Evaluasi & Rekomendasi Instruktur
          </h2>
          <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20 space-y-2.5 text-xs text-[#1D1D1B] font-serif">
            {evaluation.feedbackNotes.map((note, idx) => (
              <div key={`note-${idx}`} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Box for Official Report */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#1D1D1B]/20 text-xs font-serif">
          <div className="text-center">
            <p className="text-[#1D1D1B]/60">Mengetahui,</p>
            <p className="font-bold text-[#1D1D1B] mt-1">Guru Pengampu Kimia</p>
            <div className="h-16" />
            <p className="border-t border-[#1D1D1B]/40 inline-block px-12 pt-1 font-medium text-[#1D1D1B]">
              ( .................................................... )
            </p>
          </div>
          <div className="text-center">
            <p className="text-[#1D1D1B]/60">Laboratorium Kimia, {currentDate}</p>
            <p className="font-bold text-[#1D1D1B] mt-1">Praktikan Pelaksana,</p>
            <div className="h-16" />
            <p className="border-t border-[#1D1D1B]/40 inline-block px-12 pt-1 font-bold text-[#1D1D1B]">
              ( {profile.name || 'Praktikan'} )
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Secondary Actions (No Print) */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-8 no-print text-xs">
        <button
          onClick={onSwitchMode}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B] hover:text-[#C4A484] underline transition-colors cursor-pointer"
        >
          {mode === 'guided'
            ? 'Tantang Kemampuan: Coba Mode Tantangan (Mandiri)'
            : 'Pelajari Kembali: Coba Mode Terbimbing'}
        </button>

        <button
          onClick={onHome}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/60 hover:text-[#1D1D1B] transition-colors cursor-pointer"
        >
          Kembali ke Halaman Depan
        </button>
      </div>
    </div>
  );
};
