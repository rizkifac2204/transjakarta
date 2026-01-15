import prisma from "./prisma";

export async function getAllArmadaQuestion() {
  return prisma.armada_question.findMany({
    include: { question_set: true },
  });
}

export async function getAllArmadaQuestionBySetId(setId) {
  const parsedSetId = Number(setId);
  if (!Number.isInteger(parsedSetId)) return null;

  return prisma.armada_question.findMany({
    where: { set_id: parsedSetId },
    include: { question_set: true },
  });
}

export async function getArmadaQuestionById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_question.findUnique({
    where: { id: parsedId },
    include: { question_set: true },
  });
}

export async function createArmadaQuestion(data) {
  return prisma.armada_question.create({ data });
}

export async function updateArmadaQuestion(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_question.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteArmadaQuestion(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_question.delete({
    where: { id: parsedId },
  });
}
