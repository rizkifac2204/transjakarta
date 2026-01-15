"use server";
import prisma from "@/libs/prisma";

export async function getQuestionSet(id) {
  try {
    const questionSet = await prisma.armada_question_set.findUnique({
      where: { id: parseInt(id) },
      include: {
        service_types: true,
        fleet_types: true,
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });
    return questionSet;
  } catch (error) {
    console.error("Failed to fetch question set:", error);
    return null;
  }
}
