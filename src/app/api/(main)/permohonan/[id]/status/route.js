import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getPermohonanDetailById, updatePermohonan } from "@/libs/permohonan";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    await getSession();

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Cek validasi input minimal, bisa disesuaikan
    if (!status) {
      return Response.json(
        { message: "Harus Pilih Status", error: "Required" },
        { status: 400 }
      );
    }

    // Ambil data permohonan lama untuk cek file pendukung lama & email lama
    const dataLama = await getPermohonanDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Permohonan tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    // Siapkan objek update permohonan
    const updateData = {
      status,
      updated_at: new Date(),
    };

    const updated = await updatePermohonan(parseInt(id), updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("permohonan").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
