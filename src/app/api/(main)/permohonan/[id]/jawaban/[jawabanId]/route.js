import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import { isValidFile } from "@/utils/existAndValidFile";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";
import {
  getJawabanDetailById,
  deleteJawaban,
  updateJawaban,
} from "@/libs/jawaban";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { jawabanId: jawabanIdRaw } = params;
    const idParsed = parseInt(jawabanIdRaw);
    if (isNaN(idParsed)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const data = await getJawabanDetailById(idParsed);
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

export async function PATCH(request, { params }) {
  let uploadedFiles = [];
  try {
    await getSession();

    const { id: permohonanIdRaw, jawabanId: jawabanIdRaw } = params;

    const permohonan_id = parseInt(permohonanIdRaw);
    const jawaban_id = parseInt(jawabanIdRaw);

    if (isNaN(jawaban_id)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }
    if (isNaN(permohonan_id)) {
      return Response.json(
        { message: "ID Permohonan tidak valid" },
        { status: 400 }
      );
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
      jenis,
      tanggal,
      bentuk_fisik,
      biaya,
      penguasaan,
      penghitaman,
      pengecualian,
      pasal,
      konsekuensi,
      pesan,
      jangka_waktu,
      file_surat_pemberitahuan,
      status_file_surat_pemberitahuan,
      file_informasi,
      status_file_informasi,
    } = parsed;

    if (!jenis || !tanggal) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    // Ambil data lama
    const curJawaban = await getJawabanDetailById(jawaban_id);
    if (!curJawaban) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    // JIKA STATUS HAPUS
    if (
      status_file_surat_pemberitahuan === "delete" &&
      curJawaban.file_surat_pemberitahuan
    ) {
      await hapusFile(
        curJawaban.file_surat_pemberitahuan,
        PATH_UPLOAD.jawaban.pemberitahuan
      );
    }
    if (status_file_informasi === "delete" && curJawaban.file_informasi) {
      await hapusFile(curJawaban.file_informasi, PATH_UPLOAD.jawaban.informasi);
    }

    // JIKA STATUS CHANGE
    if (status_file_surat_pemberitahuan === "change") {
      if (isValidFile(file_surat_pemberitahuan)) {
        if (curJawaban.file_surat_pemberitahuan) {
          await hapusFile(
            curJawaban.file_surat_pemberitahuan,
            PATH_UPLOAD.jawaban.pemberitahuan
          );
        }

        uploaded.pemberitahuan = await uploadServices(
          file_surat_pemberitahuan,
          {
            allowedTypes: [...MIME_PRESETS.allSafe],
            maxSize: MAX_FILE_SIZE,
            folder: PATH_UPLOAD.jawaban.pemberitahuan,
          }
        );

        if (!uploaded.pemberitahuan.success) {
          return Response.json(
            { message: uploaded.pemberitahuan.message, error: "UploadError" },
            { status: 400 }
          );
        }

        uploadedFiles.push(uploaded.pemberitahuan);
      }
    }
    if (status_file_informasi === "change") {
      if (isValidFile(file_informasi)) {
        if (curJawaban.file_informasi) {
          await hapusFile(
            curJawaban.file_informasi,
            PATH_UPLOAD.jawaban.informasi
          );
        }

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
    }

    // Siapkan objek update permohonan
    const updateData = {
      admin_id,
      jenis,
      tanggal,
      pesan,
      penguasaan,
      bentuk_fisik,
      biaya,
      penghitaman,
      jangka_waktu,
      pengecualian,
      pasal,
      konsekuensi,
    };
    if (status_file_surat_pemberitahuan === "delete") {
      updateData.file_surat_pemberitahuan = null;
    } else if (status_file_surat_pemberitahuan === "change") {
      updateData.file_surat_pemberitahuan =
        uploaded.pemberitahuan.success && uploaded.pemberitahuan.files.length
          ? uploaded.pemberitahuan.files[0].filename
          : null;
    }
    if (status_file_informasi === "delete") {
      updateData.file_informasi = null;
    } else if (status_file_informasi === "change") {
      updateData.file_informasi =
        uploaded.informasi.success && uploaded.informasi.files.length
          ? uploaded.informasi.files[0].filename
          : null;
    }

    const updated = await updateJawaban(jawaban_id, updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("jawaban").error(error);
    await hapusFileYangSudahTerupload(uploadedFiles);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await getSession();

    const { id: permohonanIdRaw, jawabanId: jawabanIdRaw } = params;

    const permohonan_id = parseInt(permohonanIdRaw);
    const jawaban_id = parseInt(jawabanIdRaw);

    if (isNaN(jawaban_id)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }
    if (isNaN(permohonan_id)) {
      return Response.json(
        { message: "ID Permohonan tidak valid" },
        { status: 400 }
      );
    }

    // Ambil data permohonan lama untuk cek file pendukung lama & email lama
    const curJawaban = await getJawabanDetailById(jawaban_id);
    if (!curJawaban) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    if (curJawaban?.file_surat_pemberitahuan) {
      await hapusFile(
        curJawaban?.file_surat_pemberitahuan,
        PATH_UPLOAD.jawaban.pemberitahuan
      );
    }
    if (curJawaban?.file_informasi) {
      await hapusFile(
        curJawaban?.file_informasi,
        PATH_UPLOAD.jawaban.informasi
      );
    }
    const deleted = await deleteJawaban(jawaban_id);

    return Response.json({
      message: "Berhasil menghapus data",
      deleted: deleted,
    });
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
