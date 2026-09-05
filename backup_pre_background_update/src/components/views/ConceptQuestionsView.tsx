import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { ConceptQuestionsAnswer } from '../../types';

interface ConceptQuestionsViewProps {
  onComplete: (answers: ConceptQuestionsAnswer) => void;
  onBack: () => void;
}

export const ConceptQuestionsView: React.FC<ConceptQuestionsViewProps> = ({
  onComplete,
  onBack
}) => {
  const [q1, setQ1] = useState<string>('');
  const [q2, setQ2] = useState<string>('');
  const [q3, setQ3] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    if (q1 === 'b') score += 1;
    if (q2 === 'c') score += 1;
    if (q3 === 'a') score += 1;

    setSubmitted(true);
    onComplete({
      q1,
      q2,
      q3,
      isSubmitted: true,
      score
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F9F7F2] text-[#1D1D1B] flex items-center justify-center">
      <div className="w-full max-w-3xl bg-[#FFFFFF] border border-[#1D1D1B] p-6 md:p-10 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-[#1D1D1B]/15 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-0.5 px-2.5 border border-[#1D1D1B]">
                Evaluasi Kognitif
              </span>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
                Pemahaman Konseptual
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1B] tracking-tight">
              Pertanyaan Refleksi <span className="italic text-[#C4A484]">Titrasi Volumetri.</span>
            </h2>
            <p className="text-xs text-[#1D1D1B]/70 font-serif italic mt-0.5">
              Evaluasi pemahaman konsep reaksi netralisasi, kurva pH, dan ketelitian analitik
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1 */}
          <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs md:text-sm">
            <p className="font-serif font-bold text-[#1D1D1B] text-base mb-3 leading-relaxed">
              1. Mengapa titran NaOH harus ditambahkan tetes demi tetes sambil memutar Erlenmeyer saat mendekati titik akhir?
            </p>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-white border border-[#1D1D1B]/20 hover:border-[#1D1D1B] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="q1"
                  value="a"
                  checked={q1 === 'a'}
                  onChange={(e) => setQ1(e.target.value)}
                  className="mt-0.5 text-[#1D1D1B] focus:ring-[#1D1D1B]"
                />
                <span className="text-[#1D1D1B]/80 font-serif">Agar suhu labu Erlenmeyer tidak melonjak tajam akibat panas reaksi eksoterm netralisasi.</span>
              </label>
              <label className="flex items-start gap-3 p-3 bg-white border border-[#1D1D1B]/20 hover:border-[#1D1D1B] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="q1"
                  value="b"
                  checked={q1 === 'b'}
                  onChange={(e) => setQ1(e.target.value)}
                  className="mt-0.5 text-[#1D1D1B] focus:ring-[#1D1D1B]"
                />
                <span className="text-[#1D1D1B] font-serif font-semibold">
                  Karena di sekitar titik ekuivalen terjadi lompatan pH yang sangat drastis, sehingga setetes titran dapat langsung mengubah warna indikator dan mencegah overtitrasi.
                </span>
              </label>
              <label className="flex items-start gap-3 p-3 bg-white border border-[#1D1D1B]/20 hover:border-[#1D1D1B] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="q1"
                  value="c"
                  checked={q1 === 'c'}
                  onChange={(e) => setQ1(e.target.value)}
                  className="mt-0.5 text-[#1D1D1B] focus:ring-[#1D1D1B]"
                />
                <span className="text-[#1D1D1B]/80 font-serif">Agar molekul indikator fenolftalein tidak menguap keluar dari labu Erlenmeyer.</span>
              </label>
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs md:text-sm">
            <p className="font-serif font-bold text-[#1D1D1B] text-base mb-3 leading-relaxed">
              2. Apakah perbedaan esensial antara "Titik Ekuivalen" dan "Titik Akhir Titrasi"?
            </p>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-white border border-[#1D1D1B]/20 hover:border-[#1D1D1B] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="q2"
                  value="a"
                  checked={q2 === 'a'}
                  onChange={(e) => setQ2(e.target.value)}
                  className="mt-0.5 text-[#1D1D1B] focus:ring-[#1D1D1B]"
                />
                <span className="text-[#1D1D1B]/80 font-serif">Titik ekuivalen selalu terjadi pada pH 14, sedangkan titik akhir titrasi tercapai pada pH 0.</span>
              </label>
              <label className="flex items-start gap-3 p-3 bg-white border border-[#1D1D1B]/20 hover:border-[#1D1D1B] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="q2"
                  value="b"
                  checked={q2 === 'b'}
                  onChange={(e) => setQ2(e.target.value)}
                  className="mt-0.5 text-[#1D1D1B] focus:ring-[#1D1D1B]"
                />
                <span className="text-[#1D1D1B]/80 font-serif">Titik ekuivalen adalah saat volume buret habis, sedangkan titik akhir adalah saat Erlenmeyer penuh.</span>
              </label>
              <label className="flex items-start gap-3 p-3 bg-white border border-[#1D1D1B]/20 hover:border-[#1D1D1B] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="q2"
                  value="c"
                  checked={q2 === 'c'}
                  onChange={(e) => setQ2(e.target.value)}
                  className="mt-0.5 text-[#1D1D1B] focus:ring-[#1D1D1B]"
                />
                <span className="text-[#1D1D1B] font-serif font-semibold">
                  Titik ekuivalen adalah kondisi stoikiometri teoritis saat mol analit tepat ekivalen dengan mol titran, sedangkan titik akhir adalah fenomena visual eksperimen saat indikator berubah warna.
                </span>
              </label>
            </div>
          </div>

          {/* Question 3 */}
          <div className="p-5 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs md:text-sm">
            <p className="font-serif font-bold text-[#1D1D1B] text-base mb-3 leading-relaxed">
              3. Mengapa prosedur titrasi teliti harus diulang hingga diperoleh volume titran yang "konkordan" (selisih ≤ 0.20 mL)?
            </p>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-white border border-[#1D1D1B]/20 hover:border-[#1D1D1B] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="q3"
                  value="a"
                  checked={q3 === 'a'}
                  onChange={(e) => setQ3(e.target.value)}
                  className="mt-0.5 text-[#1D1D1B] focus:ring-[#1D1D1B]"
                />
                <span className="text-[#1D1D1B] font-serif font-semibold">
                  Untuk meminimalkan galat acak (random error) serta membuktikan presisi dan keterulangan (reproducibility) hasil analisis volumetri.
                </span>
              </label>
              <label className="flex items-start gap-3 p-3 bg-white border border-[#1D1D1B]/20 hover:border-[#1D1D1B] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="q3"
                  value="b"
                  checked={q3 === 'b'}
                  onChange={(e) => setQ3(e.target.value)}
                  className="mt-0.5 text-[#1D1D1B] focus:ring-[#1D1D1B]"
                />
                <span className="text-[#1D1D1B]/80 font-serif">Untuk menghabiskan seluruh sisa larutan standar NaOH yang ada di dalam tabung buret.</span>
              </label>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-5 border-t border-[#1D1D1B]/15">
            <button
              type="button"
              onClick={onBack}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1B]/70 hover:text-[#1D1D1B] transition-colors cursor-pointer"
            >
              ← Kembali ke Kurva
            </button>

            <button
              type="submit"
              disabled={!q1 || !q2 || !q3}
              className={`py-3 px-6 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-colors cursor-pointer ${
                q1 && q2 && q3
                  ? 'bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2]'
                  : 'bg-[#1D1D1B]/20 text-[#1D1D1B]/40 cursor-not-allowed'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#C4A484]" />
              <span>Buka Laporan Praktikum Virtual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
