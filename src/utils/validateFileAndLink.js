export default function validateFileAndLink({
  status_file,
  link,
  file,
  curFile,
}) {
  const adaLink = typeof link === "string" && link.trim() !== "";
  const adaFileLama = !!curFile;
  const adaFileBaru =
    file instanceof File && file.size > 0 && typeof file.name === "string";

  if (!adaLink) {
    if (status_file === "delete") {
      return {
        valid: false,
        message: "Harus input minimal satu sumber file, Link atau Upload",
      };
    }

    if (status_file === "keep") {
      if (!adaFileLama) {
        return {
          valid: false,
          message:
            "File lama tidak tersedia, dan Anda tidak mengisi link atau mengunggah file baru.",
        };
      }
    }

    if (status_file === "change") {
      if (!adaFileBaru) {
        return {
          valid: false,
          message:
            "Anda memilih ganti file, tapi tidak mengunggah file baru dan tidak ada link.",
        };
      }
    }
  }

  return { valid: true };
}
