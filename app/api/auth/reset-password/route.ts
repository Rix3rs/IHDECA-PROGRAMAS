import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Token y contraseña requeridos" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const resetToken = await (prisma as any).resetToken.findUnique({
      where: { token }
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.updateMany({
      where: { email: resetToken.email },
      data: { contrasena: hashedPassword }
    });

    await (prisma as any).resetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    });

    return NextResponse.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error: any) {
    console.error("POST /api/auth/reset-password error:", error);
    return NextResponse.json({ error: "Error al restablecer la contraseña" }, { status: 500 });
  }
}
