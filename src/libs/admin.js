import prisma from "./prisma";
import { getPermohonanCountByAdmin, getPermohonanCount } from "./permohonan";
import { getKeberatanCountByAdmin, getKeberatanCount } from "./keberatan";
import { getPenelitianCountByAdmin, getPenelitianCount } from "./penelitian";

// Ambil semua admin kecuali ID 1, termasuk jumlah data terkait
export async function getAdmin() {
  const admins = await getAdminOnly();

  return await Promise.all(
    admins.map(async (admin) => {
      const adminId = Number(admin.id);
      const isMaster = admin.level_id < 3;

      const [permohonan, keberatan, penelitian] = await Promise.all([
        isMaster
          ? getPermohonanCount()
          : getPermohonanCountByAdmin(Number(adminId)),
        isMaster
          ? getKeberatanCount()
          : getKeberatanCountByAdmin(Number(adminId)),
        isMaster
          ? getPenelitianCount()
          : getPenelitianCountByAdmin(Number(adminId)),
      ]);

      return {
        ...admin,
        _count: { permohonan, keberatan, penelitian },
      };
    })
  );
}

// Ambil admin saja tanpa jumlah
export async function getAdminOnly() {
  return prisma.admin.findMany({
    where: {
      NOT: { id: 1 },
    },
    orderBy: [{ level_id: "asc" }, { nama: "asc" }],
    include: { level: true },
  });
}

// Ambil detail admin lengkap dengan jumlah data terkait
export async function getAdminDetailById(id) {
  const adminId = Number(id);
  if (!Number.isInteger(adminId) || adminId === 1) return null;

  const admin = await getAdminDetailByIdOnly(adminId);
  if (!admin) return null;

  const [permohonan, keberatan, penelitian] = await Promise.all([
    getPermohonanCountByAdmin(adminId),
    getKeberatanCountByAdmin(adminId),
    getPenelitianCountByAdmin(adminId),
  ]);

  return {
    ...admin,
    _count: { permohonan, keberatan, penelitian },
  };
}

// Ambil detail admin berdasarkan ID tanpa hitungan
export async function getAdminDetailByIdOnly(id) {
  const adminId = Number(id);
  if (!Number.isInteger(adminId) || adminId === 1) return null;

  return prisma.admin.findUnique({
    where: { id: adminId },
    include: { level: true },
  });
}

// Cek admin berdasarkan email, dan abaikan jika ID cocok (untuk validasi unik)
export async function getAdminDetailByEmail(email, excludeId = null) {
  return prisma.admin.findFirst({
    where: {
      email: String(email),
      ...(excludeId && { NOT: { id: Number(excludeId) } }),
    },
  });
}

// Buat admin baru
export async function createAdmin(data) {
  return prisma.admin.create({ data });
}

// Perbarui admin
export async function updateAdmin(id, data) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return prisma.admin.update({
    where: { id: parsedId },
    data,
  });
}

// Hapus admin
export async function deleteAdmin(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId === 1) return null;

  return prisma.admin.delete({
    where: { id: parsedId },
  });
}

// DASHBOARD

export async function getAdminCount() {
  return prisma.admin.count({
    where: { NOT: { id: 1 } },
  });
}
