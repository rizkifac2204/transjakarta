import prisma from "./prisma";
import { verifyAuth } from "./jwt";

export async function getProfile() {
  const profile = await getProfileOnly();
  return profile;
}

export async function getProfileOnly() {
  const auth = await verifyAuth();
  const data = await prisma.user.findUnique({
    where: { id: auth.id },
    include: { level: true },
  });

  return data;
}

export async function isEmailSama(email) {
  const auth = await verifyAuth();
  const data = await prisma.user.findFirst({
    where: { id: { not: auth.id }, email: email },
  });
  return data;
}

export async function updateProfile(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
