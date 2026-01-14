import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import { isValidFile } from "@/utils/existAndValidFile";
import uploadServices, {
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";
import {
  getJawabanByPermohonanId,
  createJawaban,
  updateJawaban,
} from "@/libs/jawaban";
import { getPermohonanDetailById, updatePermohonan } from "@/libs/permohonan";
import { prepareAndSendMessage } from "@/services/whatsappServices";
import { sendEmail } from "@/services/emailServices";
import { MessagePerubahanStatus, EmailPerubahanStatus } from "@/utils/messages";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id } = await params;
    const parsedId = id;

    if (!parsedId || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getJawabanByPermohonanId(parsedId);
    return Response.json(data);
  } catch (error) {
    getLogs("jawaban").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request, { params }) {
  let uploadedFiles = [];
  try {
    await getSession();
    const { id: permohonan_id } = await params;
    const idParsed = parseInt(permohonan_id);
    if (isNaN(idParsed)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    let uploaded = {
      pemberitahuan: { files: [] },
      informasi: { files: [] },
    };

    const formData = await request.formData();
    const parsed = parseFormData(formData, {
      dateFields: ["tanggal"],
      integerFields: ["biaya", "jangka_waktu", "admin_id"],
      booleanFields: ["mailed", "whatsapped"],
    });

    const {
      admin_id,
      status,
      jenis,
      tanggal,
      bentuk_fisik,
      biaya,
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
    let { jangka_waktu } = parsed;

    const dataPermohonan = await getPermohonanDetailById(idParsed);
    if (!dataPermohonan) {
      return Response.json(
        { message: "Permohonan Tidak Ditemukan", error: "Required" },
        { status: 400 }
      );
    }

    if (!status || !jenis || !tanggal) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    if (!["Respon Final"].includes(jenis)) {
      jangka_waktu = null;
    }

    const isPemberitahuanUploadExist = isValidFile(file_surat_pemberitahuan);
    const isInformasiUploadExist = isValidFile(file_informasi);

    if (isPemberitahuanUploadExist) {
      uploaded.pemberitahuan = await uploadServices(file_surat_pemberitahuan, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.jawaban.pemberitahuan,
      });

      if (!uploaded.pemberitahuan.success) {
        return Response.json(
          { message: uploaded.pemberitahuan.message, error: "UploadError" },
          { status: 400 }
        );
      }

      uploadedFiles.push(uploaded.pemberitahuan);
    }

    if (isInformasiUploadExist) {
      uploaded.informasi = await uploadServices(file_informasi, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.jawaban.informasi,
      });

      if (!uploaded.informasi.success) {
        return Response.json(
          { message: uploaded.informasi.message, error: "UploadError" },
          { status: 400 }
        );
      }

      uploadedFiles.push(uploaded.informasi);
    }

    await updatePermohonan(idParsed, { status: status });
    const inserted = await createJawaban({
      permohonan_id: idParsed,
      admin_id,
      jenis,
      tanggal,
      pesan,
      penguasaan,
      bentuk_fisik,
      penghitaman,
      biaya,
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

    if (whatsapped) {
      const no_regis = dataPermohonan?.no_regis || "";
      const tiket = dataPermohonan?.tiket || "";
      const telp = dataPermohonan?.pemohon?.telp || "";
      const email = dataPermohonan?.pemohon?.email || "";
      const statusWahstapp = await prepareAndSendMessage(
        false,
        true,
        telp,
        MessagePerubahanStatus(tiket, email, status, no_regis, pesan)
      );
      if (!statusWahstapp) {
        await updateJawaban(inserted.id, {
          whatsapped: false,
        });
      }
    }

    if (mailed) {
      const no_regis = dataPermohonan?.no_regis || "";
      const tiket = dataPermohonan?.tiket || "";
      const email = dataPermohonan?.pemohon?.email || "";
      const statusEmail = await sendEmail({
        to: email,
        subject: "Perubahan Status Permohonan",
        html: EmailPerubahanStatus(tiket, email, status, no_regis, pesan),
      });
      if (!statusEmail) {
        await updateJawaban(inserted.id, {
          mailed: false,
        });
      }
    }

    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
    getLogs("jawaban").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
