import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseSlug, contenido } = body;

    if (!courseSlug || !contenido) {
      return NextResponse.json({ error: "courseSlug y contenido requeridos" }, { status: 400 });
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
  try {
    const body = await request.json();
    const { courseSlug, contenido } = body;

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
