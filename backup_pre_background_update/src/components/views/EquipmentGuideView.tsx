import React, { useState } from 'react';
import { ArrowLeft, Beaker, CheckCircle2, ChevronRight } from 'lucide-react';
import { VolumetricPipetteSvg, ReagentBottleSvg, IndicatorDropperBottleSvg } from '../apparatus/PreparationApparatus';
import { BuretteAssembly } from '../apparatus/BuretteAssembly';
import { ErlenmeyerFlaskSvg } from '../apparatus/ErlenmeyerFlaskSvg';
import { DigitalPhMeterSvg } from '../apparatus/DigitalPhMeterSvg';

interface EquipmentGuideViewProps {
  onBack: () => void;
  onStartLab: () => void;
}

export const EquipmentGuideView: React.FC<EquipmentGuideViewProps> = ({ onBack, onStartLab }) => {
  const [activeItem, setActiveItem] = useState<string>('burette');

  const apparatusList = [
    {
      id: 'burette',
      name: 'Buret 50 mL & Statif',
      category: 'Alat Pengukur Volumetri Utama',
      spec: 'Kapasitas 50.00 mL, Subdivisi 0.10 mL, Toleransi Kelas A ±0.05 mL',
      desc: 'Tabung silindris kaca bertanda skala dengan kran pengatur alir (stopcock) di bagian bawah. Digunakan untuk meneteskan larutan standar (titran) secara bertahap dan terukur presisi.',
      technique: 'Bilas dengan air suling lalu kondisikan dengan sedikit larutan titran NaOH. Pastikan ujung kran terisi penuh tanpa ada gelembung udara. Baca dasar cekungan meniskus dengan posisi mata sejajar.'
    },
    {
      id: 'erlenmeyer',
      name: 'Labu Erlenmeyer 250 mL & Alas Putih',
      category: 'Wadah Reaksi Titrasi',
      spec: 'Kaca Borosilikat 3.3, Mulut Sempit, Alas Datar',
      desc: 'Wadah berbentuk kerucut berleher sempit tempat larutan analit HCl dan indikator fenolftalein dicampurkan dan dititrasi.',
      technique: 'Bentuk kerucut mempermudah pemutaran (swirling) tanpa risiko cairan terpercik keluar. Selalu letakkan Erlenmeyer di atas pelat porselen putih agar perubahan warna merah muda pucat dapat teramati dengan kontras dan jelas.'
    },
    {
      id: 'pipette',
      name: 'Pipet Volumetrik 25 mL & Filler',
      category: 'Alat Pengambil Sampel Presisi Tinggi',
      spec: 'Volume Tunggal 25.00 mL, Kalibrasi TD (To Deliver) 20°C',
      desc: 'Pipet gondok dengan satu garis tanda batas melingkar pada batang atas. Digunakan untuk memindahkan larutan analit HCl tepat 25.00 mL.',
      technique: 'Gunakan selalu rubber pipette filler (ball pipet) katup A, S, dan E. JANGAN PERNAH memipet dengan mulut! Turunkan cairan perlahan hingga dasar meniskus tepat menyinggung garis tanda batas.'
    },
    {
      id: 'phmeter',
      name: 'pH Meter Digital & Elektroda',
      category: 'Instrumen Elektrokimia',
      spec: 'Resolusi 0.01 pH, Elektroda Gelas Kombinasi',
      desc: 'Alat pengukur derajat keasaman larutan secara kontinu dan objektif melalui beda potensial elektrokimia.',
      technique: 'Elektroda dibilas dengan akuades dan dikeringkan perlahan dengan tisu sebelum dicelupkan ke dalam larutan analit. Digunakan untuk memonitor lonjakan pH kurva titrasi.'
    },
    {
      id: 'indicator',
      name: 'Botol Tetes Indikator Fenolftalein',
      category: 'Reagen Penunjuk Titik Akhir',
      spec: 'Larutan Fenolftalein 1% dalam Etanol',
      desc: 'Zaman kimia asam-basa organik lemah yang mengalami perubahan struktur molekul pada rentang pH 8.2 hingga 10.0.',
      technique: 'Cukup tambahkan 2–3 tetes ke dalam 25 mL larutan analit. Jangan menambahkan terlalu banyak tetes karena indikator itu sendiri adalah asam lemah yang dapat mempengaruhi volume titrasi.'
    }
  ];

  const currentApparatus = apparatusList.find((a) => a.id === activeItem) || apparatusList[0];

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
            className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
          >
            Mulai Praktikum
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] py-1 px-3 border border-[#1D1D1B]">
            Inventaris Laboratorium
          </span>
          <span className="h-[1px] w-12 bg-[#1D1D1B]/30" />
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#1D1D1B]/60 italic">
            Spesifikasi Volumetri
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D1D1B] tracking-tight mb-2">
            Kenali Alat <span className="italic text-[#C4A484]">Praktikum Titrasi.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#1D1D1B]/75 font-serif italic leading-relaxed">
            Spesifikasi, fungsi, dan teknik operasional alat volumetri laboratorium kimia analitik.
          </p>
        </div>

        {/* Two column interactive showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Menu List */}
          <div className="md:col-span-4 space-y-2">
            {apparatusList.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full p-3.5 border text-left flex items-center justify-between transition-colors cursor-pointer ${
                  activeItem === item.id
                    ? 'bg-[#1D1D1B] border-[#1D1D1B] text-[#F9F7F2]'
                    : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:border-[#1D1D1B]'
                }`}
              >
                <div>
                  <div className="text-xs font-serif font-bold">{item.name}</div>
                  <div className={`text-[10px] ${activeItem === item.id ? 'text-[#F9F7F2]/60' : 'text-[#1D1D1B]/50'}`}>
                    {item.category}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${activeItem === item.id ? 'text-[#C4A484]' : 'text-[#1D1D1B]/30'}`} />
              </button>
            ))}
          </div>

          {/* Right Preview Card */}
          <div className="md:col-span-8 bg-[#F9F7F2] border border-[#1D1D1B]/20 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1D1D1B]/15">
                <div>
                  <span className="text-[9px] font-bold text-[#C4A484] uppercase tracking-[0.2em]">
                    {currentApparatus.category}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#1D1D1B]">{currentApparatus.name}</h3>
                </div>
                <span className="text-[10px] font-mono text-[#1D1D1B]/80 bg-[#FFFFFF] px-2.5 py-1 border border-[#1D1D1B]/20 self-start sm:self-auto">
                  {currentApparatus.spec}
                </span>
              </div>

              {/* Apparatus Visual Render */}
              <div className="h-48 bg-[#FFFFFF] border border-[#1D1D1B]/15 flex items-center justify-center p-4 mb-5 shadow-inner">
                {currentApparatus.id === 'burette' && (
                  <div className="scale-75 origin-center">
                    <BuretteAssembly
                      currentReading={12.45}
                      stopcockState="closed"
                      isDropping={false}
                      hasAirBubble={false}
                      interactiveStopcock={false}
                    />
                  </div>
                )}
                {currentApparatus.id === 'erlenmeyer' && (
                  <div className="scale-90 origin-center">
                    <ErlenmeyerFlaskSvg
                      deliveredVolumeMl={15}
                      pH={8.8}
                      indicatorColorHex="#f472b6"
                      indicatorAlpha={0.35}
                      isSwirling={false}
                    />
                  </div>
                )}
                {currentApparatus.id === 'pipette' && (
                  <div className="scale-90 origin-center">
                    <VolumetricPipetteSvg isFilled={true} hasFiller={true} />
                  </div>
                )}
                {currentApparatus.id === 'phmeter' && (
                  <div className="scale-100 origin-center">
                    <DigitalPhMeterSvg pH={7.00} visible={true} />
                  </div>
                )}
                {currentApparatus.id === 'indicator' && (
                  <div className="scale-110 origin-center">
                    <IndicatorDropperBottleSvg />
                  </div>
                )}
              </div>

              {/* Description & Usage */}
              <div className="space-y-3 text-xs sm:text-sm text-[#1D1D1B]/80">
                <div>
                  <h4 className="font-serif font-bold text-[#1D1D1B] mb-1">Fungsi Alat:</h4>
                  <p className="leading-relaxed text-[#1D1D1B]/75 font-sans">{currentApparatus.desc}</p>
                </div>

                <div className="p-3.5 bg-[#F4EFE6] border-l-2 border-[#1D1D1B]">
                  <h4 className="font-serif font-bold text-[#1D1D1B] mb-1 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A484] shrink-0" />
                    Teknik Penggunaan yang Benar:
                  </h4>
                  <p className="leading-relaxed text-[#1D1D1B]/85 text-xs font-sans">
                    {currentApparatus.technique}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
