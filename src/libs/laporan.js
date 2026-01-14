import prisma from "./prisma";

export async function getLaporanHeader(kategori) {
  if (!kategori) return [];
  return await prisma.laporan_header.findMany({
    where: { kategori: kategori },
    orderBy: {
      label: "asc",
    },
  });
}

export async function getLaporanHeaderPlusData(kategori) {
  if (!kategori) return [];
  return await prisma.laporan_header.findMany({
    where: { kategori: kategori },
    orderBy: {
      label: "asc",
    },
    include: {
      laporan: true,
    },
  });
}

export async function getLaporanHeaderDetailById(kategori, id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;
  if (!kategori) return null;

  return await prisma.laporan_header.findFirst({
    where: { id: parsedId, kategori: kategori },
    include: {
      laporan: true,
    },
  });
}

export async function createLaporanHeader(data) {
  return await prisma.laporan_header.create({ data: data });
}

export async function updateLaporanHeader(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.laporan_header.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteLaporanHeader(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.laporan_header.delete({
    where: { id: parsedId },
  });
}

export async function getLaporan(kategori) {
  if (!kategori) return [];
  return await prisma.laporan.findMany({
    where: { kategori: kategori },
    include: { laporan_header: true },
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getLaporanPagination({
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
    prisma.laporan.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: { created_at: "desc" },
      include: { laporan_header: true },
    }),
    prisma.laporan.count({
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

export async function getLaporanDetailById(kategori, id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;
  if (!kategori) return null;

  return await prisma.laporan.findFirst({
    where: { id: parsedId, kategori: kategori },
    include: { laporan_header: true },
  });
}

export async function createLaporan(data) {
  return await prisma.laporan.create({ data: data });
}

export async function updateLaporan(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.laporan.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteLaporan(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.laporan.delete({
    where: { id: parsedId },
  });
}

export async function countLaporanGroupedByKategori() {
  return await prisma.laporan.groupBy({
    by: ["kategori"],
    _count: {
      _all: true,
    },
    orderBy: {
      kategori: "asc",
    },
  });
}
