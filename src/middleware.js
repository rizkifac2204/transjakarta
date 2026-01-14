import { NextResponse } from "next/server";
import { verifyAuth } from "./libs/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = request.cookies.get(process.env.JWT_NAME)?.value;
  const verifiedToken = await verifyAuth(token).catch(() => {});

  if (request.nextUrl.pathname.startsWith("/login")) {
    if (verifiedToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!verifiedToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
