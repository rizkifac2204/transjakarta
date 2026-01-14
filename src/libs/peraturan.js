import prisma from "./prisma";

export async function getPeraturanHeader() {
  return await prisma.peraturan_header.findMany({
    orderBy: { label: "asc" },
  });
}

export async function getPeraturanHeaderPlusData() {
  return await prisma.peraturan_header.findMany({
    orderBy: {
      label: "asc",
    },
    include: {
      peraturan: true,
    },
  });
}

export async function getPeraturanHeaderDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.peraturan_header.findUnique({
    where: { id: parsedId },
    include: {
      peraturan: true,
    },
  });
}

export async function createPeraturanHeader(data) {
  return await prisma.peraturan_header.create({ data: data });
}

export async function updatePeraturanHeader(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.peraturan_header.update({
    where: { id: parsedId },
    data,
  });
}

export async function deletePeraturanHeader(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.peraturan_header.delete({
    where: { id: parsedId },
  });
}

export async function getPeraturan() {
  return await prisma.peraturan.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: { peraturan_header: true },
  });
}

export async function getPeraturanPagination({
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
    prisma.peraturan.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: { created_at: "desc" },
      include: { peraturan_header: true },
    }),
    prisma.peraturan.count({
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

export async function getPeraturanDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.peraturan.findUnique({
    where: { id: parsedId },
    include: { peraturan_header: true },
  });
}

export async function createPeraturan(data) {
  return await prisma.peraturan.create({ data: data });
}

export async function updatePeraturan(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.peraturan.update({
    where: { id: parsedId },
    data,
  });
}

export async function deletePeraturan(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.peraturan.delete({
    where: { id: parsedId },
  });
}
