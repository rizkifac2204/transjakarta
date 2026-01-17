import { verifyAuth } from "@/libs/jwt";
import getLogs from "@/libs/getLogs";
import prisma from "@/libs/prisma";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { hapusFile } from "@/services/uploadservices";

export async function DELETE(_request, { params }) {
  try {
    const auth = await verifyAuth();
    // belum ada blokir authorisasi

    const { id, question_id } = params;
    if (!id || !question_id) {
      return Response.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const parsedSurveyId = parseInt(id);
    const parsedQuestionId = parseInt(question_id);
    if (isNaN(parsedSurveyId) || isNaN(parsedQuestionId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const answerRecord = await prisma.armada_survey_answer.findUnique({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
    });

    if (!answerRecord) {
      return Response.json(
        { error: "Jawaban tidak ditemukan" },
        { status: 404 },
      );
    }

    const deletedAnswer = await prisma.armada_survey_answer.delete({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
    });

    if (answerRecord?.photo_url)
      await hapusFile(answerRecord?.photo_url, PATH_UPLOAD.armada);

    return Response.json({
      message: "Jawaban survei berhasil dihapus",
      payload: deletedAnswer,
    });
  } catch (error) {
    getLogs("armada").error(error);
    if (error.code === "P2025") {
      // Prisma Client error: Record not found
      return Response.json({ error: "Answer not found" }, { status: 404 });
    }
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}
