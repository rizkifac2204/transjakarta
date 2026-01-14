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
import { createKeberatan } from "@/libs/keberatan";
import {
  getPemohonDetailByEmail,
  createPemohon,
  updatePemohon,
} from "@/libs/pemohon";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";
import { getInstansi } from "@/libs/instansi";
import validatePhone from "@/utils/validatePhone";
import { prepareAndSendMessage } from "@/services/whatsappServices";
import { sendEmail } from "@/services/emailServices";
import {
  MessageKeberatanKepadaAdmin,
  MessageKeberatanKepadaPemohon,
  EmailKeberatanKepadaAdmin,
  EmailKeberatanKepadaPemohon,
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
    const parsed = parseFormData(formData, {});
    const {
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
      token,
    } = parsed;
    // const tiket = generateTicket(6);

    if (
      !email ||
      !nama ||
      !nomor_identitas ||
      !alasan ||
      !tujuan ||
      !identitas
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

    const instansi = await getInstansi();
    let resultIdentitas = { files: [] };
    let resultPendukung = { files: [] };
    let pemohonId = null;
    const isIdentitasUploadExist = isValidFile(identitas);
    const isPendukungUploadExist = isValidFile(file_pendukung);
    const updatePayload = {};

    // proses upload identitas
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
        nama,
        nomor_identitas,
        telp,
        alamat,
        identitas: resultIdentitas.files[0].filename || null,
      });
    } else {
      await hapusFile(pemohon?.identitas, PATH_UPLOAD.identitas);
      updatePayload.identitas = resultIdentitas.files[0].filename || null;
      updatePayload.nama = nama;
      updatePayload.nomor_identitas = nomor_identitas;
      updatePayload.telp = telp;
      updatePayload.alamat = alamat;
      // proses update pemohon
      if (Object.keys(updatePayload).length > 0) {
        await updatePemohon(parseInt(pemohon.id), updatePayload);
      }
    }

    // id pemohon di dapatkan dari datalama atau data baru dibuat
    pemohonId = pemohon.id;

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
          { status: 400, headers: withCorsHeaders() }
        );
      }
    }

    // masukan file yang diupload
    uploadedFiles = [resultIdentitas, resultPendukung];

    // Buat keberatan dengan data hasil upload dan input lain
    const insertedData = await createKeberatan({
      pemohon_id: pemohonId,
      email,
      tanggal: new Date(),
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

    // WHATSAPP ==============================
    if (instansi?.notif_wa) {
      await prepareAndSendMessage(
        false,
        true,
        instansi.notif_wa,
        MessageKeberatanKepadaAdmin(email),
        0
      );
    }
    await prepareAndSendMessage(
      false,
      true,
      telp,
      MessageKeberatanKepadaPemohon(new Date()),
      1000
    );

    // EMAIL ===================================
    if (instansi?.notif_email) {
      await sendEmail({
        to: instansi.notif_email,
        subject: "Pengajuan Keberatan",
        html: EmailKeberatanKepadaAdmin(email),
      });
    }
    await sendEmail({
      to: email,
      subject: "Pengajuan Keberatan",
      html: EmailKeberatanKepadaPemohon(new Date()),
    });

    return Response.json(
      {
        message: "Berhasil Mengajukan Keberatan",
        data: insertedData,
      },
      { status: 201, headers: withCorsHeaders() }
    );
  } catch (error) {
    console.log(error);
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
