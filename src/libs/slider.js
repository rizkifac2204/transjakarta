import prisma from "./prisma";

// Ambil semua slider aktif dan urut
export async function getSliders() {
  return await prisma.slider.findMany({
    where: { is_active: true },
    orderBy: { urutan: "asc" },
  });
}

// Ambil satu slider by ID
export async function getSliderById(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.slider.findUnique({
    where: { id: parsedId },
  });
}

// Tambahkan slider baru
export async function createSlider(data) {
  return await prisma.slider.create({ data });
}

// Hapus slider by ID
export async function deleteSlider(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) return null;

  return await prisma.slider.delete({
    where: { id: parsedId },
  });
}
