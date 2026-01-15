import { verifyAuth } from "@/libs/jwt";
import {
  getArmadaQuestionSetById,
  updateArmadaQuestionSet,
  deleteArmadaQuestionSet,
} from "@/libs/armada-question-set";
import getLogs from "@/libs/getLogs";

export async function GET(_request, { params }) {
  try {
    const { questionSetId } = params;
    const parsedId = parseInt(questionSetId);
    if (!questionSetId || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const questionSet = await getArmadaQuestionSetById(parsedId);

    if (!questionSet) {
      return Response.json(
        { error: "Question Set not found" },
        { status: 404 }
      );
    }

    return Response.json(questionSet);
  } catch (error) {
    getLogs("armada").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth();
    if (auth.level > 3)
      return Response.json({ message: "Forbidden" }, { status: 403 });

    const { questionSetId } = params;
    const parsedId = parseInt(questionSetId);
    if (!questionSetId || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const { description, service_types, fleet_types } = await request.json();

    console.log({ description, service_types, fleet_types });
    return Response.json({ error: "KEDAP" }, { status: 400 });

    if (!description || !service_types || !fleet_types) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedQuestionSet = await updateArmadaQuestionSet(parsedId, {
      data: {
        description,
        service_types: {
          set: service_types.map((id) => ({ id })),
        },
        fleet_types: {
          set: fleet_types.map((id) => ({ id })),
        },
      },
    });

    return Response.json(updatedQuestionSet);
  } catch (error) {
    getLogs("armada").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth();
    if (auth.level > 3)
      return Response.json({ message: "Forbidden" }, { status: 403 });

    const { questionSetId } = params;
    const parsedId = parseInt(questionSetId);
    if (!questionSetId || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const deleted = await deleteArmadaQuestionSet(parsedId);

    return Response.json({
      message: "Berhasil menghapus data",
      payload: deleted,
    });
  } catch (error) {
    getLogs("armada").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
