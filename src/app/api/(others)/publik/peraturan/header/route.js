import getLogs from "@/libs/getLogs";
import {
  getPeraturanHeader,
  getPeraturanHeaderPlusData,
} from "@/libs/peraturan";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function GET(request) {
  // ✅ gunakan checkAndroidApiKey disini
  try {
    const searchParams = request.nextUrl.searchParams;
    const withData = searchParams.get("data");

    const data = withData
      ? await getPeraturanHeaderPlusData()
      : await getPeraturanHeader();

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
