import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import {
  getHalamanById,
  updateHalamanById,
  deleteHalamanById,
} from "@/libs/halaman";
import { revalidatePath } from "next/cache";
import { sanitizeHTML } from "@/utils/sanitizeHTML";

export const dynamic = "force-dynamic";

export async function GET(_, { params }) {
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

    const data = await getHalamanById(parsedId);
    if (!data) {
      return Response.json(
        { message: "Tidak Ditemukan", error: "Not Found" },
        { status: 404 }
      );
    }

    return Response.json(data);
  } catch (error) {
    getLogs("halaman").error(error);
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
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getHalamanById(parsedId);
    if (!data) {
      return Response.json(
        { message: "Tidak Ditemukan", error: "Not Found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { slug, judul, isi } = body;

    if (!slug || !isi || !judul) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const safeIsi = sanitizeHTML(isi);

    const updated = await updateHalamanById(parsedId, {
      judul: judul ? judul : null,
      isi: safeIsi,
      slug,
    });

    revalidatePath(`/${slug}`);
    return Response.json(
      {
        message: "Berhasil Mengubah Data",
        data: updated,
      },
      { status: 201 }
    );
  } catch (error) {
    getLogs("halaman").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(_, { params }) {
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

    const data = await getHalamanById(parsedId);
    if (!data) {
      return Response.json(
        { message: "Tidak Ditemukan", error: "Not Found" },
        { status: 404 }
      );
    }

    const deleted = await deleteHalamanById(parsedId);

    revalidatePath(`/${data.slug}`);
    return Response.json({
      message: "Berhasil Hapus",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("halaman").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
