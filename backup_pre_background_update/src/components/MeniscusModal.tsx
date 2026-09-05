import React, { useState } from 'react';
import { Eye, HelpCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { formatDecimals, parseInputNumber } from '../utils/chemistry';
import { LabMode } from '../types';

interface MeniscusModalProps {
  actualReading: number; // e.g., 0.45 or 24.85
  title: string;
  mode: LabMode;
  onConfirm: (enteredValue: number, isAccurate: boolean) => void;
  onClose: () => void;
}

export const MeniscusModal: React.FC<MeniscusModalProps> = ({
  actualReading,
  title,
  mode,
  onConfirm,
  onClose
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [eyePosition, setEyePosition] = useState<'high' | 'level' | 'low'>('level');
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  // Center display around actual reading:
  // Base integer reading
  const baseMl = Math.floor(actualReading);
  const fraction = actualReading - baseMl;

  // Zoomed SVG vertical scale:
  // Show from (baseMl - 0.5) to (baseMl + 1.5), so total 2.0 mL span in 300px
  // 1.0 mL = 150px => 0.1 mL = 15px
  const centerMl = baseMl + 0.5;
  const startMl = centerMl - 1.0;
  const endMl = centerMl + 1.0;

  // Visual parallax offset based on student's chosen eye angle:
  const parallaxOffsetMl = eyePosition === 'high' ? -0.06 : eyePosition === 'low' ? +0.06 : 0;
  const apparentReading = actualReading + parallaxOffsetMl;

  const yForMl = (ml: number) => {
    // Burette scale increases downwards
    return 30 + (ml - startMl) * 140;
  };

  const meniscusY = yForMl(apparentReading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInputNumber(inputValue);

    if (parsed === null) {
      setErrorNotice('Masukkan angka volume yang valid (contoh: 0.45 atau 25.10)');
      return;
    }

    // Check decimal places guideline
    const rawTrimmed = inputValue.trim().replace(',', '.');
    const decimalParts = rawTrimmed.split('.');
    if (decimalParts.length < 2 || decimalParts[1].length < 2) {
      if (mode === 'guided') {
        setErrorNotice(
          'Pembacaan buret analitik sebaiknya dituliskan hingga 2 angka di belakang koma (misal: 25.10 bukan 25.1).'
        );
        return;
      }
    }

    // Check accuracy tolerance (within +/- 0.08 mL)
    const diff = Math.abs(parsed - actualReading);
    const isAccurate = diff <= 0.08;

    if (mode === 'guided' && !isAccurate && !hasChecked) {
      setHasChecked(true);
      setErrorNotice(
        `Pembacaan Anda (${parsed.toFixed(2)} mL) kurang tepat. Perhatikan dasar cekungan meniskus dengan teliti (sekitar ${actualReading.toFixed(2)} mL). Coba perbaiki atau lanjutkan.`
      );
      return;
    }

    onConfirm(parsed, isAccurate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#F9F7F2] border border-[#1D1D1B] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#1D1D1B]/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1D1D1B] text-[#F9F7F2] border border-[#1D1D1B]">
              <Eye className="w-4 h-4 text-[#C4A484]" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1D1D1B] tracking-tight">{title}</h3>
              <p className="text-xs font-serif italic text-[#1D1D1B]/60">Mode Pembacaan Skala Meniskus Buret 50 mL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#1D1D1B]/60 hover:text-[#1D1D1B] hover:bg-[#F4EFE6] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
          {/* Zoomed Burette Inspection Window */}
          <div className="relative w-48 h-80 bg-white border border-[#1D1D1B]/30 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Eye-level indicator line in guided mode */}
            {mode === 'guided' && (
              <div
                className="absolute left-0 right-0 border-t border-dashed border-[#1D1D1B]/70 z-20 pointer-events-none flex items-center"
                style={{ top: `${meniscusY}px` }}
              >
                <span className="text-[9px] bg-[#1D1D1B] text-[#F9F7F2] font-mono px-1 rounded-none ml-1">
                  Garis Pandang Mata
                </span>
              </div>
            )}

            <svg viewBox="0 0 160 320" className="w-full h-full select-none">
              <defs>
                <linearGradient id="glassZoomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="25%" stopColor="#f8fafc" stopOpacity="0.1" />
                  <stop offset="75%" stopColor="#f8fafc" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="liquidZoomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#bfdbfe" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.65" />
                </linearGradient>
              </defs>

              {/* Burette Glass Walls */}
              <rect x="35" y="10" width="90" height="300" fill="url(#glassZoomGrad)" stroke="#1D1D1B" strokeWidth="1.2" />

              {/* Liquid Column */}
              <rect
                x="37"
                y={meniscusY}
                width="86"
                height={310 - meniscusY}
                fill="url(#liquidZoomGrad)"
              />

              {/* Concave Meniscus Shape (Dasar Meniskus Cekung) */}
              <path
                d={`M 37 ${meniscusY - 4} Q 80 ${meniscusY + 8} 123 ${meniscusY - 4} L 123 ${meniscusY} Q 80 ${meniscusY + 12} 37 ${meniscusY} Z`}
                fill="#2563eb"
                opacity="0.7"
              />
              <ellipse cx="80" cy={meniscusY + 6} rx="40" ry="3" fill="#ffffff" opacity="0.4" />

              {/* Graduation Scale Lines */}
              {Array.from({ length: 21 }).map((_, idx) => {
                const ml = startMl + idx * 0.1;
                const y = yForMl(ml);
                const isMajor = Math.abs(ml - Math.round(ml)) < 0.01;
                const isMid = Math.abs(ml - (Math.floor(ml) + 0.5)) < 0.01;

                return (
                  <g key={`scale-${idx}`}>
                    <line
                      x1={35}
                      y1={y}
                      x2={isMajor ? 75 : isMid ? 60 : 50}
                      y2={y}
                      stroke="#1D1D1B"
                      strokeWidth={isMajor ? 1.6 : isMid ? 1.1 : 0.8}
                    />
                    {isMajor && (
                      <text
                        x={84}
                        y={y + 4.5}
                        fill="#1D1D1B"
                        fontSize="13"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {Math.round(ml)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Educational Controls & Input */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="p-3.5 bg-white border border-[#1D1D1B]/20 mb-4 text-xs font-serif text-[#1D1D1B]/80 leading-relaxed shadow-sm">
                <p className="font-bold text-[#1D1D1B] mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C4A484]" /> Petunjuk Pembacaan Buret:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#1D1D1B]/80">
                  <li>Skala buret bertambah ke arah <strong>bawah</strong> (0 mL di atas).</li>
                  <li>Baca bagian <strong>paling bawah dari cekungan meniskus</strong> cairan.</li>
                  <li>Taksir nilai hingga <strong>dua angka di belakang koma</strong> (±0.05 atau ±0.01 mL).</li>
                </ul>
              </div>

              {/* Parallax Eye Level Toggle for Training */}
              {mode === 'guided' && (
                <div className="mb-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B] block mb-1.5 font-serif">
                    Sudut Pandang Mata (Uji Paralaks):
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEyePosition('high')}
                      className={`px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                        eyePosition === 'high'
                          ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                          : 'bg-white text-[#1D1D1B]/70 border-[#1D1D1B]/20 hover:bg-[#F4EFE6]'
                      }`}
                    >
                      Terlalu Tinggi
                    </button>
                    <button
                      type="button"
                      onClick={() => setEyePosition('level')}
                      className={`px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                        eyePosition === 'level'
                          ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                          : 'bg-white text-[#1D1D1B]/70 border-[#1D1D1B]/20 hover:bg-[#F4EFE6]'
                      }`}
                    >
                      Sejajar (Tepat)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEyePosition('low')}
                      className={`px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                        eyePosition === 'low'
                          ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                          : 'bg-white text-[#1D1D1B]/70 border-[#1D1D1B]/20 hover:bg-[#F4EFE6]'
                      }`}
                    >
                      Terlalu Rendah
                    </button>
                  </div>
                  {eyePosition !== 'level' && (
                    <p className="text-[10px] font-serif text-[#C4A484] mt-1 flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3 h-3" /> Posisi mata tidak sejajar menimbulkan kesalahan paralaks!
                    </p>
                  )}
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B] block mb-1 font-serif">
                    Hasil Pembacaan Meniskus:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Contoh: 0.45 atau 25.10"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setErrorNotice(null);
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#1D1D1B]/40 focus:border-[#1D1D1B] focus:ring-1 focus:ring-[#1D1D1B] text-[#1D1D1B] font-mono text-base font-semibold placeholder:text-[#1D1D1B]/30 outline-none transition"
                    />
                    <span className="absolute right-3.5 top-2.5 text-sm font-bold text-[#1D1D1B]/60 font-serif">
                      mL
                    </span>
                  </div>
                </div>

                {errorNotice && (
                  <div className="p-2.5 bg-white border border-[#1D1D1B] text-xs font-serif text-[#1D1D1B] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#C4A484] shrink-0 mt-0.5" />
                    <span>{errorNotice}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A484]" />
                    Simpan Pembacaan
                  </button>
                  {mode === 'guided' && (
                    <button
                      type="button"
                      onClick={() => setInputValue(formatDecimals(actualReading, 2))}
                      className="px-3 py-2 bg-white hover:bg-[#F4EFE6] text-[10px] font-bold uppercase tracking-wider text-[#1D1D1B] border border-[#1D1D1B]/30 transition cursor-pointer"
                      title="Tampilkan nilai teoritis meniskus"
                    >
                      Bantu Baca
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
