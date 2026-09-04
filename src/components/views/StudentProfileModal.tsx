import React, { useState } from 'react';
import { User, School, BookCheck, ArrowRight, X } from 'lucide-react';
import { StudentProfile } from '../../types';

interface StudentProfileModalProps {
  initialProfile: StudentProfile | null;
  onSave: (profile: StudentProfile) => void;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  initialProfile,
  onSave,
  onClose
}) => {
  const [name, setName] = useState<string>(initialProfile?.name || '');
  const [className, setClassName] = useState<string>(initialProfile?.className || 'XI MIPA');
  const [school, setSchool] = useState<string>(initialProfile?.school || '');
  const [rememberMe, setRememberMe] = useState<boolean>(initialProfile?.rememberMe ?? true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorNotice('Nama praktikan wajib diisi untuk penerbitan laporan.');
      return;
    }
    onSave({
      name: name.trim(),
      className: className.trim() || 'XI MIPA',
      school: school.trim() || 'SMA Negeri',
      rememberMe
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#F9F7F2] border border-[#1D1D1B] p-6 md:p-8 overflow-hidden text-[#1D1D1B]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1D1D1B]/15 mb-6">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C4A484] block mb-1">
              Buku Jurnal / Registrasi
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#1D1D1B]">Identitas Praktikan</h3>
            <p className="text-xs text-[#1D1D1B]/70 font-serif italic mt-0.5">
              Data ini akan dicantumkan pada sertifikat dan laporan resmi praktikum
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#1D1D1B]/20 flex items-center justify-center text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/80 block mb-1.5">
              Nama Lengkap Praktikan: *
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-[#1D1D1B]/40">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Contoh: Miftahul Fikriyah"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorNotice(null);
                }}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#1D1D1B]/30 focus:border-[#1D1D1B] text-[#1D1D1B] text-sm outline-none transition"
              />
            </div>
          </div>

          {/* Class Field */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/80 block mb-1.5">
              Kelas / Tingkat:
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-[#1D1D1B]/40">
                <BookCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Contoh: XI MIPA 1 atau XI-A"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#1D1D1B]/30 focus:border-[#1D1D1B] text-[#1D1D1B] text-sm outline-none transition"
              />
            </div>
          </div>

          {/* School Field */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/80 block mb-1.5">
              Asal Sekolah / Madrasah:
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-[#1D1D1B]/40">
                <School className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Contoh: SMAN 1 Pekanbaru"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#1D1D1B]/30 focus:border-[#1D1D1B] text-[#1D1D1B] text-sm outline-none transition"
              />
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#1D1D1B]/70 hover:text-[#1D1D1B]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="border-[#1D1D1B]/40 text-[#1D1D1B] focus:ring-[#1D1D1B]"
              />
              <span>Simpan identitas saya di peramban ini</span>
            </label>
          </div>

          {errorNotice && (
            <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2.5">
              {errorNotice}
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjutkan ke Protokol APD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
