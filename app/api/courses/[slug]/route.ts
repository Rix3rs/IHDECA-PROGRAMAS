import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await requireSession(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;
  try {
    const { slug } = await context.params;
    if (auth.session.rol === "TEACHER") {
      const assignment = await prisma.userCourse.findUnique({
        where: { userId_courseSlug: { userId: auth.session.id, courseSlug: slug } }
      });
      if (!assignment) return NextResponse.json({ error: "No tienes acceso a este curso" }, { status: 403 });
    }
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
    if (instructor !== undefined && auth.session.rol === "ADMIN") {
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
    const isAdmin = auth.session.rol === "ADMIN";
    if (isAdmin && title !== undefined) updateData.title = title;
    if (isAdmin && description !== undefined) updateData.description = description;
    if (isAdmin && extendedDescription !== undefined) updateData.extendedDescription = extendedDescription;
    if (isAdmin && category !== undefined) updateData.category = category;
    if (isAdmin && categorySlug !== undefined) updateData.categorySlug = categorySlug;
    if (isAdmin && duration !== undefined) updateData.duration = duration;
    if (isAdmin && lessons !== undefined) updateData.lessons = lessons;
    if (isAdmin && price !== undefined) updateData.price = price;
    if (isAdmin && precioMxn !== undefined) {
      const num = precioMxn === "" || precioMxn === null ? null : Number(precioMxn);
      updateData.precioMxn = num;
      if (num != null) {
        updateData.price = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(num);
      }
    }
    if (isAdmin && modalidad !== undefined) updateData.modalidad = modalidad;
    if (isAdmin && instructor !== undefined) updateData.instructor = instructor;
    if (isAdmin && coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (isAdmin && coverPositionY !== undefined) updateData.coverPositionY = coverPositionY;
    if (isAdmin && coverAlt !== undefined) updateData.coverAlt = coverAlt;
    if (fechas !== undefined) updateData.fechas = fechas;
    if (isAdmin && publicado !== undefined) updateData.publicado = publicado;
    if (objetivos !== undefined) updateData.objetivos = Array.isArray(objetivos) ? objetivos.join("\n") : objetivos;
    if (dirigidoA !== undefined) updateData.dirigidoA = Array.isArray(dirigidoA) ? dirigidoA.join("\n") : dirigidoA;

    const updated = await prisma.course.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json({ success: true, course: updated });
  } catch (error: any) {
    console.error("PUT /api/courses/[slug] error:", error);
    const msg = error?.code === "P2002" ? "Ya existe un curso con ese nombre" : "Error al actualizar curso";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await requireSession(["ADMIN"]);
  if (auth.error) return auth.error;
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
