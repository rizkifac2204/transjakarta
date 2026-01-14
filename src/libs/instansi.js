import prisma from "./prisma";

export async function getInstansi() {
  const data = await prisma.instansi.findFirst();
  if (!data) return {};
  return data;
}

export async function createInstansi(data) {
  return await prisma.instansi.create({
    data,
  });
}

export async function updateInstansi(data) {
  const instansi = await prisma.instansi.findFirst();
  if (!instansi) throw new Error("Data instansi tidak ditemukan");

  return await prisma.instansi.update({
    where: { id: instansi.id },
    data,
  });
}

export async function deleteInstansi() {
  const instansi = await prisma.instansi.findFirst();
  if (!instansi) throw new Error("Data instansi tidak ditemukan");

  return await prisma.instansi.delete({
    where: { id: instansi.id },
  });
}
