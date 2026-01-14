import prisma from "./prisma";
import { getConditionByAuth, getDetailConditionByAuth } from "./condition";

// === GET ===

export async function getKeberatanDynamic({
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

  return prisma.keberatan.findMany({
    where,
    orderBy,
    ...(include && { include }),
    ...(select && { select }),
  });
}

export async function getKeberatanDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  const where = await getDetailConditionByAuth(parsedId);
  if (!where) return null;

  return prisma.keberatan.findFirst({
    where,
    include: {
      admin: true,
      pemohon: true,
    },
  });
}

export async function getKeberatanDetailByNoRegis(no_regis, excludeId = null) {
  return prisma.keberatan.findFirst({
    where: {
      no_regis: String(no_regis),
      ...(excludeId && { NOT: { id: Number(excludeId) } }),
    },
  });
}

// === CREATE ===

export async function createKeberatan(data) {
  return prisma.keberatan.create({ data });
}

// === UPDATE ===

export async function updateKeberatan(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.keberatan.update({
    where: { id: parsedId },
    data,
  });
}

// === DELETE ===

export async function deleteKeberatan(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.keberatan.delete({
    where: { id: parsedId },
  });
}

// === PROFILE / ADMIN ===

export async function getKeberatanByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return [];

  return prisma.keberatan.findMany({
    select: {
      id: true,
      no_regis: true,
    },
    where: {
      admin_id: parsedId,
      deleted_at: null,
    },
  });
}

export async function getKeberatanCountByAdmin(adminId) {
  const parsedId = Number(adminId);
  if (!Number.isInteger(parsedId)) return 0;

  return prisma.keberatan.count({
    where: {
      admin_id: parsedId,
      deleted_at: null,
    },
  });
}

export async function getKeberatanCount() {
  const where = await getConditionByAuth();

  return prisma.keberatan.count({ where });
}
