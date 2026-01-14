import { FORBIDDEN_MIME_TYPES } from "./mimePresets";

export default function validateFileType(file, allowedTypes) {
  const type = file.type;

  if (FORBIDDEN_MIME_TYPES.includes(type)) {
    return "Format file ini tidak diizinkan";
  }

  if (!allowedTypes.includes(type)) {
    return "Format file tidak sesuai";
  }

  return null;
}
