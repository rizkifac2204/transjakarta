import getLogs from "@/libs/getLogs";
import { getSession } from "@/libs/auth-public";
import { parseJsonBody } from "@/utils/parseJsonBody";
import { updatePemohon } from "@/libs/pemohon";
import bcrypt from "bcryptjs";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Unauthorized", error: "auth" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    const isPasswordSet = Boolean(session?.password);

    const body = await request.json();
    const parsed = parseJsonBody(body);

    const {
      nama,
      nomor_identitas,
      telp,
      jenis_kelamin,
      pekerjaan,
      alamat,
      pendidikan,
      universitas,
      jurusan,
      nim,
      username,
      password,
    } = parsed;

    if (isPasswordSet && !password) {
      return Response.json(
        { message: "Masukan Password", error: "Required" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    if (
      !nama ||
      !nomor_identitas ||
      !telp ||
      !jenis_kelamin ||
      !pendidikan ||
      !pekerjaan ||
      !alamat ||
      !username
    ) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    if (isPasswordSet) {
      const match = await bcrypt.compare(password, session?.password);
      if (!match) {
        return Response.json(
          { message: "Password Lama Salah" },
          { status: 400 }
        );
      }
    }

    const updateData = {
      nama,
      nomor_identitas,
      telp,
      jenis_kelamin,
      pendidikan,
      pekerjaan,
      alamat,
      universitas,
      jurusan,
      nim,
      username,
      updated_at: new Date(),
    };

    const updated = await updatePemohon(parseInt(session.id), updateData);

    return Response.json(
      {
        message: "Berhasil mengupdate data",
        data: updated,
      },
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
