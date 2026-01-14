import {
  getAuthByUsername,
  editAuthAfterLogin,
  editAuthAfterLogout,
  setUserCookie,
  expireUserCookie,
  verifyAuth,
} from "@/libs/auth";
import { createTempSession } from "@/libs/tempSession";
import getLogs from "@/libs/getLogs";
import bcrypt from "bcryptjs";
import verifyRecaptchaToken from "@/libs/verifyRecaptchaToken";

function setRole(id) {
  let role = null;

  switch (id) {
    case 1:
      role = "DEVELOPER";
      break;
    case 2:
      role = "MASTER";
      break;
    case 3:
      role = "ADMIN";
      break;
    case 4:
      role = "SURVEYOR";
      break;
  }
  return role;
}

export async function GET() {
  try {
    const session = await verifyAuth();
    return Response.json(
      { status: "success", message: "Logged In", payload: session },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    let isLoginSuccessful = false;
    const body = await request.json();
    const { username, password } = body;

    const { token } = body;
    if (!token) {
      return Response.json(
        { status: "error", message: "Recaptcha Belum Siap" },
        { status: 400 }
      );
    }
    const captcha = await verifyRecaptchaToken(token, "login");
    if (!captcha.success) {
      getLogs("publik").error(captcha);
      return Response.json(
        { status: "error", message: "Gagal Verifikasi" },
        { status: 404 }
      );
    }

    const entries = await getAuthByUsername(username);

    if (!entries || entries.length === 0) {
      return Response.json(
        { status: "error", message: "Tidak Ditemukan" },
        { status: 404 }
      );
    }

    for (const userEntry of entries) {
      const match = await bcrypt.compare(password, userEntry.password);
      if (match) {
        if (userEntry.mfa_enabled) {
          // Buat temporary token untuk MFA
          const tempToken = createTempSession({
            id: userEntry.id,
            nama: userEntry.nama,
            level: userEntry.level_id,
            role: setRole(userEntry.level_id),
            image: null,
            mfa_secret: userEntry.mfa_secret,
          });

          return Response.json(
            {
              status: "mfa_required",
              message: "MFA Required",
              tempToken,
            },
            { status: 200 }
          );
        } else {
          // MFA tidak aktif → login normal
          const dataForJWT = {
            id: userEntry.id,
            nama: userEntry.nama,
            level: userEntry.level_id,
            role: setRole(userEntry.level_id),
            image: null,
          };
          await editAuthAfterLogin(userEntry.id);
          await setUserCookie(dataForJWT);
          isLoginSuccessful = true;
          break;
        }
      }
    }

    if (isLoginSuccessful) {
      return Response.json(
        { status: "success", message: "Berhasil Login" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { status: "error", message: "Tidak Ditemukan" },
        { status: 404 }
      );
    }
  } catch (error) {
    getLogs("auth").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
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
      { status: 200 }
    );
  } catch (error) {
    getLogs("auth").error(error);
    // success anyway
    return Response.json(
      { status: "success", message: "Forced Logging Out" },
      { status: 200 }
    );
  }
}
