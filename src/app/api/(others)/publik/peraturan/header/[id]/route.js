import getLogs from "@/libs/getLogs";
import { getPeraturanHeaderDetailById } from "@/libs/peraturan";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return new Response(JSON.stringify({ message: "ID tidak valid" }), {
        status: 400,
        headers: withCorsHeaders(),
      });
    }

    const data = await getPeraturanHeaderDetailById(parsedId);
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
      { status: 500, headers: withCorsHeaders() }
    );
  }
}
