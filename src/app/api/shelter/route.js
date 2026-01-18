import { verifyAuth } from "@/libs/jwt";
import { parseJsonBody } from "@/utils/parseJsonBody";
import { createShelterSurvey } from "@/libs/shelter-survey";
import getLogs from "@/libs/getLogs";

export async function POST(request) {
  try {
    const auth = await verifyAuth();
    const body = await request.json();
    const parsedBody = parseJsonBody(body, {
      integerFields: ["shelter_type_id"],
      dateFields: ["tanggal", "jam_mulai", "jam_selesai"],
    });

    const {
      shelter_type_id,
      nama_halte,
      kode_halte,
      tanggal,
      periode,
      jam_mulai,
      jam_selesai,
    } = parsedBody;

    if (
      !shelter_type_id ||
      !nama_halte ||
      !kode_halte ||
      !tanggal ||
      !periode ||
      !jam_mulai ||
      !jam_selesai
    ) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newData = await createShelterSurvey({
      surveyor_id: auth.id,
      shelter_type_id,
      nama_halte,
      kode_halte,
      tanggal,
      periode,
      jam_mulai,
      jam_selesai,
    });

    return Response.json(newData, { status: 201 });
  } catch (error) {
    getLogs("shelter").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}
