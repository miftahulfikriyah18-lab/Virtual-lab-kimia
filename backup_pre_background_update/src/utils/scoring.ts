import {
  CalculationAnswers,
  FinalEvaluation,
  TechniqueLog,
  TrialData
} from '../types';

export function evaluateExperiment(
  trueConcentration: number,
  calculatedConcentration: number,
  trials: TrialData[],
  technique: TechniqueLog,
  calcAnswers: CalculationAnswers,
  ppeMandatoryPassed: boolean
): FinalEvaluation {
  const feedbackNotes: string[] = [];

  // 1. KESELAMATAN (Max 5 pts)
  let safetyScore = 0;
  if (ppeMandatoryPassed) safetyScore += 3;
  if (technique.pipetteFillerUsed) safetyScore += 2;
  else {
    feedbackNotes.push('Peringatan: Selalu gunakan pipette filler saat mengambil larutan analit HCl.');
  }

  // 2. TEKNIK LABORATORIUM (Max 30 pts)
  let techniqueScore = 0;

  // Burette preparation (8 pts)
  if (technique.buretteMounted) techniqueScore += 2;
  if (technique.buretteRinsedWater) techniqueScore += 2;
  if (technique.buretteConditionedWithNaOH) {
    techniqueScore += 4;
    feedbackNotes.push('Bagus: Buret dibilas dengan larutan NaOH standar untuk menjaga konsentrasi titran tetap konstan.');
  } else {
    feedbackNotes.push('Catatan Teknik: Bilas buret dengan sedikit NaOH setelah air suling agar titran tidak mengalami pengenceran.');
  }

  // Air bubble check (4 pts)
  if (technique.airBubbleChecked) {
    if (technique.airBubbleFlushed) {
      techniqueScore += 4;
    } else {
      techniqueScore += 1;
      feedbackNotes.push('Perhatian: Gelembung udara pada ujung buret harus dikeluarkan agar volume titran yang terbaca akurat.');
    }
  }

  // Indicator drop count (4 pts)
  if (technique.indicatorDropCount >= 2 && technique.indicatorDropCount <= 3) {
    techniqueScore += 4;
  } else if (technique.indicatorDropCount === 1 || technique.indicatorDropCount === 4) {
    techniqueScore += 3;
  } else if (technique.indicatorDropCount > 4) {
    techniqueScore += 2;
    feedbackNotes.push('Catatan Teknik: Penambahan indikator cukup 2–3 tetes agar tidak mempengaruhi kesetimbangan analit.');
  } else {
    techniqueScore += 0;
    feedbackNotes.push('Kekurangan: Titrasi dilakukan tanpa indikator fenolftalein sehingga titik akhir sulit diamati secara visual.');
  }

  // Flask swirling (5 pts)
  if (technique.flaskSwirlCountTotal >= 6) {
    techniqueScore += 5;
    feedbackNotes.push('Bagus: Erlenmeyer diputar secara konsisten untuk memastikan pencampuran analit dan titran merata.');
  } else if (technique.flaskSwirlCountTotal >= 3) {
    techniqueScore += 3;
  } else {
    techniqueScore += 1;
    feedbackNotes.push('Catatan Teknik: Biasakan memutar Erlenmeyer secara berkala saat meneteskan titran.');
  }

  // Meniscus reading accuracy (5 pts)
  if (technique.meniscusPrecisionOk) {
    techniqueScore += 5;
    feedbackNotes.push('Bagus: Pembacaan meniskus dilakukan dengan presisi dua angka di belakang koma pada posisi mata sejajar.');
  } else {
    techniqueScore += 2;
    feedbackNotes.push('Catatan Teknik: Perhatikan posisi mata saat membaca dasar cekungan meniskus buret.');
  }

  // Stopcock control near endpoint (4 pts)
  if (technique.titrationSlowedNearEndpoint) {
    techniqueScore += 4;
    feedbackNotes.push('Bagus: Laju titran diperlambat menjadi tetes demi tetes ketika mendekati titik akhir.');
  } else {
    techniqueScore += 1;
    feedbackNotes.push('Perhatian: Kurangi laju alir titran saat warna merah muda lokal mulai bertahan lebih lama.');
  }

  // Clamp technique
  techniqueScore = Math.min(30, Math.max(0, techniqueScore));

  // 3. PRESISI (Max 20 pts)
  // Filter accurate trials
  const accurateTrials = trials.filter((t) => !t.isRough && t.deliveredVolume > 0);
  let precisionScore = 10;
  let concordantSpread = 0;

  if (accurateTrials.length >= 2) {
    const titres = accurateTrials.map((t) => t.deliveredVolume);
    const minTitre = Math.min(...titres);
    const maxTitre = Math.max(...titres);
    concordantSpread = Number((maxTitre - minTitre).toFixed(2));

    if (concordantSpread <= 0.10) {
      precisionScore = 20;
      feedbackNotes.push(`Sangat Presisi: Selisih volume antar titrasi teliti hanya ${concordantSpread.toFixed(2)} mL (≤ 0.10 mL).`);
    } else if (concordantSpread <= 0.20) {
      precisionScore = 18;
      feedbackNotes.push(`Presisi Baik: Hasil titrasi teliti konkordan dengan selisih ${concordantSpread.toFixed(2)} mL (≤ 0.20 mL).`);
    } else if (concordantSpread <= 0.30) {
      precisionScore = 14;
      feedbackNotes.push(`Cukup Presisi: Selisih volume ${concordantSpread.toFixed(2)} mL. Disarankan mengulang titrasi untuk data lebih seragam.`);
    } else if (concordantSpread <= 0.50) {
      precisionScore = 10;
      feedbackNotes.push(`Presisi Rendah: Selisih titrasi ${concordantSpread.toFixed(2)} mL melampaui batas toleransi 0.20 mL.`);
    } else {
      precisionScore = 6;
      feedbackNotes.push(`Data Belum Konkordan: Selisih antar percobaan (${concordantSpread.toFixed(2)} mL) cukup besar.`);
    }
  } else if (accurateTrials.length === 1) {
    precisionScore = 10;
    feedbackNotes.push('Catatan: Baru satu titrasi teliti yang diselesaikan. Dianjurkan melakukan minimal 2 titrasi teliti.');
  }

  // 4. AKURASI (Max 30 pts)
  const percentError =
    trueConcentration > 0
      ? Number(
          (
            (Math.abs(calculatedConcentration - trueConcentration) / trueConcentration) *
            100
          ).toFixed(2)
        )
      : 100;

  let accuracyScore = 0;
  if (percentError <= 0.5) {
    accuracyScore = 30;
    feedbackNotes.push(`Akurasi Istimewa: Galat konsentrasi hanya ${percentError.toFixed(2)}% (≤ 0.5%).`);
  } else if (percentError <= 1.0) {
    accuracyScore = 27;
    feedbackNotes.push(`Akurasi Sangat Baik: Galat konsentrasi ${percentError.toFixed(2)}% (≤ 1.0%).`);
  } else if (percentError <= 2.0) {
    accuracyScore = 24;
    feedbackNotes.push(`Akurasi Baik: Galat konsentrasi ${percentError.toFixed(2)}% (≤ 2.0%).`);
  } else if (percentError <= 3.0) {
    accuracyScore = 20;
    feedbackNotes.push(`Akurasi Cukup: Galat konsentrasi ${percentError.toFixed(2)}% (≤ 3.0%).`);
  } else if (percentError <= 5.0) {
    accuracyScore = 15;
    feedbackNotes.push(`Akurasi Sedang: Galat konsentrasi ${percentError.toFixed(2)}%.`);
  } else if (percentError <= 8.0) {
    accuracyScore = 10;
    feedbackNotes.push(`Galat konsentrasi sebesar ${percentError.toFixed(2)}%. Kemungkinan titik akhir terlewat atau pembacaan buret kurang tepat.`);
  } else {
    accuracyScore = Math.max(5, Math.round(10 - (percentError - 8) * 0.5));
    feedbackNotes.push(`Galat konsentrasi ${percentError.toFixed(2)}% cukup tinggi. Periksa kembali pembacaan buret dan titik akhir titrasi.`);
  }

  // 5. PERHITUNGAN (Max 15 pts)
  let calculationScore = 0;
  if (calcAnswers.scores) {
    if (calcAnswers.scores.avgVolumeCorrect) calculationScore += 3;
    if (calcAnswers.scores.molesNaOHCorrect) calculationScore += 3;
    if (calcAnswers.scores.moleRatioCorrect) calculationScore += 3;
    if (calcAnswers.scores.molesHClCorrect) calculationScore += 3;
    if (calcAnswers.scores.concentrationCorrect) calculationScore += 3;
  }
  if (calculationScore === 15) {
    feedbackNotes.push('Perhitungan Sempurna: Seluruh tahapan stoikiometri dan konversi satuan dijawab dengan benar.');
  }

  // Check overtitration note
  const hasOvertitration = trials.some((t) => t.overtitration);
  if (hasOvertitration) {
    feedbackNotes.push('Pengamatan Warna: Pada titrasi tertentu warna merah muda tampak agak pekat, menandakan penambahan sedikit kelebihan basa.');
  }

  const totalScore = Math.min(
    100,
    techniqueScore + accuracyScore + precisionScore + calculationScore + safetyScore
  );

  let ratingTitle: 'Master Titrasi' | 'Analis Terampil' | 'Praktikan Berkembang' | 'Perlu Latihan' =
    'Perlu Latihan';

  if (totalScore >= 90) {
    ratingTitle = 'Master Titrasi';
  } else if (totalScore >= 80) {
    ratingTitle = 'Analis Terampil';
  } else if (totalScore >= 70) {
    ratingTitle = 'Praktikan Berkembang';
  } else {
    ratingTitle = 'Perlu Latihan';
  }

  return {
    techniqueScore,
    accuracyScore,
    precisionScore,
    calculationScore,
    safetyScore,
    totalScore,
    percentError,
    calculatedConcentration,
    trueConcentration,
    concordantSpread,
    ratingTitle,
    feedbackNotes
  };
}
