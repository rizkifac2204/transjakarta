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
import { generateTicket } from "@/utils/generateTicket";
import {
  getPenelitianDynamic,
  getPenelitianDetailByNoRegis,
  createPenelitian,
} from "@/libs/penelitian";
import { getPemohonDetailByEmail, createPemohon } from "@/libs/pemohon";
import { createJawabanPenelitian } from "@/libs/jawaban-penelitian";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getPenelitianDynamic();
    return Response.json(data);
  } catch (error) {
    getLogs("penelitian").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

async function prosesJawaban({ createdPenelitianId, formData }) {
  let uploaded = {
    pemberitahuan: { files: [] },
    informasi: { files: [] },
  };

  const parsed = parseFormData(formData, {
    dateFields: ["tanggal_jawaban"],
    integerFields: ["admin_id"],
    booleanFields: ["mailed", "whatsapped"],
  });
  let {
    admin_id,
    jenis,
    tanggal_jawaban,
    pesan,
    file_surat_pemberitahuan,
    file_informasi,
    mailed,
    whatsapped,
  } = parsed;

  try {
    const isPemberitahuanUploadExist = isValidFile(file_surat_pemberitahuan);
    const isInformasiUploadExist = isValidFile(file_informasi);

    if (isPemberitahuanUploadExist) {
      uploaded.pemberitahuan = await uploadServices(file_surat_pemberitahuan, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.jawabanpenelitian.pemberitahuan,
      });
    }

    if (isInformasiUploadExist) {
      uploaded.informasi = await uploadServices(file_informasi, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.jawabanpenelitian.informasi,
      });
    }

    await createJawabanPenelitian({
      penelitian_id: createdPenelitianId,
      admin_id,
      jenis,
      tanggal: tanggal_jawaban,
      pesan,
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
    getLogs("penelitian").error(error);
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
      judul,
      tujuan,
      nomor_identitas,
      nama,
      nim,
      universitas,
      jurusan,
      identitas,
      file_permohonan,
      file_proposal,
      file_pertanyaan,
      status,
      jenis,
    } = parsed;
    const tiket = generateTicket(6);
    const isPermohonanUploadExist = isValidFile(file_permohonan);
    const isProposalUploadExist = isValidFile(file_proposal);
    const isPertanyaanUploadExist = isValidFile(file_pertanyaan);

    if (!no_regis || !admin_id || !tanggal || !judul || !tujuan || !status) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }
    if (
      !isPermohonanUploadExist ||
      !isProposalUploadExist ||
      !isPertanyaanUploadExist
    ) {
      return Response.json(
        { message: "Harus Upload Semua File", error: "Required" },
        { status: 400 }
      );
    }

    const isRegisExist = await getPenelitianDetailByNoRegis(no_regis);
    if (isRegisExist) {
      return Response.json(
        {
          message: "Nomor Registrasi Sudah Digunakan. Mohon Ganti",
          error: "RegisExist",
        },
        { status: 400 }
      );
    }

    if (!["Proses", "Disetujui", "Ditolak", "Hold"].includes(status)) {
      return Response.json(
        { message: "Status tidak dikenal", error: "InvalidStatus" },
        { status: 400 }
      );
    }

    let resultIdentitas = { files: [] };
    let resultPermohonan = { files: [] };
    let resultProposal = { files: [] };
    let resultPertanyaan = { files: [] };
    let pemohonId = null;

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
          nomor_identitas,
          nim,
          universitas,
          jurusan,
          nama: nama || "Noname",
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

    // Upload file permohonan
    if (isPermohonanUploadExist) {
      resultPermohonan = await uploadServices(file_permohonan, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.penelitian.permohonan,
      });

      if (!resultPermohonan.success) {
        return Response.json(
          { message: resultPermohonan.message, error: "UploadError" },
          { status: 400 }
        );
      }

      uploadedFiles.push(resultPermohonan);
    }

    // Upload file proposal
    if (isProposalUploadExist) {
      resultProposal = await uploadServices(file_proposal, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.penelitian.proposal,
      });

      if (!resultProposal.success) {
        return Response.json(
          { message: resultProposal.message, error: "UploadError" },
          { status: 400 }
        );
      }

      uploadedFiles.push(resultProposal);
    }

    // Upload file pertanyaan
    if (isPertanyaanUploadExist) {
      resultPertanyaan = await uploadServices(file_pertanyaan, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.penelitian.pertanyaan,
      });

      if (!resultPertanyaan.success) {
        return Response.json(
          { message: resultPertanyaan.message, error: "UploadError" },
          { status: 400 }
        );
      }

      uploadedFiles.push(resultPertanyaan);
    }

    // Buat dengan data hasil upload dan input lain
    const createdPenelitian = await createPenelitian({
      admin_id,
      pemohon_id: pemohonId,
      no_regis,
      tiket: tiket,
      email,
      tipe,
      tanggal,
      platform: "Website",
      judul,
      tujuan,
      file_permohonan: isPermohonanUploadExist
        ? resultPermohonan.files[0].filename
        : null,
      file_proposal: isProposalUploadExist
        ? resultProposal.files[0].filename
        : null,
      file_pertanyaan: isPertanyaanUploadExist
        ? resultPertanyaan.files[0].filename
        : null,
      status,
    });

    // PROSES JAWABAN
    if (jenis) {
      const resultJawaban = await prosesJawaban({
        createdPenelitianId: createdPenelitian.id,
        formData,
      });

      if (!resultJawaban.success) {
        return Response.json({
          message: "Berhasil Menambah Data, Tapi Jawaban Tidak Tersimpan",
          data: createdPenelitian,
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
        data: createdPenelitian,
      },
      { status: 201 }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
    getLogs("penelitian").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
