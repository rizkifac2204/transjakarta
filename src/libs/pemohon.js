import prisma from "./prisma";

export async function getPemohon() {
  return await prisma.pemohon.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: {
      _count: {
        select: {
          permohonan: true,
          keberatan: true,
        },
      },
    },
  });
}

export async function getPemohonDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.pemohon.findUnique({
    where: { id: parsedId },
    include: {
      permohonan: {
        select: {
          id: true,
          tiket: true,
        },
      },
      keberatan: {
        select: {
          id: true,
          tanggal: true,
        },
      },
      penelitian: {
        select: {
          id: true,
          tiket: true,
        },
      },
    },
  });
}

export async function getPemohonDetailByEmail(email) {
  return await prisma.pemohon.findUnique({
    where: { email: email },
  });
}

export async function createPemohon(data) {
  const inserted = await prisma.pemohon.create({ data: data });
  return inserted;
}

export async function updatePemohon(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.pemohon.update({
    where: { id: parsedId },
    data,
  });
}

export async function deletePemohon(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.pemohon.delete({
    where: { id: parsedId },
  });
}
