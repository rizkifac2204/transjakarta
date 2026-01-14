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
  getJawabanPenelitianByPenelitianId,
  createJawabanPenelitian,
  updateJawabanPenelitian,
} from "@/libs/jawaban-penelitian";
import { getPenelitianDetailById, updatePenelitian } from "@/libs/penelitian";
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

    const data = await getJawabanPenelitianByPenelitianId(parsedId);
    return Response.json(data);
  } catch (error) {
    getLogs("jawaban-penelitian").error(error);
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
    const { id: penelitian_id } = await params;
    const idParsed = parseInt(penelitian_id);
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
      integerFields: ["admin_id"],
      booleanFields: ["mailed", "whatsapped"],
    });

    const {
      admin_id,
      status,
      jenis,
      tanggal,
      file_surat_pemberitahuan,
      file_informasi,
      pesan,
      mailed,
      whatsapped,
    } = parsed;

    const dataLama = await getPenelitianDetailById(idParsed);
    if (!dataLama) {
      return Response.json(
        { message: "Data Tidak Ditemukan", error: "Required" },
        { status: 400 }
      );
    }

    if (!status || !jenis || !tanggal) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const isPemberitahuanUploadExist = isValidFile(file_surat_pemberitahuan);
    const isInformasiUploadExist = isValidFile(file_informasi);

    if (isPemberitahuanUploadExist) {
      uploaded.pemberitahuan = await uploadServices(file_surat_pemberitahuan, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.jawabanpenelitian.pemberitahuan,
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
        folder: PATH_UPLOAD.jawabanpenelitian.informasi,
      });

      if (!uploaded.informasi.success) {
        return Response.json(
          { message: uploaded.informasi.message, error: "UploadError" },
          { status: 400 }
        );
      }

      uploadedFiles.push(uploaded.informasi);
    }

    await updatePenelitian(idParsed, { status: status });
    const inserted = await createJawabanPenelitian({
      penelitian_id: idParsed,
      admin_id,
      jenis,
      tanggal,
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

    if (whatsapped) {
      const no_regis = dataLama?.no_regis || "";
      const tiket = dataLama?.tiket || "";
      const telp = dataLama?.pemohon?.telp || "";
      const email = dataLama?.pemohon?.email || "";
      const statusWahstapp = await prepareAndSendMessage(
        false,
        true,
        telp,
        MessagePerubahanStatus(tiket, email, status, no_regis, pesan),
        true
      );
      if (!statusWahstapp) {
        await updateJawabanPenelitian(inserted.id, {
          whatsapped: false,
        });
      }
    }

    if (mailed) {
      const no_regis = dataLama?.no_regis || "";
      const tiket = dataLama?.tiket || "";
      const email = dataLama?.pemohon?.email || "";
      const statusEmail = await sendEmail({
        to: email,
        subject: "Perubahan Status Permohonan Penelitian",
        html: EmailPerubahanStatus(tiket, email, status, no_regis, pesan, true),
      });
      if (!statusEmail) {
        await updateJawabanPenelitian(inserted.id, {
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
    getLogs("jawaban-penelitian").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
