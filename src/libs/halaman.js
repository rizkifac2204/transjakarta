import prisma from "./prisma";
import { cache } from "react";

export async function getAllHalaman() {
  return await prisma.halaman.findMany({
    select: {
      id: true,
      slug: true,
      judul: true,
    },
    orderBy: { created_at: "desc" },
  });
}

export async function getHalamanById(id) {
  return await prisma.halaman.findUnique({
    where: { id: Number(id) },
  });
}

export async function createHalaman(data) {
  return await prisma.halaman.create({ data });
}

export async function updateHalamanById(id, data) {
  return await prisma.halaman.update({
    where: { id: Number(id) },
    data,
  });
}

export async function deleteHalamanById(id) {
  return await prisma.halaman.delete({
    where: { id: Number(id) },
  });
}

export const getHalamanBySlug = cache(async (slug) => {
  return await prisma.halaman.findUnique({
    where: { slug: slug },
  });
});
