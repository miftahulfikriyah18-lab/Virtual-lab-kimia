import React, { useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onProceed: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onProceed }) => {
  useEffect(() => {
    // Subtle timer to allow immediate interaction or auto-proceed after 2.8s
    const timer = setTimeout(() => {
      onProceed();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onProceed]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F7F2] text-[#1D1D1B] px-6 selection:bg-[#1D1D1B] selection:text-[#F9F7F2]">
      {/* Background scientific grid watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#1D1D1B 0.75px, transparent 0.75px), radial-gradient(#1D1D1B 0.75px, #F9F7F2 0.75px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />

      {/* Center Scientific Seal and Branding */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center animate-fadeIn">
        {/* Lab Emblem */}
        <div className="w-20 h-20 mb-8 border border-[#1D1D1B] bg-white flex items-center justify-center shadow-[4px_4px_0px_#1D1D1B] transition-transform">
          <svg viewBox="0 0 64 64" className="w-12 h-12 text-[#1D1D1B]" fill="none" stroke="currentColor">
            {/* Minimalist Flask & Atom */}
            <path
              d="M 28 12 L 36 12 L 36 24 L 46 44 C 48 48 45 52 40 52 L 24 52 C 19 52 16 48 18 44 L 28 24 Z"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <line x1="25" y1="42" x2="39" y2="42" stroke="#C4A484" strokeWidth="2.2" />
            <circle cx="32" cy="36" r="2" fill="#1D1D1B" />
          </svg>
        </div>

        {/* Category badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 bg-[#F4EFE6] border border-[#1D1D1B]/20 text-[10px] uppercase font-mono tracking-[0.25em] text-[#1D1D1B]">
          <Sparkles className="w-3 h-3 text-[#C4A484]" />
          Platform Sains Interaktif
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1D1D1B] tracking-tight mb-2">
          V-LAB KIMIA SMA
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm uppercase font-mono tracking-[0.2em] text-[#1D1D1B]/70 mb-4">
          Laboratorium Kimia Virtual Kelas X, XI, dan XII
        </p>

        {/* Tagline */}
        <p className="text-base sm:text-lg font-serif italic text-[#1D1D1B]/90 max-w-md leading-relaxed mb-8">
          &ldquo;Belajar Kimia dengan Melakukan Eksperimen.&rdquo;
        </p>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1 bg-[#1D1D1B]/10 overflow-hidden mb-6">
          <div className="h-full bg-[#1D1D1B] animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Manual Enter Action */}
        <button
          onClick={onProceed}
          className="group inline-flex items-center gap-2 px-6 py-3 bg-[#1D1D1B] text-[#F9F7F2] text-xs font-bold uppercase tracking-[0.2em] shadow-[3px_3px_0px_#C4A484] hover:bg-[#333330] transition cursor-pointer"
        >
          <span>Masuk ke Laboratorium</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-6 text-[10px] font-mono tracking-widest text-[#1D1D1B]/40 uppercase">
        Standar Kurikulum Kimia SMA • Simulasi Kuantitatif
      </div>
    </div>
  );
};
