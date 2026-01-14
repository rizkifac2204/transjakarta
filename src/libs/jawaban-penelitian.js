import prisma from "./prisma";
import { getConditionByAuth } from "./condition";

// === GET ===

export async function getJawabanPenelitian() {
  return prisma.jawaban_penelitian.findMany({
    orderBy: { created_at: "desc" },
  });
}

export async function getJawabanPenelitianByPenelitianId(penelitianId) {
  const parsedId = Number(penelitianId);
  if (!Number.isInteger(parsedId)) return [];

  return prisma.jawaban_penelitian.findMany({
    where: { penelitian_id: parsedId },
    orderBy: { created_at: "desc" },
  });
}

export async function getJawabanPenelitianDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.jawaban_penelitian.findUnique({
    where: { id: parsedId },
    include: { admin: true },
  });
}

// === CREATE ===

export async function createJawabanPenelitian(data) {
  return prisma.jawaban_penelitian.create({ data });
}

// === UPDATE ===

export async function updateJawabanPenelitian(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.jawaban_penelitian.update({
    where: { id: parsedId },
    data,
  });
}

// === DELETE ===

export async function deleteJawabanPenelitian(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.jawaban_penelitian.delete({
    where: { id: parsedId },
  });
}

// === PROFILE / ADMIN ===

export async function getJawabanPenelitianByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return [];

  return prisma.jawaban_penelitian.findMany({
    select: {
      id: true,
      jenis: true,
    },
    where: {
      admin_id: parsedId,
      penelitian: {
        is: {
          admin_id: parsedId,
          deleted_at: null,
        },
      },
    },
  });
}

export async function getJawabanPenelitianCountByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return 0;

  return prisma.jawaban_penelitian.count({
    where: {
      admin_id: parsedId,
      penelitian: {
        is: {
          admin_id: parsedId,
          deleted_at: null,
        },
      },
    },
  });
}

export async function getJawabanPenelitianCount() {
  const where = await getConditionByAuth();
  return prisma.jawaban_penelitian.count({
    where: {
      penelitian: {
        is: { ...where },
      },
    },
  });
}
