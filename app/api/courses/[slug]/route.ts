import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const {
      title,
      description,
      extendedDescription,
      category,
      categorySlug,
      duration,
      lessons,
      instructor,
      price,
      precioMxn,
      modalidad,
      coverUrl,
      coverPositionY,
      coverAlt,
      fechas,
      publicado,
      objetivos,
      dirigidoA
    } = body;

    // Handle Teacher Assignment using comma-separated slugs on User
    if (instructor !== undefined) {
      if (instructor && instructor !== "Por confirmar") {
        // Find teacher users matching name
        const teacherUsers = await prisma.user.findMany({
          where: { nombre: instructor, rol: "TEACHER" }
        });

        for (const teacher of teacherUsers) {
          const currentSlugs = teacher.cursoAsignadoSlug 
            ? teacher.cursoAsignadoSlug.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];
          if (!currentSlugs.includes(slug)) {
            currentSlugs.push(slug);
            await prisma.user.update({
              where: { id: teacher.id },
              data: { cursoAsignadoSlug: currentSlugs.join(",") }
            });
            await prisma.userCourse.upsert({
              where: { userId_courseSlug: { userId: teacher.id, courseSlug: slug } },
              update: {},
              create: { userId: teacher.id, courseSlug: slug }
            });
          }
        }
      } else {
        // Unassign this course slug from any teacher
        const assignedTeachers = await prisma.user.findMany({
          where: { rol: "TEACHER" }
        });

        for (const teacher of assignedTeachers) {
          await prisma.userCourse.deleteMany({
            where: { userId: teacher.id, courseSlug: slug }
          });
          if (teacher.cursoAsignadoSlug && teacher.cursoAsignadoSlug.includes(slug)) {
            const updatedSlugs = teacher.cursoAsignadoSlug
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s && s !== slug);

            await prisma.user.update({
              where: { id: teacher.id },
              data: { cursoAsignadoSlug: updatedSlugs.join(",") || null }
            });
          }
        }
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (extendedDescription !== undefined) updateData.extendedDescription = extendedDescription;
    if (category !== undefined) updateData.category = category;
    if (categorySlug !== undefined) updateData.categorySlug = categorySlug;
    if (duration !== undefined) updateData.duration = duration;
    if (lessons !== undefined) updateData.lessons = lessons;
    if (price !== undefined) updateData.price = price;
    if (precioMxn !== undefined) {
      const num = precioMxn === "" || precioMxn === null ? null : Number(precioMxn);
      updateData.precioMxn = num;
      if (num != null) {
        updateData.price = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(num);
      }
    }
    if (modalidad !== undefined) updateData.modalidad = modalidad;
    if (instructor !== undefined) updateData.instructor = instructor;
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (coverPositionY !== undefined) updateData.coverPositionY = coverPositionY;
    if (coverAlt !== undefined) updateData.coverAlt = coverAlt;
    if (fechas !== undefined) updateData.fechas = fechas;
    if (publicado !== undefined) updateData.publicado = publicado;
    if (objetivos !== undefined) updateData.objetivos = Array.isArray(objetivos) ? objetivos.join("\n") : objetivos;
    if (dirigidoA !== undefined) updateData.dirigidoA = Array.isArray(dirigidoA) ? dirigidoA.join("\n") : dirigidoA;

    const updated = await prisma.course.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json({ success: true, course: updated });
  } catch (error: any) {
    console.error("PUT /api/courses/[slug] error:", error);
    return NextResponse.json({ error: "Error al actualizar curso" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    await prisma.course.delete({
      where: { slug }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/courses/[slug] error:", error);
    return NextResponse.json({ error: "Error al eliminar curso" }, { status: 500 });
  }
}
