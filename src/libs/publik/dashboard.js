import prisma from "../prisma";

export async function getPermohonanPublikCountByIdAndEmail(
  publicId,
  publicEmail
) {
  const parsedId = Number(publicId);
  const parsedEmail = String(publicEmail);
  if (!parsedId && parsedEmail) return null;

  return prisma.permohonan.count({
    where: {
      deleted_at: null,
      OR: [
        parsedId ? { pemohon_id: parsedId } : undefined,
        parsedEmail ? { email: parsedEmail } : undefined,
      ].filter(Boolean),
    },
  });
}

export async function getKeberatanPublikCountByIdAndEmail(
  publicId,
  publicEmail
) {
  const parsedId = Number(publicId);
  const parsedEmail = String(publicEmail);
  if (!parsedId && parsedEmail) return null;

  return prisma.keberatan.count({
    where: {
      deleted_at: null,
      OR: [
        parsedId ? { pemohon_id: parsedId } : undefined,
        parsedEmail ? { email: parsedEmail } : undefined,
      ].filter(Boolean),
    },
  });
}

export async function getPenelitianPublikCountByIdAndEmail(
  publicId,
  publicEmail
) {
  const parsedId = Number(publicId);
  const parsedEmail = String(publicEmail);
  if (!parsedId && parsedEmail) return null;

  return prisma.penelitian.count({
    where: {
      deleted_at: null,
      OR: [
        parsedId ? { pemohon_id: parsedId } : undefined,
        parsedEmail ? { email: parsedEmail } : undefined,
      ].filter(Boolean),
    },
  });
}

export async function getJawabanPublikCountByIdAndEmail(publicId, publicEmail) {
  const parsedId = Number(publicId);
  const parsedEmail = String(publicEmail);
  if (!parsedId && parsedEmail) return null;

  return prisma.jawaban.count({
    where: {
      permohonan: {
        is: {
          deleted_at: null,
          OR: [
            parsedId ? { pemohon_id: parsedId } : undefined,
            parsedEmail ? { email: parsedEmail } : undefined,
          ].filter(Boolean),
        },
      },
    },
  });
}

export async function getJawabanPenelitianPublikCountByIdAndEmail(
  publicId,
  publicEmail
) {
  const parsedId = Number(publicId);
  const parsedEmail = String(publicEmail);
  if (!parsedId && parsedEmail) return null;

  return prisma.jawaban_penelitian.count({
    where: {
      penelitian: {
        is: {
          deleted_at: null,
          OR: [
            parsedId ? { pemohon_id: parsedId } : undefined,
            parsedEmail ? { email: parsedEmail } : undefined,
          ].filter(Boolean),
        },
      },
    },
  });
}

export async function getTestimoniPublikCountByEmail(email) {
  if (!email) return null;

  return prisma.testimoni.count({
    where: {
      email,
      OR: [
        {
          permohonan: {
            is: { deleted_at: null },
          },
        },
        {
          penelitian: {
            is: { deleted_at: null },
          },
        },
      ],
    },
  });
}
