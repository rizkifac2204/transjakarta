import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import { isValidFile } from "@/utils/existAndValidFile";
import uploadServices, {
  hapusFile,
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";
import validateEmail from "@/utils/validateEmail";
import validatePhone from "@/utils/validatePhone";
import { createPenelitian } from "@/libs/penelitian";
import {
  getPemohonDetailByEmail,
  createPemohon,
  updatePemohon,
} from "@/libs/pemohon";
import { generateTicket } from "@/utils/generateTicket";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";
import { getInstansi } from "@/libs/instansi";
import { prepareAndSendMessage } from "@/services/whatsappServices";
import { sendEmail } from "@/services/emailServices";
import {
  MessagePermohonanBaruKepadaAdmin,
  MessagePermohonanBaruKepadaPemohon,
  EmailPermohonanBaruKepadaAdmin,
  EmailPermohonanBaruKepadaPemohon,
} from "@/utils/messages";
import verifyRecaptchaToken from "@/libs/verifyRecaptchaToken";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function POST(request) {
  let uploadedFiles = [];
  try {
    const formData = await request.formData();
    const parsed = parseFormData(formData, {
      dateFields: ["tanggal"],
    });
    const {
      email,
      telp,
      nama,
      nomor_identitas,
      alamat,
      pekerjaan,
      nim,
      universitas,
      jurusan,
      tanggal,
      tipe,
      judul,
      tujuan,
      identitas,
      file_permohonan,
      file_proposal,
      file_pertanyaan,
      status_identitas,
      token,
    } = parsed;
    const tiket = generateTicket(6);

    if (
      !email ||
      !tujuan ||
      !judul ||
      !tanggal ||
      !tipe ||
      !nomor_identitas ||
      !nama ||
      !telp ||
      !universitas
    ) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    if (!token) {
      return Response.json(
        { status: "error", message: "Recaptcha Belum Siap" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    const captcha = await verifyRecaptchaToken(token, "submit_form");
    if (!captcha.success) {
      getLogs("publik").error(captcha);
      return Response.json(
        { status: "error", message: "Gagal Verifikasi" },
        { status: 404, headers: withCorsHeaders() }
      );
    }

    if (!validateEmail(email)) {
      return Response.json(
        { message: "Format email tidak valid", error: "InvalidEmail" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    if (!validatePhone(telp)) {
      return Response.json(
        { message: "Format No. Hp tidak valid", error: "InvalidTelp" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const isIdentitasUploadExist = isValidFile(identitas);
    const isPermohonanUploadExist = isValidFile(file_permohonan);
    const isProposalUploadExist = isValidFile(file_proposal);
    const isPertanyaanUploadExist = isValidFile(file_pertanyaan);

    if (
      !isPermohonanUploadExist ||
      !isProposalUploadExist ||
      !isPertanyaanUploadExist
    ) {
      return Response.json(
        { message: "Upload Semua File Yang Diperlukan", error: "Required" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const instansi = await getInstansi();
    let resultIdentitas = { files: [] };
    let resultPermohonan = { files: [] };
    let resultProposal = { files: [] };
    let resultPertanyaan = { files: [] };
    let resultPendukung = { files: [] };
    let pemohonId = null;
    const updatePayload = {};

    // Upload file identitas
    if (!isIdentitasUploadExist) {
      return Response.json(
        { message: "Harus upload identitas", error: "Required" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    resultIdentitas = await uploadServices(identitas, {
      allowedTypes: [...MIME_PRESETS.image],
      maxSize: MAX_FOTO_SIZE,
      folder: PATH_UPLOAD.identitas,
    });
    if (!resultIdentitas.success) {
      return Response.json(
        { message: resultIdentitas.message, error: "UploadError" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    // Cek dan buat pemohon jika belum ada
    let pemohon = await getPemohonDetailByEmail(String(email));

    if (!pemohon) {
      pemohon = await createPemohon({
        email,
        telp,
        nama,
        nomor_identitas,
        alamat,
        pekerjaan,
        nim,
        universitas,
        jurusan,
        identitas: resultIdentitas.files[0].filename || null,
      });
    } else {
      await hapusFile(pemohon?.identitas, PATH_UPLOAD.identitas);
      updatePayload.identitas = resultIdentitas.files[0].filename || null;
      updatePayload.telp = telp;
      updatePayload.nama = nama;
      updatePayload.nomor_identitas = nomor_identitas;
      updatePayload.alamat = alamat;
      updatePayload.pekerjaan = pekerjaan;
      updatePayload.nim = nim;
      updatePayload.universitas = universitas;
      updatePayload.jurusan = jurusan;
      if (Object.keys(updatePayload).length > 0) {
        await updatePemohon(parseInt(pemohon.id), updatePayload);
      }
    }

    // id pemohon di dapatkan dari datalama atau data baru dibuat
    pemohonId = pemohon.id;

    // Upload file - just wrap - required
    if (isPermohonanUploadExist) {
      resultPermohonan = await uploadServices(file_permohonan, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.penelitian.permohonan,
      });

      if (!resultPermohonan.success) {
        return Response.json(
          { message: resultPermohonan.message, error: "UploadError" },
          { status: 400, headers: withCorsHeaders() }
        );
      }
      uploadedFiles.push(resultPermohonan);
    }
    if (isProposalUploadExist) {
      resultProposal = await uploadServices(file_proposal, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.penelitian.proposal,
      });

      if (!resultProposal.success) {
        return Response.json(
          { message: resultProposal.message, error: "UploadError" },
          { status: 400, headers: withCorsHeaders() }
        );
      }
      uploadedFiles.push(resultProposal);
    }
    if (isPertanyaanUploadExist) {
      resultPertanyaan = await uploadServices(file_pertanyaan, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.penelitian.pertanyaan,
      });

      if (!resultPertanyaan.success) {
        return Response.json(
          { message: resultPertanyaan.message, error: "UploadError" },
          { status: 400, headers: withCorsHeaders() }
        );
      }
      uploadedFiles.push(resultPertanyaan);
    }

    // Buat permohonan dengan data hasil upload dan input lain
    const createdData = await createPenelitian({
      pemohon_id: pemohonId,
      tiket,
      email,
      tipe,
      tanggal,
      platform: parsed?.platform || "Website",
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
      status: "Proses",
    });

    // WHATSAPP ========================
    if (instansi?.notif_wa) {
      prepareAndSendMessage(
        false,
        true,
        instansi.notif_wa,
        MessagePermohonanBaruKepadaAdmin(tiket, email, true)
      );
    }
    prepareAndSendMessage(
      false,
      true,
      telp,
      MessagePermohonanBaruKepadaPemohon(tiket, email, true)
    );

    // EMAIL =========================
    if (instansi?.notif_email) {
      sendEmail({
        to: instansi.notif_email,
        subject: "Permohonan Penelitian Baru",
        html: EmailPermohonanBaruKepadaAdmin(tiket, email, true),
      });
    }
    sendEmail({
      to: email,
      subject: "Permohonan Penelitian Baru",
      html: EmailPermohonanBaruKepadaPemohon(tiket, email, true),
    });

    return Response.json(
      {
        message: "Berhasil Mengajukan Permohonan Penelitian",
        data: createdData,
      },
      { status: 201, headers: withCorsHeaders() }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
    getLogs("publik").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500, headers: withCorsHeaders() }
    );
  }
}
