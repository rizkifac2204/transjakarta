import prisma from "./prisma";

export async function getAllShelterTypes() {
  return await prisma.shelter_type.findMany();
}
