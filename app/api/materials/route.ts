import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, templateMaterialNuevo } from "@/lib/email";
import { createNotification } from "@/lib/notifications";
import { requireSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireSession(["ADMIN", "TEACHER", "STUDENT"]);
  if (auth.error) return auth.error;
  try {
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get("courseSlug");

    if (!courseSlug) {
      return NextResponse.json({ error: "courseSlug requerido" }, { status: 400 });
    }
    if (auth.session.rol !== "ADMIN") {
      const assignment = await prisma.userCourse.findUnique({
        where: { userId_courseSlug: { userId: auth.session.id, courseSlug } }
      });
      if (!assignment) return NextResponse.json({ error: "No tienes acceso a este curso" }, { status: 403 });
    }

    const materials = await (prisma as any).material.findMany({
      where: { courseSlug },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(materials);
  } catch (error: any) {
    console.error("GET /api/materials error:", error);
    return NextResponse.json({ error: "Error al cargar materiales" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireSession(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const { courseSlug, title, type, url } = body;

    if (!courseSlug || !title || !url) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }
    if (auth.session.rol === "TEACHER") {
      const assignment = await prisma.userCourse.findUnique({
        where: { userId_courseSlug: { userId: auth.session.id, courseSlug } }
      });
      if (!assignment) return NextResponse.json({ error: "No tienes acceso a este curso" }, { status: 403 });
    }

    const material = await (prisma as any).material.create({
      data: { courseSlug, title, type: type || "link", url }
    });

    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    const students = await prisma.userCourse.findMany({ where: { courseSlug } });
    for (const uc of students) {
      const student = await prisma.user.findUnique({ where: { id: uc.userId } });
      if (student) {
        try {
          await sendEmail(student.email, "Nuevo material - IHDECA", templateMaterialNuevo(student.nombre, course?.title || courseSlug, title));
        } catch {}
      }
    }

    createNotification("Material subido", `"${title}" agregado al curso ${course?.title || courseSlug}`, "material", "/dashboard/admin");

    return NextResponse.json({ success: true, material });
  } catch (error: any) {
    console.error("POST /api/materials error:", error);
    return NextResponse.json({ error: "Error al crear material" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireSession(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    if (auth.session.rol === "TEACHER") {
      const material = await prisma.material.findUnique({ where: { id: Number(id) } });
      if (!material) return NextResponse.json({ error: "Material no encontrado" }, { status: 404 });
      const assignment = await prisma.userCourse.findUnique({
        where: { userId_courseSlug: { userId: auth.session.id, courseSlug: material.courseSlug } }
      });
      if (!assignment) return NextResponse.json({ error: "No tienes acceso a este curso" }, { status: 403 });
    }

    await (prisma as any).material.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/materials error:", error);
    return NextResponse.json({ error: "Error al eliminar material" }, { status: 500 });
  }
}
