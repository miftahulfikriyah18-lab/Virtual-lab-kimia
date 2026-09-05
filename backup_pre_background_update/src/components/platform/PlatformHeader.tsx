import React, { useState, useRef, useEffect } from 'react';
import { PlatformNavigationTab, StudentUser } from '../../platform/types';
import {
  GraduationCap,
  Bell,
  User,
  LogOut,
  History,
  Award,
  ChevronDown,
  Compass,
  Home,
  CheckCircle2,
  Settings
} from 'lucide-react';

interface PlatformHeaderProps {
  user: StudentUser;
  activeTab: PlatformNavigationTab;
  onTabChange: (tab: PlatformNavigationTab) => void;
  onLogout: () => void;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  user,
  activeTab,
  onTabChange,
  onLogout
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowNotification(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'P';

  return (
    <header className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#1D1D1B] selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left Brand & Logo */}
          <div
            onClick={() => onTabChange('beranda')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-white border border-[#1D1D1B] shadow-[2px_2px_0px_#1D1D1B] flex items-center justify-center group-hover:bg-[#F4EFE6] transition">
              <GraduationCap className="w-5 h-5 text-[#1D1D1B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-serif font-bold text-[#1D1D1B] tracking-tight">
                  V-LAB KIMIA SMA
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.2 bg-[#F4EFE6] border border-[#1D1D1B]/30 text-[9px] font-mono uppercase tracking-widest text-[#1D1D1B]">
                  {user.grade}
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#1D1D1B]/60 tracking-wider">
                Laboratorium Kimia Virtual
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 border border-[#1D1D1B]/20 bg-[#F4EFE6]/60 p-1 text-xs font-mono uppercase tracking-wider">
            <button
              onClick={() => onTabChange('beranda')}
              className={`px-3.5 py-1.5 transition cursor-pointer ${
                activeTab === 'beranda'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold shadow-xs'
                  : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => onTabChange('katalog')}
              className={`px-3.5 py-1.5 transition cursor-pointer ${
                activeTab === 'katalog'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold shadow-xs'
                  : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
              }`}
            >
              Praktikum
            </button>
            <button
              onClick={() => onTabChange('progres')}
              className={`px-3.5 py-1.5 transition cursor-pointer ${
                activeTab === 'progres'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold shadow-xs'
                  : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
              }`}
            >
              Progres Saya
            </button>
            <button
              onClick={() => onTabChange('riwayat')}
              className={`px-3.5 py-1.5 transition cursor-pointer ${
                activeTab === 'riwayat'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold shadow-xs'
                  : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
              }`}
            >
              Riwayat
            </button>
            <button
              onClick={() => onTabChange('profil')}
              className={`px-3.5 py-1.5 transition cursor-pointer ${
                activeTab === 'profil'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold shadow-xs'
                  : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
              }`}
            >
              Profil
            </button>
          </nav>

          {/* Right Greeting & Profile Dropdown */}
          <div className="flex items-center gap-3" ref={dropdownRef}>
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotification(!showNotification)}
                aria-label="Pemberitahuan"
                className="p-2 border border-[#1D1D1B]/30 hover:border-[#1D1D1B] bg-white text-[#1D1D1B] transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>

              {/* Notification Popover */}
              {showNotification && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#1D1D1B] shadow-[4px_4px_0px_#1D1D1B] p-4 text-xs font-sans animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#1D1D1B]/15 pb-2 mb-2 font-mono text-[10px] uppercase tracking-wider text-[#1D1D1B]/70">
                    <span>Pemberitahuan</span>
                    <span className="text-emerald-700 font-bold">1 Baru</span>
                  </div>
                  <div className="flex items-start gap-2.5 py-1.5 text-[#1D1D1B]">
                    <CheckCircle2 className="w-4 h-4 text-[#C4A484] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs">Modul Titrasi Asam-Basa Aktif</p>
                      <p className="text-[11px] text-[#1D1D1B]/70 mt-0.5">
                        Laboratorium titrasi asam-basa siap dikerjakan dengan titran NaOH standar.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile trigger */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-white border border-[#1D1D1B] hover:bg-[#F4EFE6] shadow-[2px_2px_0px_#1D1D1B] transition cursor-pointer"
              >
                <div className="w-7 h-7 bg-[#1D1D1B] text-[#F9F7F2] font-mono text-xs font-bold flex items-center justify-center">
                  {initials}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#1D1D1B] leading-tight truncate max-w-[120px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] font-mono text-[#1D1D1B]/60 leading-none">
                    {user.school || user.grade}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#1D1D1B]/60" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#1D1D1B] shadow-[4px_4px_0px_#1D1D1B] py-1 text-xs font-mono uppercase tracking-wider animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-[#1D1D1B]/15 bg-[#F4EFE6]/50">
                    <p className="font-bold text-[#1D1D1B] normal-case text-sm font-serif">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[#1D1D1B]/60 normal-case">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 bg-white border border-[#1D1D1B]/30 text-[9px] text-[#1D1D1B]">
                      {user.grade}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onTabChange('profil');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-[#1D1D1B] hover:bg-[#F4EFE6] flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#1D1D1B]/60" />
                    <span>Profil Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('riwayat');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-[#1D1D1B] hover:bg-[#F4EFE6] flex items-center gap-2.5 cursor-pointer"
                  >
                    <History className="w-4 h-4 text-[#1D1D1B]/60" />
                    <span>Riwayat Praktikum</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('profil');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-[#1D1D1B] hover:bg-[#F4EFE6] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#1D1D1B]/60" />
                    <span>Pengaturan</span>
                  </button>

                  <div className="border-t border-[#1D1D1B]/15 my-1" />

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden border-t border-[#1D1D1B]/15 bg-[#F4EFE6] px-2 py-1.5 flex items-center justify-around text-[10px] font-mono uppercase tracking-wider">
        <button
          onClick={() => onTabChange('beranda')}
          className={`px-2 py-1 flex items-center gap-1 ${
            activeTab === 'beranda' ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold' : 'text-[#1D1D1B]'
          }`}
        >
          <Home className="w-3 h-3" />
          <span>Beranda</span>
        </button>
        <button
          onClick={() => onTabChange('katalog')}
          className={`px-2 py-1 flex items-center gap-1 ${
            activeTab === 'katalog' ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold' : 'text-[#1D1D1B]'
          }`}
        >
          <Compass className="w-3 h-3" />
          <span>Praktikum</span>
        </button>
        <button
          onClick={() => onTabChange('progres')}
          className={`px-2 py-1 flex items-center gap-1 ${
            activeTab === 'progres' ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold' : 'text-[#1D1D1B]'
          }`}
        >
          <Award className="w-3 h-3" />
          <span>Progres</span>
        </button>
        <button
          onClick={() => onTabChange('riwayat')}
          className={`px-2 py-1 flex items-center gap-1 ${
            activeTab === 'riwayat' ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold' : 'text-[#1D1D1B]'
          }`}
        >
          <History className="w-3 h-3" />
          <span>Riwayat</span>
        </button>
        <button
          onClick={() => onTabChange('profil')}
          className={`px-2 py-1 flex items-center gap-1 ${
            activeTab === 'profil' ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold' : 'text-[#1D1D1B]'
          }`}
        >
          <User className="w-3 h-3" />
          <span>Profil</span>
        </button>
      </div>
    </header>
  );
};
