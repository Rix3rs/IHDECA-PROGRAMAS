import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail, templateResetPassword } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: "insensitive" } }
    });

    if (!user) {
      return NextResponse.json({ success: true, message: "Si el email existe, recibiras un enlace" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await (prisma as any).resetToken.create({
      data: { email: cleanEmail, token, expiresAt }
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    try {
      await sendEmail(cleanEmail, "Restablece tu contraseña - IHDECA", templateResetPassword(user.nombre, resetUrl));
    } catch (emailErr) {
      console.error("Error enviando email de recuperacion:", emailErr);
    }

    return NextResponse.json({ success: true, message: "Si el email existe, recibiras un enlace" });
  } catch (error: any) {
    console.error("POST /api/auth/forgot-password error:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
