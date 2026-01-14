import prisma from "./prisma";
import { verifyAuth } from "./auth";
import { getPermohonanCountByAdmin, getPermohonanCount } from "./permohonan";
import { getKeberatanCountByAdmin, getKeberatanCount } from "./keberatan";
import { getPenelitianCountByAdmin, getPenelitianCount } from "./penelitian";

export async function getProfile() {
  const profile = await getProfileOnly();
  const isMaster = profile.level_id < 3;

  const [permohonan, keberatan, penelitian] = await Promise.all([
    isMaster
      ? getPermohonanCount()
      : getPermohonanCountByAdmin(Number(profile.id)),
    isMaster
      ? getKeberatanCount()
      : getKeberatanCountByAdmin(Number(profile.id)),
    isMaster
      ? getPenelitianCount()
      : getPenelitianCountByAdmin(Number(profile.id)),
  ]);

  return {
    ...profile,
    _count: {
      permohonan,
      keberatan,
      penelitian,
    },
  };
}

export async function getProfileOnly() {
  const auth = await verifyAuth();
  const data = await prisma.admin.findUnique({
    where: { id: auth.id },
    include: { level: true },
  });

  return data;
}

export async function isEmailSama(email) {
  const session = await verifyAuth();
  const data = await prisma.admin.findFirst({
    where: { id: { not: session.id }, email: email },
  });
  return data;
}

export async function updateProfile(id, data) {
  return prisma.admin.update({
    where: { id },
    data,
  });
}
