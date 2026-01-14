import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import bcrypt from "bcryptjs";
import validateEmail from "@/utils/validateEmail";
import {
  getAuthByEmail,
  editAuthAfterLogin,
  setUserCookie,
} from "@/libs/auth-public";
import verifyRecaptchaToken from "@/libs/verifyRecaptchaToken";
import { updatePemohon, createPemohon } from "@/libs/pemohon";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function POST(request) {
  try {
    let isRegisterSuccessful = false;
    const body = await request.json();
    const parsed = parseJsonBody(body, {});
    const { email, username, password, token } = parsed;

    if (!email || !username || !password) {
      return Response.json(
        { status: "error", message: "Lengkapi email dan password" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    if (!validateEmail(email)) {
      return Response.json(
        {
          status: "error",
          message: "Periksa kembali email kamu",
        },
        { status: 404, headers: withCorsHeaders() }
      );
    }

    if (!token) {
      return Response.json(
        { status: "error", message: "Recaptcha Belum Siap" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    const captcha = await verifyRecaptchaToken(token, "register");
    if (!captcha.success) {
      getLogs("publik").error(captcha);
      return Response.json(
        { status: "error", message: "Gagal Verifikasi" },
        { status: 404, headers: withCorsHeaders() }
      );
    }

    const nama = email.split("@")[0];

    // prepare data
    let registered;
    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(password, salt);

    const cekEmail = await getAuthByEmail(email);
    if (cekEmail) {
      // blok jika sudah register, hanya login
      if (cekEmail.register) {
        return Response.json(
          {
            status: "error",
            message:
              "Email Sudah Terdaftar, Lakukan Login atau Lupa Password untuk melakukan reset password",
          },
          { status: 404, headers: withCorsHeaders() }
        );
      }

      // daftarkan user dengan cara update username password dan register true
      registered = await updatePemohon(cekEmail.id, {
        username: username,
        password: hashBaru,
        register: true,
      });
      isRegisterSuccessful = true;
    } else {
      // buat pemohon baru
      registered = await createPemohon({
        email,
        nama,
        username,
        password: hashBaru,
        register: true,
      });
      isRegisterSuccessful = true;
    }

    if (isRegisterSuccessful) {
      const dataForJWT = {
        id: registered.id,
        nama: registered?.nama,
        email: email,
        image: null,
      };

      await editAuthAfterLogin(registered.id);
      await setUserCookie(dataForJWT);

      return Response.json(
        { status: "success", message: "Berhasil Membuat Akun" },
        { status: 200, headers: withCorsHeaders() }
      );
    } else {
      return Response.json(
        { status: "error", message: "Gagal Membuat Akun" },
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
