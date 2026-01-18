import { verifyAuth } from "@/libs/jwt";
import { upsertShelterSurveyAnswer } from "@/libs/shelter-survey-answer";
import { getQuestionsByShelterType } from "@/libs/shelter-question";
import {
  getShelterSurveyById,
  updateShelterSurvey,
} from "@/libs/shelter-survey";
import getLogs from "@/libs/getLogs";
import prisma from "@/libs/prisma";

export async function POST(request, { params }) {
  try {
    const auth = await verifyAuth();

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const survey = await getShelterSurveyById(parsedId);
    if (!survey) {
      return Response.json({ message: "Survey not found" }, { status: 404 });
    }

    if (auth.level >= 4 && survey.surveyor_id !== auth.id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { question_id, answer, note } = body;

    if (!question_id || answer === null || typeof answer === "undefined") {
      return Response.json(
        { message: "Missing required fields: question_id, answer" },
        { status: 400 },
      );
    }

    // reset finish flag when a new answer is submitted
    if (survey.finish) {
      await updateShelterSurvey(parsedId, { finish: false });
    }

    const newAnswer = await upsertShelterSurveyAnswer(
      parsedId,
      parseInt(question_id),
      { answer: Boolean(answer), note },
    );

    return Response.json(newAnswer, { status: 201 });
  } catch (error) {
    getLogs("shelter-answer").error(error);
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
    const auth = await verifyAuth();

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const survey = await prisma.shelter_survey.findUnique({
      where: { id: parsedId },
      include: {
        answers: true,
      },
    });

    if (!survey) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
    if (auth.level >= 4 && auth.id !== survey.surveyor_id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const questions = await getQuestionsByShelterType(survey.shelter_type_id);

    const totalQuestions = questions.length;
    const totalAnswers = survey.answers.length;

    if (totalAnswers < totalQuestions) {
      return Response.json(
        { message: "Harap jawab semua pertanyaan sebelum menyelesaikan." },
        { status: 400 },
      );
    }

    for (const answer of survey.answers) {
      if (!answer.answer && !answer.note && !answer.photo_url) {
        const question = questions.find((q) => q.id === answer.question_id);
        return Response.json(
          {
            message: `Pertanyaan "${question.basic}" harus memiliki catatan atau foto jika jawaban "Tidak".`,
          },
          { status: 400 },
        );
      }
    }

    const finishedSurvey = await updateShelterSurvey(parsedId, {
      finish: true,
    });

    return Response.json({
      message: "Berhasil menyelesaikan survey",
      payload: finishedSurvey,
    });
  } catch (error) {
    getLogs("shelter-answer").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}

// belum ada delete
