import { NextResponse } from "next/server";
import { verifyAuthFromRequest } from "./libs/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const verifiedToken = await verifyAuthFromRequest(request).catch(() => {});

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
