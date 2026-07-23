import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail, templateNuevaCalificacion, templateBienvenidaDocente } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    const users = await prisma.user.findMany({
      orderBy: {
        nombre: "asc"
      }
    });

    const allUserCourses = await prisma.userCourse.findMany({});

    const userCoursesMap = new Map<string, string[]>();
    for (const uc of allUserCourses) {
      const slugs = userCoursesMap.get(uc.userId) || [];
      slugs.push(uc.courseSlug);
      userCoursesMap.set(uc.userId, slugs);
    }

    const formatted = users.map((u) => {
      const userSlugs = userCoursesMap.get(u.id) || [];
      const cursoAsignadoSlug = userSlugs.join(",");
      
      const matchedCourses = courses.filter((c) => userSlugs.includes(c.slug));
      const cursoTitle = matchedCourses.length > 0
        ? matchedCourses.map((c) => c.title).join(", ")
        : (cursoAsignadoSlug || "Sin curso asignado");

      return {
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        contrasena: "••••••••", // Masked for security
        rol: u.rol,
        cursoSlug: cursoAsignadoSlug,
        cursoSlugs: userSlugs,
        cursoTitle: cursoTitle,
        zoomLink: u.zoomLink || "",
        calificacion: u.calificacion,
        comentariosDocente: u.comentariosDocente || "",
        progreso: u.progreso,
        estadoInscripcion: u.estadoInscripcion,
        fechaRegistro: u.fechaRegistro || "",
        empresa: u.empresa || "Personal"
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      email,
      contrasena,
      rol,
      cursoSlug,
      zoomLink,
      empresa
    } = body;

    if (!email || !nombre) {
      return NextResponse.json({ error: "Nombre y email son requeridos" }, { status: 400 });
    }

    if (!contrasena && rol !== "TEACHER") {
      return NextResponse.json({ error: "La contrasena es requerida" }, { status: 400 });
    }

    const password = contrasena || crypto.randomBytes(12).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nombre,
        email: email.trim().toLowerCase(),
        contrasena: hashedPassword,
        rol: rol || "STUDENT",
        cursoAsignadoSlug: cursoSlug || null,
        zoomLink: zoomLink || null,
        empresa: empresa || "Personal",
        estadoInscripcion: rol === "TEACHER" ? "Aceptado" : "Pendiente"
      }
    });

    if (cursoSlug) {
      await prisma.userCourse.create({
        data: { userId: newUser.id, courseSlug: cursoSlug }
      });
    }

    if (rol === "TEACHER") {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 3600000);
      await (prisma as any).resetToken.create({
        data: { email: newUser.email, token, expiresAt }
      });

      const subject = contrasena ? "Configura tu cuenta - IHDECA" : "Configura tu contraseña - IHDECA";
      const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password?token=${token}`;
      try {
        await sendEmail(newUser.email, "Bienvenido a IHDECA - Configura tu acceso", templateBienvenidaDocente(newUser.nombre, resetUrl));
      } catch {}
    }

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      nombre,
      email,
      contrasena,
      rol,
      cursoSlug,
      zoomLink,
      calificacion,
      comentariosDocente,
      progreso,
      estadoInscripcion,
      fechaRegistro,
      empresa
    } = body;

    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    
    // Hash new password if provided and not empty
    if (contrasena && contrasena !== "••••••••" && !contrasena.startsWith("$2a$") && !contrasena.startsWith("$2b$")) {
      updateData.contrasena = await bcrypt.hash(contrasena, 10);
    }
    
    if (rol !== undefined) updateData.rol = rol;
    if (cursoSlug !== undefined) {
      updateData.cursoAsignadoSlug = cursoSlug || null;

      const newSlugs = cursoSlug
        ? cursoSlug.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

      const existingEnrollments = await prisma.userCourse.findMany({
        where: { userId: id }
      });

      const existingSlugs = existingEnrollments.map(e => e.courseSlug);

      for (const slug of existingSlugs) {
        if (!newSlugs.includes(slug)) {
          await prisma.userCourse.delete({
            where: { userId_courseSlug: { userId: id, courseSlug: slug } }
          });
        }
      }

      for (const slug of newSlugs) {
        if (!existingSlugs.includes(slug)) {
          await prisma.userCourse.create({
            data: { userId: id, courseSlug: slug }
          });
        }
      }
    }
    if (zoomLink !== undefined) updateData.zoomLink = zoomLink;
    if (calificacion !== undefined) updateData.calificacion = calificacion;
    if (comentariosDocente !== undefined) updateData.comentariosDocente = comentariosDocente;
    if (progreso !== undefined) updateData.progreso = progreso;
    if (estadoInscripcion !== undefined) updateData.estadoInscripcion = estadoInscripcion;
    if (fechaRegistro !== undefined) updateData.fechaRegistro = fechaRegistro;
    if (empresa !== undefined) updateData.empresa = empresa;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData
    });

    if (calificacion !== undefined && updated.rol === "STUDENT") {
      try {
        await sendEmail(updated.email, "Nueva calificacion - IHDECA", templateNuevaCalificacion(updated.nombre, "tu curso", calificacion));
      } catch {}
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 });
  }
}
