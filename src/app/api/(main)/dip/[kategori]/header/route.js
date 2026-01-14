import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getDipHeader, createDipHeader } from "@/libs/dip";
import { DIP_KATEGORI } from "@/configs/appConfig";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();

    const { kategori } = await params;
    if (!kategori || !DIP_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKKategori" },
        { status: 400 }
      );
    }

    const data = await getDipHeader(String(kategori));
    return Response.json(data);
  } catch (error) {
    getLogs("dip").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await getSession();

    const { kategori } = await params;
    if (!kategori || !DIP_KATEGORI.includes(kategori)) {
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

    const inserted = await createDipHeader({
      kategori,
      label,
    });

    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    getLogs("dip").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
