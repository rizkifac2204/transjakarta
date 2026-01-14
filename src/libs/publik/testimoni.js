import prisma from "../prisma";
import { verifyAuth } from "../auth-public";

export async function publicGetTestimoni() {
  const auth = await verifyAuth();
  if (!auth || (!auth.id && !auth.email)) return [];

  const where = { email: String(auth.email) };
  const items = await prisma.testimoni.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      permohonan: true,
      penelitian: true,
    },
  });

  const result = items.map((item) => {
    const isPermohonan = !!item.permohonan;
    return {
      ...item,
      jenis: isPermohonan ? "permohonan" : "penelitian",
      foreignKey: isPermohonan
        ? item.permohonan.id
        : (item.penelitian?.id ?? null),
    };
  });

  return result;
}
