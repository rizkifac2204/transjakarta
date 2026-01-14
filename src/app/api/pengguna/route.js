import { verifyAuth } from "@/libs/jwt";
import { parseFormData } from "@/utils/parseFormData";
import getLogs from "@/libs/getLogs";
import bcrypt from "bcryptjs";
import { getAuthByUsername } from "@/libs/auth";
import { createUser, getUserDetailByEmail } from "@/libs/user";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import uploadServices, {
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";
import { PATH_UPLOAD, MAX_FOTO_SIZE } from "@/configs/appConfig";
import { validateStrongPassword } from "@/utils/strongPassword";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let uploadedFiles = [];
  try {
    const auth = await verifyAuth();

    const formData = await request.formData();
    const parsed = parseFormData(formData, { integerFields: ["level_id"] });
    const { level_id, nama, telp, alamat, email, username, password, foto } =
      parsed;

    // required
    if (!level_id || !nama || !username || !password) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const isStrong = validateStrongPassword(password);
    if (isStrong !== true) {
      return Response.json({ message: isStrong }, { status: 400 });
    }

    // management level
    if (level_id < auth.level) {
      return Response.json(
        { message: "Tidak Bisa Input Dengan Level Lebih Tinggi" },
        { status: 400 }
      );
    }

    // check email sama
    if (email) {
      const othersAdmin = await getUserDetailByEmail(String(email));
      if (othersAdmin) {
        return Response.json(
          { message: "Email Sudah Digunakan Oleh Admin Lain, Mohon Ganti" },
          { status: 400 }
        );
      }
    }

    // cek username sama
    const entries = await getAuthByUsername(username);
    if (entries && entries.length !== 0) {
      return Response.json(
        {
          message:
            "Username Sudah Digunakan Pengguna Lain, Mohon Ganti Demi Keamanan",
        },
        { status: 404 }
      );
    }

    let resultFoto = { files: [] };
    const isFotoUploadExist = isValidFile(foto);

    // Upload file pendukung tetap diproses terpisah
    if (isFotoUploadExist) {
      resultFoto = await uploadServices(foto, {
        allowedTypes: [...MIME_PRESETS.image],
        maxSize: MAX_FOTO_SIZE,
        folder: PATH_UPLOAD.user,
      });

      if (!resultFoto.success) {
        return Response.json(
          { message: resultFoto.message, error: "UploadError" },
          { status: 400 }
        );
      }
    }

    uploadedFiles = [resultFoto];

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(password, salt);

    // create
    const createdAdmin = await createUser({
      level_id,
      nama,
      telp,
      alamat,
      email,
      username,
      password: hashBaru,
      valid: true,
      foto: isFotoUploadExist ? resultFoto.files[0].filename : null,
    });

    return Response.json(
      {
        message: "Berhasil Menambah Data",
        payload: createdAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
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
