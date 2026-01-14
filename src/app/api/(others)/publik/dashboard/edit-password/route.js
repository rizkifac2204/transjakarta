import { getSession } from "@/libs/auth-public";
import getLogs from "@/libs/getLogs";
import bcrypt from "bcryptjs";
import { updatePemohon } from "@/libs/pemohon";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";
import { validateStrongPasswordPemohon } from "@/utils/strongPassword";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function PATCH(request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { password_lama, password_baru } = body;
    const isPasswordSet = Boolean(session?.password);

    if (!password_baru) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const isStrong = validateStrongPasswordPemohon(password_baru);
    if (isStrong !== true) {
      return Response.json({ message: isStrong }, { status: 400 });
    }

    if (isPasswordSet) {
      const match = await bcrypt.compare(password_lama, session?.password);
      if (!match) {
        return Response.json(
          { message: "Password Lama Salah" },
          { status: 400 }
        );
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(password_baru, salt);

    const updated = await updatePemohon(session.id, {
      password: hashBaru,
      updated_at: new Date(),
    });

    return Response.json(
      { message: "Password Berhasil Diperbarui", data: updated },
      { status: 200, headers: withCorsHeaders() }
    );
  } catch (error) {
    getLogs("publik").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500, headers: withCorsHeaders() }
    );
  }
}
