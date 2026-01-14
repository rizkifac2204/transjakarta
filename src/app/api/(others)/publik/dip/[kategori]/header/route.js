import getLogs from "@/libs/getLogs";
import { getDipHeader, getDipHeaderPlusData } from "@/libs/dip";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function GET(request, { params }) {
  try {
    const { kategori } = await params;
    if (!kategori || !DIP_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKKategori" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const withData = searchParams.get("data");

    const data = withData
      ? await getDipHeaderPlusData(String(kategori))
      : await getDipHeader(String(kategori));

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
