import { verifyAuth } from "@/libs/jwt";
import { parseJsonBody } from "@/utils/parseJsonBody";
import {
  getShelterQuestionById,
  updateShelterQuestion,
  deleteShelterQuestion,
} from "@/libs/shelter-question";
import getLogs from "@/libs/getLogs";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const question = await getShelterQuestionById(parsedId);
    if (!question) {
      return Response.json({ message: "Data not found" }, { status: 404 });
    }

    return Response.json(question);
  } catch (error) {
    getLogs("shelter-question").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await verifyAuth();
    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const question = await getShelterQuestionById(parsedId);
    if (!question) {
      return Response.json({ message: "Data not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsedBody = parseJsonBody(body, {
      integerFields: ["shelter_type_id"],
    });

    const updated = await updateShelterQuestion(parsedId, parsedBody);

    return Response.json(updated);
  } catch (error) {
    getLogs("shelter-question").error(error);
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
    await verifyAuth();
    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const question = await getShelterQuestionById(parsedId);
    if (!question) {
      return Response.json({ message: "Data not found" }, { status: 404 });
    }

    const deleted = await deleteShelterQuestion(parsedId);

    return Response.json({
      message: "Berhasil menghapus data",
      payload: deleted,
    });
  } catch (error) {
    getLogs("shelter-question").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}
