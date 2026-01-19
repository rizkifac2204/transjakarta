import { verifyAuth } from "@/libs/jwt";
import prisma from "@/libs/prisma";
import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import { hapusFile } from "@/services/uploadservices";
import { getQuestionsByShelterType } from "@/libs/shelter-question";
import { getShelterSurveyById } from "@/libs/shelter-survey";
import { pathShelter } from "./[question_id]/upload/route";

export async function resetFinishShelter(id) {
  await prisma.shelter_survey.update({
    where: { id: id },
    data: {
      finish: false,
    },
  });
}

export async function POST(request, { params }) {
  try {
    const auth = await verifyAuth();

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const shelter = await getShelterSurveyById(parsedId);
    if (!shelter) {
      return Response.json({ message: "Survey not found" }, { status: 404 });
    }

    if (auth.level >= 4 && shelter.surveyor_id !== auth.id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    // get path dynamic
    const path = pathShelter(shelter);

    const body = await request.json();
    const parsedBody = parseJsonBody(body, {
      integerFields: ["question_id"],
      booleanFields: ["answer"],
    });

    const { question_id, answer, note } = parsedBody;

    if (!question_id || answer === null || typeof answer === "undefined") {
      return Response.json(
        { message: "Missing required fields: question_id, answer" },
        { status: 400 },
      );
    }

    const answerRecord = await prisma.shelter_survey_answer.findUnique({
      where: {
        shelter_survey_id_question_id: {
          shelter_survey_id: parsedId,
          question_id: question_id,
        },
      },
    });

    const data = {
      shelter_survey_id: parsedId,
      question_id,
      answer,
      note: answer ? null : note,
      photo_url: answer ? null : answerRecord?.photo_url || null,
    };

    // tambah atau edit jawaban survei
    const surveyAnswer = await prisma.shelter_survey_answer.upsert({
      where: {
        shelter_survey_id_question_id: {
          shelter_survey_id: data.shelter_survey_id,
          question_id: data.question_id,
        },
      },
      update: {
        answer: data.answer,
        note: data.note,
        photo_url: data.photo_url,
      },
      create: data,
    });

    if (answerRecord?.photo_url && answer) {
      await hapusFile(answerRecord?.photo_url, path);
    }

    resetFinishShelter(parsedId);

    return Response.json({
      message: "Berhasil menyimpan jawaban survei",
      payload: surveyAnswer,
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

export async function PATCH(request, { params }) {
  try {
    const auth = await verifyAuth();
    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const shelter = await prisma.shelter_survey.findUnique({
      where: { id: parsedId },
      include: {
        answers: true,
      },
    });

    if (!shelter) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
    if (auth.level >= 4 && auth.id !== shelter.surveyor_id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const questions = await getQuestionsByShelterType(shelter.shelter_type_id);

    const totalQuestions = questions.length;
    const totalAnswers = shelter.answers.length;

    if (totalAnswers < totalQuestions) {
      return Response.json(
        { message: "Harap jawab semua pertanyaan sebelum menyelesaikan." },
        { status: 400 },
      );
    }

    for (const answer of shelter.answers) {
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

    const finishedSurvey = await prisma.shelter_survey.update({
      where: { id: parsedId },
      data: {
        finish: true,
      },
    });

    return Response.json({
      message: "Berhasil menyelesaikan survey",
      payload: finishedSurvey,
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
