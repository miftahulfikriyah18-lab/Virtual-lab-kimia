import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertTriangle, ArrowRight, HelpCircle, BookOpen } from 'lucide-react';
import { CalculationAnswers, TrialData } from '../../types';
import {
  formatDecimals,
  parseInputNumber,
  STANDARD_ACID_VOLUME_L,
  STANDARD_BASE_CONCENTRATION,
  STANDARD_SAMPLE_VOLUME
} from '../../utils/chemistry';

interface CalculationWorksheetProps {
  trials: TrialData[];
  trueAcidConcentration?: number;
  standardBaseConcentration?: number;
  sampleVolumeMl?: number;
  initialAnswers?: CalculationAnswers;
  onComplete?: (answers: CalculationAnswers, calculatedMolarity: number) => void;
  onContinue?: (answersOrConc: any, maybeMolarity?: number) => void;
  onBackToLab?: () => void;
  onBack?: () => void;
}

export const CalculationWorksheet: React.FC<CalculationWorksheetProps> = ({
  trials,
  trueAcidConcentration = 0.1,
  standardBaseConcentration = STANDARD_BASE_CONCENTRATION,
  sampleVolumeMl = STANDARD_SAMPLE_VOLUME,
  initialAnswers,
  onComplete,
  onContinue,
  onBackToLab,
  onBack
}) => {
  // Filter accurate trials
  const accurateTrials = trials.filter((t) => !t.isRough && t.deliveredVolume > 0);
  const accurateTitres = accurateTrials.map((t) => t.deliveredVolume);

  // Compute reference concordant average
  const refAvgVolume =
    accurateTitres.length > 0
      ? accurateTitres.reduce((a, b) => a + b, 0) / accurateTitres.length
      : 25.0;

  // Expected intermediate values based on student's actual experimental average:
  const refMolesNaOH = refAvgVolume * 0.001 * standardBaseConcentration;
  const refMolesHCl = refMolesNaOH;
  const sampleVolumeL = sampleVolumeMl * 0.001;
  const refConcentrationHCl = refMolesHCl / (sampleVolumeL || STANDARD_ACID_VOLUME_L);

  // Local form state
  const [avgVolInput, setAvgVolInput] = useState<string>(
    initialAnswers?.avgNaOHVolume || formatDecimals(refAvgVolume, 2)
  );
  const [molesNaOHInput, setMolesNaOHInput] = useState<string>(
    initialAnswers?.molesNaOH || ''
  );
  const [moleRatioInput, setMoleRatioInput] = useState<string>(
    initialAnswers?.moleRatio || '1:1'
  );
  const [molesHClInput, setMolesHClInput] = useState<string>(
    initialAnswers?.molesHCl || ''
  );
  const [concInput, setConcInput] = useState<string>(
    initialAnswers?.concentrationHCl || ''
  );

  const [stepErrors, setStepErrors] = useState<{ [key: string]: string | null }>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [validationSummary, setValidationSummary] = useState<{
    correctCount: number;
    hasErrors: boolean;
  } | null>(null);

  const handleProceed = (answers: CalculationAnswers, conc: number) => {
    if (typeof onComplete === 'function') {
      onComplete(answers, conc);
    } else if (typeof onContinue === 'function') {
      onContinue(answers, conc);
    }
  };

  const handleBack = () => {
    if (typeof onBackToLab === 'function') {
      onBackToLab();
    } else if (typeof onBack === 'function') {
      onBack();
    }
  };

  const fillAllCorrectValues = () => {
    setAvgVolInput(formatDecimals(refAvgVolume, 2));
    setMolesNaOHInput(refMolesNaOH.toFixed(6));
    setMoleRatioInput('1:1');
    setMolesHClInput(refMolesHCl.toFixed(6));
    setConcInput(refConcentrationHCl.toFixed(4));
    setStepErrors({});
    setValidationSummary({ correctCount: 5, hasErrors: false });
  };

  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string | null } = {};

    // 1. Validate Average Volume (mL)
    const userAvgVol = parseInputNumber(avgVolInput);
    let avgVolumeCorrect = false;
    if (userAvgVol === null || userAvgVol <= 0) {
      errors.avgVol = 'Masukkan angka volume rata-rata yang valid (mL).';
    } else if (Math.abs(userAvgVol - refAvgVolume) > 0.3) {
      errors.avgVol = `Volume rata-rata (${userAvgVol.toFixed(2)} mL) kurang sesuai dengan data titrasi teliti Anda (~${refAvgVolume.toFixed(2)} mL).`;
    } else {
      avgVolumeCorrect = true;
    }

    // 2. Validate moles NaOH
    const userMolesNaOH = parseInputNumber(molesNaOHInput);
    let molesNaOHCorrect = false;
    const expectedMoles = (userAvgVol || refAvgVolume) * 0.001 * standardBaseConcentration;
    if (userMolesNaOH === null || userMolesNaOH <= 0) {
      errors.molesNaOH = 'Masukkan nilai mol NaOH (contoh: 0.0025 atau 2.5e-3).';
    } else if (Math.abs(userMolesNaOH - expectedMoles) / expectedMoles > 0.08) {
      errors.molesNaOH = `Periksa perhitungan mol: n = M × V(Liter) = 0.1000 × (${(userAvgVol || refAvgVolume).toFixed(2)} / 1000).`;
    } else {
      molesNaOHCorrect = true;
    }

    // 3. Validate mole ratio (1:1)
    let moleRatioCorrect = false;
    const sanitizedRatio = moleRatioInput.trim().replace(/\s+/g, '');
    if (sanitizedRatio === '1:1' || sanitizedRatio === '1' || sanitizedRatio === '1/1') {
      moleRatioCorrect = true;
    } else {
      errors.moleRatio = 'Berdasarkan reaksi HCl + NaOH → NaCl + H₂O, rasio mol adalah 1 : 1.';
    }

    // 4. Validate moles HCl
    const userMolesHCl = parseInputNumber(molesHClInput);
    let molesHClCorrect = false;
    if (userMolesHCl === null || userMolesHCl <= 0) {
      errors.molesHCl = 'Masukkan nilai mol HCl dalam sampel.';
    } else if (userMolesNaOH && Math.abs(userMolesHCl - userMolesNaOH) / userMolesNaOH > 0.08) {
      errors.molesHCl = 'Karena perbandingan mol 1:1, maka mol HCl harus sama dengan mol NaOH.';
    } else {
      molesHClCorrect = true;
    }

    // 5. Validate final concentration HCl [M]
    const userConc = parseInputNumber(concInput);
    let concentrationCorrect = false;
    const expectedConc = (userMolesHCl || expectedMoles) / (sampleVolumeL || STANDARD_ACID_VOLUME_L);

    if (userConc === null || userConc <= 0) {
      errors.conc = 'Masukkan konsentrasi HCl dalam satuan mol/L (M).';
    } else if (Math.abs(userConc - expectedConc) / expectedConc > 0.1) {
      errors.conc = `Periksa rumus konsentrasi: M = n / V(Liter) = n / 0.025 L.`;
    } else {
      concentrationCorrect = true;
    }

    setStepErrors(errors);
    setValidated(true);

    const scores = {
      avgVolumeCorrect,
      molesNaOHCorrect,
      moleRatioCorrect,
      molesHClCorrect,
      concentrationCorrect
    };

    const correctCount = [
      avgVolumeCorrect,
      molesNaOHCorrect,
      moleRatioCorrect,
      molesHClCorrect,
      concentrationCorrect
    ].filter(Boolean).length;

    const hasErrors = Object.keys(errors).length > 0;
    setValidationSummary({ correctCount, hasErrors });

    const calculationAnswers: CalculationAnswers = {
      avgNaOHVolume: avgVolInput,
      molesNaOH: molesNaOHInput,
      moleRatio: moleRatioInput,
      molesHCl: molesHClInput,
      concentrationHCl: concInput || refConcentrationHCl.toFixed(4),
      isSubmitted: true,
      scores
    };

    const finalCalculatedConcentration = userConc || refConcentrationHCl;

    // If there are no errors, OR if the user was already shown validation warnings and clicks again, proceed!
    if (!hasErrors || validated) {
      handleProceed(calculationAnswers, finalCalculatedConcentration);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F9F7F2] text-[#1D1D1B] flex items-center justify-center">
      <div className="w-full max-w-3xl bg-[#FFFFFF] border border-[#1D1D1B] p-6 md:p-10 shadow-sm relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1D1D1B]/15 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-0.5 px-2.5 border border-[#1D1D1B]">
                Lembar Stoikiometri
              </span>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
                Analisis Kuantitatif
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B] tracking-tight">
              Kalkulasi Konsentrasi <span className="italic text-[#C4A484]">HCl Analit.</span>
            </h2>
            <p className="text-xs text-[#1D1D1B]/70 font-serif italic mt-0.5">
              Gunakan data hasil titrasi volumetri untuk menentukan molaritas sampel
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-2 bg-[#F9F7F2] hover:bg-[#F4EFE6] text-[10px] font-bold uppercase tracking-[0.15em] text-[#1D1D1B] border border-[#1D1D1B]/30 transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Tutup Panduan' : 'Panduan Rumus'}</span>
          </button>
        </div>

        {/* Data summary box */}
        <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1D1D1B]/60 block mb-0.5">Alikuot HCl:</span>
            <strong className="text-[#1D1D1B] text-sm font-serif">25.00 mL (0.025 L)</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1D1D1B]/60 block mb-0.5">Titran Baku NaOH:</span>
            <strong className="text-[#1D1D1B] text-sm font-mono font-bold">0.1000 mol L⁻¹</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1D1D1B]/60 block mb-0.5">Titrasi Teliti:</span>
            <strong className="text-[#C4A484] text-sm font-serif font-bold">{accurateTrials.length} Percobaan</strong>
          </div>
        </div>

        {/* Optional Formula Hint Box */}
        {showHint && (
          <div className="p-5 bg-[#F4EFE6] border-l-2 border-[#1D1D1B] mb-6 text-xs text-[#1D1D1B] space-y-2 animate-fadeIn">
            <p className="font-serif font-bold text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C4A484]" /> Bimbingan Stoikiometri Asidimetri:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[#1D1D1B]/80 font-serif">
              <li>Konversikan volume ke satuan Liter: <code className="bg-white border border-[#1D1D1B]/20 px-1 py-0.5 font-mono text-xs">V(L) = V(mL) / 1000</code>.</li>
              <li>Hitung mol titran: <code className="bg-white border border-[#1D1D1B]/20 px-1 py-0.5 font-mono text-xs">n NaOH = M NaOH × V NaOH (L)</code>.</li>
              <li>Reaksi: <code className="bg-white border border-[#1D1D1B]/20 px-1 py-0.5 font-mono text-xs">HCl + NaOH → NaCl + H₂O</code> (1 mol HCl bereaksi dengan 1 mol NaOH).</li>
              <li>Maka pada titik ekuivalen: <code className="bg-white border border-[#1D1D1B]/20 px-1 py-0.5 font-mono text-xs">n HCl = n NaOH</code>.</li>
              <li>Hitung konsentrasi analit: <code className="bg-white border border-[#1D1D1B]/20 px-1 py-0.5 font-mono text-xs">M HCl = n HCl / V HCl (0.025 L)</code>.</li>
            </ol>
          </div>
        )}

        {/* Steps Form */}
        <form onSubmit={handleValidateAndSubmit} className="space-y-4">
          {/* Step 1: Average Volume */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <label className="text-xs font-serif font-bold text-[#1D1D1B] block mb-1">
              1. Volume rata-rata NaOH dari titrasi teliti (mL):
            </label>
            <div className="flex items-center gap-3 mt-2">
              <div className="relative w-44">
                <input
                  type="text"
                  value={avgVolInput}
                  onChange={(e) => setAvgVolInput(e.target.value)}
                  placeholder="Contoh: 24.85"
                  className="w-full px-3 py-2 bg-white border border-[#1D1D1B]/30 focus:border-[#1D1D1B] text-[#1D1D1B] font-mono font-bold text-sm outline-none transition"
                />
                <span className="absolute right-3 top-2 text-xs font-serif text-[#1D1D1B]/60">mL</span>
              </div>
              <span className="text-xs text-[#1D1D1B]/60 font-serif italic">
                (Hasil titrasi teliti yang konkordan)
              </span>
            </div>
            {stepErrors.avgVol && (
              <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {stepErrors.avgVol}
              </p>
            )}
          </div>

          {/* Step 2: Moles NaOH */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <label className="text-xs font-serif font-bold text-[#1D1D1B] block mb-0.5">
              2. Jumlah mol NaOH yang digunakan (mol = M × V_L):
            </label>
            <p className="text-[11px] text-[#1D1D1B]/60 font-serif italic mb-2">
              M NaOH = 0.1000 M ; V = (Volume rata-rata / 1000) L
            </p>
            <div className="flex items-center gap-3">
              <div className="relative w-52">
                <input
                  type="text"
                  value={molesNaOHInput}
                  onChange={(e) => setMolesNaOHInput(e.target.value)}
                  placeholder="Contoh: 0.002485"
                  className="w-full px-3 py-2 bg-white border border-[#1D1D1B]/30 focus:border-[#1D1D1B] text-[#1D1D1B] font-mono font-bold text-sm outline-none transition"
                />
                <span className="absolute right-3 top-2 text-xs font-serif text-[#1D1D1B]/60">mol</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const v = parseInputNumber(avgVolInput) || refAvgVolume;
                  const m = v * 0.001 * 0.1;
                  setMolesNaOHInput(m.toFixed(6));
                }}
                className="px-3 py-2 bg-white hover:bg-[#F4EFE6] text-[10px] font-bold uppercase tracking-[0.1em] text-[#1D1D1B] border border-[#1D1D1B]/30 cursor-pointer"
              >
                Hitung Otomatis
              </button>
            </div>
            {stepErrors.molesNaOH && (
              <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {stepErrors.molesNaOH}
              </p>
            )}
          </div>

          {/* Step 3: Mole Ratio */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <label className="text-xs font-serif font-bold text-[#1D1D1B] block mb-1">
              3. Perbandingan koefisien reaksi (Mol HCl : Mol NaOH):
            </label>
            <div className="flex items-center gap-3 mt-2">
              <select
                value={moleRatioInput}
                onChange={(e) => setMoleRatioInput(e.target.value)}
                className="px-3 py-2 bg-white border border-[#1D1D1B]/30 focus:border-[#1D1D1B] text-[#1D1D1B] font-mono font-bold text-sm outline-none"
              >
                <option value="1:1">1 : 1 (HCl + NaOH)</option>
                <option value="1:2">1 : 2</option>
                <option value="2:1">2 : 1</option>
              </select>
              <span className="text-xs text-[#1D1D1B]/60 font-serif italic">
                Persamaan: HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)
              </span>
            </div>
            {stepErrors.moleRatio && (
              <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {stepErrors.moleRatio}
              </p>
            )}
          </div>

          {/* Step 4: Moles HCl */}
          <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/20">
            <label className="text-xs font-serif font-bold text-[#1D1D1B] block mb-1">
              4. Jumlah mol HCl dalam 25.00 mL sampel analit:
            </label>
            <div className="flex items-center gap-3 mt-2">
              <div className="relative w-52">
                <input
                  type="text"
                  value={molesHClInput}
                  onChange={(e) => setMolesHClInput(e.target.value)}
                  placeholder="Contoh: 0.002485"
                  className="w-full px-3 py-2 bg-white border border-[#1D1D1B]/30 focus:border-[#1D1D1B] text-[#1D1D1B] font-mono font-bold text-sm outline-none transition"
                />
                <span className="absolute right-3 top-2 text-xs font-serif text-[#1D1D1B]/60">mol</span>
              </div>
              <button
                type="button"
                onClick={() => setMolesHClInput(molesNaOHInput || refMolesNaOH.toFixed(6))}
                className="px-3 py-2 bg-white hover:bg-[#F4EFE6] text-[10px] font-bold uppercase tracking-[0.1em] text-[#1D1D1B] border border-[#1D1D1B]/30 cursor-pointer"
              >
                Samakan (1:1)
              </button>
            </div>
            {stepErrors.molesHCl && (
              <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {stepErrors.molesHCl}
              </p>
            )}
          </div>

          {/* Step 5: Final Concentration [M] */}
          <div className="p-5 bg-[#F4EFE6] border border-[#1D1D1B]">
            <label className="text-xs md:text-sm font-serif font-bold text-[#1D1D1B] block mb-0.5">
              5. Konsentrasi akhir sampel larutan HCl (mol L⁻¹ atau M):
            </label>
            <p className="text-[11px] text-[#1D1D1B]/70 font-serif italic mb-3">
              M HCl = n HCl / V HCl (L) = n HCl / 0.0250 L
            </p>
            <div className="flex items-center gap-3">
              <div className="relative w-60">
                <input
                  type="text"
                  value={concInput}
                  onChange={(e) => setConcInput(e.target.value)}
                  placeholder="Contoh: 0.0994 atau 0.1000"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#1D1D1B] text-[#1D1D1B] font-mono font-bold text-base outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-[#C4A484]">
                  M (mol/L)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const n = parseInputNumber(molesHClInput) || refMolesHCl;
                  const c = n / 0.025;
                  setConcInput(c.toFixed(4));
                }}
                className="px-4 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.15em] cursor-pointer transition-colors"
              >
                Hitung Konsentrasi
              </button>
            </div>
            {stepErrors.conc && (
              <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {stepErrors.conc}
              </p>
            )}
          </div>

          {/* Validation Feedback Banner */}
          {validationSummary && validationSummary.hasErrors && (
            <div className="p-4 bg-amber-50 border border-amber-300 text-xs text-[#1D1D1B] space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Hasil Periksa: {validationSummary.correctCount} dari 5 langkah tepat</span>
                </div>
                <button
                  type="button"
                  onClick={fillAllCorrectValues}
                  className="px-3 py-1.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Bantu Isi Otomatis
                </button>
              </div>
              <p className="text-[11px] text-amber-900/80 font-serif">
                Periksa kolom bertanda merah di atas untuk menyempurnakan kalkulasi Anda, atau Anda dapat menekan tombol <strong>&quot;Tetap Lanjut ke Analisis Kurva&quot;</strong> di bawah untuk melanjutkan tahap praktikum.
              </p>
            </div>
          )}

          {validationSummary && !validationSummary.hasErrors && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Semua 5 tahapan stoikiometri telah dihitung dengan benar (Skor Sempurna: 15/15)!</span>
              </div>
            </div>
          )}

          {/* Navigation & Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-[#1D1D1B]/15 gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-colors cursor-pointer self-start sm:self-center"
            >
              ← Kembali ke Meja Lab
            </button>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              {validationSummary?.hasErrors && (
                <button
                  type="button"
                  onClick={() => {
                    const finalCalculatedConcentration = parseInputNumber(concInput) || refConcentrationHCl;
                    handleProceed(
                      {
                        avgNaOHVolume: avgVolInput,
                        molesNaOH: molesNaOHInput,
                        moleRatio: moleRatioInput,
                        molesHCl: molesHClInput,
                        concentrationHCl: concInput || refConcentrationHCl.toFixed(4),
                        isSubmitted: true,
                        scores: {
                          avgVolumeCorrect: !stepErrors.avgVol,
                          molesNaOHCorrect: !stepErrors.molesNaOH,
                          moleRatioCorrect: !stepErrors.moleRatio,
                          molesHClCorrect: !stepErrors.molesHCl,
                          concentrationCorrect: !stepErrors.conc
                        }
                      },
                      finalCalculatedConcentration
                    );
                  }}
                  className="py-3 px-4 bg-[#F4EFE6] hover:bg-[#EAE4D7] text-[#1D1D1B] text-[10px] font-bold uppercase tracking-[0.15em] border border-[#1D1D1B]/30 transition-colors cursor-pointer"
                >
                  Tetap Lanjut ke Analisis Kurva →
                </button>
              )}

              <button
                type="submit"
                className="py-3 px-6 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A484]" />
                <span>
                  {validationSummary?.hasErrors ? 'Periksa Ulang & Lanjutkan' : 'Periksa & Lanjutkan ke Analisis Kurva'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
