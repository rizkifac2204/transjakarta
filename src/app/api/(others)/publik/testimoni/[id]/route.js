import getLogs from "@/libs/getLogs";
import { getSession } from "@/libs/auth-public";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";
import { getTestimoniDetailById, deleteTestimoni } from "@/libs/testimoni";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    const data = await getTestimoniDetailById(parseInt(id));
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: withCorsHeaders(),
    });
  } catch (error) {
    getLogs("publik").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500, headers: withCorsHeaders() }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getSession();

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const dataLama = await getTestimoniDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404, headers: withCorsHeaders() }
      );
    }
    console.log({ dataLama, session });

    if (dataLama.email !== session?.email) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404, headers: withCorsHeaders() }
      );
    }

    const prosess = await deleteTestimoni(parseInt(id));

    return Response.json(
      {
        message: "Berhasil Hapus",
        deleted: prosess,
      },
      { status: 201, headers: withCorsHeaders() }
    );
  } catch (error) {
    getLogs("publik").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500, headers: withCorsHeaders() }
    );
  }
}
