import { IMAGE_TYPES } from "@/configs/appConfig";

const mimeMap = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  heic: "image/heic",
  tiff: "image/tiff",
};

const imageMime = IMAGE_TYPES.map((ext) => mimeMap[ext] || `image/${ext}`);

const MIME_PRESETS = {
  image: imageMime,
  pdf: ["application/pdf"],
  word: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  excel: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  imageAndPdf: [...imageMime, "application/pdf"],
  allSafe: [
    ...imageMime,
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
  ],
};

const FORBIDDEN_MIME_TYPES = [
  "application/x-php",
  "text/html",
  "application/javascript",
  "text/javascript",
  "application/x-sh",
  "application/x-bash",
  "application/x-msdownload",
];

export { MIME_PRESETS, FORBIDDEN_MIME_TYPES };
