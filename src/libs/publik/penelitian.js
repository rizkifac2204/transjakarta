import prisma from "../prisma";
import { verifyAuth } from "../auth-public";

export async function publicGetPenelitian() {
  const auth = await verifyAuth();
  if (!auth || (!auth.id && !auth.email)) return [];

  const where = {
    deleted_at: null,
    OR: [{ pemohon_id: Number(auth.id) }, { email: String(auth.email) }],
  };

  return prisma.penelitian.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      testimoni: true,
      _count: {
        select: { jawaban_penelitian: true },
      },
    },
  });
}
