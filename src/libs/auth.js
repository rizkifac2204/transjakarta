import { nanoid } from "nanoid";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";

export class AuthError extends Error {}

export async function verifyAuth() {
  try {
    const cookieStore = cookies();
    const { value: token } = cookieStore.get(process.env.JWT_NAME);
    if (!token) throw new AuthError("Tidak Ada Token");

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );
    return verified.payload;
  } catch (error) {
    throw new AuthError("Akses Tidak Benar.");
  }
}

export async function setUserCookie(data) {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));

  const cookieStore = cookies();

  cookieStore.set({
    name: process.env.JWT_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function expireUserCookie() {
  const cookieStore = cookies();
  cookieStore.delete(process.env.JWT_NAME);
}

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
