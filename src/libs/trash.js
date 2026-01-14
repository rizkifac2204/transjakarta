import prisma from "./prisma";
import {
  getTrashConditionByAuth,
  getTrashDetailConditionByAuth,
} from "./condition";

export async function getTrash() {
  const permohonan = await getTrashPermohonan();
  const keberatan = await getTrashKeberatan();
  const penelitian = await getTrashPenelitian();

  const result = [
    ...permohonan.map((item) => ({ ...item, type: "permohonan" })),
    ...keberatan.map((item) => ({ ...item, type: "keberatan" })),
    ...penelitian.map((item) => ({ ...item, type: "penelitian" })),
  ];
  return result;
}

export async function getTrashPermohonan() {
  const where = await getTrashConditionByAuth();

  return await prisma.permohonan.findMany({
    where,
    orderBy: {
      deleted_at: "desc",
    },
    include: {
      admin: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });
}

export async function getTrashKeberatan() {
  const where = await getTrashConditionByAuth();

  return await prisma.keberatan.findMany({
    where,
    orderBy: {
      deleted_at: "desc",
    },
    include: {
      admin: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });
}

export async function getTrashPenelitian() {
  const where = await getTrashConditionByAuth();

  return await prisma.penelitian.findMany({
    where,
    orderBy: {
      deleted_at: "desc",
    },
    include: {
      admin: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });
}

export async function getTrashPermohonanDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  const where = await getTrashDetailConditionByAuth(parsedId);

  return await prisma.permohonan.findFirst({ where, include: { admin: true } });
}

export async function getTrashKeberatanDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  const where = await getTrashDetailConditionByAuth(parsedId);

  return await prisma.keberatan.findFirst({
    where,
    include: { admin: true },
  });
}

export async function getTrashPenelitianDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  const where = await getTrashDetailConditionByAuth(parsedId);

  return await prisma.penelitian.findFirst({
    where,
    include: { admin: true },
  });
}
