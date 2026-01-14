import prisma from "./prisma";

export async function getAllUser() {
  return prisma.users.findMany({
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

  return prisma.users.findUnique({
    where: { id: userId },
    include: { level: true },
  });
}

export async function getUserDetailByEmail(email, excludeId = null) {
  return prisma.users.findFirst({
    where: {
      email: String(email),
      ...(excludeId && { NOT: { id: Number(excludeId) } }),
    },
  });
}

export async function createUser(data) {
  return prisma.users.create({ data });
}

export async function updateUser(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.users.update({
    where: { id: parsedId },
    data,
  });
}

export async function deleteUser(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId === 1) return null;

  return prisma.users.delete({
    where: { id: parsedId },
  });
}

// DASHBOARD

export async function getUserCount() {
  return prisma.users.count({
    where: { NOT: { id: 1 } },
  });
}
