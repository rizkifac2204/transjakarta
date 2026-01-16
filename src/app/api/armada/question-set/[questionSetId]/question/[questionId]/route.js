import { verifyAuth } from "@/libs/jwt";
import { getArmadaQuestionSetById } from "@/libs/armada-question-set";
import {
  getArmadaQuestionById,
  updateArmadaQuestion,
  deleteArmadaQuestion,
} from "@/libs/armada-question";
import getLogs from "@/libs/getLogs";

export async function GET(_request, { params }) {
  try {
    const { questionSetId, questionId } = params;
    const parsedId = parseInt(questionSetId);
    const parsedQuestionId = parseInt(questionId);
    if (
      !questionSetId ||
      isNaN(parsedId) ||
      !questionId ||
      isNaN(parsedQuestionId)
    ) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const questionSet = await getArmadaQuestionSetById(parsedId);
    if (!questionSet) {
      return Response.json(
        { error: "Question Set not found" },
        { status: 404 }
      );
    }

    const question = await getArmadaQuestionById(parsedQuestionId);
    if (!question) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    return Response.json(question);
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

    const { questionSetId, questionId } = params;
    const parsedId = parseInt(questionSetId);
    const parsedQuestionId = parseInt(questionId);
    if (
      !questionSetId ||
      isNaN(parsedId) ||
      !questionId ||
      isNaN(parsedQuestionId)
    ) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const { section, basic, indicator, spm_criteria, order } =
      await request.json();

    if (!section || !basic || !indicator || !spm_criteria || !order) {
      return Response.json({ error: "Lengkapi Data" }, { status: 400 });
    }

    const updatedQuestion = await updateArmadaQuestion(parsedQuestionId, {
      data: {
        section,
        basic,
        indicator,
        spm_criteria,
        order,
      },
    });

    return Response.json(updatedQuestion);
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

    const { questionSetId, questionId } = params;
    const parsedId = parseInt(questionSetId);
    const parsedQuestionId = parseInt(questionId);
    if (
      !questionSetId ||
      isNaN(parsedId) ||
      !questionId ||
      isNaN(parsedQuestionId)
    ) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const deleted = await deleteArmadaQuestion(parsedQuestionId);

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
