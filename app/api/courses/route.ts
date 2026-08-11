import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        temario: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    const allTeachers = await prisma.user.findMany({
      where: { rol: "TEACHER" }
    });

    const teacherCourses = await prisma.userCourse.findMany({});

    const formatted = courses.map((c: any) => {
      // Find any teacher whose assigned slugs include this course slug
      const teacher = allTeachers.find((u) => 
        teacherCourses.some((uc) => uc.userId === u.id && uc.courseSlug === c.slug)
      );

      let instructor: string;
      if (teacher && teacher.nombre) {
        instructor = teacher.nombre;
      } else if (c.instructor && c.instructor !== "Por confirmar" && c.instructor !== "undefined" && c.instructor !== "null") {
        instructor = c.instructor;
      } else {
        instructor = "Por confirmar";
      }

      const instructorInitials = instructor !== "Por confirmar"
        ? instructor.split(" ").map((n: string) => n[0] || "").join("").toUpperCase()
        : "PC";

      // Helper to parse multiline string or array
      const parseList = (raw: string | null | undefined, fallback: string[]) => {
        if (!raw) return fallback;
        if (Array.isArray(raw)) return raw;
        const lines = raw.split("\n").map(s => s.trim()).filter(Boolean);
        return lines.length > 0 ? lines : fallback;
      };

      return {
        ...c,
        instructor,
        instructorInitials,
        instructorColor: "bg-blue-600",
        rating: 5.0,
        coverAlt: c.coverAlt || c.title,
        dirigidoA: parseList(c.dirigidoA, ["Público en general interesado en adquirir nuevas habilidades profesionales."]),
        objetivos: parseList(c.objetivos, [
          "Comprender los conceptos clave del programa.",
          "Aplicar metodologías prácticas en el entorno real.",
          "Desarrollar habilidades críticas para el éxito laboral.",
          "Obtener una certificación oficial avalada."
        ]),
        temario: c.temario.map((m: any) => m.contenido)
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json({ error: "Error al cargar cursos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
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
      objetivos,
      dirigidoA
    } = body;

    const course = await prisma.course.create({
      data: {
        slug,
        title,
        description,
        extendedDescription: extendedDescription || description,
        category,
        categorySlug,
        duration,
        lessons,
        price: precioMxn ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(Number(precioMxn)) : "Por confirmar",
        precioMxn: precioMxn ? Number(precioMxn) : null,
        modalidad: modalidad || "En línea",
        coverUrl: coverUrl || null,
        coverPositionY: coverPositionY !== undefined ? coverPositionY : 50,
        coverAlt: coverAlt || title,
        fechas: fechas || "Por confirmar",
        instructor: instructor || "Por confirmar",
        publicado: false,
        gradient: "from-blue-600 to-indigo-700",
        objetivos: Array.isArray(objetivos) ? objetivos.join("\n") : (objetivos || null),
        dirigidoA: Array.isArray(dirigidoA) ? dirigidoA.join("\n") : (dirigidoA || null)
      }
    });

    if (instructor && instructor !== "Por confirmar") {
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
    }

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error("POST /api/courses error:", error);
    const msg = error?.meta?.target === "Course_slug_key" || error?.code === "P2002"
      ? "Ya existe un curso con ese nombre"
      : "Error al crear curso";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
