import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getTestimoni } from "@/libs/testimoni";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getTestimoni();
    return Response.json(data);
  } catch (error) {
    getLogs("testimoni").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
