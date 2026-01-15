import prisma from "./prisma";

export async function getAllArmadaQuestionSet() {
  return prisma.armada_question_set.findMany({
    include: {
      service_types: true,
      fleet_types: true,
      _count: {
        select: { questions: true },
      },
    },
  });
}

export async function getArmadaQuestionSetById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_question_set.findUnique({
    where: { id: parsedId },
    include: {
      service_types: true,
      fleet_types: true,
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function createArmadaQuestionSet(data) {
  return prisma.armada_question_set.create({ data });
}

export async function updateArmadaQuestionSet(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_question_set.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteArmadaQuestionSet(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_question_set.delete({
    where: { id: parsedId },
  });
}
