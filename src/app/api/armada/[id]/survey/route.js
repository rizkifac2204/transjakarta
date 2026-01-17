import { verifyAuth } from "@/libs/jwt";
import prisma from "@/libs/prisma";
import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { hapusFile } from "@/services/uploadservices";

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
      await hapusFile(answerRecord?.photo_url, PATH_UPLOAD.armada);
    }

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
