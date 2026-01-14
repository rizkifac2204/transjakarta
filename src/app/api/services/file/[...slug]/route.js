import { join } from "path";
import { existsSync, readFileSync, statSync } from "fs";

export async function GET(_request, { params }) {
  try {
    const slug = params.slug;
    if (!slug || !Array.isArray(slug)) {
      return new Response("Path tidak valid", { status: 400 });
    }

    const filePath = join(process.cwd(), "src", ...slug);

    if (!existsSync(filePath)) {
      return new Response("File tidak ditemukan", { status: 404 });
    }

    const fileBuffer = readFileSync(filePath);
    const stat = statSync(filePath);
    const ext = filePath.split(".").pop().toLowerCase();

    // Atur content-type sederhana (boleh kamu buat helper lebih lengkap kalau mau)
    const contentTypeMap = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      pdf: "application/pdf",
    };

    const contentType = contentTypeMap[ext] || "application/octet-stream";

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Terjadi kesalahan", { status: 500 });
  }
}
