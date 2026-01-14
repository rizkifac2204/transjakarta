import prisma from "./prisma";

export async function getAllUser() {
  return prisma.user.findMany({
    where: {
      NOT: { id: 1 },
    },
    orderBy: [{ level_id: "asc" }, { nama: "asc" }],
    include: { level: true },
  });
}

export async function getUserById(id) {
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId === 1) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    include: { level: true },
  });
}

export async function getUserDetailByEmail(email, excludeId = null) {
  return prisma.user.findFirst({
    where: {
      email: String(email),
      ...(excludeId && { NOT: { id: Number(excludeId) } }),
    },
  });
}

export async function createUser(data) {
  return prisma.user.create({ data });
}

export async function updateUser(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.user.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteUser(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId === 1) return null;

  return prisma.user.delete({
    where: { id: parsedId },
  });
}

// DASHBOARD

export async function getUserCount() {
  return prisma.user.count({
    where: { NOT: { id: 1 } },
  });
}
