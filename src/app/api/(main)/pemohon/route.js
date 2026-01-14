import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getPemohon } from "@/libs/pemohon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getPemohon();
    return Response.json(data);
  } catch (error) {
    getLogs("pemohon").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

// TIDAK ADA POST KARENA DATA BERASAL DARI USER ATAU FORM ADD PERMOHONAN
