import path from "path";
import fs from "fs/promises"; // ganti semua fs.* dengan fs.promises
import { existsSync, mkdirSync } from "fs"; // hanya sync yang dipakai dari fs
import validateFileSize from "@/utils/validateFileSize";
import validateFileType from "@/utils/validateFileType";
// import sharp from "sharp";

/**
 * Service untuk upload file satu atau banyak sekaligus.
 *
 * @param {File|File[]} files - File atau array of File dari FormData
 * @param {Object} options
 * @param {string[]} options.allowedTypes - Daftar MIME type yang diizinkan
 * @param {number} options.maxSize - Ukuran maksimum per file (dalam bytes)
 * @param {string} options.folder - Sub-folder di dalam "src/uploads/"
 *
 * @returns {Object} - { success: boolean, files: [{ filename, path, size, type }] | message: string }
 */
export default async function uploadServices(files, options) {
  const { allowedTypes, maxSize, folder } = options;

  const uploadDir = path.join(process.cwd(), "src", "uploads", folder);
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const fileArray = Array.isArray(files) ? files : [files];
  const savedFiles = [];

  for (const file of fileArray) {
    // Validasi ukuran
    const sizeError = validateFileSize(file, maxSize);
    if (sizeError) {
      // Rollback
      for (const saved of savedFiles) {
        try {
          await fs.unlink(saved.path);
        } catch (_) {}
      }
      return { success: false, message: sizeError };
    }

    // Validasi tipe
    const typeError = validateFileType(file, allowedTypes);
    if (typeError) {
      for (const saved of savedFiles) {
        try {
          await fs.unlink(saved.path);
        } catch (_) {}
      }
      return { success: false, message: typeError };
    }

    // Simpan file
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let mimetype = file.mimetype?.toLowerCase() || "";
    if (!mimetype) {
      mimetype = getMimeFromBuffer(buffer);
    }
    const isImage = mimetype.startsWith("image/");
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // // Kompres jika image dan format didukung
    // if (isImage) {
    //   try {
    //     const sharpInstance = sharp(buffer).resize({
    //       width: 1200,
    //       withoutEnlargement: true,
    //       fit: sharp.fit.inside,
    //     });

    //     if (mimetype === "image/jpeg" || mimetype === "image/jpg") {
    //       buffer = await sharpInstance.jpeg({ quality: 75 }).toBuffer();
    //     } else if (mimetype === "image/png") {
    //       buffer = await sharpInstance.png({ compressionLevel: 8 }).toBuffer();
    //     } else if (mimetype === "image/webp") {
    //       buffer = await sharpInstance.webp({ quality: 75 }).toBuffer();
    //     } else if (mimetype === "image/avif") {
    //       buffer = await sharpInstance.avif({ quality: 50 }).toBuffer();
    //     } else if (mimetype === "image/heif") {
    //       buffer = await sharpInstance.heif({ quality: 50 }).toBuffer();
    //     } else {
    //       // Jika format tidak bisa dikompres, lewatkan kompresi
    //       console.warn("Format image tidak dikenali untuk kompresi:", mimetype);
    //     }
    //   } catch (err) {
    //     console.error("Gagal kompresi image:", err);
    //     return { success: false, message: "Gagal memproses gambar." };
    //   }
    // }

    await fs.writeFile(filepath, buffer);

    savedFiles.push({
      folder,
      filename,
      path: path.join("uploads", folder, filename),
      size: file.size,
      type: mimetype,
    });
  }

  return { success: true, files: savedFiles };
}

export async function hapusFileYangSudahTerupload(fileGroups) {
  for (const group of fileGroups) {
    if (group?.files && Array.isArray(group.files)) {
      for (const file of group.files) {
        const fullPath = path.join(process.cwd(), "src", file.path);
        try {
          await fs.unlink(fullPath);
          console.log("✅ Berhasil hapus:", fullPath);

          // Coba hapus folder jika kosong
          const folderPath = path.dirname(fullPath);
          await hapusFolderJikaKosong(folderPath);
        } catch (err) {
          console.error("❌ Gagal menghapus:", fullPath, err);
        }
      }
    }
  }
}

export async function hapusFile(filename, folder) {
  try {
    if (!filename?.trim() || !folder?.trim()) return;

    const filePath = path.join(
      process.cwd(),
      "src",
      "uploads",
      folder,
      filename
    );

    await fs.access(filePath);
    await fs.unlink(filePath);

    const folderPath = path.dirname(filePath);
    await hapusFolderJikaKosong(folderPath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Gagal menghapus file ${filename}:`, err);
    } else {
      console.warn(`File tidak ditemukan, jadi tidak dihapus: ${filename}`);
    }
  }
}

const IGNORED_FILES = [".DS_Store", "desktop.ini", "Thumbs.db"];
async function hapusFolderJikaKosong(folderPath) {
  try {
    const files = await fs.readdir(folderPath);

    const visibleFiles = files.filter((file) => !IGNORED_FILES.includes(file));

    if (visibleFiles.length === 0) {
      await fs.rm(folderPath, { recursive: true, force: true });
      console.log("🧹 Folder kosong dihapus:", folderPath);
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Gagal menghapus folder kosong:", err);
    }
  }
}

/**
 * Deteksi mimetype dari buffer file berdasarkan signature awal (magic numbers).
 * Referensi: https://en.wikipedia.org/wiki/List_of_file_signatures
 *
 * @param {Buffer} buffer
 * @returns {string} mimetype, contoh: "image/jpeg", "image/png"
 */
function getMimeFromBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return "";

  const hex = buffer.toString("hex", 0, 12).toLowerCase();

  if (hex.startsWith("ffd8ff")) return "image/jpeg";
  if (hex.startsWith("89504e47")) return "image/png";
  if (hex.startsWith("47494638")) return "image/gif";
  if (hex.startsWith("52494646") && hex.includes("57454250"))
    return "image/webp"; // WEBP
  if (hex.startsWith("000000")) {
    if (hex.includes("66747970")) {
      if (hex.includes("68656963")) return "image/heic"; // HEIC variant
      if (hex.includes("avif")) return "image/avif";
    }
  }
  if (hex.startsWith("49492a00") || hex.startsWith("4d4d002a"))
    return "image/tiff";
  if (hex.startsWith("424d")) return "image/bmp";

  return "";
}
