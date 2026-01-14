import prisma from "../prisma";
import { getConditionByAuth } from "../condition";

export async function getPermohonanTerbaru() {
  const where = await getConditionByAuth();

  const data = await prisma.permohonan.findMany({
    where,
    take: 5,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      created_at: true,
      status: true,
      pemohon: {
        select: {
          nama: true,
        },
      },
    },
  });

  return data.map((item) => ({
    id: item.id,
    nama: item.pemohon?.nama || "Tidak diketahui",
    tanggal: item.created_at,
    status: item.status || "Belum ada",
  }));
}
