import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import { isValidFile } from "@/utils/existAndValidFile";
import uploadServices, {
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";
import validateEmail from "@/utils/validateEmail";
import {
  getPermohonanDynamic,
  getPermohonanDetailByNoRegis,
  createPermohonan,
} from "@/libs/permohonan";
import { getPemohonDetailByEmail, createPemohon } from "@/libs/pemohon";
import { generateTicket } from "@/utils/generateTicket";
import { createJawaban } from "@/libs/jawaban";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getPermohonanDynamic();
    return Response.json(data);
  } catch (error) {
    getLogs("permohonan").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

async function prosesJawaban({ createdPermohonanId, formData, status }) {
  let uploaded = {
    pemberitahuan: { files: [] },
    informasi: { files: [] },
  };

  const parsed = parseFormData(formData, {
    dateFields: ["tanggal_jawaban"],
    integerFields: ["biaya", "jangka_waktu", "admin_id"],
    booleanFields: ["mailed", "whatsapped"],
  });
  let {
    admin_id,
    jenis,
    tanggal_jawaban,
    bentuk_fisik,
    biaya,
    jangka_waktu,
    penguasaan,
    penghitaman,
    pengecualian,
    pasal,
    konsekuensi,
    file_surat_pemberitahuan,
    file_informasi,
    pesan,
    mailed,
    whatsapped,
  } = parsed;

  if (!["Diberikan", "Diberikan Sebagian"].includes(status)) {
    bentuk_fisik = null;
    biaya = null;
    jangka_waktu = null;
    file_informasi = null;
  }
  if (!["Diberikan Sebagian"].includes(status)) {
    penghitaman = null;
  }
  if (!["Diberikan Sebagian", "Tidak Dapat Diberikan"].includes(status)) {
    penguasaan = null;
    pengecualian = null;
  }
  if (!["Tidak Dapat Diberikan"].includes(status)) {
    pasal = null;
    konsekuensi = null;
  }
  if (!["Respon Final"].includes(jenis)) {
    jangka_waktu = null;
  }

  try {
    const isPemberitahuanUploadExist = isValidFile(file_surat_pemberitahuan);
    const isInformasiUploadExist = isValidFile(file_informasi);

    if (isPemberitahuanUploadExist) {
      uploaded.pemberitahuan = await uploadServices(file_surat_pemberitahuan, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.jawaban.pemberitahuan,
      });
    }

    if (isInformasiUploadExist) {
      uploaded.informasi = await uploadServices(file_informasi, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.jawaban.informasi,
      });
    }

    await createJawaban({
      permohonan_id: createdPermohonanId,
      admin_id,
      jenis,
      tanggal: tanggal_jawaban,
      pesan,
      penguasaan,
      bentuk_fisik,
      biaya,
      penghitaman,
      jangka_waktu,
      pengecualian,
      pasal,
      konsekuensi,
      file_surat_pemberitahuan:
        uploaded.pemberitahuan.success && uploaded.pemberitahuan.files.length
          ? uploaded.pemberitahuan.files[0].filename
          : null,
      file_informasi:
        uploaded.informasi.success && uploaded.informasi.files.length
          ? uploaded.informasi.files[0].filename
          : null,
      mailed,
      whatsapped,
    });

    return { success: true, uploaded };
  } catch (error) {
    getLogs("permohonan").error(error);
    await hapusFileYangSudahTerupload([
      uploaded.pemberitahuan,
      uploaded.informasi,
    ]);
    return { success: false, error: error, uploaded };
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
      no_regis,
      admin_id,
      tanggal,
      tipe,
      email,
      rincian,
      tujuan,
      cara_dapat,
      identitas,
      file_pendukung,
      status,
      jenis,
    } = parsed;
    let { cara_terima } = parsed;
    const tiket = generateTicket(6);

    if (
      !no_regis ||
      !admin_id ||
      !tanggal ||
      !rincian ||
      !tujuan ||
      !cara_dapat ||
      !status
    ) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const isRegisExist = await getPermohonanDetailByNoRegis(no_regis);
    if (isRegisExist) {
      return Response.json(
        {
          message: "Nomor Registrasi Sudah Digunakan. Mohon Ganti",
          error: "RegisExist",
        },
        { status: 400 }
      );
    }

    // dinamis input
    if (cara_dapat !== "Mendapatkan Salinan Informasi (Soft/Hard Copy)") {
      cara_terima = null;
    }

    if (
      ![
        "Proses",
        "Diberikan",
        "Diberikan Sebagian",
        "Tidak Dapat Diberikan",
      ].includes(status)
    ) {
      return Response.json(
        { message: "Status tidak dikenal", error: "InvalidStatus" },
        { status: 400 }
      );
    }

    let resultIdentitas = { files: [] };
    let resultPendukung = { files: [] };
    let pemohonId = null;
    const isPendukungUploadExist = isValidFile(file_pendukung);

    // Upload identitas hanya jika email_pemohon ada dan valid file identitas juga ada
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
          nama: "Noname",
          identitas: isIdentitasUploadExist
            ? resultIdentitas.files[0].filename
            : null,
        });
      }

      // get pemohonId dari pemohon yang sudah ada atau baru dibuat
      pemohonId = pemohon.id;
    } else {
      // Kalau email_pemohon tidak ada, identitas tidak diupload, Supaya aman, pastikan resultIdentitas tetap objek kosong
      resultIdentitas = { files: [] };
    }

    // Upload file pendukung tetap diproses terpisah
    if (isPendukungUploadExist) {
      resultPendukung = await uploadServices(file_pendukung, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.permohonan,
      });

      if (!resultPendukung.success) {
        return Response.json(
          { message: resultPendukung.message, error: "UploadError" },
          { status: 400 }
        );
      }
    }

    uploadedFiles = [resultIdentitas, resultPendukung];

    // Buat permohonan dengan data hasil upload dan input lain
    const createdPermohonan = await createPermohonan({
      no_regis,
      admin_id,
      tipe,
      pemohon_id: pemohonId,
      email,
      tanggal,
      platform: "Website",
      rincian,
      tujuan,
      cara_dapat,
      cara_terima,
      tiket: tiket,
      file_pendukung: isPendukungUploadExist
        ? resultPendukung.files[0].filename
        : null,
      status,
    });

    // PROSES JAWABAN
    if (jenis) {
      const resultJawaban = await prosesJawaban({
        createdPermohonanId: createdPermohonan.id,
        formData,
        status,
      });

      if (!resultJawaban.success) {
        return Response.json({
          message: "Berhasil Menambah Data, Tapi Jawaban Tidak Tersimpan",
          data: createdPermohonan,
        });
      }

      uploadedFiles.push(
        resultJawaban.uploaded.pemberitahuan,
        resultJawaban.uploaded.informasi
      );
    }

    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: createdPermohonan,
      },
      { status: 201 }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
    getLogs("permohonan").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
