import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import {
  getUISubSubDetailById,
  updateUIHeaderDynamic,
  deleteUIHeaderDynamic,
} from "@/libs/ukpbj-informasi-withsub";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getUISubSubDetailById(parsedId);
    return Response.json(data);
  } catch (error) {
    getLogs("ukpbj").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await getSession();

    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { label } = body;

    if (!label) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const curData = await getUISubSubDetailById(parsedId);
    if (!curData) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    // Siapkan objek update
    const updateData = { label: label };
    const updated = await updateUIHeaderDynamic(
      "ukpbj_informasi_header_sub_sub",
      parsedId,
      updateData
    );

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("ukpbj").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await getSession();

    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    // Ambil data lama untuk cek file pendukung lama & email lama
    const curData = await getUISubSubDetailById(parsedId);
    if (!curData) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const deleted = await deleteUIHeaderDynamic(
      "ukpbj_informasi_header_sub_sub",
      parsedId
    );

    return Response.json({
      message: "Berhasil menghapus data",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("ukpbj").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
