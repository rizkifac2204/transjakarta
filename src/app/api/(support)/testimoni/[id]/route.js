import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import {
  getTestimoniDetailById,
  updateTestimoni,
  deleteTestimoni,
} from "@/libs/testimoni";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getTestimoniDetailById(parseInt(id));
    return Response.json(data);
  } catch (error) {
    getLogs("testimoni").error(error);
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
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = parseJsonBody(body, { booleanFields: ["inslide"] });

    const { inslide } = parsed;

    const dataLama = await getTestimoniDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const updated = await updateTestimoni(parseInt(id), { inslide });

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("testimoni").error(error);
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

    const id = params.id;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const dataLama = await getTestimoniDetailById(parsedId);
    if (!dataLama) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const deleted = await deleteTestimoni(parsedId);

    return Response.json({
      message: "Berhasil Hapus Data",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("testimoni").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
