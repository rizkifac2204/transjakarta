export const SEPUTAR_PPID = [
  {
    link: "/seputar-ppid/profile-singkat",
    icon: "solar:projector-broken",
    label: "Profil Singkat PPID",
  },
  {
    link: "/seputar-ppid/visi-misi",
    icon: "solar:colour-tuneing-broken",
    label: "Visi Misi PPID",
  },
  {
    link: "/seputar-ppid/struktur",
    icon: "solar:usb-circle-broken",
    label: "Struktur PPID",
  },
  {
    link: "/seputar-ppid/tugas-fungsi-wewenang",
    icon: "solar:translation-broken",
    label: "Tugas, Fungsi, dan Wewenang PPID",
  },
  {
    link: "/seputar-ppid/lokasi-kontak",
    icon: "solar:point-on-map-broken",
    label: "Lokasi dan Kontak PPID",
    static: true,
  },
];
export const LINK_SEPUTAR_PPID = SEPUTAR_PPID.map((item) => item.link);

export const INFORMASI_PUBLIK = [
  {
    kategori: "berkala",
    link: "/informasi-publik/berkala",
    icon: "solar:file-smile-broken",
    label: "Informasi Berkala",
  },
  {
    kategori: "serta-merta",
    link: "/informasi-publik/serta-merta",
    icon: "solar:file-smile-bold-duotone",
    label: "Informasi Serta Merta",
  },
  {
    kategori: "tersedia-setiap-saat",
    link: "/informasi-publik/tersedia-setiap-saat",
    icon: "solar:file-smile-bold",
    label: "Informasi Tersedia Setiap Saat",
  },
  {
    link: "https://www.bp2mi.go.id/dip-online",
    icon: "solar:palette-round-bold",
    label: "Daftar Informasi Publik",
    newtab: true,
  },
];
export const LINK_INFORMASI_PUBLIK = INFORMASI_PUBLIK.map((item) => item.link);

export const LAPORAN = [
  {
    kategori: "akses-informasi-publik",
    link: "/laporan/akses-informasi-publik",
    icon: "solar:accessibility-broken",
    label: "Akses Informasi Publik",
  },
  {
    kategori: "layanan-informasi-publik",
    link: "/laporan/layanan-informasi-publik",
    icon: "solar:server-path-broken",
    label: "Layanan Informasi Publik",
  },
  {
    kategori: "survei-informasi-publik",
    link: "/laporan/survei-informasi-publik",
    icon: "solar:headphones-round-sound-broken",
    label: "Survei Informasi Publik",
  },
];
export const LINK_LAPORAN = LAPORAN.map((item) => item.link);

export const MEDIA_LAYANAN = [
  {
    link: "/media-layanan/maklumat-pelayanan-publik",
    icon: "solar:cursor-broken",
    label: "Maklumat Pelayanan Publik",
  },
  {
    link: "/media-layanan/alur-permohonan-informasi",
    icon: "solar:link-round-angle-outline",
    label: "Alur Permohonan Informasi",
  },
  {
    link: "/media-layanan/prosedur-pengajuan-keberatan",
    icon: "solar:map-arrow-right-bold-duotone",
    label: "Prosedur Pengajuan Keberatan",
  },
  {
    link: "/media-layanan/prosedur-sengketa-informasi",
    icon: "solar:map-arrow-right-broken",
    label: "Prosedur Sengketa Informasi",
  },
  {
    link: "/media-layanan/jalur-layanan",
    icon: "solar:quit-full-screen-broken",
    label: "Jalur Layanan",
  },
  {
    link: "/media-layanan/waktu-layanan",
    icon: "solar:sort-by-time-linear",
    label: "Waktu Layanan",
  },
  {
    link: "/media-layanan/biaya-layanan",
    icon: "solar:wad-of-money-broken",
    label: "Biaya Layanan",
  },
  {
    link: "/media-layanan/call-center",
    icon: "solar:call-chat-broken",
    label: "Call Center KP2MI",
  },
];
export const LINK_MEDIA_LAYANAN = MEDIA_LAYANAN.map((item) => item.link);

export const LINK_FORM = [
  {
    link: "/form/permohonan",
    icon: "solar:document-text-broken",
    label: "Permohonan Informasi",
  },
  {
    link: "/form/keberatan",
    icon: "solar:document-text-broken",
    label: "Pengajuan Keberatan",
  },
  {
    link: "/form/penelitian",
    icon: "solar:document-text-broken",
    label: "Permohonan Penelitian",
  },
];

export const LINK_DASHBOARD = [
  {
    link: "/dashboard",
    label: "Dashboard",
    icon: "solar:sofa-2-broken",
  },
  {
    link: "/dashboard/profile",
    label: "Profile",
    icon: "solar:user-circle-broken",
  },
  {
    link: "/dashboard/permohonan",
    label: "Permohonan Informasi",
    icon: "material-symbols-light:history-rounded",
  },
  {
    link: "/dashboard/keberatan",
    label: "Riwayat Keberatan",
    icon: "material-symbols-light:history-rounded",
  },
  {
    link: "/dashboard/penelitian",
    label: "Permohonan Penelitian",
    icon: "material-symbols-light:history-rounded",
  },
  {
    link: "/dashboard/testimoni",
    label: "Testimoni",
    icon: "solar:star-fall-2-broken",
  },
];

export const UKPBJ = [
  {
    link: "/ukpbj/regulasi",
    icon: "solar:book-bookmark-broken",
    label: "Regulasi",
    static: true,
  },
  {
    link: "/ukpbj/monitoring-pbj",
    icon: "solar:screencast-2-broken",
    label: "Monitoring PBJ",
  },
  {
    link: "/ukpbj/informasi-pbj",
    icon: "solar:repeat-one-minimalistic-broken",
    label: "Informasi PBJ",
    static: true,
  },
  {
    link: "/ukpbj/penyedia",
    icon: "solar:round-transfer-diagonal-broken",
    label: "Penyedia",
  },
  {
    link: "/ukpbj/sirup-kp2mi",
    icon: "solar:routing-3-broken",
    label: "SIRUP KP2MI",
  },
  {
    link: "/ukpbj/lpse-kp2mi",
    icon: "solar:slider-minimalistic-horizontal-broken",
    label: "LPSE KP2MI",
  },
];
export const LINK_UKPBJ = UKPBJ.map((item) => item.link);
