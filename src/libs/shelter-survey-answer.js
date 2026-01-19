import prisma from "./prisma";

export async function getAllShelterSurveyAnswer() {
  return prisma.shelter_survey_answer.findMany();
}

export async function getAllShelterSurveyAnswerBySurveyId(surveyId) {
  const parsedSurveyId = Number(surveyId);
  if (!Number.isInteger(parsedSurveyId)) return null;

  return prisma.shelter_survey_answer.findMany({
    where: { shelter_survey_id: parsedSurveyId },
    include: { question: true },
  });
}

export async function getShelterSurveyAnswerById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_survey_answer.findUnique({
    where: { id: parsedId },
    include: { shelter_survey: true, question: true },
  });
}

export async function createShelterSurveyAnswer(data) {
  return prisma.shelter_survey_answer.create({ data });
}

export async function upsertShelterSurveyAnswer(
  shelter_survey_id,
  question_id,
  data,
) {
  return prisma.shelter_survey_answer.upsert({
    where: {
      shelter_survey_id_question_id: {
        shelter_survey_id,
        question_id,
      },
    },
    update: data,
    create: {
      shelter_survey_id,
      question_id,
      ...data,
    },
  });
}

export async function updateShelterSurveyAnswer(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_survey_answer.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteShelterSurveyAnswer(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_survey_answer.delete({
    where: { id: parsedId },
  });
}
