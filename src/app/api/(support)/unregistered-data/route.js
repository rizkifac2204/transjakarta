import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getPermohonanCountDynamic } from "@/libs/permohonan";
import { getPenelitianCountDynamic } from "@/libs/penelitian";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    let data;
    const permohonan = await getPermohonanCountDynamic({
      where: { no_regis: null },
    });
    const penelitian = await getPenelitianCountDynamic({
      where: { no_regis: null },
    });

    data = { countPermohonan: permohonan, countPenelitian: penelitian };

    return Response.json(data);
  } catch (error) {
    getLogs("support").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
