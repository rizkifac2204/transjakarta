import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { validateStrongPassword } from "@/utils/strongPassword";

import { updateProfile } from "@/libs/profile";
import bcrypt from "bcryptjs";

export async function PATCH(request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { password_lama, password_baru } = body;

    // 🔸 Validasi input dasar
    if (!password_lama || !password_baru) {
      return Response.json(
        { message: "Password tidak boleh kosong" },
        { status: 400 }
      );
    }

    const isStrong = validateStrongPassword(password_baru);
    if (isStrong !== true) {
      return Response.json({ message: isStrong }, { status: 400 });
    }

    const match = await bcrypt.compare(password_lama, session.password);
    if (!match) {
      return Response.json(
        {
          message: "Password Lama Salah",
        },
        { status: 400 }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(password_baru, salt);

    const updated = await updateProfile(session.id, {
      password: hashBaru,
      updated_at: new Date(),
    });

    return Response.json({
      message: "Password Berhasil Diperbarui",
      data: updated,
    });
  } catch (error) {
    console.log(error);
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
