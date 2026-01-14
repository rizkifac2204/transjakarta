import getLogs from "@/libs/getLogs";
import { getSession } from "@/libs/auth";

import { isEmailSama, updateProfile } from "@/libs/profile";
import bcrypt from "bcryptjs";

// export async function GET() {
//   try {
//     const profile = await getProfile();
//     return Response.json(profile);
//   } catch (error) {
//     getLogs("profile").error(error);
//     return Response.json(
//       {
//         message: "Terjadi Kesalahan",
//         error: error instanceof Error ? error.message : error,
//       },
//       { status: error.status || 500 }
//     );
//   }
// }

export async function PATCH(request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { nama, telp, email, alamat, username, password_lama } = body;

    const match = await bcrypt.compare(password_lama, session.password);
    if (!match) {
      return Response.json(
        {
          message: "Password Lama Salah",
        },
        { status: 400 }
      );
    }

    if (email && email !== session.email) {
      const isEmailSudahDigunakan = await isEmailSama(email);
      if (isEmailSudahDigunakan) {
        return Response.json(
          {
            message: "Email Sudah Digunakan User Lain",
          },
          { status: 400 }
        );
      }
    }

    const updated = await updateProfile(session.id, {
      nama,
      telp,
      email,
      alamat,
      username,
      updated_at: new Date(),
    });

    return Response.json({
      message: "Profil berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    getLogs("profile").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
