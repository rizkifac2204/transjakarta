import prisma from "../prisma";

export async function getPeraturanCount() {
  return prisma.peraturan.count();
}

export async function getDipCount() {
  return prisma.dip.count();
}

export async function getLaporanCount() {
  return prisma.laporan.count();
}

export async function getUkpbjRegulasiCount() {
  return prisma.ukpbj_regulasi.count();
}

export async function getUkpbjInformasiCount() {
  return prisma.ukpbj_informasi.count();
}
