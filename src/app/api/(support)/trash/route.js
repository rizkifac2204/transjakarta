import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getTrash } from "@/libs/trash";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getTrash();
    return Response.json(data);
  } catch (error) {
    getLogs("trash").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
