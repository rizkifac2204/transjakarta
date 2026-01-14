import prisma from "./prisma";

// HEADER ===============================================================
export async function getUIHeader() {
  return await prisma.ukpbj_informasi_header.findMany({
    orderBy: { label: "asc" },
  });
}

export async function getUIHeaderPlusData() {
  return await prisma.ukpbj_informasi_header.findMany({
    orderBy: {
      label: "asc",
    },
    include: {
      ukpbj_informasi_header_sub: true,
    },
  });
}

export async function getUIHeaderDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_informasi_header.findUnique({
    where: { id: parsedId },
    include: {
      ukpbj_informasi_header_sub: true,
    },
  });
}

// HEADER SUB ===========================================================
export async function getUISub() {
  return await prisma.ukpbj_informasi_header_sub.findMany({
    orderBy: { label: "asc" },
    include: { ukpbj_informasi_header_sub_sub: true },
  });
}

export async function getUISubPlusData() {
  return await prisma.ukpbj_informasi_header_sub.findMany({
    orderBy: {
      label: "asc",
    },
    include: { ukpbj_informasi_header_sub_sub: true },
  });
}

export async function getUISubByHeaderId(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_informasi_header_sub.findMany({
    where: { header_id: parsedId },
    orderBy: { label: "asc" },
    include: { ukpbj_informasi_header_sub_sub: true },
  });
}

export async function getUISubDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_informasi_header_sub.findUnique({
    where: { id: parsedId },
    include: {
      ukpbj_informasi_header: true, // include parent
      ukpbj_informasi_header_sub_sub: true, // include children
    },
  });
}

// HEADER SUB SUB =======================================================
export async function getUISubSub() {
  return await prisma.ukpbj_informasi_header_sub_sub.findMany({
    orderBy: { label: "asc" },
    include: { ukpbj_informasi: true },
  });
}

export async function getUISubSubPlusData() {
  return await prisma.ukpbj_informasi_header_sub_sub.findMany({
    orderBy: {
      label: "asc",
    },
    include: { ukpbj_informasi: true },
  });
}

export async function getUISubSubByHeaderId(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_informasi_header_sub_sub.findMany({
    where: { header_sub_id: parsedId },
    orderBy: {
      label: "asc",
    },
    include: { ukpbj_informasi: true },
  });
}

export async function getUISubSubDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_informasi_header_sub_sub.findUnique({
    where: { id: parsedId },
    include: { ukpbj_informasi_header_sub: true, ukpbj_informasi: true },
  });
}

// MIX HEADER =====================================================================
export async function createUIHeaderDynamic(table, data) {
  const allowedTables = [
    "ukpbj_informasi_header",
    "ukpbj_informasi_header_sub",
    "ukpbj_informasi_header_sub_sub",
  ];

  if (!allowedTables.includes(table)) return null;

  // Validasi foreign key
  if (table === "ukpbj_informasi_header_sub" && !data.header_id) return null;

  if (table === "ukpbj_informasi_header_sub_sub" && !data.header_sub_id)
    return null;

  return await prisma[table].create({ data });
}

export async function updateUIHeaderDynamic(table, id, data) {
  const allowedTables = [
    "ukpbj_informasi_header",
    "ukpbj_informasi_header_sub",
    "ukpbj_informasi_header_sub_sub",
  ];
  if (!allowedTables.includes(table)) return null;

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma[table].update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteUIHeaderDynamic(table, id) {
  const allowedTables = [
    "ukpbj_informasi_header",
    "ukpbj_informasi_header_sub",
    "ukpbj_informasi_header_sub_sub",
  ];
  if (!allowedTables.includes(table)) return null;

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma[table].delete({
    where: { id: parsedId },
  });
}
// MIX HEADER =====================================================================

// INFORMASI =============================================================
export async function getUI() {
  return await prisma.ukpbj_informasi.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: { ukpbj_informasi_header_sub_sub: true },
  });
}

export async function getUIDetailById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_informasi.findUnique({
    where: { id: parsedId },
    include: { ukpbj_informasi_header_sub_sub: true },
  });
}

export async function getUIPagination({ page = 1, limit = 10, search = "" }) {
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
    prisma.ukpbj_informasi.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: { created_at: "desc" },
      include: { ukpbj_informasi_header_sub_sub: true },
    }),
    prisma.ukpbj_informasi.count({
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

export async function createUI(data) {
  return await prisma.ukpbj_informasi.create({ data: data });
}

export async function updateUI(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_informasi.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteUI(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.ukpbj_informasi.delete({
    where: { id: parsedId },
  });
}

export async function getUIAllFromHeader() {
  const alldata = await prisma.ukpbj_informasi_header.findMany({
    include: {
      ukpbj_informasi_header_sub: {
        include: {
          ukpbj_informasi_header_sub_sub: {
            include: {
              ukpbj_informasi: true,
            },
          },
        },
      },
    },
  });
  return alldata;
}
