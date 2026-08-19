import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireSession(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const { courseSlug, contenido } = body;

    if (!courseSlug || !contenido) {
      return NextResponse.json({ error: "courseSlug y contenido requeridos" }, { status: 400 });
    }
    if (auth.session.rol === "TEACHER") {
      const assignment = await prisma.userCourse.findUnique({
        where: { userId_courseSlug: { userId: auth.session.id, courseSlug } }
      });
      if (!assignment) return NextResponse.json({ error: "No tienes acceso a este curso" }, { status: 403 });
    }

    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    const record = await prisma.syllabusModule.create({
      data: {
        courseSlug,
        contenido
      }
    });

    return NextResponse.json({ success: true, module: record });
  } catch (error: any) {
    console.error("POST /api/syllabus error:", error);
    return NextResponse.json({ error: "Error al agregar temario" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireSession(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const { courseSlug, contenido } = body;
    if (auth.session.rol === "TEACHER") {
      const assignment = await prisma.userCourse.findUnique({
        where: { userId_courseSlug: { userId: auth.session.id, courseSlug } }
      });
      if (!assignment) return NextResponse.json({ error: "No tienes acceso a este curso" }, { status: 403 });
    }

    const record = await prisma.syllabusModule.findFirst({
      where: { courseSlug, contenido }
    });

    if (record) {
      await prisma.syllabusModule.delete({
        where: { id: record.id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/syllabus error:", error);
    return NextResponse.json({ error: "Error al eliminar temario" }, { status: 500 });
  }
}
