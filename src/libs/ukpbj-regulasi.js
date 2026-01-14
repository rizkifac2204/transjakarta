import prisma from "./prisma";

export async function getUkpbjRegulasiHeader() {
  return await prisma.ukpbj_regulasi_header.findMany({
    orderBy: { label: "asc" },
  });
}

export async function getUkpbjRegulasiHeaderPlusData() {
  return await prisma.ukpbj_regulasi_header.findMany({
    orderBy: {
      label: "asc",
    },
    include: {
      ukpbj_regulasi: true,
    },
  });
}

export async function getUkpbjRegulasiHeaderDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_regulasi_header.findUnique({
    where: { id: parsedId },
    include: {
      ukpbj_regulasi: true,
    },
  });
}

export async function createUkpbjRegulasiHeader(data) {
  return await prisma.ukpbj_regulasi_header.create({ data: data });
}

export async function updateUkpbjRegulasiHeader(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_regulasi_header.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteUkpbjRegulasiHeader(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_regulasi_header.delete({
    where: { id: parsedId },
  });
}

export async function getUkpbjRegulasi() {
  return await prisma.ukpbj_regulasi.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: { ukpbj_regulasi_header: true },
  });
}

export async function getUkpbjRegulasiPagination({
  page = 1,
  limit = 10,
  search = "",
}) {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  search = search ?? "";

  const skip = (page - 1) * limit;
  const whereClause = search
    ? {
        label: {
          contains: search,
        },
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.ukpbj_regulasi.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: { created_at: "desc" },
      include: { ukpbj_regulasi_header: true },
    }),
    prisma.ukpbj_regulasi.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    data,
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPreviousPage ? page - 1 : null,
  };
}

export async function getUkpbjRegulasiDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_regulasi.findUnique({
    where: { id: parsedId },
    include: { ukpbj_regulasi_header: true },
  });
}

export async function createUkpbjRegulasi(data) {
  return await prisma.ukpbj_regulasi.create({ data: data });
}

export async function updateUkpbjRegulasi(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_regulasi.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteUkpbjRegulasi(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_regulasi.delete({
    where: { id: parsedId },
  });
}
