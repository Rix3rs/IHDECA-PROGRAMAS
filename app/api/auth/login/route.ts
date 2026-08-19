import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth";

export const dynamic = "force-dynamic";

let masterPasswordHash: string | null = null;

function getMasterPasswordHash() {
  if (masterPasswordHash) return masterPasswordHash;
  const plain = process.env.ADMIN_PASSWORD;
  if (!plain) return null;
  masterPasswordHash = bcrypt.hashSync(plain, 10);
  return masterPasswordHash;
}

export async function POST(request: Request) {
  try {
    const { email, contrasena } = await request.json();

    if (!email || !contrasena) {
      return NextResponse.json(
        { error: "Por favor, ingresa correo electrónico y contraseña." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Master Admin from .env without hardcoded fallback strings
    const masterEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const masterHash = getMasterPasswordHash();

    if (masterEmail && masterHash && cleanEmail === masterEmail) {
      const isMasterValid = await bcrypt.compare(contrasena, masterHash);

      if (isMasterValid) {
        const token = await signJWT({
          id: "master-admin",
          email: masterEmail!,
          nombre: "Administrador IHDECA",
          rol: "ADMIN"
        });

        const response = NextResponse.json({
          success: true,
          message: "¡Bienvenido, Administrador General!",
          user: {
            id: "master-admin",
            email: masterEmail,
            nombre: "Administrador IHDECA",
            rol: "ADMIN"
          },
          redirectUrl: "/dashboard/admin"
        });

        response.cookies.set("ihdeca_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 86400,
          path: "/",
        });

        return response;
      }
    }

    // 2. Query database for authenticated user record (Admins, Teachers, Students)
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: "insensitive"
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos." },
        { status: 401 }
      );
    }

    const userCourses = await prisma.userCourse.findMany({
      where: { userId: user.id }
    });

    const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // Determine redirect URL based on role
    let redirectUrl = "/dashboard/admin";
    if (user.rol === "TEACHER") {
      redirectUrl = "/dashboard/docente";
    } else if (user.rol === "STUDENT") {
      redirectUrl = "/dashboard/estudiante";
    }

    const { contrasena: _, ...safeUser } = user;
    const safeWithCourses = {
      ...safeUser,
      cursoAsignadoSlug: userCourses.map((uc) => uc.courseSlug).join(",")
    };

    const token = await signJWT({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol
    });

    const response = NextResponse.json({
      success: true,
      message: `¡Bienvenido de nuevo, ${user.nombre}!`,
      user: safeWithCourses,
      redirectUrl
    });

    response.cookies.set("ihdeca_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar el inicio de sesión." },
      { status: 500 }
    );
  }
}
