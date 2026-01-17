import { verifyAuth } from "@/libs/jwt";
import { parseJsonBody } from "@/utils/parseJsonBody";
import { createArmada } from "@/libs/armada";
import getLogs from "@/libs/getLogs";

export async function POST(request) {
  try {
    const auth = await verifyAuth();
    const body = await request.json();
    const parsedBody = parseJsonBody(body, {
      integerFields: ["service_type_id", "fleet_type_id"],
      dateFields: ["tanggal", "jam_mulai", "jam_selesai"],
    });

    const {
      service_type_id,
      fleet_type_id,
      tanggal,
      periode,
      jam_mulai,
      jam_selesai,
      no_body,
      kode_trayek,
      asal_tujuan,
    } = parsedBody;

    if (
      !service_type_id ||
      !fleet_type_id ||
      !tanggal ||
      !periode ||
      !jam_mulai ||
      !jam_selesai ||
      !no_body ||
      !kode_trayek ||
      !asal_tujuan
    ) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newData = await createArmada({
      surveyor_id: auth.id,
      service_type_id,
      fleet_type_id,
      tanggal,
      periode,
      jam_mulai,
      jam_selesai,
      no_body,
      kode_trayek,
      asal_tujuan,
    });

    return Response.json(newData, { status: 201 });
  } catch (error) {
    getLogs("armada").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}
