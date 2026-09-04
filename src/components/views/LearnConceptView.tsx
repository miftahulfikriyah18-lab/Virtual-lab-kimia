import React from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Info, Sparkles, ArrowRight } from 'lucide-react';

interface LearnConceptViewProps {
  onBack: () => void;
  onStartLab: () => void;
}

export const LearnConceptView: React.FC<LearnConceptViewProps> = ({ onBack, onStartLab }) => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 bg-[#F9F7F2] text-[#1D1D1B] flex flex-col items-center">
      <div className="w-full max-w-4xl bg-[#FFFFFF] border border-[#1D1D1B] shadow-sm p-6 sm:p-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1D1D1B]/15 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
          <button
            onClick={onStartLab}
            className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Mulai Praktikum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Header Badge & Title */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-1 px-3 border border-[#1D1D1B]">
            Landasan Teori
          </span>
          <span className="h-[1px] w-12 bg-[#1D1D1B]/30" />
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
            Kurikulum Kimia Analitik SMA
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D1D1B] tracking-tight mb-2">
            Konsep Teoretis <span className="italic text-[#C4A484]">Titrasi Asam–Basa.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#1D1D1B]/75 font-serif italic leading-relaxed">
            Prinsip volumetri analitik netralisasi: HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)
          </p>
        </div>

        {/* Conceptual Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm leading-relaxed">
          {/* Card 1 */}
          <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20 space-y-2">
            <h3 className="text-base font-serif font-bold text-[#1D1D1B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C4A484]" /> 1. Apa itu Titrasi Asam–Basa?
            </h3>
            <p className="text-[#1D1D1B]/75 leading-relaxed font-sans">
              Titrasi asidimetri–alkalimetri adalah metode analisis volumetri kuantitatif untuk menentukan konsentrasi larutan analit (asam) dengan cara mereaksikannya secara terkontrol dengan larutan titran (basa) yang konsentrasinya telah diketahui secara tepat (larutan standar).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20 space-y-2">
            <h3 className="text-base font-serif font-bold text-[#1D1D1B] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C4A484]" /> 2. Analit vs Titran
            </h3>
            <p className="text-[#1D1D1B]/75 leading-relaxed font-sans">
              <strong className="text-[#1D1D1B]">Analit (HCl):</strong> Larutan yang konsentrasinya belum diketahui. Diambil tepat 25.00 mL menggunakan pipet volumetrik dan dimasukkan ke dalam Erlenmeyer.
            </p>
            <p className="text-[#1D1D1B]/75 leading-relaxed font-sans">
              <strong className="text-[#1D1D1B]">Titran (NaOH 0.1000 M):</strong> Larutan standar berkonsentrasi diketahui yang diisikan ke dalam buret 50 mL.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20 space-y-2">
            <h3 className="text-base font-serif font-bold text-[#1D1D1B] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#C4A484]" /> 3. Titik Ekuivalen vs Titik Akhir
            </h3>
            <p className="text-[#1D1D1B]/75 leading-relaxed font-sans">
              <strong className="text-[#1D1D1B]">Titik Ekuivalen (Stoikiometri):</strong> Kondisi teoretis saat mol asam bereaksi sempurna dengan mol basa (<code className="bg-[#F4EFE6] px-1 py-0.5 border border-[#1D1D1B]/15 text-[#1D1D1B] font-mono text-xs">n HCl = n NaOH</code>). Pada asam kuat dan basa kuat di suhu 25 °C, pH ekuivalen = <strong className="text-[#1D1D1B]">7.00</strong>.
            </p>
            <p className="text-[#1D1D1B]/75 leading-relaxed font-sans">
              <strong className="text-[#1D1D1B]">Titik Akhir Titrasi:</strong> Titik ketika indikator berubah warna secara permanen yang teramati oleh praktikan.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20 space-y-2">
            <h3 className="text-base font-serif font-bold text-[#1D1D1B] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C4A484]" /> 4. Peran Indikator Fenolftalein (PP)
            </h3>
            <p className="text-[#1D1D1B]/75 leading-relaxed font-sans">
              Fenolftalein tak berwarna dalam suasana asam (pH &lt; 8.2) dan berubah menjadi merah muda pada trayek <strong className="text-[#1D1D1B]">pH 8.2 – 10.0</strong>. Titik akhir ideal dicapai saat larutan berubah menjadi <em className="font-serif italic text-[#C4A484]">merah muda sangat pucat yang bertahan setidaknya 30 detik</em>. Jika larutan berubah fuchsia pekat, berarti terjadi kelebihan basa (overtitrasi).
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-5 bg-[#F4EFE6] border border-[#1D1D1B]/15 space-y-2 md:col-span-2">
            <h3 className="text-base font-serif font-bold text-[#1D1D1B] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C4A484]" /> 5. Mengapa Titrasi Harus Diulang (Titer Konkordan)?
            </h3>
            <p className="text-[#1D1D1B]/80 leading-relaxed font-sans">
              Pengukuran tunggal rentan terhadap galat eksperimen (kesalahan paralaks, tetesan berlebih, gelembung udara). Titrasi teliti diulang minimal 2–3 kali. Data dikatakan <strong className="text-[#1D1D1B]">konkordan</strong> jika selisih volume titran terpakai antar percobaan bernilai <strong className="text-[#1D1D1B]">≤ 0.20 mL</strong> (idealnya ≤ 0.10 mL). Nilai rata-rata dari data yang konkordan kemudian digunakan untuk menghitung konsentrasi akhir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
