import prisma from "./prisma";

export async function getDipHeader(kategori) {
  if (!kategori) return [];
  return await prisma.dip_header.findMany({
    where: { kategori: kategori },
    orderBy: {
      label: "asc",
    },
  });
}

export async function getDipHeaderPlusData(kategori) {
  if (!kategori) return [];
  return await prisma.dip_header.findMany({
    where: { kategori: kategori },
    orderBy: {
      label: "asc",
    },
    include: {
      dip: true,
    },
  });
}

export async function getDipHeaderDetailById(kategori, id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;
  if (!kategori) return null;

  return await prisma.dip_header.findFirst({
    where: { id: parsedId, kategori: kategori },
    include: {
      dip: true,
    },
  });
}

export async function createDipHeader(data) {
  return await prisma.dip_header.create({ data: data });
}

export async function updateDipHeader(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.dip_header.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteDipHeader(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.dip_header.delete({
    where: { id: parsedId },
  });
}

export async function getDip(kategori) {
  if (!kategori) return [];
  return await prisma.dip.findMany({
    where: { kategori: kategori },
    include: { dip_header: true },
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getDipPagination({
  kategori,
  page = 1,
  limit = 10,
  search = "",
}) {
  kategori = kategori ?? "";
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
    prisma.dip.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: { created_at: "desc" },
      include: { dip_header: true },
    }),
    prisma.dip.count({
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

export async function getDipDetailById(kategori, id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;
  if (!kategori) return null;

  return await prisma.dip.findFirst({
    where: { id: parsedId, kategori: kategori },
    include: { dip_header: true },
  });
}

export async function createDip(data) {
  return await prisma.dip.create({ data: data });
}

export async function updateDip(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.dip.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteDip(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.dip.delete({
    where: { id: parsedId },
  });
}

export async function countDipGroupedByKategori() {
  return await prisma.dip.groupBy({
    by: ["kategori"],
    _count: {
      _all: true,
    },
    orderBy: {
      kategori: "asc",
    },
  });
}
