import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET debe estar configurado con al menos 32 caracteres");
  }
  return new TextEncoder().encode(value);
}
const expiresIn = "24h";

export interface JWTPayload {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

export async function signJWT(payload: JWTPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
