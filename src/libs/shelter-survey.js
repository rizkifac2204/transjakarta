import prisma from "./prisma";

export async function getAllShelterSurvey({ where: extraWhere = {} } = {}) {
  return prisma.shelter_survey.findMany({
    where: extraWhere,
    include: {
      shelter_type: true,
      surveyor: { select: { nama: true } },
    },
  });
}

export async function getShelterSurveyById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_survey.findUnique({
    where: { id: parsedId },
    include: {
      shelter_type: true,
      surveyor: true,
      answers: true,
    },
  });
}

export async function createShelterSurvey(data) {
  return prisma.shelter_survey.create({ data });
}

export async function updateShelterSurvey(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_survey.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteShelterSurvey(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_survey.delete({
    where: { id: parsedId },
  });
}
