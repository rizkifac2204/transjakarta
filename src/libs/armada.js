import prisma from "./prisma";

export async function getAllArmada() {
  return prisma.armada_survey.findMany({
    include: {
      service_type: true,
      fleet_type: true,
      surveyor: { select: { nama: true } },
    },
  });
}

export async function getArmadaById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_survey.findUnique({
    where: { id: parsedId },
    include: {
      service_type: true,
      fleet_type: true,
      surveyor: true,
      answers: true,
    },
  });
}

export async function createArmada(data) {
  return prisma.armada_survey.create({ data });
}

export async function updateArmada(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_survey.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteArmada(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.armada_survey.delete({
    where: { id: parsedId },
  });
}
