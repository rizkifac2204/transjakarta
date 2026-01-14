import prisma from "./prisma";
import { verifyAuth } from "./jwt";

// jika ada id, ambil selain data dengan id tersebut
export async function getAuthByUsername(username, id) {
  const data = await prisma.users.findMany({
    where: {
      username,
      ...(id && {
        NOT: { id: parseInt(id) },
      }),
    },
  });
  return data;
}

export async function editAuthAfterLogin(id) {
  const data = await prisma.users.update({
    where: { id: parseInt(id) },
    data: { last_access: null, login: true },
  });
  return data;
}

export async function editAuthAfterLogout(id) {
  const data = await prisma.users.update({
    where: { id: parseInt(id) },
    data: { last_access: new Date(), login: false },
  });
  return data;
}

export async function getSession() {
  const session = await verifyAuth();
  const data = await prisma.users.findUnique({
    where: { id: parseInt(session.id), login: true },
    include: {
      level: true,
    },
  });

  if (!data) {
    const error = new Error("FORCE_LOGOUT");
    error.status = 401;
    throw error;
  }

  return data;
}
