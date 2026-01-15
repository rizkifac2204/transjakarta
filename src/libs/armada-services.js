import prisma from "./prisma";

export async function getAllServicesType() {
  return await prisma.service_type.findMany();
}

export async function getAllFleetType() {
  return await prisma.fleet_type.findMany();
}
