import prisma from "./prisma";

export async function getAllShelterQuestion() {
  return prisma.shelter_question.findMany({
    include: { shelter_type: true },
    orderBy: [{ section: "asc" }, { spm_reference: "asc" }, { order: "asc" }],
  });
}

export async function getShelterQuestionById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_question.findUnique({
    where: { id: parsedId },
    include: { shelter_type: true },
  });
}

export async function createShelterQuestion(data) {
  return prisma.shelter_question.create({ data });
}

export async function updateShelterQuestion(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_question.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteShelterQuestion(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.shelter_question.delete({
    where: { id: parsedId },
  });
}

export async function getQuestionsByShelterType(shelter_type_id) {
  if (!shelter_type_id) {
    return [];
  }

  const questions = await prisma.shelter_question.findMany({
    where: {
      OR: [
        {
          shelter_type_id: shelter_type_id,
        },
        {
          shelter_type_id: null,
        },
      ],
    },
    include: {
      shelter_type: true,
    },
  });

  const customOrder = [
    "KEAMANAN",
    "KESELAMATAN",
    "KENYAMANAN",
    "KETERJANGKAUAN",
    "KESETARAAN",
    "KETERATURAN",
  ];

  questions.sort((a, b) => {
    const sectionA = customOrder.indexOf(a.section);
    const sectionB = customOrder.indexOf(b.section);
    if (sectionA !== sectionB) {
      return sectionA - sectionB;
    }
    // Fallback to order if sections are the same
    if (a.order && b.order) {
      return a.order.localeCompare(b.order);
    }
    return 0;
  });

  return questions;
}
