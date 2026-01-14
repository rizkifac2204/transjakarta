import { verifyAuth } from "@/libs/jwt";
import { parseFormData } from "@/utils/parseFormData";
import getLogs from "@/libs/getLogs";
import bcrypt from "bcryptjs";
import { getAuthByUsername } from "@/libs/auth";
import { createAdmin, getAdminDetailByEmail } from "@/libs/user";
import { canManage } from "@/utils/manage";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import uploadServices, {
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";
import { PATH_UPLOAD, MAX_FOTO_SIZE } from "@/configs/appConfig";
import { validateStrongPassword } from "@/utils/strongPassword";

export const dynamic = "force-dynamic";

// export async function GET() {
//   try {
//     const auth = await verifyAuth();
//     const data = await getAdmin();

//     const modifiedData = data?.map((admin) => {
//       return {
//         ...admin,
//         isManage: canManage(admin.level_id, auth.level),
//       };
//     });

//     return Response.json(modifiedData);
//   } catch (error) {
//     getLogs("pengguna").error(error);
//     return Response.json(
//       {
//         message: "Terjadi Kesalahan",
//         error: error instanceof Error ? error.message : error,
//       },
//       { status: error.status || 500 }
//     );
//   }
// }

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

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(password, salt);

    // management level
    const isManage = canManage(level_id, auth.level);
    if (!isManage) {
      return Response.json(
        {
          message: "Tidak Bisa Input Dengan Level Lebih Tinggi",
          error: "Access",
        },
        { status: 400 }
      );
    }

    // check email sama
    if (email) {
      const othersAdmin = await getAdminDetailByEmail(String(email));
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
    const entries = await getAuthByUsername(username);
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

    let resultFoto = { files: [] };
    const isFotoUploadExist = isValidFile(foto);

    // Upload file pendukung tetap diproses terpisah
    if (isFotoUploadExist) {
      resultFoto = await uploadServices(foto, {
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
    }

    uploadedFiles = [resultFoto];

    // create
    const createdAdmin = await createAdmin({
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
        data: createdAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
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
