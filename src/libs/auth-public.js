import { nanoid } from "nanoid";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";

export class AuthError extends Error {}

export async function verifyAuth() {
  try {
    const cookieStore = cookies();
    const { value: token } = cookieStore.get(process.env.JWT_PUBLIC_NAME);
    if (!token) throw new AuthError("Tidak Ada Token");

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );
    return verified.payload;
  } catch (error) {
    return null;
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
    name: process.env.JWT_PUBLIC_NAME,
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
  cookieStore.delete(process.env.JWT_PUBLIC_NAME);
}

export async function getAuthByEmail(email, excludeId = null) {
  const data = await prisma.pemohon.findFirst({
    where: {
      email,
      ...(excludeId && {
        NOT: { id: parseInt(excludeId) },
      }),
    },
  });
  return data;
}

export async function getAuthByUsername(username, id) {
  const data = await prisma.pemohon.findMany({
    where: {
      username,
      register: true,
      ...(id && {
        NOT: { id: parseInt(id) },
      }),
    },
  });
  return data;
}

export async function editAuthAfterLogin(id) {
  const data = await prisma.pemohon.update({
    where: { id: parseInt(id) },
    data: { last_access: null, login: true },
  });
  return data;
}

export async function editAuthAfterLogout(id) {
  const data = await prisma.pemohon.update({
    where: { id: parseInt(id) },
    data: { last_access: new Date(), login: false },
  });
  return data;
}

export async function getSession() {
  try {
    // Cek token valid
    const session = await verifyAuth();

    // Pastikan ada ID
    if (!session?.id) return null;

    // Cek user di database masih login dan sudah register
    const user = await prisma.pemohon.findUnique({
      where: {
        id: parseInt(session.id),
        login: true,
        register: true,
      },
    });

    return user ? { ...user, image: session?.image } : null;
  } catch (error) {
    // Token tidak valid, tidak perlu throw
    return null;
  }
}
