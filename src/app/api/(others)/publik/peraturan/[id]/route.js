import getLogs from "@/libs/getLogs";
import { getPeraturanDetailById } from "@/libs/peraturan";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors(); // untuk preflight
}

export async function GET(_request, { params }) {
  // checkAndroidApiKey
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return new Response(JSON.stringify({ message: "Id Tidak Valid" }), {
        status: 400,
        headers: withCorsHeaders(),
      });
    }

    const data = await getPeraturanDetailById(parsedId);

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
