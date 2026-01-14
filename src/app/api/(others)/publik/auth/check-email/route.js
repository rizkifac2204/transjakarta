import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import validateEmail from "@/utils/validateEmail";
import {
  getAuthByEmail,
  editAuthAfterLogin,
  setUserCookie,
} from "@/libs/auth-public";
import { updatePemohon, createPemohon } from "@/libs/pemohon";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function POST(request) {
  try {
    let isRegisterSuccessful = false;
    let keterangan = "Registrasi";
    const body = await request.json();
    const parsed = parseJsonBody(body, {});
    const { email, name, image } = parsed;

    if (!email || !name) {
      return Response.json(
        { status: "error", message: "Tidak Terdeteksi" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    if (!validateEmail(email)) {
      return Response.json(
        { status: "error", message: "Periksa kembali email kamu" },
        { status: 404, headers: withCorsHeaders() }
      );
    }

    // prepare data
    let registered;
    const cekEmail = await getAuthByEmail(email);
    if (cekEmail && cekEmail.id) {
      registered = await updatePemohon(cekEmail.id, {
        register: true,
      });
      isRegisterSuccessful = true;
      keterangan = "Login";
    } else {
      // buat pemohon baru
      registered = await createPemohon({
        email,
        nama: name,
        register: true,
      });
      isRegisterSuccessful = true;
    }

    if (isRegisterSuccessful) {
      const dataForJWT = {
        id: registered.id,
        nama: registered?.nama,
        email: email,
        image: image || null,
      };

      await editAuthAfterLogin(registered.id);
      await setUserCookie(dataForJWT);

      return Response.json(
        { status: "success", message: `Berhasil Memproses ${keterangan}` },
        { status: 200, headers: withCorsHeaders() }
      );
    } else {
      return Response.json(
        { status: "error", message: "Gagal Memproses" },
        { status: 404, headers: withCorsHeaders() }
      );
    }
  } catch (error) {
    getLogs("publik").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500, headers: withCorsHeaders() }
    );
  }
}
