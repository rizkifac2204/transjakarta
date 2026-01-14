import prisma from "./prisma";
import { getConditionByAuth } from "./condition";

// === GET ===

export async function getJawaban() {
  return prisma.jawaban.findMany({
    orderBy: { created_at: "desc" },
  });
}

export async function getJawabanByPermohonanId(permohonanId) {
  const parsedId = Number(permohonanId);
  if (!Number.isInteger(parsedId)) return [];

  return prisma.jawaban.findMany({
    where: { permohonan_id: parsedId },
    orderBy: { created_at: "desc" },
  });
}

export async function getJawabanDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.jawaban.findUnique({
    where: { id: parsedId },
    include: { admin: true },
  });
}

// === CREATE ===

export async function createJawaban(data) {
  return prisma.jawaban.create({ data });
}

// === UPDATE ===

export async function updateJawaban(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.jawaban.update({
    where: { id: parsedId },
    data,
  });
}

// === DELETE ===

export async function deleteJawaban(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.jawaban.delete({
    where: { id: parsedId },
  });
}

// === PROFILE / ADMIN ===

export async function getJawabanByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return [];

  return prisma.jawaban.findMany({
    select: {
      id: true,
      jenis: true,
    },
    where: {
      admin_id: parsedId,
      permohonan: {
        is: {
          admin_id: parsedId,
          deleted_at: null,
        },
      },
    },
  });
}

export async function getJawabanCountByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return 0;

  return prisma.jawaban.count({
    where: {
      admin_id: parsedId,
      permohonan: {
        is: {
          admin_id: parsedId,
          deleted_at: null,
        },
      },
    },
  });
}

export async function getJawabanCount() {
  const where = await getConditionByAuth();
  return prisma.jawaban.count({
    where: {
      permohonan: {
        is: { ...where },
      },
    },
  });
}
