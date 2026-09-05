import React from 'react';
import { BookOpen, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { TrialData } from '../types';
import { formatDecimals } from '../utils/chemistry';

interface NotebookModalProps {
  trials: TrialData[];
  onClose: () => void;
  onProceedToCalculations?: () => void;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({ trials, onClose, onProceedToCalculations }) => {
  // Filter accurate trials
  const accurateTrials = trials.filter((t) => !t.isRough && t.deliveredVolume > 0);

  // Compute concordant average
  let avgTitre: number | null = null;
  let concordantDiff: number | null = null;

  if (accurateTrials.length >= 2) {
    const titres = accurateTrials.map((t) => t.deliveredVolume);
    const minT = Math.min(...titres);
    const maxT = Math.max(...titres);
    concordantDiff = Number((maxT - minT).toFixed(2));
    const sum = titres.reduce((acc, v) => acc + v, 0);
    avgTitre = Number((sum / titres.length).toFixed(2));
  } else if (accurateTrials.length === 1) {
    avgTitre = accurateTrials[0].deliveredVolume;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#F9F7F2] border border-[#1D1D1B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#1D1D1B]/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1D1D1B] text-[#F9F7F2]">
              <BookOpen className="w-4 h-4 text-[#C4A484]" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1D1D1B] tracking-tight">Catatan Praktikum Laboratorium</h3>
              <p className="text-xs font-serif italic text-[#1D1D1B]/60">Data Pengamatan Titrasi Asam–Basa (HCl vs NaOH 0.1000 M)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#1D1D1B]/60 hover:text-[#1D1D1B] hover:bg-[#F4EFE6] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="border border-[#1D1D1B]/20 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4EFE6] text-[10px] font-serif font-bold text-[#1D1D1B] uppercase tracking-[0.15em] border-b border-[#1D1D1B]/20">
                  <th className="py-3 px-4">Percobaan</th>
                  <th className="py-3 px-3 text-right">Volume Awal (mL)</th>
                  <th className="py-3 px-3 text-right">Volume Akhir (mL)</th>
                  <th className="py-3 px-3 text-right">Volume NaOH (mL)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D1B]/10 font-mono text-xs">
                {trials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#1D1D1B]/50 font-serif italic text-xs">
                      Belum ada data titrasi yang tercatat. Mulai titrasi pada meja praktikum.
                    </td>
                  </tr>
                ) : (
                  trials.map((trial) => {
                    const delivered = trial.deliveredVolume;
                    const initial = trial.studentInitialReading ?? trial.initialReading;
                    const final = trial.studentFinalReading ?? trial.finalReading;

                    return (
                      <tr
                        key={trial.id}
                        className={`hover:bg-[#F4EFE6]/50 transition ${
                          trial.isRough ? 'bg-[#F9F7F2]/60 text-[#1D1D1B]/50' : 'text-[#1D1D1B] font-semibold'
                        }`}
                      >
                        <td className="py-3 px-4 font-serif font-medium flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${trial.isRough ? 'bg-[#C4A484]' : 'bg-[#1D1D1B]'}`} />
                          {trial.title}
                          {trial.isRough && (
                            <span className="text-[9px] uppercase tracking-wider bg-[#F4EFE6] text-[#1D1D1B] px-1.5 py-0.5 border border-[#1D1D1B]/20 font-serif">
                              Kasar
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">{formatDecimals(initial, 2)}</td>
                        <td className="py-3 px-3 text-right">{formatDecimals(final, 2)}</td>
                        <td className="py-3 px-3 text-right font-bold text-[#1D1D1B]">
                          {formatDecimals(delivered, 2)}
                        </td>
                        <td className="py-3 px-4 text-center font-serif text-[11px]">
                          {trial.isRough ? (
                            <span className="text-[#1D1D1B]/50 uppercase tracking-wider text-[10px]">Estimasi</span>
                          ) : trial.overtitration ? (
                            <span className="text-red-700 font-bold flex items-center justify-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Lewat Titik Akhir
                            </span>
                          ) : (
                            <span className="text-[#1D1D1B] font-bold flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A484]" /> Sah
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Concordant Analysis Banner */}
          {accurateTrials.length >= 2 ? (
            <div
              className={`p-4 border flex items-start gap-3 bg-white ${
                concordantDiff !== null && concordantDiff <= 0.20
                  ? 'border-[#1D1D1B]'
                  : 'border-[#C4A484]'
              }`}
            >
              {concordantDiff !== null && concordantDiff <= 0.20 ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#C4A484]" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#C4A484]" />
              )}
              <div className="text-xs space-y-1 font-serif text-[#1D1D1B]">
                <p className="font-bold text-sm">
                  {concordantDiff !== null && concordantDiff <= 0.20
                    ? 'Hasil Titrasi Anda Konkordan'
                    : 'Hasil Titrasi Belum Cukup Konkordan'}
                </p>
                <p className="text-[#1D1D1B]/80">
                  Selisih volume antar titrasi teliti adalah{' '}
                  <strong className="font-mono underline font-bold">{concordantDiff?.toFixed(2)} mL</strong> (toleransi ≤ 0.20 mL).
                </p>
                {avgTitre !== null && (
                  <p className="pt-1">
                    Rata-rata volume titran terpakai (titrasi teliti):{' '}
                    <strong className="font-mono text-[#1D1D1B] text-xs bg-[#F4EFE6] px-2 py-0.5 border border-[#1D1D1B]/20">
                      {avgTitre.toFixed(2)} mL
                    </strong>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-white border border-[#1D1D1B]/20 text-xs font-serif text-[#1D1D1B]/70 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C4A484] shrink-0" />
              <span>
                Lakukan minimal <strong>2 kali titrasi teliti</strong> untuk memeriksa konkordansi data sebelum menghitung konsentrasi.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-[#1D1D1B]/20 flex items-center justify-between gap-3">
          <span className="text-[10px] font-serif text-[#1D1D1B]/60 italic">
            {accurateTrials.length >= 1 ? `${accurateTrials.length} titrasi teliti tercatat` : 'Lakukan titrasi teliti'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#1D1D1B]/30 hover:border-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.15em] text-[#1D1D1B] transition cursor-pointer"
            >
              Tutup Catatan
            </button>
            {accurateTrials.length >= 1 && onProceedToCalculations && (
              <button
                onClick={() => {
                  onClose();
                  onProceedToCalculations();
                }}
                className="px-5 py-2 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.15em] transition cursor-pointer"
              >
                Hitung Kadar HCl →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
