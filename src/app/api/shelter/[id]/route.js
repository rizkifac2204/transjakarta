import { verifyAuth } from "@/libs/jwt";
import { parseJsonBody } from "@/utils/parseJsonBody";
import {
  getShelterSurveyById,
  updateShelterSurvey,
  deleteShelterSurvey,
} from "@/libs/shelter-survey";
import getLogs from "@/libs/getLogs";

export async function PATCH(request, { params }) {
  try {
    const auth = await verifyAuth();

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

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

    const survey = await getShelterSurveyById(parsedId);
    if (!survey) {
      return Response.json({ message: "Data not found" }, { status: 404 });
    }
    if (auth.level >= 4 && survey.surveyor_id !== auth.id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await updateShelterSurvey(parsedId, {
      shelter_type_id,
      nama_halte,
      kode_halte,
      tanggal,
      periode,
      jam_mulai,
      jam_selesai,
    });

    return Response.json(updated);
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

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth();

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const survey = await getShelterSurveyById(parsedId);
    if (!survey) {
      return Response.json({ message: "Data not found" }, { status: 404 });
    }
    if (auth.level >= 4 && survey.surveyor_id !== auth.id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const deleted = await deleteShelterSurvey(parsedId);

    return Response.json({
      message: "Berhasil menghapus data",
      payload: deleted,
    });
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
