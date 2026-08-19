import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("ihdeca_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  const payload = await verifyJWT(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("ihdeca_token", "", { maxAge: 0, path: "/" });
    return response;
  }

  const roleRoutes: Record<string, string> = {
    ADMIN: "/dashboard/admin",
    TEACHER: "/dashboard/docente",
    STUDENT: "/dashboard/estudiante"
  };
  const expectedPrefix = roleRoutes[payload.rol];
  if (!expectedPrefix) return NextResponse.redirect(new URL("/login", request.url));
  if (pathname === "/dashboard" || !pathname.startsWith(expectedPrefix)) {
    return NextResponse.redirect(new URL(expectedPrefix, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
