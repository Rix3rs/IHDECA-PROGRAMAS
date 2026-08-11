import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("ihdeca_token", "", { httpOnly: true, secure: false, maxAge: 0, path: "/" });
  return response;
}
