import prisma from "./prisma";

export async function getTestimoni(
  inslide = null,
  permohonan_id = null,
  penelitian_id = null
) {
  const data = await prisma.testimoni.findMany({
    where: {
      ...(inslide && { inslide: inslide }),
      ...(permohonan_id && { permohonan_id: Number(permohonan_id) }),
      ...(penelitian_id && { penelitian_id: Number(penelitian_id) }),
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const enriched = await Promise.all(
    data.map(async (item) => {
      const pemohon = await prisma.pemohon.findUnique({
        where: {
          email: item.email,
        },
        select: {
          nama: true,
          pekerjaan: true,
          foto: true,
        },
      });

      return {
        ...item,
        pemohon: pemohon || null,
      };
    })
  );

  return enriched;
}

export async function getTestimoniByPermohonanId(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.testimoni.findMany({
    where: { permohonan_id: parsedId },
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getTestimoniByTiket(tiket) {
  return await prisma.testimoni.findMany({
    where: { tiket: String(tiket) },
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function checkTestimoniExists(tiket, email) {
  return await prisma.testimoni.findFirst({
    where: {
      tiket: String(tiket),
      email: String(email),
    },
  });
}

export async function getTestimoniDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.testimoni.findFirst({
    where: { id: parsedId },
  });
}

export async function createTestimoni(data) {
  return await prisma.testimoni.create({ data: data });
}

export async function updateTestimoniByTiketAndEmail(tiket, email, data) {
  if (!tiket || !email) return null;
  return await prisma.testimoni.updateMany({
    where: { tiket, email },
    data,
  });
}

export async function updateTestimoni(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.testimoni.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteTestimoni(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.testimoni.delete({
    where: { id: parsedId },
  });
}

export async function countTestimoni() {
  return await prisma.testimoni.count();
}

export async function countTestimoniByTiket(tiket) {
  return await prisma.testimoni.count({
    where: { tiket: String(tiket) },
  });
}
