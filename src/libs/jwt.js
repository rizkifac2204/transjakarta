import { nanoid } from "nanoid";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

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

export async function verifyAuthFromRequest(request) {
  try {
    const token = request.cookies.get(process.env.JWT_NAME)?.value;
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
