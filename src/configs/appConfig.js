const appConfig = {
  app: {
    name: "Transajakarta",
    description: "-",
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
  user: "user",
  armada: "armada-survey",
  shelter: "shelter-survey",
};
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB = 26_214_400 byte
export const MAX_FOTO_SIZE = 10 * 1024 * 1024; // 10 MB = 10_485_760 byte

export default appConfig;
