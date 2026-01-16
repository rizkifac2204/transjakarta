import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { verifyAuth } from "@/libs/jwt";

export async function DELETE(request, { params }) {
  try {
    const token = await verifyAuth(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { armada_survey_id, question_id } = params;

    if (!armada_survey_id || !question_id) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const parsedSurveyId = Number(armada_survey_id);
    const parsedQuestionId = Number(question_id);

    const deletedAnswer = await prisma.armada_survey_answer.delete({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
    });

    return NextResponse.json({
      message: "Answer deleted successfully",
      data: deletedAnswer,
    });
  } catch (error) {
    if (error.code === 'P2025') { // Prisma Client error: Record not found
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }
    console.error("Error deleting answer:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
