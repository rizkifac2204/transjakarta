import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";
import { isValidFile } from "@/utils/existAndValidFile";
import validateEmail from "@/utils/validateEmail";
import {
  getPermohonanDetailById,
  getPermohonanDetailByNoRegis,
  updatePermohonan,
} from "@/libs/permohonan";
import { getPemohonDetailByEmail, createPemohon } from "@/libs/pemohon";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getPermohonanDetailById(parseInt(id));
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

export async function PATCH(request, { params }) {
  let uploadedFiles = [];
  try {
    await getSession();
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const parsed = parseFormData(formData, {
      dateFields: ["tanggal"],
      integerFields: ["admin_id"],
      booleanFields: [],
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
      status_file_pendukung,
      status,
    } = parsed;
    let { cara_terima } = parsed;
    let pemohonId = null;

    // Ambil data permohonan lama untuk cek file pendukung lama & email lama
    const dataLama = await getPermohonanDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Permohonan tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }
    pemohonId = dataLama.pemohon_id;

    // Cek validasi input minimal, bisa disesuaikan
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

    // cek jika nomor regis sama dengan data lain
    if (dataLama.no_regis !== no_regis) {
      const isRegisExist = await getPermohonanDetailByNoRegis(
        no_regis,
        parseInt(id)
      );
      if (isRegisExist) {
        return Response.json(
          {
            message: "Nomor Registrasi Sudah Digunakan. Mohon Ganti",
            error: "RegisExist",
          },
          { status: 400 }
        );
      }
    }

    // dinamis input
    if (cara_dapat !== "Mendapatkan Salinan Informasi (Soft/Hard Copy)") {
      cara_terima = null;
    }

    // Proses email pemohon
    let resultIdentitas = { files: [] };

    if (email) {
      if (!validateEmail(email)) {
        return Response.json(
          { message: "Format email tidak valid", error: "InvalidEmail" },
          { status: 400 }
        );
      }

      // Kalau email berubah
      if (email !== dataLama.email) {
        // cek apakah pemohon baru sudah ada
        let pemohon = await getPemohonDetailByEmail(String(email));
        if (!pemohon) {
          // upload identitas jika ada file
          if (isValidFile(identitas)) {
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
          // buat pemohon baru
          pemohon = await createPemohon({
            email,
            nama: "Noname",
            identitas:
              resultIdentitas.files.length > 0
                ? resultIdentitas.files[0].filename
                : null,
          });
        }
        // kalau sudah ada, lewati update pemohon dan upload identitas
        pemohonId = pemohon.id;
      }
    }
    // jika email kosong, skip proses pemohon dan upload identitas

    // prepare file pendukung upload
    let filenamePendukungBaru = null;

    // jika request delete
    if (status_file_pendukung === "delete") {
      await hapusFile(dataLama.file_pendukung, PATH_UPLOAD.permohonan);
    }

    // jika request change
    if (status_file_pendukung === "change") {
      if (isValidFile(file_pendukung)) {
        // hapus file pendukung lama jika ada
        if (dataLama.file_pendukung) {
          await hapusFile(dataLama.file_pendukung, PATH_UPLOAD.permohonan);
        }

        // upload file pendukung baru
        const resultPendukung = await uploadServices(file_pendukung, {
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

        uploadedFiles.push(resultPendukung);
        filenamePendukungBaru =
          resultPendukung.files.length > 0
            ? resultPendukung.files[0].filename
            : null;
      }
    }

    // Siapkan objek update permohonan
    const updateData = {
      no_regis,
      admin_id,
      tipe,
      tanggal,
      rincian,
      tujuan,
      cara_dapat,
      cara_terima,
      status,
      updated_at: new Date(),
    };
    if (email) {
      updateData.pemohon_id = pemohonId;
      updateData.email = email;
    } else {
      updateData.pemohon_id = null;
      updateData.email = null;
    }
    if (status_file_pendukung === "delete") {
      updateData.file_pendukung = null;
    } else if (filenamePendukungBaru !== null) {
      updateData.file_pendukung = filenamePendukungBaru;
    }

    const updated = await updatePermohonan(parseInt(id), updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("permohonan").error(error);
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

    const id = params.id;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    // Ambil data permohonan lama untuk cek file pendukung lama & email lama
    const dataLama = await getPermohonanDetailById(parsedId);
    if (!dataLama) {
      return Response.json(
        { message: "Permohonan tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const prosess = await updatePermohonan(parseInt(id), {
      deleted_at: new Date(),
    });

    return Response.json({
      message: "Dipindahkan Ke Sampah",
      deleted: prosess,
    });
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
