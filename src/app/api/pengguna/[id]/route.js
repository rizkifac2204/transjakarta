import { verifyAuth } from "@/libs/jwt";
import { canManage } from "@/utils/manage";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { getAuthByUsername } from "@/libs/auth";
import bcrypt from "bcryptjs";
import {
  getAdminDetailById,
  getAdminDetailByEmail,
  updateAdmin,
  deleteAdmin,
} from "@/libs/user";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";
import { validateStrongPassword } from "@/utils/strongPassword";

export async function GET(_request, { params }) {
  try {
    const auth = await verifyAuth();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getAdminDetailById(parsedId);
    const modifiedData = {
      ...data,
      isManage: canManage(data.level_id, auth.level),
    };

    return Response.json(modifiedData);
  } catch (error) {
    getLogs("pengguna").error(error);
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
    const auth = await verifyAuth();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const parsed = parseFormData(formData, { integerFields: ["level_id"] });
    const {
      level_id,
      nama,
      telp,
      alamat,
      email,
      username,
      password,
      status_password,
      foto,
      status_foto,
    } = parsed;

    const isManage = canManage(level_id, auth.level);
    if (!isManage) {
      return Response.json(
        {
          message: "Tidak Bisa Edit Dengan Level Lebih Tinggi",
          error: "Access",
        },
        { status: 400 }
      );
    }

    // Cek validasi input minimal, bisa disesuaikan
    if (!level_id || !nama || !username) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    // Cek validasi input password
    if (status_password == "change") {
      if (!password) {
        return Response.json(
          {
            message: "Lengkapi semua field yang harus diisi",
            error: "Required",
          },
          { status: 400 }
        );
      }

      const isStrong = validateStrongPassword(password);
      if (isStrong !== true) {
        return Response.json({ message: isStrong }, { status: 400 });
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(password || "-", salt);

    // Cek apakah pemohon dengan ID tersebut ada
    const penggunalama = await getAdminDetailById(parsedId);
    if (!penggunalama) {
      return Response.json(
        { message: "Pengguna tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    // Cek apakah email sudah terdaftar
    if (email) {
      const othersAdmin = await getAdminDetailByEmail(String(email), parsedId);
      if (othersAdmin) {
        return Response.json(
          {
            message: "Email Sudah Digunakan Oleh Admin Lain, Mohon Ganti",
            error: "Required",
          },
          { status: 400 }
        );
      }
    }

    // cek username sama
    const entries = await getAuthByUsername(username, parsedId);
    if (entries && entries.length !== 0) {
      return Response.json(
        {
          status: "error",
          message:
            "Username Sudah Digunakan Pengguna Lain, Mohon Ganti Demi Keamanan",
        },
        { status: 404 }
      );
    }

    // prepare file foto upload
    let filenameFotoBaru = null;

    // jika request delete
    if (status_foto === "delete" && penggunalama?.foto) {
      await hapusFile(penggunalama.foto, PATH_UPLOAD.admin);
      filenameFotoBaru = null; // set file baru menjadi null
    }
    // jika request change
    if (status_foto === "change") {
      if (isValidFile(foto)) {
        // hapus file identitas lama jika ada
        if (penggunalama?.foto)
          await hapusFile(penggunalama.foto, PATH_UPLOAD.admin);

        // upload file identitas baru
        const resultFoto = await uploadServices(foto, {
          allowedTypes: [...MIME_PRESETS.image],
          maxSize: MAX_FOTO_SIZE,
          folder: PATH_UPLOAD.admin,
        });

        if (!resultFoto.success) {
          return Response.json(
            { message: resultFoto.message, error: "UploadError" },
            { status: 400 }
          );
        }

        uploadedFiles.push(resultFoto);
        filenameFotoBaru =
          resultFoto.files.length > 0 ? resultFoto.files[0].filename : null;
      }
    }

    // Siapkan objek update permohonan
    const updateData = {
      nama,
      telp,
      alamat,
      email,
      username,
      updated_at: new Date(),
    };
    if (status_foto === "delete") {
      updateData.foto = null;
    } else if (filenameFotoBaru !== null) {
      updateData.foto = filenameFotoBaru;
    }
    if (status_password === "change") {
      updateData.password = hashBaru;
    }

    const updated = await updateAdmin(parsedId, updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    getLogs("pengguna").error(error);
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
    const auth = await verifyAuth();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const penggunalama = await getAdminDetailById(parsedId);
    if (!penggunalama) {
      return Response.json(
        { message: "Pemohon tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const isManage = canManage(penggunalama.level_id, auth.level);
    if (!isManage) {
      return Response.json(
        {
          message: "Tidak Bisa Input Dengan Level Lebih Tinggi",
          error: "Access",
        },
        { status: 400 }
      );
    }

    if (penggunalama?.foto)
      await hapusFile(penggunalama?.foto, PATH_UPLOAD.admin);

    const deleted = await deleteAdmin(parsedId);

    return Response.json({
      message: "Berhasil menghapus data",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("pengguna").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
