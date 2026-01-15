import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

import { verifyAuth } from "@/libs/jwt";
import {
  createArmadaQuestionSet,
  getArmadaQuestionSetById,
  updateArmadaQuestionSet,
  deleteArmadaQuestionSet,
} from "@/libs/armada-question-set";
import getLogs from "@/libs/getLogs";

export async function POST(request, { params }) {
  try {
    const auth = await verifyAuth();
    if (auth.level > 3)
      return Response.json({ message: "Forbidden" }, { status: 403 });

    const { questionSetId } = params;
    const parsedId = parseInt(questionSetId);
    if (!questionSetId || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const { text, category, spm_criteria, spm_reference, order } =
      await request.json();

    console.log({ text, category, spm_criteria, spm_reference, order });
    return Response.json({ error: "KEDAP" }, { status: 400 });

    if (!text || !category || !spm_criteria || !order) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.armada_question.create({
      data: {
        set_id: parsedId,
        text,
        category,
        spm_criteria,
        spm_reference,
        order,
      },
    });

    return Response.json(newQuestion, { status: 201 });
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
