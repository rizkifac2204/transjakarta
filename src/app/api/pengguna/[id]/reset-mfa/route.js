import { verifyAuth } from "@/libs/jwt";
import getLogs from "@/libs/getLogs";
import { getUserById, updateUser } from "@/libs/user";

export async function PATCH(request, { params }) {
  try {
    const auth = await verifyAuth();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    // Cek apakah pemohon dengan ID tersebut ada
    const penggunalama = await getUserById(parsedId);
    if (!penggunalama) {
      return Response.json(
        { message: "Pengguna tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    if (penggunalama.level_id < auth.level) {
      return Response.json(
        { message: "Tidak Bisa Edit Dengan Level Lebih Tinggi" },
        { status: 403 }
      );
    }

    await updateUser(parsedId, {
      mfa_enabled: false,
      mfa_secret: null,
      updated_at: new Date(),
    });

    return Response.json({ message: "Berhasil reset mfa" });
  } catch (error) {
    getLogs("pengguna").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
