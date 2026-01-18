import { verifyAuth } from "@/libs/jwt";
import prisma from "@/libs/prisma";
import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import { hapusFile } from "@/services/uploadservices";
import { getQuestionsBySurvey } from "@/libs/armada-question";
import { pathArmada } from "./[question_id]/upload/route";

export async function resetFinishArmada(id) {
  await prisma.armada_survey.update({
    where: { id: id },
    data: {
      finish: false,
    },
  });
}

export async function POST(request, { params }) {
  try {
    const auth = await verifyAuth();
    // belum ada blokir authorisasi

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    // authorize surveyor atau admin
    const armada = await prisma.armada_survey.findUnique({
      where: { id: parsedId },
    });
    if (!armada) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
    if (auth.role > 3 && auth.id !== armada.surveyor_id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    // get path dynamic
    const path = pathArmada(armada);

    const body = await request.json();
    const parsedBody = parseJsonBody(body, {
      integerFields: ["question_id"],
      booleanFields: ["answer"],
    });

    const { question_id, answer, note } = parsedBody;

    // Answer can be false, so we check for undefined/null instead of just `!answer`
    if (!question_id || answer === null || answer === undefined) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const answerRecord = await prisma.armada_survey_answer.findUnique({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: parsedId,
          question_id: question_id,
        },
      },
    });

    const data = {
      armada_survey_id: parsedId,
      question_id,
      answer,
      note: answer ? null : note,
      photo_url: answer ? null : answerRecord?.photo_url || null,
    };

    // tambah atau edit jawaban survei
    const surveyAnswer = await prisma.armada_survey_answer.upsert({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: data.armada_survey_id,
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

    resetFinishArmada(parsedId);

    return Response.json({
      message: "Berhasil menyimpan jawaban survei",
      payload: surveyAnswer,
    });
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

export async function PATCH(request, { params }) {
  try {
    const auth = await verifyAuth();
    // belum ada blokir authorisasi

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    // authorize surveyor atau admin
    const armada = await prisma.armada_survey.findUnique({
      where: { id: parsedId },
      include: {
        answers: true,
        service_type: true,
        fleet_type: true,
      },
    });

    if (!armada) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
    if (auth.role > 3 && auth.id !== armada.surveyor_id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    // Use the shared function to get questions, ensuring consistency with the UI
    const uniqueQuestions = await getQuestionsBySurvey(
      armada.service_type_id,
      armada.fleet_type_id,
    );

    const totalQuestions = uniqueQuestions.length;
    const totalAnswers = armada.answers.length;

    if (totalAnswers < totalQuestions) {
      return Response.json(
        { message: "Harap jawab semua pertanyaan sebelum menyelesaikan." },
        { status: 400 },
      );
    }

    for (const answer of armada.answers) {
      if (!answer.answer && !answer.note && !answer.photo_url) {
        const question = uniqueQuestions.find(
          (q) => q.id === answer.question_id,
        );
        return Response.json(
          {
            message: `Pertanyaan "${question.basic}" harus memiliki catatan atau foto jika jawaban "Tidak".`,
          },
          { status: 400 },
        );
      }
    }

    const finishedSurvey = await prisma.armada_survey.update({
      where: { id: parsedId },
      data: {
        finish: true,
        // jam_selesai: new Date(),
      },
    });

    return Response.json({
      message: "Berhasil menyelesaikan survey",
      payload: finishedSurvey,
    });
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
