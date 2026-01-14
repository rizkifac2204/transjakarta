import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getOrCreateMfaSecret, verifyMfaToken } from "@/libs/mfa";
import { updateProfile } from "@/libs/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    const secret = await getOrCreateMfaSecret(session, namesecret);

    return Response.json(secret);
  } catch (error) {
    getLogs("mfa").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    const { token } = await request.json();

    if (!/^\d{6}$/.test(token)) {
      return Response.json(
        { message: "Kode OTP tidak valid" },
        { status: 400 }
      );
    }

    if (!session?.mfa_secret) {
      return Response.json(
        { message: "MFA belum di-setup, silakan scan QR Code dulu" },
        { status: 400 }
      );
    }

    const isValid = verifyMfaToken(session.mfa_secret, token);

    if (!isValid) {
      return Response.json(
        { message: "Kode OTP salah atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    await updateProfile(parseInt(session.id), { mfa_enabled: true });

    return Response.json({ message: "MFA berhasil diaktifkan" });
  } catch (error) {
    getLogs("mfa").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
