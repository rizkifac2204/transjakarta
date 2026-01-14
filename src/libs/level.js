import prisma from "./prisma";

export async function getLevel() {
  return await prisma.level.findMany({
    orderBy: {
      id: "asc",
    },
  });
}
