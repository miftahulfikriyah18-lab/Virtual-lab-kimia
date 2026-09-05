import React, { useState } from 'react';
import { GradeLevel, StudentUser } from '../../platform/types';
import { AuthService } from '../../services/authService';
import { ShieldCheck, Sparkles, User, Lock, Mail, Building, GraduationCap, ArrowRight } from 'lucide-react';

interface AuthViewProps {
  onAuthenticated: (user: StudentUser) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthenticated }) => {
  const [activeTab, setActiveTab] = useState<'MASUK' | 'DAFTAR' | 'DEMO'>('MASUK');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regSchool, setRegSchool] = useState('SMA Negeri 1');
  const [regGrade, setRegGrade] = useState<GradeLevel>('Kelas XI');
  const [regError, setRegError] = useState('');

  // Demo state
  const [demoName, setDemoName] = useState('');
  const [demoSchool, setDemoSchool] = useState('SMA Negeri');
  const [demoGrade, setDemoGrade] = useState<GradeLevel>('Kelas XI');

  // Feedback notifications
  const [notification, setNotification] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) {
      setLoginError('Silakan masukkan email.');
      return;
    }
    try {
      const user = await AuthService.login(loginEmail, loginPassword);
      onAuthenticated(user);
    } catch {
      setLoginError('Gagal masuk. Silakan periksa kembali email Anda.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim()) {
      setRegError('Nama lengkap wajib diisi.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Email wajib diisi.');
      return;
    }
    if (regPassword && regPassword !== regConfirmPassword) {
      setRegError('Konfirmasi password tidak cocok.');
      return;
    }
    try {
      const user = await AuthService.register(
        regName,
        regEmail,
        regPassword,
        regSchool,
        regGrade
      );
      onAuthenticated(user);
    } catch {
      setRegError('Gagal mendaftar. Silakan coba kembali.');
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = AuthService.loginDemo(
      demoName.trim() || 'Praktikan Kimia',
      demoSchool.trim() || 'SMA Negeri',
      demoGrade
    );
    onAuthenticated(user);
  };

  const handleGoogleLogin = async () => {
    // Elegant local simulator fallback for Google OAuth
    const user = await AuthService.login('siswa.kimia@gmail.com', 'google_auth');
    onAuthenticated(user);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1D1D1B] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* Container card */}
      <div className="w-full max-w-md bg-white border border-[#1D1D1B] shadow-[6px_6px_0px_#1D1D1B] p-6 sm:p-8 relative">
        {/* Top Emblem & Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F4EFE6] border border-[#1D1D1B] mb-3">
            <GraduationCap className="w-6 h-6 text-[#1D1D1B]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1B] tracking-tight">
            V-LAB KIMIA SMA
          </h1>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#1D1D1B]/60 mt-0.5">
            Laboratorium Kimia Virtual Kelas X, XI, dan XII
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border border-[#1D1D1B] bg-[#F4EFE6] p-0.5 mb-6 text-xs font-bold font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('MASUK')}
            className={`py-2 text-center transition cursor-pointer ${
              activeTab === 'MASUK'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] shadow-sm'
                : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => setActiveTab('DAFTAR')}
            className={`py-2 text-center transition cursor-pointer ${
              activeTab === 'DAFTAR'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] shadow-sm'
                : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
            }`}
          >
            Daftar
          </button>
          <button
            onClick={() => setActiveTab('DEMO')}
            className={`py-2 text-center transition cursor-pointer ${
              activeTab === 'DEMO'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] shadow-sm'
                : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
            }`}
          >
            Mode Demo
          </button>
        </div>

        {/* Notification pill if any */}
        {notification && (
          <div className="mb-4 p-3 bg-[#F4EFE6] border border-[#C4A484] text-xs text-[#1D1D1B] font-mono flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="font-bold ml-2">✕</button>
          </div>
        )}

        {/* ======================= TAB 1: MASUK ======================= */}
        {activeTab === 'MASUK' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-700 text-xs font-mono">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="siswa@sekolah.sch.id"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none focus:ring-1 focus:ring-[#1D1D1B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setNotification('Fitur reset kata sandi telah dikirimkan ke email terdaftar (Mode Demo: password apa saja dapat digunakan).')}
                  className="text-[10px] text-[#1D1D1B]/60 hover:text-[#1D1D1B] underline font-mono cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none focus:ring-1 focus:ring-[#1D1D1B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold uppercase tracking-[0.2em] shadow-[2px_2px_0px_#C4A484] transition cursor-pointer mt-2"
            >
              Masuk
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1D1D1B]/15" />
              </div>
              <span className="relative bg-white px-3 text-[10px] uppercase font-mono tracking-widest text-[#1D1D1B]/50">
                Atau
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 border border-[#1D1D1B] bg-white hover:bg-[#F4EFE6] text-xs font-bold uppercase tracking-wider text-[#1D1D1B] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Masuk dengan Google
            </button>
          </form>
        )}

        {/* ======================= TAB 2: DAFTAR ======================= */}
        {activeTab === 'DAFTAR' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            {regError && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-700 text-xs font-mono">
                {regError}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Siti Aisyah"
                  className="w-full pl-9 pr-3 py-2 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="siswa@sekolah.sch.id"
                  className="w-full pl-9 pr-3 py-2 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-3 py-2 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                  Konfirmasi
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-3 py-2 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                Sekolah
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#1D1D1B]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                  placeholder="SMA Negeri 1 Jakarta"
                  className="w-full pl-9 pr-3 py-2 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                Kelas
              </label>
              <select
                value={regGrade}
                onChange={(e) => setRegGrade(e.target.value as GradeLevel)}
                className="w-full px-3 py-2 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none cursor-pointer"
              >
                <option value="Kelas X">Kelas X</option>
                <option value="Kelas XI">Kelas XI</option>
                <option value="Kelas XII">Kelas XII</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold uppercase tracking-[0.2em] shadow-[2px_2px_0px_#C4A484] transition cursor-pointer mt-2"
            >
              Buat Akun
            </button>
          </form>
        )}

        {/* ======================= TAB 3: MODE DEMO ======================= */}
        {activeTab === 'DEMO' && (
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <div className="p-3 bg-[#F4EFE6] border border-[#C4A484] text-xs text-[#1D1D1B] font-mono leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-[#1D1D1B]" />
                <span>Mode Demo Praktikan</span>
              </div>
              <p>Mode demo menyimpan progres pada perangkat ini.</p>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                Nama Praktikan
              </label>
              <input
                type="text"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                placeholder="Nama Anda (misal: Budi Santoso)"
                className="w-full px-3 py-2.5 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                Kelas
              </label>
              <select
                value={demoGrade}
                onChange={(e) => setDemoGrade(e.target.value as GradeLevel)}
                className="w-full px-3 py-2.5 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none cursor-pointer"
              >
                <option value="Kelas X">Kelas X</option>
                <option value="Kelas XI">Kelas XI</option>
                <option value="Kelas XII">Kelas XII</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#1D1D1B]/80 mb-1">
                Sekolah
              </label>
              <input
                type="text"
                value={demoSchool}
                onChange={(e) => setDemoSchool(e.target.value)}
                placeholder="SMA Negeri"
                className="w-full px-3 py-2.5 border border-[#1D1D1B] bg-[#F9F7F2] text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold uppercase tracking-[0.2em] shadow-[2px_2px_0px_#C4A484] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk Mode Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* Subtle footer */}
      <div className="mt-6 text-center text-xs font-mono text-[#1D1D1B]/50">
        V-LAB KIMIA SMA © 2026 • Kurikulum Kimia SMA
      </div>
    </div>
  );
};
