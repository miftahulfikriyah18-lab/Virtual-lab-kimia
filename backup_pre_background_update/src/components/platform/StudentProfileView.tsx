import React, { useState } from 'react';
import { GradeLevel, StudentUser } from '../../platform/types';
import { AuthService } from '../../services/authService';
import { User, Mail, Building, GraduationCap, Calendar, Save, CheckCircle2 } from 'lucide-react';

interface StudentProfileViewProps {
  user: StudentUser;
  onUpdateUser: (updated: StudentUser) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [school, setSchool] = useState(user.school);
  const [grade, setGrade] = useState<GradeLevel>(user.grade);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = AuthService.updateProfile({
      name: name.trim() || user.name,
      school: school.trim() || user.school,
      grade
    });
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* Header */}
      <div className="border-b border-[#1D1D1B]/20 pb-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1D1D1B]/60">
          Akun Praktikan
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B] tracking-tight mt-1">
          Profil Praktikan
        </h1>
        <p className="text-sm font-serif text-[#1D1D1B]/80 mt-1">
          Informasi identitas praktikan terhubung dengan laporan resmi praktikum dan transkrip nilai virtual.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border-2 border-[#1D1D1B] shadow-[6px_6px_0px_#1D1D1B] p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-400 text-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profil praktikan berhasil diperbarui tanpa mengubah riwayat progres.</span>
            </div>
          )}

          <div className="flex items-center gap-4 border-b border-[#1D1D1B]/15 pb-6">
            <div className="w-16 h-16 bg-[#1D1D1B] text-[#F9F7F2] font-mono text-xl font-bold flex items-center justify-center shadow-[2px_2px_0px_#C4A484]">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#1D1D1B]">{user.name}</h2>
              <p className="text-xs font-mono text-[#1D1D1B]/60 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 bg-[#F4EFE6] border border-[#1D1D1B]/30 text-[10px] font-mono uppercase tracking-wider text-[#1D1D1B]">
                  {user.grade}
                </span>
                {user.isDemo && (
                  <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-[10px] font-mono uppercase tracking-wider text-amber-800">
                    Mode Demo Lokal
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Email (Read only for safety) */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2.5 border border-[#1D1D1B]/30 bg-[#F4EFE6]/70 text-sm text-[#1D1D1B]/70 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Asal Sekolah */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1.5">
                Asal Sekolah / Madrasah
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Tingkat Kelas */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1.5">
                Tingkat Kelas
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full pl-9 pr-3 py-2.5 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none cursor-pointer"
                >
                  <option value="Kelas X">Kelas X</option>
                  <option value="Kelas XI">Kelas XI</option>
                  <option value="Kelas XII">Kelas XII</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account metadata info */}
          <div className="p-3 bg-[#F4EFE6] border border-[#1D1D1B]/15 text-xs font-mono text-[#1D1D1B]/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C4A484]" />
              <span>Bergabung sejak: {formattedJoinDate}</span>
            </div>
            <span>ID Praktikan: {user.userId}</span>
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold font-mono uppercase tracking-[0.2em] shadow-[2px_2px_0px_#C4A484] flex items-center gap-2 cursor-pointer transition"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
