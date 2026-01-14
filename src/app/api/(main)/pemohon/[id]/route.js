import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import {
  getPemohonDetailByEmail,
  getPemohonDetailById,
  deletePemohon,
  updatePemohon,
} from "@/libs/pemohon";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getPemohonDetailById(parsedId);
    return Response.json(data);
  } catch (error) {
    getLogs("pemohon").error(error);
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
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const parsed = parseFormData(formData);
    const {
      email,
      nama,
      nomor_identitas,
      telp,
      jenis_kelamin,
      pekerjaan,
      alamat,
      identitas,
      pendidikan,
      universitas,
      jurusan,
      nim,
      status_identitas,
    } = parsed;

    // Cek apakah pemohon dengan ID tersebut ada
    const pemohonlama = await getPemohonDetailById(parsedId);
    if (!pemohonlama) {
      return Response.json(
        { message: "Pemohon tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    // Cek validasi input minimal, bisa disesuaikan
    if (!email || !nama) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }
    // Cek apakah email sudah terdaftar
    if (pemohonlama.email !== email) {
      const pemohonByEmail = await getPemohonDetailByEmail(String(email));
      if (pemohonByEmail) {
        return Response.json(
          { message: "Email sudah terdaftar", error: "EmailExists" },
          { status: 400 }
        );
      }
    }

    // prepare file identitas upload
    let filenameIdentitasBaru = null;

    // jika request delete
    if (status_identitas === "delete" && pemohonlama?.identitas) {
      await hapusFile(pemohonlama.identitas, PATH_UPLOAD.identitas);
      filenameIdentitasBaru = null; // set file baru menjadi null
    }
    // jika request change
    if (status_identitas === "change") {
      if (isValidFile(identitas)) {
        // hapus file identitas lama jika ada
        if (pemohonlama?.identitas)
          await hapusFile(pemohonlama.identitas, PATH_UPLOAD.identitas);

        // upload file identitas baru
        const resultIdentitas = await uploadServices(identitas, {
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

        uploadedFiles.push(resultIdentitas);
        filenameIdentitasBaru =
          resultIdentitas.files.length > 0
            ? resultIdentitas.files[0].filename
            : null;
      }
    }

    // Siapkan objek update permohonan
    const updateData = {
      nama,
      email,
      nomor_identitas,
      telp,
      jenis_kelamin,
      pekerjaan,
      alamat,
      pendidikan,
      universitas,
      jurusan,
      nim,
      updated_at: new Date(),
    };
    if (status_identitas === "delete") {
      updateData.identitas = null;
    } else if (filenameIdentitasBaru !== null) {
      updateData.identitas = filenameIdentitasBaru;
    }

    const updated = await updatePemohon(parsedId, updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("pemohon").error(error);
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
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const pemohonlama = await getPemohonDetailById(parsedId);
    if (!pemohonlama) {
      return Response.json(
        { message: "Pemohon tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    if (pemohonlama?.identitas)
      await hapusFile(pemohonlama?.identitas, PATH_UPLOAD.identitas);

    if (pemohonlama?.foto)
      await hapusFile(pemohonlama?.identitas, PATH_UPLOAD.pemohon);

    const deleted = await deletePemohon(parsedId);

    return Response.json({
      message: "Berhasil menghapus data",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("pemohon").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
