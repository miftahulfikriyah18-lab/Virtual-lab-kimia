import React from 'react';
import { TrendingUp, ArrowRight, BookOpen, CheckCircle, Info } from 'lucide-react';
import { TitrationCurve } from '../TitrationCurve';
import { TrialData } from '../../types';
import { generateTitrationCurvePoints, calculateTheoreticalEquivalence } from '../../utils/chemistry';

interface CurveAnalysisViewProps {
  trials: TrialData[];
  trueAcidConcentration: number;
  calculatedConcentration: number;
  onContinue: () => void;
  onBack: () => void;
}

export const CurveAnalysisView: React.FC<CurveAnalysisViewProps> = ({
  trials,
  trueAcidConcentration,
  calculatedConcentration,
  onContinue,
  onBack
}) => {
  const theoreticalEqVol = calculateTheoreticalEquivalence(trueAcidConcentration);

  // Take points from the best accurate trial or generate smooth reference curve
  const bestTrial = trials.find((t) => !t.isRough && t.deliveredVolume > 0) || trials[0];
  const experimentalPoints = bestTrial?.curvePoints || [];
  const referencePoints = generateTitrationCurvePoints(trueAcidConcentration, 38.0, 0.2);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F9F7F2] text-[#1D1D1B] flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#FFFFFF] border border-[#1D1D1B] p-6 md:p-10 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1D1D1B]/15 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-0.5 px-2.5 border border-[#1D1D1B]">
                Analisis Grafis
              </span>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
                Kurva Titrasi Netralisasi
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B] tracking-tight">
              Kajian Kurva Titrasi <span className="italic text-[#C4A484]">Asam–Basa.</span>
            </h2>
            <p className="text-xs text-[#1D1D1B]/70 font-serif italic mt-0.5">
              Hubungan kuantitatif volume titran NaOH terhadap perubahan pH larutan analit HCl
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          {/* Left: Titration Curve Visualizer */}
          <div className="lg:col-span-7">
            <div className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-3">
              <TitrationCurve
                points={referencePoints}
                currentVolume={bestTrial?.deliveredVolume || theoreticalEqVol}
                currentPh={bestTrial?.pH || 7.0}
                isEquivalenceRevealed={true}
                equivalenceVolume={theoreticalEqVol}
                maxVolume={38.0}
              />
            </div>
            <div className="flex items-center justify-between mt-3 px-1 text-xs font-serif text-[#1D1D1B]/70">
              <span>Volume Ekuivalen: <strong className="font-mono font-bold text-[#1D1D1B]">{theoreticalEqVol.toFixed(2)} mL</strong></span>
              <span>pH Ekuivalen: <strong className="font-mono font-bold text-[#C4A484]">7.00 (Netral)</strong></span>
            </div>
          </div>

          {/* Right: Scientific Explanations */}
          <div className="lg:col-span-5 space-y-3.5 text-xs text-[#1D1D1B]">
            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
              <h4 className="font-serif font-bold text-sm text-[#1D1D1B] mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#C4A484]" />
                1. Sebelum Titik Ekuivalen
              </h4>
              <p className="leading-relaxed text-[#1D1D1B]/75 font-serif">
                Pada awal titrasi, pH larutan naik perlahan karena konsentrasi ion [H⁺] dari sisa asam kuat HCl masih sangat mendominasi larutan analit.
              </p>
            </div>

            <div className="p-4 bg-[#F4EFE6] border-l-2 border-[#1D1D1B]">
              <h4 className="font-serif font-bold text-sm text-[#1D1D1B] mb-1.5 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#C4A484]" />
                2. Lonjakan Tajam pH (pH 4 → 10)
              </h4>
              <p className="leading-relaxed text-[#1D1D1B]/80 font-serif">
                Tepat di sekitar titik ekuivalen ({theoreticalEqVol.toFixed(2)} mL), penambahan satu tetes titran (~0.05 mL) melesatkan pH drastis dari 4 menuju 10 karena seluruh ion H⁺ telah bereaksi sempurna membentuk NaCl dan H₂O.
              </p>
            </div>

            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
              <h4 className="font-serif font-bold text-sm text-[#1D1D1B] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#C4A484]" />
                3. Mengapa Fenolftalein Tepat?
              </h4>
              <p className="leading-relaxed text-[#1D1D1B]/75 font-serif">
                Indikator fenolftalein bertransisi pada <strong>pH 8.2 – 10.0</strong> (merah muda seulas). Karena interval ini berada persis di zona lompatan pH tajam, selisih volume titik akhir dengan titik ekuivalen teoritis (pH 7.00) hampir nol (&lt; 0.05 mL).
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-5 border-t border-[#1D1D1B]/15">
          <button
            type="button"
            onClick={onBack}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-colors cursor-pointer"
          >
            ← Kembali ke Perhitungan
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="py-3 px-6 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-colors cursor-pointer"
          >
            <span>Lanjut ke Pertanyaan Refleksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
