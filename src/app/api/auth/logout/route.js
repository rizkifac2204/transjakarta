import { NextResponse } from "next/server";
import { editAuthAfterLogout } from "@/libs/auth";
import { expireUserCookie, verifyAuth } from "@/libs/jwt";
import getLogs from "@/libs/getLogs";

export async function GET(request) {
  try {
    const auth = await verifyAuth();

    await editAuthAfterLogout(auth?.id);
    await expireUserCookie();
  } catch (error) {
    getLogs("auth").error(error);
  }
  return NextResponse.redirect(new URL("/", request.url));
}
