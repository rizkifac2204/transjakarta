import { verifyAuth } from "@/libs/jwt";
import prisma from "@/libs/prisma";
import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";

export async function POST(request, { params }) {
  try {
    const auth = await verifyAuth();
    // belum ada blokir authorisasi

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
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
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // DISINI SEPERTINYA TAMBAHAKN HAPUS FOTO DAN NULL NOTE JIKA JAWABAN TRUE

    const data = {
      armada_survey_id: parsedId,
      question_id,
      answer,
      note: answer ? null : note,
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
      },
      create: data,
    });

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
      { status: error.status || 500 }
    );
  }
}
