import getLogs from "@/libs/getLogs";
import { getPeraturan, getPeraturanPagination } from "@/libs/peraturan";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors(); // untuk preflight
}

export async function GET(request) {
  // ✅ gunakan checkAndroidApiKey disini
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("q");

    const data =
      page || limit || search
        ? await getPeraturanPagination({ page, limit, search })
        : await getPeraturan();

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
