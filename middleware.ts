import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl.clone();

  // If the token exists and the user is trying to access the login page, redirect to /boards
  if (token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/boards", request.url));
  }

  // If the token does not exist and the user is trying to access a protected page, redirect to login
  if (!token && url.pathname.startsWith("/boards")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the token is expired and the user is trying to access a protected page, redirect to login
  if (token && typeof token.exp === 'number' && Date.now() >= token.exp * 1000 && url.pathname.startsWith("/boards")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue to the requested page if the token is valid or if the user is accessing a non-protected page
  return NextResponse.next();
}

// The paths where this middleware should run
export const config = {
  matcher: ["/", "/boards"],
};
