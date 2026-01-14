import prisma from "./prisma";
import { getConditionByAuth, getDetailConditionByAuth } from "./condition";

// === GET ===

export async function getPermohonanDynamic({
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

  return prisma.permohonan.findMany({
    where,
    orderBy,
    ...(include && { include }),
    ...(select && { select }),
  });
}

export async function getPermohonanDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  const where = await getDetailConditionByAuth(parsedId);
  if (!where) return null;

  return prisma.permohonan.findFirst({
    where,
    include: {
      admin: true,
      pemohon: true,
      jawaban: true,
      testimoni: true,
    },
  });
}

export async function getPermohonanDetailByNoRegis(no_regis, excludeId = null) {
  return prisma.permohonan.findFirst({
    where: {
      no_regis: String(no_regis),
      ...(excludeId && { NOT: { id: Number(excludeId) } }),
    },
  });
}

// === CREATE ===

export async function createPermohonan(data) {
  return prisma.permohonan.create({ data });
}

// === UPDATE ===

export async function updatePermohonan(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.permohonan.update({
    where: { id: parsedId },
    data,
  });
}

// === DELETE ===

export async function deletePermohonan(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.permohonan.delete({
    where: { id: parsedId },
  });
}

// === PROFILE / ADMIN ===

export async function getPermohonanByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return [];

  return prisma.permohonan.findMany({
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

export async function getPermohonanCountByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return 0;

  return prisma.permohonan.count({
    where: {
      admin_id: parsedId,
      deleted_at: null,
    },
  });
}

export async function getPermohonanCount() {
  const where = await getConditionByAuth();

  return prisma.permohonan.count({ where });
}

// === PUBLIK ====

export async function getPermohonanDetailByTiket(tiket) {
  if (!tiket) return null;

  return prisma.permohonan.findFirst({
    where: { tiket },
  });
}

export async function getPermohonanDetailByTiketAndEmail(tiket, email) {
  if (!tiket) return null;
  if (!email) return null;

  return prisma.permohonan.findFirst({
    where: { tiket, email },
    include: { pemohon: true, jawaban: true },
  });
}

// ===== FOOTER MOBILE ========
export async function getPermohonanCountDynamic({ where: extraWhere = {} }) {
  const baseWhere = await getConditionByAuth();

  const where = {
    ...baseWhere,
    ...extraWhere,
  };

  return prisma.permohonan.count({ where });
}
