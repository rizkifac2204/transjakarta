import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getKeberatanDetailById, updateKeberatan } from "@/libs/keberatan";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session?.level_id > 2) {
      return Response.json(
        { message: "Akses Terbatas", error: "InvalidAccess" },
        { status: 400 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { penanggungjawabId } = body;

    // Cek validasi input minimal, bisa disesuaikan
    if (!penanggungjawabId) {
      return Response.json(
        { message: "Tidak Boleh Kosong", error: "Required" },
        { status: 400 }
      );
    }

    // Ambil data keberatan lama untuk cek file pendukung lama & email lama
    const dataLama = await getKeberatanDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Keberatan tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    // Siapkan objek update keberatan
    const updateData = {
      admin_id: parseInt(penanggungjawabId),
      updated_at: new Date(),
    };

    const updated = await updateKeberatan(parseInt(id), updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("keberatan").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
