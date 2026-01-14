import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import {
  getKeberatanDetailById,
  getKeberatanDetailByNoRegis,
  updateKeberatan,
} from "@/libs/keberatan";

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
    const { no_regis } = body;

    if (!no_regis) {
      return Response.json(
        { message: "Tidak Boleh Kosong", error: "Required" },
        { status: 400 }
      );
    }

    const dataLama = await getKeberatanDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    // cek jika nomor regis sama dengan data lain
    if (dataLama.no_regis !== no_regis) {
      const isRegisExist = await getKeberatanDetailByNoRegis(
        no_regis,
        parseInt(id)
      );
      if (isRegisExist) {
        return Response.json(
          {
            message: "Nomor Registrasi Sudah Digunakan. Mohon Ganti",
            error: "RegisExist",
          },
          { status: 400 }
        );
      }
    }

    const updateData = {
      no_regis,
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
