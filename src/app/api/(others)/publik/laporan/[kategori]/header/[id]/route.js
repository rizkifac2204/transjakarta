import getLogs from "@/libs/getLogs";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { getLaporanHeaderDetailById } from "@/libs/laporan";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function GET(_request, { params }) {
  try {
    const { id, kategori } = await params;

    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400, headers: withCorsHeaders() }
      );
    }
    if (!kategori || !LAPORAN_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKategori" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const data = await getLaporanHeaderDetailById(String(kategori), parsedId);

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
