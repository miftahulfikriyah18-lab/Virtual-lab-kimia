import React, { useState, useMemo } from 'react';
import {
  ExperimentProgressRecord,
  ExperimentRegistryItem,
  GradeLevel
} from '../../platform/types';
import { EXPERIMENTS_REGISTRY, ALL_TOPICS } from '../../platform/experimentsRegistry';
import { ExperimentThumbnail } from './ExperimentThumbnails';
import {
  Search,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Filter
} from 'lucide-react';

interface CatalogViewProps {
  userGrade?: GradeLevel;
  progressMap: Record<string, ExperimentProgressRecord>;
  onSelectExperiment: (exp: ExperimentRegistryItem) => void;
}

type StatusFilter = 'all' | 'available' | 'coming_soon' | 'completed';

export const CatalogView: React.FC<CatalogViewProps> = ({
  userGrade = 'Kelas XI',
  progressMap,
  onSelectExperiment
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(userGrade);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  // Filtered experiments
  const filteredExperiments = useMemo(() => {
    return EXPERIMENTS_REGISTRY.filter((exp) => {
      // Grade filter
      const matchesGrade = exp.grade.includes(selectedGrade);
      if (!matchesGrade) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          exp.title.toLowerCase().includes(q) ||
          exp.topic.toLowerCase().includes(q) ||
          exp.code.toLowerCase().includes(q) ||
          exp.description.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Topic filter
      if (selectedTopic !== 'all' && exp.topic !== selectedTopic) {
        return false;
      }

      // Status filter
      const userProg = progressMap[exp.id];
      const isCompleted = userProg?.status === 'completed';
      const isAvailable = exp.status === 'available';

      if (statusFilter === 'available' && !isAvailable) return false;
      if (statusFilter === 'coming_soon' && isAvailable) return false;
      if (statusFilter === 'completed' && !isCompleted) return false;

      return true;
    });
  }, [selectedGrade, searchQuery, statusFilter, selectedTopic, progressMap]);

  // Count available in current grade
  const availableInGrade = EXPERIMENTS_REGISTRY.filter(
    (e) => e.grade.includes(selectedGrade) && e.status === 'available'
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* Header section */}
      <div className="border-b border-[#1D1D1B]/20 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1D1D1B]/60">
              Katalog Praktikum Kimia
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B] tracking-tight mt-1">
              Katalog Virtual Laboratory
            </h1>
            <p className="text-sm font-serif text-[#1D1D1B]/80 mt-1 max-w-2xl">
              Eksplorasi modul laboratorium kimia virtual interaktif. Dirancang sesuai capaian pembelajaran Kurikulum Merdeka & K-13.
            </p>
          </div>

          {/* Grade selection tabs */}
          <div className="flex border-2 border-[#1D1D1B] bg-white p-1 text-xs font-mono uppercase tracking-wider shadow-[3px_3px_0px_#1D1D1B]">
            {(['Kelas X', 'Kelas XI', 'Kelas XII'] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-4 py-2 transition cursor-pointer font-bold ${
                  selectedGrade === g
                    ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                    : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#1D1D1B]/50 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari praktikum, materi, atau topik..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#1D1D1B] text-xs font-mono placeholder:text-[#1D1D1B]/40 focus:outline-none focus:ring-1 focus:ring-[#1D1D1B]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="md:col-span-6 flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 border transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold'
                : 'bg-white text-[#1D1D1B] border-[#1D1D1B]/30 hover:border-[#1D1D1B]'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-2 border transition cursor-pointer ${
              statusFilter === 'available'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold'
                : 'bg-white text-[#1D1D1B] border-[#1D1D1B]/30 hover:border-[#1D1D1B]'
            }`}
          >
            Tersedia
          </button>
          <button
            onClick={() => setStatusFilter('coming_soon')}
            className={`px-3 py-2 border transition cursor-pointer ${
              statusFilter === 'coming_soon'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold'
                : 'bg-white text-[#1D1D1B] border-[#1D1D1B]/30 hover:border-[#1D1D1B]'
            }`}
          >
            Segera Hadir
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-2 border transition cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold'
                : 'bg-white text-[#1D1D1B] border-[#1D1D1B]/30 hover:border-[#1D1D1B]'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Notice strip */}
      <div className="p-3.5 bg-[#F4EFE6] border border-[#1D1D1B]/20 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#1D1D1B]">
          <Sparkles className="w-4 h-4 text-[#C4A484]" />
          <span>
            Menampilkan <strong>{filteredExperiments.length}</strong> eksperimen untuk <strong>{selectedGrade}</strong> ({availableInGrade} modul aktif saat ini).
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-[#1D1D1B]/60">
          Laboratorium Terus Berkembang
        </span>
      </div>

      {/* Grid of Experiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperiments.map((exp) => {
          const userProg = progressMap[exp.id];
          const isCompleted = userProg?.status === 'completed';
          const isInProgress = userProg?.status === 'in_progress' && !isCompleted;
          const isAvailable = exp.status === 'available';

          // Determine card badge
          let badgeText = 'SEGERA HADIR';
          let badgeClass = 'bg-amber-50 text-amber-800 border-amber-300';

          if (isCompleted) {
            badgeText = 'SELESAI';
            badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold';
          } else if (isInProgress) {
            badgeText = 'SEDANG DIKERJAKAN';
            badgeClass = 'bg-sky-50 text-sky-800 border-sky-400 font-bold';
          } else if (isAvailable) {
            badgeText = 'TERSEDIA';
            badgeClass = 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold';
          }

          return (
            <div
              key={exp.id}
              onClick={() => onSelectExperiment(exp)}
              className={`bg-white border-2 border-[#1D1D1B] flex flex-col justify-between transition-all cursor-pointer group ${
                isAvailable
                  ? 'shadow-[4px_4px_0px_#1D1D1B] hover:shadow-[6px_6px_0px_#C4A484] hover:-translate-y-0.5'
                  : 'shadow-[3px_3px_0px_#1D1D1B]/40 hover:shadow-[4px_4px_0px_#1D1D1B]'
              }`}
            >
              {/* Card top */}
              <div className="p-5">
                {/* Visual Icon & Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 bg-[#F9F7F2] border border-[#1D1D1B] p-2 flex items-center justify-center shrink-0 group-hover:bg-[#F4EFE6] transition">
                    <ExperimentThumbnail type={exp.thumbnailType} className="w-10 h-10 text-[#1D1D1B]" />
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 border text-[9px] font-mono uppercase tracking-wider ${badgeClass}`}
                    >
                      {badgeText}
                    </span>
                    <p className="text-[10px] font-mono text-[#1D1D1B]/50 mt-1">
                      {exp.code}
                    </p>
                  </div>
                </div>

                {/* Topic */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]/60 mb-1">
                  <BookOpen className="w-3 h-3 text-[#C4A484]" />
                  <span>{exp.topic}</span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1D1D1B] group-hover:text-[#C4A484] transition-colors leading-snug mb-2">
                  {exp.title}
                </h3>

                {/* Description */}
                <p className="text-xs font-serif text-[#1D1D1B]/80 leading-relaxed line-clamp-3">
                  {exp.description}
                </p>
              </div>

              {/* Card bottom metadata & action */}
              <div className="border-t border-[#1D1D1B]/15 bg-[#F9F7F2] p-4 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3 text-[11px] text-[#1D1D1B]/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C4A484]" />
                    <span>{exp.durationMinutes}m</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-[#1D1D1B]/30" />
                  <span>{exp.difficulty}</span>
                </div>

                {/* Action button */}
                {isAvailable ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1D1D1B] group-hover:translate-x-0.5 transition-transform">
                    <span>{isCompleted ? 'Buka Lab' : 'Mulai Lab'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C4A484]" />
                  </div>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-[#1D1D1B]/60 underline group-hover:text-[#1D1D1B]">
                    Detail Modul
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredExperiments.length === 0 && (
        <div className="p-12 text-center bg-white border border-[#1D1D1B]/20 text-[#1D1D1B]">
          <BookOpen className="w-8 h-8 text-[#C4A484] mx-auto mb-2" />
          <p className="font-serif font-bold text-lg">Tidak ada praktikum yang sesuai kriteria.</p>
          <p className="text-xs font-mono text-[#1D1D1B]/60 mt-1">
            Coba ubah kata kunci pencarian atau sesuaikan filter status.
          </p>
        </div>
      )}
    </div>
  );
};
