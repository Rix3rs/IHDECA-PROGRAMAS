import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyJWT, type JWTPayload } from "@/lib/auth";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export async function getSession(): Promise<JWTPayload | null> {
  const token = (await cookies()).get("ihdeca_token")?.value;
  return token ? verifyJWT(token) : null;
}

export async function requireSession(roles?: UserRole[]) {
  const session = await getSession();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "No autenticado" }, { status: 401 }) };
  }
  if (roles && !roles.includes(session.rol as UserRole)) {
    return { session: null, error: NextResponse.json({ error: "No autorizado" }, { status: 403 }) };
  }
  return { session, error: null };
}

