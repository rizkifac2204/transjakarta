import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";
import { isValidFile } from "@/utils/existAndValidFile";
import validateEmail from "@/utils/validateEmail";
import {
  getKeberatanDynamic,
  getKeberatanDetailByNoRegis,
  createKeberatan,
} from "@/libs/keberatan";
import { getPemohonDetailByEmail, createPemohon } from "@/libs/pemohon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getKeberatanDynamic();
    return Response.json(data);
  } catch (error) {
    getLogs("keberatan").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request) {
  let uploadedFiles = [];
  try {
    await getSession();

    const formData = await request.formData();
    const parsed = parseFormData(formData, {
      dateFields: ["tanggal"],
      integerFields: ["admin_id"],
    });
    const {
      admin_id,
      no_regis,
      tanggal,
      email,
      nama,
      kategori,
      nomor_identitas,
      identitas,
      telp,
      alamat,
      alasan,
      tujuan,
      file_pendukung,
    } = parsed;
    let pemohonId = null;

    if (
      !no_regis ||
      !admin_id ||
      !tanggal ||
      !nama ||
      !kategori ||
      !nomor_identitas ||
      !alasan ||
      !tujuan
    ) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const isRegisExist = await getKeberatanDetailByNoRegis(no_regis);
    if (isRegisExist) {
      return Response.json(
        {
          message: "Nomor Registrasi Sudah Digunakan. Mohon Ganti",
          error: "RegisExist",
        },
        { status: 400 }
      );
    }

    let resultIdentitas = { files: [] };
    let resultPendukung = { files: [] };
    const isPendukungUploadExist = isValidFile(file_pendukung);

    // Upload identitas hanya jika email ada dan valid file identitas juga ada
    if (email) {
      if (!validateEmail(email)) {
        return Response.json(
          { message: "Format email tidak valid", error: "InvalidEmail" },
          { status: 400 }
        );
      }

      // Cek dan buat pemohon jika belum ada
      let pemohon = await getPemohonDetailByEmail(String(email));
      if (!pemohon) {
        const isIdentitasUploadExist = isValidFile(identitas);
        if (isIdentitasUploadExist) {
          resultIdentitas = await uploadServices(identitas, {
            allowedTypes: [...MIME_PRESETS.image],
            maxSize: MAX_FOTO_SIZE,
            folder: PATH_UPLOAD.identitas,
          });

          if (!resultIdentitas.success) {
            return Response.json(
              { message: resultIdentitas.message, error: "UploadError" },
              { status: 400 }
            );
          }
        }

        pemohon = await createPemohon({
          email,
          nama,
          nomor_identitas,
          telp,
          alamat,
          identitas: isIdentitasUploadExist
            ? resultIdentitas.files[0].filename
            : null,
        });
      }

      pemohonId = pemohon.id;
    } else {
      // Kalau email tidak ada, identitas tidak diupload
      // Supaya aman, pastikan resultIdentitas tetap objek kosong
      resultIdentitas = { files: [] };
    }

    // Upload file pendukung tetap diproses terpisah
    if (isPendukungUploadExist) {
      resultPendukung = await uploadServices(file_pendukung, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.keberatan,
      });

      if (!resultPendukung.success) {
        return Response.json(
          { message: resultPendukung.message, error: "UploadError" },
          { status: 400 }
        );
      }
    }

    uploadedFiles = [resultIdentitas, resultPendukung];

    const inserted = await createKeberatan({
      no_regis,
      admin_id,
      pemohon_id: pemohonId,
      email,
      tanggal,
      nama,
      kategori,
      nomor_identitas,
      telp,
      alamat,
      alasan,
      tujuan,
      file_pendukung: isPendukungUploadExist
        ? resultPendukung.files[0].filename
        : null,
    });

    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
    getLogs("keberatan").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
