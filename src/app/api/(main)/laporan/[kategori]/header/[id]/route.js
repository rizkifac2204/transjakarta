import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import {
  getLaporanHeaderDetailById,
  updateLaporanHeader,
  deleteLaporanHeader,
} from "@/libs/laporan";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id, kategori } = await params;

    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    if (!kategori || !LAPORAN_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKategori" },
        { status: 400 }
      );
    }

    const data = await getLaporanHeaderDetailById(String(kategori), parsedId);
    return Response.json(data);
  } catch (error) {
    getLogs("laporan").error(error);
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

    const { id, kategori } = await params;

    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    if (!kategori || !LAPORAN_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKategori" },
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

    const curLaporanHeader = await getLaporanHeaderDetailById(
      String(kategori),
      parsedId
    );
    if (!curLaporanHeader) {
      return Response.json(
        { message: "Header Laporan tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    // Siapkan objek update
    const updateData = { label };
    const updated = await updateLaporanHeader(parsedId, updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("laporan").error(error);
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

    const { id, kategori } = await params;

    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    if (!kategori || !LAPORAN_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKategori" },
        { status: 400 }
      );
    }
    const curLaporanHeader = await getLaporanHeaderDetailById(
      String(kategori),
      parsedId
    );
    if (!curLaporanHeader) {
      return Response.json(
        { message: "Header Laporan tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const deleted = await deleteLaporanHeader(parsedId);

    return Response.json({
      message: "Berhasil menghapus data",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("laporan").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
