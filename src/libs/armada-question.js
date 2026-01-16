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

export async function getQuestionsBySurvey(service_type_id, fleet_type_id) {
  if (!service_type_id || !fleet_type_id) {
    return [];
  }

  const questionSets = await prisma.armada_question_set.findMany({
    where: {
      OR: [
        // Linked to S, but has NO fleet types linked
        {
          service_types: { some: { id: service_type_id } },
          NOT: { fleet_types: { some: {} } },
        },
        // Linked to F, but has NO service types linked
        {
          fleet_types: { some: { id: fleet_type_id } },
          NOT: { service_types: { some: {} } },
        },
        // Linked to S AND F
        {
          service_types: { some: { id: service_type_id } },
          fleet_types: { some: { id: fleet_type_id } },
        },
      ],
    },
    include: {
      questions: true,
    },
  });

  const allQuestions = questionSets.flatMap((set) => set.questions);
  const uniqueQuestions = Array.from(
    new Map(allQuestions.map((q) => [q.id, q])).values()
  );

  const customOrder = [
    "KEAMANAN",
    "KESELAMATAN",
    "KENYAMANAN",
    "KESETARAAN",
    "KETERATURAN",
  ];
  uniqueQuestions.sort((a, b) => {
    const sectionA = customOrder.indexOf(a.section);
    const sectionB = customOrder.indexOf(b.section);
    if (sectionA !== sectionB) {
      return sectionA - sectionB;
    }
    return a.order.localeCompare(b.order);
  });

  return uniqueQuestions;
}
