const appConfig = {
  app: {
    name: "PPID KP2MI",
    description: "Pejabat Pengelola Informasi dan Dokumentasi",
  },
  // layout
  layout: {
    isRTL: false,
    darkMode: false,
    semiDarkMode: false,
    skin: "default",
    contentWidth: "full",
    type: "vertical",
    navBarType: "sticky",
    footerType: "static",
    isMonochrome: false,
    menu: {
      isCollapsed: false,
      isHidden: false,
    },
    mobileMenu: false,
    customizer: false,
  },
};

export const IMAGE_TYPES = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "heic",
  "tiff",
];
export const AUDIO_TYPES = ["mp3", "wav", "ogg", "aac", "flac", "m4a", "wma"];
export const PDF_TYPES = ["pdf"];
export const WORD_TYPES = ["doc", "docx"];
export const EXCEL_TYPES = ["xls", "xlsx"];
export const DOC_TYPES = [...PDF_TYPES, ...WORD_TYPES, ...EXCEL_TYPES];
export const PATH_UPLOAD = {
  admin: "admin",
  identitas: "identitas",
  pemohon: "pemohon",
  permohonan: "permohonan",
  jawaban: {
    informasi: "jawaban/informasi",
    pemberitahuan: "jawaban/pemberitahuan",
  },
  keberatan: "keberatan",
  penelitian: {
    permohonan: "penelitian/permohonan",
    proposal: "penelitian/proposal",
    pertanyaan: "penelitian/pertanyaan",
  },
  jawabanpenelitian: {
    pemberitahuan: "penelitian-jawaban/pemberitahuan",
    informasi: "penelitian-jawaban/informasi",
  },
  peraturan: "peraturan",
  dip: {
    berkala: "dip/berkala",
    "serta-merta": "dip/serta-merta",
    "tersedia-setiap-saat": "dip/tersedia-setiap-saat",
  },
  laporan: {
    "akses-informasi-publik": "laporan/akses-informasi-publik",
    "layanan-informasi-publik": "laporan/layanan-informasi-publik",
    "survei-informasi-publik": "laporan/survei-informasi-publik",
  },
  slider: "slider",
  ukpbj: {
    informasi: "ukpbj/informasi",
    regulasi: "ukpbj/regulasi",
  },
};
export const DIP_KATEGORI = Object.keys(PATH_UPLOAD.dip);
export const LAPORAN_KATEGORI = Object.keys(PATH_UPLOAD.laporan);
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB = 26_214_400 byte
export const MAX_FOTO_SIZE = 10 * 1024 * 1024; // 10 MB = 10_485_760 byte

export default appConfig;
