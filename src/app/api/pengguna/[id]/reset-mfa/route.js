import { verifyAuth } from "@/libs/auth";
import { canManage } from "@/utils/manage";
import getLogs from "@/libs/getLogs";
import { getAdminDetailById, updateAdmin } from "@/libs/user";

export async function PATCH(request, { params }) {
  try {
    const auth = await verifyAuth();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    // Cek apakah pemohon dengan ID tersebut ada
    const penggunalama = await getAdminDetailById(parsedId);
    if (!penggunalama) {
      return Response.json(
        { message: "Pengguna tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const isManage = canManage(penggunalama.level_id, auth.level);
    if (!isManage) {
      return Response.json(
        {
          message: "Tidak Bisa Edit Dengan Level Lebih Tinggi",
          error: "Access",
        },
        { status: 400 }
      );
    }

    const updated = await updateAdmin(parsedId, {
      mfa_enabled: false,
      mfa_secret: null,
      updated_at: new Date(),
    });

    return Response.json({ message: "Berhasil reset mfa" });
  } catch (error) {
    console.log(error);
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
