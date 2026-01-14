import prisma from "./prisma";
import { getConditionByAuth, getDetailConditionByAuth } from "./condition";

// === GET ===

export async function getPenelitianDynamic({
  where: extraWhere = {},
  orderBy = { created_at: "desc" },
  include,
  select,
} = {}) {
  const baseWhere = await getConditionByAuth();

  const where = {
    ...baseWhere,
    ...extraWhere,
  };

  return prisma.penelitian.findMany({
    where,
    orderBy,
    ...(include && { include }),
    ...(select && { select }),
  });
}

export async function getPenelitianDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  const where = await getDetailConditionByAuth(parsedId);
  if (!where) return null;

  return prisma.penelitian.findFirst({
    where,
    include: {
      admin: true,
      pemohon: true,
      jawaban_penelitian: true,
      testimoni: true,
    },
  });
}

export async function getPenelitianDetailByNoRegis(no_regis, excludeId = null) {
  return prisma.penelitian.findFirst({
    where: {
      no_regis: String(no_regis),
      ...(excludeId && { NOT: { id: Number(excludeId) } }),
    },
  });
}

// === CREATE ===

export async function createPenelitian(data) {
  return prisma.penelitian.create({ data });
}

// === UPDATE ===

export async function updatePenelitian(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.penelitian.update({
    where: { id: parsedId },
    data,
  });
}

// === DELETE ===

export async function deletePenelitian(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.penelitian.delete({
    where: { id: parsedId },
  });
}

// === PROFILE / ADMIN ===

export async function getPenelitianByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return [];

  return prisma.penelitian.findMany({
    select: {
      id: true,
      no_regis: true,
      tiket: true,
    },
    where: {
      admin_id: parsedId,
      deleted_at: null,
    },
  });
}

export async function getPenelitianCountByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return 0;

  return prisma.penelitian.count({
    where: {
      admin_id: parsedId,
      deleted_at: null,
    },
  });
}

export async function getPenelitianCount() {
  const where = await getConditionByAuth();

  return prisma.penelitian.count({ where });
}

// === PUBLIK ====

export async function getPenelitianDetailByTiket(tiket) {
  if (!tiket) return null;

  return prisma.penelitian.findFirst({
    where: { tiket },
  });
}

export async function getPenelitianDetailByTiketAndEmail(tiket, email) {
  if (!tiket) return null;
  if (!email) return null;

  return prisma.penelitian.findFirst({
    where: { tiket, email },
    include: { pemohon: true, jawaban_penelitian: true },
  });
}

// ===== FOOTER MOBILE ========
export async function getPenelitianCountDynamic({ where: extraWhere = {} }) {
  const baseWhere = await getConditionByAuth();

  const where = {
    ...baseWhere,
    ...extraWhere,
  };

  return prisma.penelitian.count({ where });
}
