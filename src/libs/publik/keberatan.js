import prisma from "../prisma";
import { verifyAuth } from "../auth-public";

export async function publicGetKeberatan() {
  const auth = await verifyAuth();
  if (!auth || (!auth.id && !auth.email)) return [];

  const where = {
    deleted_at: null,
    OR: [{ pemohon_id: Number(auth.id) }, { email: String(auth.email) }],
  };

  return prisma.keberatan.findMany({
    where,
    orderBy: { created_at: "desc" },
  });
}

export async function publicGetKeberatananDetailById(id) {
  const auth = await verifyAuth();

  const detail = await prisma.keberatan.findFirst({
    where: {
      id: Number(id),
      deleted_at: null,
      OR: [{ pemohon_id: Number(auth.id) }, { email: String(auth.email) }],
    },
    include: {
      pemohon: {
        select: {
          id: true,
          nama: true,
          email: true,
        },
      },
    },
  });

  return detail;
}
