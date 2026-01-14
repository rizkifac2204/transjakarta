import { NextResponse } from "next/server";
import { editAuthAfterLogout, expireUserCookie, verifyAuth } from "@/libs/auth";
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
