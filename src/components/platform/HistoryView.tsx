import React from 'react';
import { ExperimentProgressRecord } from '../../platform/types';
import { ExperimentThumbnail } from './ExperimentThumbnails';
import { History, FileText, RotateCcw, Award, CheckCircle2, Clock, Calendar } from 'lucide-react';

interface HistoryViewProps {
  historyRecords: ExperimentProgressRecord[];
  onViewReport: (record: ExperimentProgressRecord) => void;
  onRepeatExperiment: (experimentId: string) => void;
  onGoToCatalog: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyRecords,
  onViewReport,
  onRepeatExperiment,
  onGoToCatalog
}) => {
  return (
    <div className="space-y-8 animate-fadeIn selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* Header */}
      <div className="border-b border-[#1D1D1B]/20 pb-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1D1D1B]/60">
          Catatan Belajar
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B] tracking-tight mt-1">
          Riwayat Praktikum
        </h1>
        <p className="text-sm font-serif text-[#1D1D1B]/80 mt-1">
          Daftar seluruh aktivitas eksperimen laboratorium, jumlah pengulangan percobaan, dan riwayat perolehan skor praktikum.
        </p>
      </div>

      {historyRecords.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 border-[#1D1D1B] shadow-[4px_4px_0px_#1D1D1B]">
          <History className="w-10 h-10 text-[#C4A484] mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#1D1D1B]">
            Belum Ada Riwayat Praktikum
          </h3>
          <p className="text-xs font-mono text-[#1D1D1B]/70 max-w-md mx-auto mt-1 mb-6">
            Anda belum menyelesaikan sesi laboratorium virtual. Mulai modul Titrasi Asam–Basa di katalog untuk mengumpulkan riwayat praktikum pertama Anda.
          </p>
          <button
            onClick={onGoToCatalog}
            className="px-6 py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold font-mono uppercase tracking-[0.2em] shadow-[2px_2px_0px_#C4A484] transition cursor-pointer"
          >
            Buka Katalog Praktikum
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {historyRecords.map((record) => {
            const isCompleted = record.status === 'completed';
            const formattedDate = record.completedAt
              ? new Date(record.completedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
              : 'Sedang Dikerjakan';

            return (
              <div
                key={record.experimentId}
                className="bg-white border-2 border-[#1D1D1B] shadow-[4px_4px_0px_#1D1D1B] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#F9F7F2] border border-[#1D1D1B] p-2 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1D1D1B]">
                    <ExperimentThumbnail type="titration" className="w-10 h-10 text-[#1D1D1B]" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#F4EFE6] border border-[#1D1D1B]/30 text-[#1D1D1B]">
                        {record.experimentId} • {record.topic}
                      </span>
                      {isCompleted ? (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-emerald-100 border border-emerald-400 text-emerald-800 font-bold">
                          Selesai
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-sky-100 border border-sky-400 text-sky-800 font-bold">
                          Sedang Dikerjakan
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#1D1D1B]">
                      Titrasi Asam–Basa
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#1D1D1B]/70 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C4A484]" />
                        <span>{formattedDate}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-[#C4A484]" />
                        <span>Percobaan: <strong>{record.attempts} kali</strong></span>
                      </div>
                      {record.bestScore !== undefined && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-[#C4A484]" />
                            <span>Nilai Terbaik: <strong>{record.bestScore}</strong></span>
                          </div>
                        </>
                      )}
                      {record.score !== undefined && (
                        <>
                          <span>•</span>
                          <span>Nilai Terakhir: <strong>{record.score}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                  {record.reportData && (
                    <button
                      onClick={() => onViewReport(record)}
                      className="px-4 py-2.5 bg-white hover:bg-[#F9F7F2] border border-[#1D1D1B] text-xs font-mono font-bold uppercase tracking-wider text-[#1D1D1B] shadow-[2px_2px_0px_#1D1D1B] flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Lihat Laporan</span>
                    </button>
                  )}

                  <button
                    onClick={() => onRepeatExperiment(record.experimentId)}
                    className="px-4 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#C4A484] flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Praktikum</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
