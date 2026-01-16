import prisma from "./prisma";

export async function getAllArmadaAnswer() {
  return prisma.armada_survey_answer.findMany();
}

export async function getAllArmadaAnswerByArmadaId(armadaId) {
  const parsedArmadaId = Number(armadaId);
  if (!Number.isInteger(parsedArmadaId)) return null;

  return prisma.armada_survey_answer.findMany({
    where: { armada_survey_id: parsedArmadaId },
    include: { question_set: true },
  });
}

export async function getArmadaAnswerById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_survey_answer.findUnique({
    where: { id: parsedId },
    include: { armada_survey: true, question: true },
  });
}

export async function createArmadaAnswer(data) {
  return prisma.armada_survey_answer.create({ data });
}

export async function updateArmadaAnswer(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_survey_answer.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteArmadaAnswer(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_survey_answer.delete({
    where: { id: parsedId },
  });
}
