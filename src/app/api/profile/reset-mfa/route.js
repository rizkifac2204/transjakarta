import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { updateProfile } from "@/libs/profile";

export async function PATCH(request) {
  try {
    const session = await getSession();

    const updated = await updateProfile(session.id, {
      mfa_enabled: false,
      mfa_secret: null,
      updated_at: new Date(),
    });

    return Response.json({
      message: "Berhasil Reset",
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
