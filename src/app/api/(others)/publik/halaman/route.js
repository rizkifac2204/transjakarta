import getLogs from "@/libs/getLogs";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";
import { getHalamanBySlug } from "@/libs/halaman";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors(); // untuk preflight
}

export async function GET(request) {
  // ✅ gunakan checkAndroidApiKey disini
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ message: "Slug Tidak Valid" }), {
        status: 404,
        headers: withCorsHeaders(),
      });
    }

    const data = await getHalamanBySlug(slug);

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
