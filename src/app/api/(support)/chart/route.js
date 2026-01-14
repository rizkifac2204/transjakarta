import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { chartConfig } from "@/configs/chartConfig";
import { parseISO, startOfDay, addDays } from "date-fns";
import { getFilteredInfografisData } from "@/libs/infografis";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await getSession();
    const { searchParams } = new URL(request.url);

    const table = searchParams.get("table") || "permohonan";
    const config = chartConfig[table];
    if (!config) {
      return Response.json(
        { message: "Tidak Ditemukan Source Data", error: "InvalidTable" },
        { status: 400 }
      );
    }
    const date = searchParams.get("date");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const dateFilter = (() => {
      try {
        if (date) {
          const d = parseISO(date);
          return {
            gte: startOfDay(d).toISOString(),
            lt: addDays(startOfDay(d), 1).toISOString(),
          };
        }

        if (start && end) {
          const endDate = startOfDay(parseISO(end));
          return {
            gte: startOfDay(parseISO(start)).toISOString(),
            lt: addDays(endDate, 1).toISOString(),
          };
        }

        return undefined;
      } catch {
        return undefined;
      }
    })();

    const data = await getFilteredInfografisData(table, config, dateFilter);

    return Response.json(data);
  } catch (error) {
    getLogs("chart").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
