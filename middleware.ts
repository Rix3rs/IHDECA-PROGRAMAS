import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("ihdeca_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const roleRoutes: Record<string, string> = {
      ADMIN: "/dashboard/admin",
      TEACHER: "/dashboard/docente",
      STUDENT: "/dashboard/estudiante",
    };

    const expectedPrefix = roleRoutes[payload.rol];
    if (expectedPrefix && !pathname.startsWith(expectedPrefix)) {
      return NextResponse.redirect(new URL(expectedPrefix, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
