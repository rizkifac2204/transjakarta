import {
  getAuthByUsername,
  editAuthAfterLogin,
  setUserCookie,
  verifyAuth,
  getSession,
  editAuthAfterLogout,
  expireUserCookie,
} from "@/libs/auth-public";
import verifyRecaptchaToken from "@/libs/verifyRecaptchaToken";
import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import bcrypt from "bcryptjs";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";
import { getIP } from "@/utils/get-ip";
import { ratelimit } from "@/utils/rateLimit";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      await expireUserCookie();
    }
    return Response.json(
      { status: "success", message: "Logged In", payload: session },
      { status: 200, headers: withCorsHeaders() }
    );
  } catch (error) {
    await expireUserCookie();
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500, headers: withCorsHeaders() }
    );
  }
}

export async function POST(request) {
  try {
    let isLoginSuccessful = false;
    const body = await request.json();
    const parsed = parseJsonBody(body, {});
    const { username, password, token } = parsed;
    const ip = getIP();
    getLogs("testing").error(ip);

    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return Response.json(
        { status: "error", message: "Too Many Requests" },
        { status: 429 }
      );
    }

    if (!username || !password) {
      return Response.json(
        { status: "error", message: "Lengkapi username dan password" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    if (!token) {
      return Response.json(
        { status: "error", message: "Recaptcha Belum Siap" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    const captcha = await verifyRecaptchaToken(token, "login");
    if (!captcha.success) {
      getLogs("publik").error(captcha);
      return Response.json(
        { status: "error", message: "Gagal Verifikasi" },
        { status: 404, headers: withCorsHeaders() }
      );
    }

    const entries = await getAuthByUsername(username);

    if (!entries || entries.length === 0) {
      return Response.json(
        { status: "error", message: "Tidak Ditemukan" },
        { status: 404, headers: withCorsHeaders() }
      );
    }

    for (const userEntry of entries) {
      const match = await bcrypt.compare(password, userEntry.password);
      if (match) {
        const dataForJWT = {
          id: userEntry.id,
          nama: userEntry.nama,
          email: userEntry.email,
          image: null,
        };
        await editAuthAfterLogin(userEntry.id);
        await setUserCookie(dataForJWT);
        isLoginSuccessful = true;
        break;
      }
    }

    if (isLoginSuccessful) {
      return Response.json(
        { status: "success", message: "Berhasil Login" },
        { status: 200, headers: withCorsHeaders() }
      );
    } else {
      return Response.json(
        { status: "error", message: "Tidak Ditemukan" },
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

export async function DELETE(_request) {
  try {
    const session = await verifyAuth();
    await editAuthAfterLogout(session?.id);
    await expireUserCookie(session?.id);
    return Response.json(
      { status: "success", message: "Logged Out" },
      { status: 200, headers: withCorsHeaders() }
    );
  } catch (error) {
    getLogs("publik").error(error);
    // success anyway
    return Response.json(
      { status: "success", message: "Forced Logging Out" },
      { status: 200, headers: withCorsHeaders() }
    );
  }
}
