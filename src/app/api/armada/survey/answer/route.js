import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { verifyAuth } from "@/libs/jwt";

export async function POST(request) {
  try {
    const token = await verifyAuth(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { armada_survey_id, question_id, answer, note, photo_url } = body;

    // Answer can be false, so we check for undefined/null instead of just `!answer`
    if (!armada_survey_id || !question_id || answer === null || answer === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: armada_survey_id, question_id, answer" },
        { status: 400 }
      );
    }

    const data = {
      armada_survey_id: Number(armada_survey_id),
      question_id: Number(question_id),
      answer: Boolean(answer),
      note: note || null,
      photo_url: photo_url || null,
    };

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

    return NextResponse.json({
      message: "Answer saved successfully",
      data: surveyAnswer,
    });
  } catch (error) {
    console.error("Error saving answer:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
