import React, { useState } from 'react';
import { ShieldAlert, CheckSquare, Square, ArrowRight, Glasses, Shirt, Footprints, Sparkles } from 'lucide-react';

interface SafetyScreenProps {
  onContinue: () => void;
  onDirectLab?: () => void;
  onBack: () => void;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({ onContinue, onDirectLab, onBack }) => {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({
    labCoat: false,
    goggles: false,
    closedShoes: false,
    gloves: false
  });

  const toggleItem = (key: string) => {
    setSelectedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const mandatorySatisfied =
    selectedItems.labCoat && selectedItems.goggles && selectedItems.closedShoes;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F9F7F2] text-[#1D1D1B]">
      <div className="w-full max-w-3xl bg-[#FFFFFF] border border-[#1D1D1B] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Header Badge */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#1D1D1B]/15">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-1 px-3 border border-[#1D1D1B]">
            Protokol APD
          </span>
          <span className="h-[1px] w-12 bg-[#1D1D1B]/30" />
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
            Keselamatan Kerja Kimia Analitik
          </span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1D1D1B] tracking-tight mb-2">
            Peralatan Perlindungan <span className="italic text-[#C4A484]">Diri Praktikan.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#1D1D1B]/75 font-serif italic leading-relaxed">
            Sebelum memulai manipulasi larutan asam kuat (HCl) dan basa kuat (NaOH), praktikan diwajibkan mengaktifkan perlengkapan proteksi laboratorium berikut ini.
          </p>
        </div>

        {/* PPE Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Jas Lab (Mandatory) */}
          <button
            type="button"
            onClick={() => toggleItem('labCoat')}
            className={`p-5 border text-left flex items-start gap-4 transition-all cursor-pointer ${
              selectedItems.labCoat
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                : 'bg-[#F9F7F2] border-[#1D1D1B]/20 hover:border-[#1D1D1B] text-[#1D1D1B]'
            }`}
          >
            <div className={`p-2.5 border shrink-0 mt-0.5 ${
              selectedItems.labCoat ? 'border-[#F9F7F2]/30 text-[#C4A484]' : 'border-[#1D1D1B]/20 text-[#1D1D1B]'
            }`}>
              <Shirt className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm">Jas Laboratorium Kancing Penuh</span>
                {selectedItems.labCoat ? (
                  <CheckSquare className="w-4 h-4 text-[#C4A484]" />
                ) : (
                  <Square className="w-4 h-4 text-[#1D1D1B]/40" />
                )}
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${
                selectedItems.labCoat ? 'text-[#F9F7F2]/70 font-sans' : 'text-[#1D1D1B]/60 font-sans'
              }`}>
                Melindungi pakaian dan kulit dari cipratan zat korosif.
              </p>
              <span className={`inline-block mt-2 text-[9px] font-bold uppercase tracking-[0.2em] ${
                selectedItems.labCoat ? 'text-[#C4A484]' : 'text-[#1D1D1B]'
              }`}>
                *Wajib
              </span>
            </div>
          </button>

          {/* Kacamata Goggles (Mandatory) */}
          <button
            type="button"
            onClick={() => toggleItem('goggles')}
            className={`p-5 border text-left flex items-start gap-4 transition-all cursor-pointer ${
              selectedItems.goggles
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                : 'bg-[#F9F7F2] border-[#1D1D1B]/20 hover:border-[#1D1D1B] text-[#1D1D1B]'
            }`}
          >
            <div className={`p-2.5 border shrink-0 mt-0.5 ${
              selectedItems.goggles ? 'border-[#F9F7F2]/30 text-[#C4A484]' : 'border-[#1D1D1B]/20 text-[#1D1D1B]'
            }`}>
              <Glasses className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm">Kacamata Pengaman (Goggles)</span>
                {selectedItems.goggles ? (
                  <CheckSquare className="w-4 h-4 text-[#C4A484]" />
                ) : (
                  <Square className="w-4 h-4 text-[#1D1D1B]/40" />
                )}
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${
                selectedItems.goggles ? 'text-[#F9F7F2]/70 font-sans' : 'text-[#1D1D1B]/60 font-sans'
              }`}>
                Melindungi indera penglihatan dari bahaya percikan bahan kimia.
              </p>
              <span className={`inline-block mt-2 text-[9px] font-bold uppercase tracking-[0.2em] ${
                selectedItems.goggles ? 'text-[#C4A484]' : 'text-[#1D1D1B]'
              }`}>
                *Wajib
              </span>
            </div>
          </button>

          {/* Sepatu Tertutup (Mandatory) */}
          <button
            type="button"
            onClick={() => toggleItem('closedShoes')}
            className={`p-5 border text-left flex items-start gap-4 transition-all cursor-pointer ${
              selectedItems.closedShoes
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                : 'bg-[#F9F7F2] border-[#1D1D1B]/20 hover:border-[#1D1D1B] text-[#1D1D1B]'
            }`}
          >
            <div className={`p-2.5 border shrink-0 mt-0.5 ${
              selectedItems.closedShoes ? 'border-[#F9F7F2]/30 text-[#C4A484]' : 'border-[#1D1D1B]/20 text-[#1D1D1B]'
            }`}>
              <Footprints className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm">Sepatu Tertutup</span>
                {selectedItems.closedShoes ? (
                  <CheckSquare className="w-4 h-4 text-[#C4A484]" />
                ) : (
                  <Square className="w-4 h-4 text-[#1D1D1B]/40" />
                )}
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${
                selectedItems.closedShoes ? 'text-[#F9F7F2]/70 font-sans' : 'text-[#1D1D1B]/60 font-sans'
              }`}>
                Dilarang menggunakan sandal atau selop terbuka di laboratorium.
              </p>
              <span className={`inline-block mt-2 text-[9px] font-bold uppercase tracking-[0.2em] ${
                selectedItems.closedShoes ? 'text-[#C4A484]' : 'text-[#1D1D1B]'
              }`}>
                *Wajib
              </span>
            </div>
          </button>

          {/* Sarung Tangan Karet (Recommended) */}
          <button
            type="button"
            onClick={() => toggleItem('gloves')}
            className={`p-5 border text-left flex items-start gap-4 transition-all cursor-pointer ${
              selectedItems.gloves
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                : 'bg-[#F9F7F2] border-[#1D1D1B]/20 hover:border-[#1D1D1B] text-[#1D1D1B]'
            }`}
          >
            <div className={`p-2.5 border shrink-0 mt-0.5 ${
              selectedItems.gloves ? 'border-[#F9F7F2]/30 text-[#C4A484]' : 'border-[#1D1D1B]/20 text-[#1D1D1B]'
            }`}>
              <Sparkles className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm">Sarung Tangan Nitril</span>
                {selectedItems.gloves ? (
                  <CheckSquare className="w-4 h-4 text-[#C4A484]" />
                ) : (
                  <Square className="w-4 h-4 text-[#1D1D1B]/40" />
                )}
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${
                selectedItems.gloves ? 'text-[#F9F7F2]/70 font-sans' : 'text-[#1D1D1B]/60 font-sans'
              }`}>
                Menghindari kontak langsung reagen asam/basa pekat pada kulit.
              </p>
              <span className={`inline-block mt-2 text-[9px] font-bold uppercase tracking-[0.2em] ${
                selectedItems.gloves ? 'text-[#C4A484]' : 'text-[#C4A484]'
              }`}>
                Dianjurkan
              </span>
            </div>
          </button>
        </div>

        {/* Safety Note */}
        <div className="border-l-2 border-[#1D1D1B] bg-[#F4EFE6] p-4 mb-8 text-xs text-[#1D1D1B]/80 font-serif italic">
          <strong className="text-[#1D1D1B] font-bold not-italic">Peringatan Prosedur:</strong> Selalu periksa katup buret dan gunakan rubber filler untuk memipet alikuot HCl 25.00 mL. Jangan pernah memipet larutan kimia dengan mulut.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-[#1D1D1B]/15">
          <button
            type="button"
            onClick={onBack}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-colors cursor-pointer"
          >
            ← Kembali ke Beranda
          </button>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={!mandatorySatisfied}
              onClick={onContinue}
              className={`py-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] border transition-colors cursor-pointer ${
                mandatorySatisfied
                  ? 'bg-transparent border-[#1D1D1B]/30 hover:border-[#1D1D1B] hover:bg-[#1D1D1B]/5 text-[#1D1D1B]'
                  : 'bg-transparent border-[#1D1D1B]/15 text-[#1D1D1B]/30 cursor-not-allowed'
              }`}
            >
              Pengarahan Misi
            </button>

            <button
              type="button"
              disabled={!mandatorySatisfied}
              onClick={onDirectLab || onContinue}
              className={`py-3 px-6 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-colors cursor-pointer ${
                mandatorySatisfied
                  ? 'bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2]'
                  : 'bg-[#1D1D1B]/20 text-[#1D1D1B]/40 cursor-not-allowed'
              }`}
            >
              <span>Masuk Laboratorium Virtual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
