/** Snapshot APKASINDO 17–23 Agustus 2026 + proyeksi 4 pekan (diperbarui 24 Agu 2026). */
export type Province = {
  name: string; isl: string; pl: number; sw: number; d: number;
  k: number | null; cpo: number | null; gap: number; gapp: number;
  fair: number | null; wgap: number | null; r4: number; proj: number;
  hist5: number[]; sw5: number[];
};

export const PERIOD = {
  label: "17–23 Agustus 2026",
  prev: "10–16 Agustus 2026",
  extracted: "2026-08-23",
  asOf: "24 Agustus 2026",
};

export const WORLD = {
  kpbn: 15888, kpbnPrev: 15700,
  mys: 21708, mysRm: 5018,
  rott: 28640, rottUsd: 1619,
  kursUsd: 17690, kursRm: 4326,
  rend: 0.21,
};

export const NAT = {
  plasma: 3541, swadaya: 2985,
  gap: -556, gapp: -15.7,
  k: 90, cpo: 15166,
  fair: 5413, wgap: -34.6,
  plasmaRange: [2775, 3942] as [number, number],
  swadayaRange: [1500, 3390] as [number, number],
};

export const PROVINCES: Province[] = [{"name": "Sumatera Barat", "isl": "Sumatera", "pl": 3942, "sw": 3240, "d": -113, "k": 94, "cpo": 15435, "gap": -702, "gapp": -17.8, "fair": 5654, "wgap": -30.3, "r4": 4004, "proj": 4060, "hist5": [3972, 3972, 4045, 4055, 3942], "sw5": [3237, 3275, 3239, 3226, 3240]}, {"name": "Sumatera Utara", "isl": "Sumatera", "pl": 3917, "sw": 3040, "d": 15, "k": 94, "cpo": 15543, "gap": -877, "gapp": -22.4, "fair": 5654, "wgap": -30.7, "r4": 3929, "proj": 4034, "hist5": [3966, 3962, 3934, 3902, 3917], "sw5": [2850, 3219, 3050, 3050, 3040]}, {"name": "Sumatera Selatan", "isl": "Sumatera", "pl": 3853, "sw": 3266, "d": -57, "k": 93, "cpo": 15348, "gap": -587, "gapp": -15.2, "fair": 5593, "wgap": -31.1, "r4": 3864, "proj": 3968, "hist5": [3846, 3846, 3846, 3910, 3853], "sw5": [3298, 3288, 3268, 3180, 3266]}, {"name": "Riau", "isl": "Sumatera", "pl": 3884, "sw": 3320, "d": -57, "k": 93, "cpo": 15608, "gap": -564, "gapp": -14.5, "fair": 5593, "wgap": -30.6, "r4": 3955, "proj": 4000, "hist5": [3930, 3985, 4011, 3941, 3884], "sw5": [3300, 3340, 3200, 3320, 3320]}, {"name": "Kalimantan Selatan", "isl": "Kalimantan", "pl": 3783, "sw": 3100, "d": 0, "k": 94, "cpo": 15327, "gap": -683, "gapp": -18.1, "fair": 5654, "wgap": -33.1, "r4": 3746, "proj": 3896, "hist5": [3710, 3710, 3710, 3783, 3783], "sw5": [3219, 3238, 3250, 3395, 3100]}, {"name": "Jambi", "isl": "Sumatera", "pl": 3866, "sw": 3350, "d": -13, "k": 93, "cpo": 15411, "gap": -516, "gapp": -13.3, "fair": 5593, "wgap": -30.9, "r4": 3899, "proj": 3982, "hist5": [3929, 3941, 3911, 3879, 3866], "sw5": [3300, 3450, 3475, 3350, 3350]}, {"name": "Bangka Belitung", "isl": "Sumatera", "pl": 3796, "sw": 3126, "d": -15, "k": 93, "cpo": 15478, "gap": -670, "gapp": -17.7, "fair": 5593, "wgap": -32.1, "r4": 3778, "proj": 3910, "hist5": [3695, 3695, 3811, 3811, 3796], "sw5": [3000, 3145, 3156, 3156, 3126]}, {"name": "Kalimantan Tengah", "isl": "Kalimantan", "pl": 3761, "sw": 3325, "d": -30, "k": 92, "cpo": 15436, "gap": -436, "gapp": -11.6, "fair": 5533, "wgap": -32.0, "r4": 3762, "proj": 3874, "hist5": [3704, 3704, 3791, 3791, 3761], "sw5": [3230, 3230, 3230, 3230, 3325]}, {"name": "Aceh", "isl": "Sumatera", "pl": 3732, "sw": 3000, "d": 0, "k": 89, "cpo": 15614, "gap": -732, "gapp": -19.6, "fair": 5353, "wgap": -30.3, "r4": 3748, "proj": 3844, "hist5": [3718, 3763, 3763, 3732, 3732], "sw5": [3050, 2950, 2950, 2980, 3000]}, {"name": "Kalimantan Barat", "isl": "Kalimantan", "pl": 3618, "sw": 3269, "d": -73, "k": 92, "cpo": 15279, "gap": -349, "gapp": -9.6, "fair": 5533, "wgap": -34.6, "r4": 3668, "proj": 3726, "hist5": [3600, 3671, 3691, 3691, 3618], "sw5": [3400, 3460, 3190, 3464, 3269]}, {"name": "Kalimantan Timur", "isl": "Kalimantan", "pl": 3561, "sw": 3390, "d": 0, "k": 88, "cpo": 15230, "gap": -171, "gapp": -4.8, "fair": 5293, "wgap": -32.7, "r4": 3544, "proj": 3668, "hist5": [3477, 3528, 3528, 3561, 3561], "sw5": [3250, 3325, 3350, 3375, 3390]}, {"name": "Papua", "isl": "Papua", "pl": 3568, "sw": 2750, "d": -36, "k": 93, "cpo": 14353, "gap": -818, "gapp": -22.9, "fair": 5593, "wgap": -36.2, "r4": 3595, "proj": 3675, "hist5": [3612, 3604, 3604, 3604, 3568], "sw5": [2700, 2700, 2700, 2700, 2750]}, {"name": "Kalimantan Utara", "isl": "Kalimantan", "pl": 3442, "sw": 2950, "d": 0, "k": 87, "cpo": 15009, "gap": -492, "gapp": -14.3, "fair": 5233, "wgap": -34.2, "r4": 3428, "proj": 3545, "hist5": [3425, 3425, 3402, 3442, 3442], "sw5": [3000, 2850, 2800, 2950, 2950]}, {"name": "Sulawesi Tengah", "isl": "Sulawesi", "pl": 3416, "sw": 3140, "d": 0, "k": 87, "cpo": 15100, "gap": -276, "gapp": -8.1, "fair": 5233, "wgap": -34.7, "r4": 3310, "proj": 3518, "hist5": [3205, 3205, 3205, 3416, 3416], "sw5": [3021, 3041, 3250, 3140, 3140]}, {"name": "Sulawesi Barat", "isl": "Sulawesi", "pl": 3387, "sw": 2880, "d": 0, "k": 88, "cpo": 14949, "gap": -507, "gapp": -15.0, "fair": 5293, "wgap": -36.0, "r4": 3359, "proj": 3488, "hist5": [3276, 3276, 3387, 3387, 3387], "sw5": [2725, 2685, 2760, 2955, 2880]}, {"name": "Bengkulu", "isl": "Sumatera", "pl": 3409, "sw": 2972, "d": 0, "k": 87, "cpo": 15397, "gap": -437, "gapp": -12.8, "fair": 5233, "wgap": -34.9, "r4": 3392, "proj": 3511, "hist5": [3345, 3345, 3407, 3409, 3409], "sw5": [2908, 2925, 3100, 2926, 2972]}, {"name": "Lampung", "isl": "Sumatera", "pl": 3415, "sw": 3381, "d": 38, "k": 88, "cpo": 15152, "gap": -34, "gapp": -1.0, "fair": 5293, "wgap": -35.5, "r4": 3372, "proj": 3517, "hist5": [3317, 3317, 3377, 3377, 3415], "sw5": [3305, 3200, 3325, 3325, 3381]}, {"name": "Papua Barat", "isl": "Papua", "pl": 3128, "sw": 1500, "d": 0, "k": 86, "cpo": 13785, "gap": -1628, "gapp": -52.0, "fair": 5172, "wgap": -39.5, "r4": 3128, "proj": 3222, "hist5": [3128, 3128, 3128, 3128, 3128], "sw5": [1900, 2250, 1500, 1500, 1500]}, {"name": "Sulawesi Tenggara", "isl": "Sulawesi", "pl": 3481, "sw": 3145, "d": 0, "k": 86, "cpo": 15695, "gap": -336, "gapp": -9.7, "fair": 5172, "wgap": -32.7, "r4": 3481, "proj": 3585, "hist5": [3328, 3481, 3481, 3481, 3481], "sw5": [3000, 3100, 3125, 3125, 3145]}, {"name": "Gorontalo", "isl": "Sulawesi", "pl": 3202, "sw": 2000, "d": 30, "k": 83, "cpo": 15102, "gap": -1202, "gapp": -37.5, "fair": 4992, "wgap": -35.9, "r4": 3180, "proj": 3298, "hist5": [3089, 3172, 3172, 3172, 3202], "sw5": [2550, 2800, 2000, 2800, 2000]}, {"name": "Sulawesi Selatan", "isl": "Sulawesi", "pl": 2974, "sw": 2750, "d": 0, "k": 87, "cpo": 14234, "gap": -224, "gapp": -7.5, "fair": 5233, "wgap": -43.2, "r4": 2974, "proj": 3063, "hist5": [2974, 2974, 2974, 2974, 2974], "sw5": [2880, 2880, 2925, 2725, 2750]}, {"name": "Banten", "isl": "Jawa", "pl": 2775, "sw": 2775, "d": 0, "k": null, "cpo": null, "gap": 0, "gapp": 0.0, "fair": null, "wgap": null, "r4": 2763, "proj": 2858, "hist5": [2751, 2751, 2751, 2775, 2775], "sw5": [2534, 2751, 2751, 2751, 2775]}];

export const FC = {
  hist: {
    labels: ["Jan-I", "Jan-II", "Jan-III", "Jan-IV", "Feb-I", "Feb-II", "Feb-III", "Feb-IV", "Mar-I", "Mar-II", "Mar-III", "Mar-IV", "Apr-I", "Apr-II", "Apr-III", "Apr-IV", "Mei-I", "Mei-II", "Mei-III", "Mei-IV", "Jun-I", "Jun-II", "Jun-III", "Jun-IV", "Jul-I", "Jul-II", "Jul-III", "Jul-IV", "Agu-II", "Agu-III"],
    tbs: [3278.3, 3261.7, 3283.3, 3314.3, 3434.0, 3441.6, 3384.9, 3325.9, 3375.9, 3450.9, 3619.3, 3765.5, 3726.3, 3827.5, 3762.0, 3645.6, 3683.9, 3706.0, 3636.0, 3370.6, 3182.7, 3446.7, 3479.2, 3519.2, 3469.0, 3599.3, 3600.2, 3671.5, 3556.0, 3541.0],
    cpo: [14001.5, 13896.4, 14028.2, 14129.5, 14598.1, 14454.3, 14041.3, 13721.4, 13909.0, 14288.0, 15000.9, 15582.7, 15348.1, 15709.3, 15358.2, 14829.6, 15078.0, 15099.9, 14888.8, 13733.2, 12942.8, 14418.9, 14787.5, 14953.4, 14726.8, 15191.9, 15207.8, 15318.4, 15359.0, 15166.0],
    k: [91.68, 91.61, 91.61, 91.61, 91.61, 92.01, 92.01, 92.01, 92.01, 91.69, 91.69, 91.69, 91.69, 91.72, 91.72, 91.72, 91.72, 92.4, 92.4, 92.4, 92.4, 91.81, 91.81, 91.81, 91.81, 91.28, 91.28, 91.28, 91.28, 90.0],
  },
  fc: {
    labels: ["Agu-IV", "Sep-I", "Sep-II", "Sep-III", "Sep-IV", "Okt-I"],
    tbs: [3582, 3612, 3632, 3647, 3658, 3671],
    tbs_band: [160, 226, 277, 320, 358, 392],
    cpo: [16050, 16180, 16290, 16380, 16450, 16540],
    cpo_band: [768, 1084, 1329, 1536, 1718, 1881],
    pko: [15420, 15550, 15660, 15750, 15820, 15900],
    pko_band: [784, 1107, 1357, 1568, 1754, 1920],
  },
  growth: [1.01158, 1.02005, 1.0257, 1.02994, 1.03304, 1.03671],
  nat_now: 3541,
  hidx: 3,
  backtest: {
    k: 8,
    mae: 68,
    mape: 1.9,
    base_mape: 2.7,
    rows: [
      { lbl: "Jun-II", pred: 3140, act: 3447, err: -307 },
      { lbl: "Jun-III", pred: 3474, act: 3479, err: -5 },
      { lbl: "Jun-IV", pred: 3544, act: 3519, err: 25 },
      { lbl: "Jul-I", pred: 3583, act: 3469, err: 114 },
      { lbl: "Jul-II", pred: 3527, act: 3599, err: -73 },
      { lbl: "Jul-III", pred: 3645, act: 3600, err: 45 },
      { lbl: "Agu-II", pred: 3568, act: 3556, err: 12 },
      { lbl: "Agu-III", pred: 3574, act: 3541, err: 33 },
    ],
  },
  commodity: {
    cpo: { now: 15888, proj: 16380, band: 1536, mape: 2.2, base_mape: 2.9 },
    pko: { now: 15280, proj: 15750, band: 1568, mape: 3.3, base_mape: 4.6 },
    pke: null as null,
  },
  method: "Ensemble: CPO-linked catch-up + overlay B50, ENSO, musim, FX",
  through: "Agu-III (17–23 Agu 2026)",
};

export const KPBN_SPARK = [15700, 15700, 15835, 15755, 15925, 15888];

export const LATEST = [
  { name: "Riau · plasma", period: "19–25 Agu 2026", pl: 3884, prev: 3941, note: "Umur 9 th · Disbun Riau · turun Rp57 (−1,5%). CPO KPBN ~Rp15.888." },
  { name: "Sumatera Utara · plasma", period: "19–25 Agu 2026", pl: 3917, prev: 3902, note: "Umur 10–20 th · naik Rp15. Ranking 17–23: #2 nasional." },
  { name: "Sumatera Barat · plasma", period: "15–21 Agu 2026", pl: 3942, prev: 4055, note: "Periode III · turun Rp113. Tetap tertinggi nasional. K 94%." },
  { name: "Sumatera Selatan · plasma", period: "Periode II Agu 2026", pl: 3853, prev: 3910, note: "Umur 10–20 th · K 93,38% · CPO mill Rp15.349." },
  { name: "Jambi · plasma", period: "17–23 Agu 2026", pl: 3866, prev: 3879, note: "Turun tipis Rp13 setelah 14–20 Agu di Rp3.879." },
  { name: "Kalimantan Tengah · plasma", period: "Periode I Agu 2026", pl: 3761, prev: 3791, note: "Tertinggi umur 9–20 · CPO mill Rp15.436." },
];

export const DRIVERS = [
  {
    id: "b50",
    title: "B50 biodiesel Indonesia",
    tone: "up" as const,
    effect: "+0,3–0,4% / pekan",
    body: "Mandat B50 menaikkan serapan CPO dalam negeri. Transisi menuju implementasi penuh Oktober 2026 mendorong restocking pabrik biodiesel dan memangkas ketersediaan ekspor.",
  },
  {
    id: "enso",
    title: "Onset El Niño",
    tone: "up" as const,
    effect: "+0,1–0,2% / pekan",
    body: "El Niño menekan rendemen 3–6 bulan ke depan di Indonesia–Malaysia. Dampak fisik masih tertahan, tetapi premi risiko sudah masuk harga BMD. Sentimen bullish, physical tightness lebih ke Q4–Q1.",
  },
  {
    id: "bmd",
    title: "BMD 20-bulan high",
    tone: "up" as const,
    effect: "catch-up TBS +1,1% pekan-1",
    body: "Kontrak November BMD Rp5.018/ton (21 Agu) — tertinggi sejak Des 2024, +8,6% sebulan. KPBN Dumai Rp15.888 (WD). Penetapan Disbun 17–23 masih lag; 1–2 periode ke depan TBS biasanya menyusul.",
  },
  {
    id: "season",
    title: "Puncak produksi Sep–Okt",
    tone: "down" as const,
    effect: "−0,2% / pekan",
    body: "Musim panen puncak Indonesia menambah pasokan TBS. Ini menahan laju kenaikan harga petani meski CPO dunia keras. FX: rupiah menguat ke Rp17.690/US$ — sedikit menekan konversi Rp.",
  },
];
