import { getTempSession, deleteTempSession } from "@/libs/tempSession";
import { verifyMfaToken } from "@/libs/mfa";
import { setUserCookie, editAuthAfterLogin } from "@/libs/auth";
import getLogs from "@/libs/getLogs";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return Response.json({ message: "Token diperlukan" }, { status: 400 });
    }

    const userData = getTempSession(token);

    if (!userData) {
      return Response.json(
        { message: "Token tidak valid atau sudah kadaluarsa" },
        { status: 404 }
      );
    }

    return Response.json({ userData }, { status: 200 });
  } catch (error) {
    getLogs("otp").error(error);
    return Response.json(
      {
        message: "Terjadi kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { otp, tempToken } = await req.json();

    if (!otp || !tempToken) {
      return Response.json(
        { status: "error", message: "Data Tidak Lengkap" },
        { status: 400 }
      );
    }

    const userData = getTempSession(tempToken);
    if (!userData) {
      return Response.json(
        { status: "error", message: "Token kadaluarsa" },
        { status: 400 }
      );
    }

    const valid = verifyMfaToken(userData.mfa_secret, otp);
    if (!valid) {
      return Response.json(
        { status: "error", message: "OTP salah atau kadaluarsa" },
        { status: 400 }
      );
    }

    await editAuthAfterLogin(userData.id);
    await setUserCookie(userData);
    deleteTempSession(tempToken);

    return Response.json({ status: "success", message: "Login berhasil" });
  } catch (error) {
    getLogs("otp").error(error);
    return Response.json(
      {
        message: "Terjadi kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
