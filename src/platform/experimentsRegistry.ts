import { ExperimentRegistryItem } from './types';

export const EXPERIMENTS_REGISTRY: ExperimentRegistryItem[] = [
  // ==========================================
  // KELAS X
  // ==========================================
  {
    id: 'X-01',
    code: 'X-01',
    title: 'Keselamatan dan Pengenalan Alat Laboratorium',
    topic: 'Keselamatan Laboratorium',
    grade: ['Kelas X'],
    description: 'Kenali alat, simbol bahaya, penggunaan APD, dan prosedur kerja aman di laboratorium kimia.',
    status: 'coming_soon',
    durationMinutes: 30,
    difficulty: 'Mudah',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/safety-equipment',
    futureActivities: [
      'Memilih dan memakai APD yang tepat (jas lab, kacamata goggle, sarung tangan)',
      'Mengidentifikasi nama dan fungsi peralatan gelas laboratorium',
      'Mengenali piktogram bahaya bahan kimia GHS',
      'Praktik penanganan tumpahan asam dan basa',
      'Tata cara pembuangan limbah sisa reaksi kimia'
    ],
    thumbnailType: 'safety'
  },
  {
    id: 'X-02',
    code: 'X-02',
    title: 'Pengukuran Volume dan Massa',
    topic: 'Pengukuran',
    grade: ['Kelas X'],
    description: 'Pelajari penggunaan gelas ukur, pipet, labu ukur, buret, dan neraca melalui pengukuran virtual.',
    status: 'coming_soon',
    durationMinutes: 35,
    difficulty: 'Mudah',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/measurement',
    futureActivities: [
      'Membaca meniskus cekung dan cembung dengan benar',
      'Menimbang zat menggunakan neraca analitik digital 4 desimal',
      'Membandingkan presisi gelas ukur, labu ukur, dan pipet gondok',
      'Menghitung persentase ketidakpastian pengukuran alat volumetrik'
    ],
    thumbnailType: 'measurement'
  },
  {
    id: 'X-03',
    code: 'X-03',
    title: 'Mengenali Reaksi Kimia',
    topic: 'Perubahan Materi',
    grade: ['Kelas X'],
    description: 'Amati perubahan warna, pembentukan gas, endapan, dan perubahan suhu sebagai tanda terjadinya reaksi kimia.',
    status: 'coming_soon',
    durationMinutes: 40,
    difficulty: 'Mudah',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/chemical-reactions',
    futureActivities: [
      'Menguji reaksi logam Zn dengan larutan HCl encer (pembentukan gas H₂)',
      'Mengamati endapan kuning PbI₂ dari pencampuran KI dan Pb(NO₃)₂',
      'Mendeteksi perubahan kalor reaksi eksotermik dan endotermik',
      'Menuliskan persamaan reaksi molekuler dan ion bersih'
    ],
    thumbnailType: 'reaction'
  },
  {
    id: 'X-04',
    code: 'X-04',
    title: 'Hukum Kekekalan Massa',
    topic: 'Hukum Dasar Kimia',
    grade: ['Kelas X'],
    description: 'Bandingkan massa sistem sebelum dan sesudah reaksi pada sistem tertutup.',
    status: 'coming_soon',
    durationMinutes: 35,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/mass-conservation',
    futureActivities: [
      'Melakukan reaksi dalam labu erlenmeyer tertutup rapat dengan balon',
      'Menimbang massa reaktan dan wadah sebelum pencampuran',
      'Memicu reaksi kimia antara cuka (asam asetat) dan soda kue (NaHCO₃)',
      'Membuktikan Hukum Lavoisier: massa total sebelum = sesudah reaksi'
    ],
    thumbnailType: 'mass_conservation'
  },
  {
    id: 'X-05',
    code: 'X-05',
    title: 'Pereaksi Pembatas',
    topic: 'Stoikiometri',
    grade: ['Kelas X'],
    description: 'Campurkan reaktan dalam berbagai perbandingan dan tentukan pereaksi pembatas berdasarkan produk yang terbentuk.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/limiting-reactant',
    futureActivities: [
      'Menyiapkan beberapa tabung reaksi dengan mol reaktan bervariasi',
      'Mengamati volume endapan atau gas yang dihasilkan pada tiap tabung',
      'Membuat grafik hubungan jumlah pereaksi terhadap jumlah produk',
      'Menghitung rendemen teoritis dan persentase hasil reaksi'
    ],
    thumbnailType: 'limiting_reactant'
  },
  {
    id: 'X-06',
    code: 'X-06',
    title: 'Membuat Larutan dengan Konsentrasi Tertentu',
    topic: 'Larutan',
    grade: ['Kelas X'],
    description: 'Gunakan neraca, labu ukur, pipet, dan pelarut untuk membuat larutan dengan konsentrasi yang ditentukan.',
    status: 'coming_soon',
    durationMinutes: 40,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/solution-prep',
    futureActivities: [
      'Menghitung massa zat padat murni (NaCl / NaOH) yang diperlukan',
      'Melarutkan zat padat dalam gelas kimia dengan sedikit aquades',
      'Memindahkan larutan secara kuantitatif ke dalam labu ukur',
      'Menambahkan aquades hingga tanda batas kalibrasi dan menghomogenkan'
    ],
    thumbnailType: 'solution_prep'
  },
  {
    id: 'X-07',
    code: 'X-07',
    title: 'Pengenceran Larutan',
    topic: 'Larutan',
    grade: ['Kelas X'],
    description: 'Gunakan pipet volumetrik dan labu ukur untuk menyiapkan larutan melalui proses pengenceran.',
    status: 'coming_soon',
    durationMinutes: 35,
    difficulty: 'Mudah',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/dilution',
    futureActivities: [
      'Menerapkan rumus pengenceran V₁ × M₁ = V₂ × M₂',
      'Mengambil alikuot larutan pekat menggunakan pipet volumetrik dan rubber bulb',
      'Mencampur secara cermat dan membalikkan labu ukur',
      'Menguji densitas atau warna larutan hasil pengenceran'
    ],
    thumbnailType: 'dilution'
  },
  {
    id: 'X-08',
    code: 'X-08',
    title: 'Uji Nyala Unsur',
    topic: 'Struktur Atom',
    grade: ['Kelas X'],
    description: 'Amati warna nyala beberapa ion logam dan hubungkan dengan transisi energi elektron.',
    status: 'coming_soon',
    durationMinutes: 35,
    difficulty: 'Mudah',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/flame-test',
    futureActivities: [
      'Membersihkan kawat platina atau nikrom dengan HCl pekat',
      'Mencelupkan kawat ke dalam sampel garam logam (Na⁺, K⁺, Ca²⁺, Cu²⁺, Ba²⁺, Li⁺)',
      'Memanaskan kawat di zona pembakar Bunsen yang tidak berasap',
      'Menganalisis panjang gelombang emisi spektrum atomik'
    ],
    thumbnailType: 'flame_test'
  },

  // ==========================================
  // KELAS XI
  // ==========================================
  {
    id: 'XI-01',
    code: 'XI-01',
    title: 'Polaritas dan Kelarutan',
    topic: 'Ikatan Kimia dan Gaya Antarmolekul',
    grade: ['Kelas XI'],
    description: 'Bandingkan kelarutan berbagai zat untuk mempelajari hubungan polaritas dengan gaya antarmolekul.',
    status: 'coming_soon',
    durationMinutes: 40,
    difficulty: 'Mudah',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/polarity-solubility',
    futureActivities: [
      'Menguji kelarutan zat terlarut dalam pelarut polar (air) dan nonpolar (heksana/minyak)',
      'Mengamati fenomena "like dissolves like"',
      'Menganalisis interaksi dipol-dipol, ikatan hidrogen, dan gaya dispersi London',
      'Menyimpulkan pengaruh gugus hidrofilik dan hidrofobik'
    ],
    thumbnailType: 'polarity'
  },
  {
    id: 'XI-02',
    code: 'XI-02',
    title: 'Kalorimetri Reaksi',
    topic: 'Termokimia',
    grade: ['Kelas XI'],
    description: 'Ukur perubahan suhu menggunakan kalorimeter virtual dan tentukan perubahan entalpi.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/calorimetry',
    futureActivities: [
      'Mengukur suhu awal larutan HCl dan larutan NaOH menggunakan termometer presisi',
      'Mencampurkan kedua larutan ke dalam bejana kalorimeter sederhana',
      'Mencatat kurva kenaikan suhu terhadap waktu (ΔT maksimum)',
      'Menghitung kalor reaksi q = m × c × ΔT dan perubahan entalpi netralisasi (ΔHn)'
    ],
    thumbnailType: 'calorimetry'
  },
  {
    id: 'XI-03',
    code: 'XI-03',
    title: 'Faktor-Faktor yang Mempengaruhi Laju Reaksi',
    topic: 'Laju Reaksi',
    grade: ['Kelas XI'],
    description: 'Uji pengaruh konsentrasi, suhu, luas permukaan, dan katalis terhadap laju reaksi.',
    status: 'coming_soon',
    durationMinutes: 50,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/reaction-rate',
    futureActivities: [
      'Mengukur waktu hilangnya tanda silang pada reaksi natrium tiosulfat + HCl',
      'Memvariasikan konsentrasi Na₂S₂O₃ untuk menentukan orde reaksi',
      'Mengamati pengaruh peningkatan suhu terhadap frekuensi tumbukan efektif',
      'Menguji efek katalis MnO₂ pada penguraian hidrogen peroksida (H₂O₂)'
    ],
    thumbnailType: 'reaction_rate'
  },
  {
    id: 'XI-04',
    code: 'XI-04',
    title: 'Pergeseran Kesetimbangan',
    topic: 'Kesetimbangan Kimia',
    grade: ['Kelas XI'],
    description: 'Ubah konsentrasi dan suhu untuk mengamati pergeseran kesetimbangan berdasarkan prinsip Le Chatelier.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/equilibrium',
    futureActivities: [
      'Mengamati kesetimbangan ion kompleks besi(III) tiosianat [Fe(SCN)]²⁺ yang berwarna merah darah',
      'Menambahkan ion Fe³⁺ atau SCN⁻ dan melihat pergeseran arah reaksi',
      'Menguji pengaruh pemanasan dan pendinginan pada tabung reaksi',
      'Menerapkan Asas Le Chatelier untuk meramalkan arah pergeseran'
    ],
    thumbnailType: 'equilibrium'
  },
  {
    id: 'XI-05',
    code: 'XI-05',
    title: 'Identifikasi Asam–Basa dan Pengukuran pH',
    topic: 'Asam dan Basa',
    grade: ['Kelas XI'],
    description: 'Gunakan indikator dan pH meter virtual untuk menentukan sifat dan pH berbagai larutan.',
    status: 'coming_soon',
    durationMinutes: 40,
    difficulty: 'Mudah',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/ph-identification',
    futureActivities: [
      'Menguji sampel dengan kertas lakmus merah dan biru',
      'Menggunakan larutan indikator alami (kunyit, kol ungu, kembang sepatu)',
      'Mengukur nilai pH menggunakan indikator universal dan elektroda pH meter terkalibrasi',
      'Mengelompokkan asam kuat, asam lemah, basa kuat, dan basa lemah'
    ],
    thumbnailType: 'ph_acid_base'
  },
  {
    id: 'XI-06',
    code: 'XI-06',
    title: 'Titrasi Asam–Basa',
    topic: 'Asam dan Basa',
    grade: ['Kelas XI'],
    description: 'Tentukan konsentrasi HCl yang tidak diketahui melalui titrasi menggunakan NaOH standar.',
    status: 'available', // <-- ACTIVE EXISTING EXPERIMENT
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/acid-base-titration',
    futureActivities: [
      'Pemasangan dan pembilasan buret secara kuantitatif',
      'Pemeriksaan dan pengeluaran gelembung udara pada ujung buret',
      'Pengambilan alikuot analit HCl 25,00 mL menggunakan pipet volume',
      'Penambahan indikator fenolftalein (PP) 3 tetes',
      'Titrasi kasar penaksir dan titrasi teliti berulang (konkordan)',
      'Pengamatan titik akhir titrasi (warna merah muda seulas bertahan 30 detik)',
      'Perhitungan konsentrasi HCl dan pembuatan laporan resmi praktikum'
    ],
    thumbnailType: 'titration'
  },
  {
    id: 'XI-07',
    code: 'XI-07',
    title: 'Ketahanan Larutan Penyangga terhadap Perubahan pH',
    topic: 'Larutan Penyangga',
    grade: ['Kelas XI'],
    description: 'Tambahkan sedikit asam atau basa dan bandingkan perubahan pH larutan penyangga dan larutan biasa.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/buffer-solutions',
    futureActivities: [
      'Membuat larutan penyangga asam (CH₃COOH + CH₃COONa) dan larutan pembanding (air suling)',
      'Menambahkan tetes demi tetes larutan HCl 0,1 M pada kedua bejana',
      'Menambahkan tetes demi tetes larutan NaOH 0,1 M pada kedua bejana',
      'Mencatat kurva ketahanan pH dan menghitung kapasitas penyangga'
    ],
    thumbnailType: 'buffer'
  },
  {
    id: 'XI-08',
    code: 'XI-08',
    title: 'Pembentukan dan Kelarutan Endapan',
    topic: 'Kesetimbangan Kelarutan',
    grade: ['Kelas XI'],
    description: 'Campurkan berbagai ion untuk mengamati pembentukan endapan dan konsep kesetimbangan kelarutan.',
    status: 'coming_soon',
    durationMinutes: 40,
    difficulty: 'Lanjutan',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/solubility-ksp',
    futureActivities: [
      'Mencampurkan larutan ion Ca²⁺ dan SO₄²⁻ pada berbagai konsentrasi ionik',
      'Membandingkan hasil kali kelarutan Qsp dengan nilai tetapan Ksp',
      'Memprediksi apakah larutan belum jenuh, tepat jenuh, atau mengendap',
      'Mengamati pengaruh ion senama terhadap kelarutan garam sukar larut'
    ],
    thumbnailType: 'solubility'
  },

  // ==========================================
  // KELAS XII
  // ==========================================
  {
    id: 'XII-01',
    code: 'XII-01',
    title: 'Penurunan Titik Beku Larutan',
    topic: 'Sifat Koligatif Larutan',
    grade: ['Kelas XII'],
    description: 'Bandingkan titik beku pelarut murni dan beberapa larutan dengan konsentrasi berbeda.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/freezing-point',
    futureActivities: [
      'Menyiapkan bejana pendingin berisi campuran es batu dan garam dapur kasar',
      'Mengukur suhu pembekuan air suling murni sebagai acuan kalibrasi (0 °C)',
      'Mengukur penurunan titik beku larutan non-elektrolit (urea) dan elektrolit (NaCl)',
      'Menghitung tetapan penurunan titik beku molal pelarut (Kf) dan faktor van Hoff (i)'
    ],
    thumbnailType: 'freezing_point'
  },
  {
    id: 'XII-02',
    code: 'XII-02',
    title: 'Sel Volta',
    topic: 'Redoks dan Elektrokimia',
    grade: ['Kelas XII'],
    description: 'Susun sel elektrokimia, pilih elektroda, dan ukur potensial sel.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/voltaic-cell',
    futureActivities: [
      'Menyiapkan setengah sel anoda (logam Zn dalam ZnSO₄) dan katoda (logam Cu dalam CuSO₄)',
      'Memasang jembatan garam (agar-agar berisi KNO₃/KCl) penghubung kedua beker',
      'Menghubungkan kabel elektroda ke voltmeter digital presisi',
      'Mengukur potensial sel standar (E°sel) dan membandingkannya dengan perhitungan teoritis deret Volta'
    ],
    thumbnailType: 'voltaic_cell'
  },
  {
    id: 'XII-03',
    code: 'XII-03',
    title: 'Elektrolisis',
    topic: 'Elektrokimia',
    grade: ['Kelas XII'],
    description: 'Amati reaksi pada anoda dan katoda serta pengaruh arus listrik terhadap proses elektrolisis.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Lanjutan',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/electrolysis',
    futureActivities: [
      'Menyusun rangkaian sel elektrolisis pipa U menggunakan elektroda karbon inert',
      'Mengalirkan arus listrik DC dari catu daya variabel',
      'Menguji gas yang keluar di katoda dan anoda dengan lidi membara / tes pH',
      'Menerapkan Hukum Faraday I untuk menghitung massa endapan tembaga di katoda'
    ],
    thumbnailType: 'electrolysis'
  },
  {
    id: 'XII-04',
    code: 'XII-04',
    title: 'Faktor-Faktor yang Mempengaruhi Korosi',
    topic: 'Korosi',
    grade: ['Kelas XII'],
    description: 'Bandingkan korosi besi pada berbagai kondisi lingkungan.',
    status: 'coming_soon',
    durationMinutes: 35,
    difficulty: 'Mudah',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/corrosion',
    futureActivities: [
      'Menempatkan paku besi bersih ke dalam beberapa tabung reaksi dengan kondisi berbeda',
      'Menguji kondisi: udara kering (silika gel), air tanpa oksigen (air mendidih bertutup minyak), air garam, dan asam',
      'Mengamati perlindungan katodik dengan melilitkan kawat magnesium atau seng pada paku besi',
      'Menganalisis mekanisme elektrokimia oksidasi besi'
    ],
    thumbnailType: 'corrosion'
  },
  {
    id: 'XII-05',
    code: 'XII-05',
    title: 'Identifikasi Gugus Fungsi Senyawa Organik',
    topic: 'Senyawa Karbon',
    grade: ['Kelas XII'],
    description: 'Gunakan pengujian kimia virtual untuk membedakan beberapa kelompok senyawa organik.',
    status: 'coming_soon',
    durationMinutes: 50,
    difficulty: 'Lanjutan',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/functional-groups',
    futureActivities: [
      'Membedakan alkohol primer, sekunder, dan tersier menggunakan Reagen Lucas',
      'Membedakan aldehida dan keton menggunakan Pereaksi Tollens (cermin perak) dan Fehling',
      'Menguji keberadaan gugus karboksilat menggunakan larutan NaHCO₃ (pembentukan gas CO₂)',
      'Menyimpulkan struktur molekul dari hasil uji karakteristik'
    ],
    thumbnailType: 'functional_group'
  },
  {
    id: 'XII-06',
    code: 'XII-06',
    title: 'Reaksi Esterifikasi',
    topic: 'Senyawa Karbon',
    grade: ['Kelas XII'],
    description: 'Amati pembentukan ester dari alkohol dan asam karboksilat.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/esterification',
    futureActivities: [
      'Mereaksikan asam asetat glacial dengan etanol menggunakan katalis asam sulfat pekat (H₂SO₄)',
      'Memanaskan campuran dalam penangas air (water bath) tertutup kondensor',
      'Menuangkan hasil reaksi ke dalam gelas beker berisi air dingin untuk mengisolasi lapisan ester',
      'Mengenali aroma khas ester (etil asetat: aroma buah pisang/apel)'
    ],
    thumbnailType: 'esterification'
  },
  {
    id: 'XII-07',
    code: 'XII-07',
    title: 'Pembuatan Sabun — Saponifikasi',
    topic: 'Senyawa Karbon',
    grade: ['Kelas XII'],
    description: 'Simulasikan reaksi trigliserida dengan basa untuk mempelajari pembentukan sabun.',
    status: 'coming_soon',
    durationMinutes: 45,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/saponification',
    futureActivities: [
      'Mencampurkan minyak nabati (trigliserida) dengan larutan NaOH pekat',
      'Mengaduk sambil memanaskan hingga emulsi mengental (tahap trace)',
      'Melakukan salting-out dengan penambahan larutan garam dapur jenuh (NaCl)',
      'Memisahkan padatan sabun dari gliserol dan menguji daya busa serta pH sabun'
    ],
    thumbnailType: 'saponification'
  },
  {
    id: 'XII-08',
    code: 'XII-08',
    title: 'Sifat dan Identifikasi Polimer',
    topic: 'Makromolekul',
    grade: ['Kelas XII'],
    description: 'Bandingkan karakter beberapa polimer dan hubungkan struktur dengan sifatnya.',
    status: 'coming_soon',
    durationMinutes: 40,
    difficulty: 'Sedang',
    curriculumStandard: 'Kurikulum Merdeka / K-13',
    route: '/lab/polymers',
    futureActivities: [
      'Menguji elastisitas dan ketahanan panas polimer termoplastik dan termoset',
      'Mengamati uji pembakaran polimer sintetis (polietilena, PVC, nilon)',
      'Menguji hidrolisis amilum menjadi glukosa dengan iodin dan pereaksi Benedict',
      'Mengidentifikasi ikatan peptida pada protein dengan Uji Biuret'
    ],
    thumbnailType: 'polymer'
  }
];

export const ALL_TOPICS = Array.from(new Set(EXPERIMENTS_REGISTRY.map((e) => e.topic)));
