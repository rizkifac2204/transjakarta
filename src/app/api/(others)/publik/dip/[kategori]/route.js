import getLogs from "@/libs/getLogs";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { getDip, getDipPagination } from "@/libs/dip";
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
        { message: "Kategori tidak valid", error: "InvalidKategori" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("q");

    const data =
      page || limit || search
        ? await getDipPagination({ kategori, page, limit, search })
        : await getDip(String(kategori));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: withCorsHeaders(),
    });
  } catch (error) {
    getLogs("publik").error(error);
    return new Response(
      JSON.stringify({
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      }),
      {
        status: 500,
        headers: withCorsHeaders(),
      }
    );
  }
}
