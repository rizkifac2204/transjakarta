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
  getKeberatanDetailById,
  getKeberatanDetailByNoRegis,
  updateKeberatan,
} from "@/libs/keberatan";
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
    const data = await getKeberatanDetailById(parseInt(id));
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
    });
    const {
      no_regis,
      admin_id,
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
      status_file_pendukung,
    } = parsed;
    let pemohonId = null;

    const dataLama = await getKeberatanDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Data Keberatan tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }
    pemohonId = dataLama.pemohon_id;

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

    // cek jika nomor regis sama dengan data lain
    if (dataLama.no_regis !== no_regis) {
      const isRegisExist = await getKeberatanDetailByNoRegis(
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
          pemohon = await createPemohon({
            email,
            nama,
            nomor_identitas,
            telp,
            alamat,
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
      await hapusFile(dataLama.file_pendukung, PATH_UPLOAD.keberatan);
    }

    // jika request change
    if (status_file_pendukung === "change") {
      if (isValidFile(file_pendukung)) {
        // hapus file pendukung lama jika ada
        if (dataLama.file_pendukung) {
          await hapusFile(dataLama.file_pendukung, PATH_UPLOAD.keberatan);
        }

        // upload file pendukung baru
        const resultPendukung = await uploadServices(file_pendukung, {
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

        uploadedFiles.push(resultPendukung);
        filenamePendukungBaru =
          resultPendukung.files.length > 0
            ? resultPendukung.files[0].filename
            : null;
      }
    }

    // Siapkan objek update
    const updateData = {
      no_regis,
      admin_id,
      tanggal,
      nama,
      kategori,
      nomor_identitas,
      telp,
      alamat,
      alasan,
      tujuan,
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

    const updated = await updateKeberatan(parseInt(id), updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("keberatan").error(error);
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
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const dataLama = await getKeberatanDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Data Keberatan tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const prosess = await updateKeberatan(parseInt(id), {
      deleted_at: new Date(),
    });

    return Response.json({
      message: "Dipindahkan Ke Sampah",
      deleted: prosess,
    });
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
