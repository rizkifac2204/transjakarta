import { verifyAuth } from "@/libs/jwt";
import getLogs from "@/libs/getLogs";
import prisma from "@/libs/prisma";
import { hapusFile } from "@/services/uploadservices";
import { resetFinishShelter } from "../route";
import { pathShelter } from "./upload/route";

export async function DELETE(_request, { params }) {
  try {
    const auth = await verifyAuth();
    const { id, question_id } = params;
    if (!id || !question_id) {
      return Response.json(
        { message: "Missing required parameters" },
        { status: 400 },
      );
    }

    const parsedSurveyId = parseInt(id);
    const parsedQuestionId = parseInt(question_id);
    if (isNaN(parsedSurveyId) || isNaN(parsedQuestionId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    // authorize surveyor atau admin
    const shelter = await prisma.shelter_survey.findUnique({
      where: { id: parsedSurveyId },
    });
    if (!shelter) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
    if (auth.role > 3 && auth.id !== shelter.surveyor_id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    // get path dynamic
    const path = pathShelter(shelter);

    const answerRecord = await prisma.shelter_survey_answer.findUnique({
      where: {
        shelter_survey_id_question_id: {
          shelter_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
    });

    if (!answerRecord) {
      return Response.json(
        { message: "Jawaban tidak ditemukan" },
        { status: 404 },
      );
    }

    const deletedAnswer = await prisma.shelter_survey_answer.delete({
      where: {
        shelter_survey_id_question_id: {
          shelter_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
    });

    if (answerRecord?.photo_url) await hapusFile(answerRecord?.photo_url, path);

    resetFinishShelter(parsedSurveyId);

    return Response.json({
      message: "Jawaban survei berhasil dihapus",
      payload: deletedAnswer,
    });
  } catch (error) {
    getLogs("shelter").error(error);
    if (error.code === "P2025") {
      // Prisma Client error: Record not found
      return Response.json({ message: "Answer not found" }, { status: 404 });
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
