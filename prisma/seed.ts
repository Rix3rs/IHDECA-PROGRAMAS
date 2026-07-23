import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando la siembra de la base de datos...");

  // Clean existing tables (in order of relations)
  await prisma.syllabusModule.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.course.deleteMany({});

  // 1. Seed courses
  const initialCourses = [
    {
      slug: "curso-de-walter",
      title: "Curso de Walter",
      description: "Programa en desarrollo. Próximamente se compartirá más información sobre el contenido y proceso de inscripción.",
      extendedDescription: "Este programa de formación está en fase de desarrollo. El temario, objetivos y estructura definitiva del curso serán comunicados oficialmente por el equipo directivo de IHDECA.",
      category: "Desarrollo Profesional",
      categorySlug: "desarrollo-profesional",
      duration: "Por confirmar",
      lessons: "Por definir",
      price: "Por confirmar",
      gradient: "from-amber-500 to-orange-600",
      fechas: "Por confirmar",
      publicado: false,
      modalidad: "En línea",
    },
    {
      slug: "liderazgo-empresarial",
      title: "Liderazgo empresarial",
      description: "Fortalece habilidades de liderazgo, comunicación y toma de decisiones para guiar equipos de trabajo con mayor claridad y enfoque.",
      extendedDescription: "Domina herramientas de liderazgo moderno y aprende a gestionar el talento humano. Este curso te enseñará a guiar equipos de trabajo con mayor claridad, responsabilidad y un fuerte enfoque en resultados.",
      category: "Liderazgo y Habilidades Blandas",
      categorySlug: "liderazgo-y-habilidades",
      duration: "Por confirmar",
      lessons: "Por definir",
      price: "Por confirmar",
      gradient: "from-blue-600 to-indigo-700",
      fechas: "Por confirmar",
      publicado: true,
      modalidad: "En línea",
    },
    {
      slug: "comunicacion-efectiva",
      title: "Comunicación efectiva y asertiva en el trabajo",
      description: "Mejora las relaciones interpersonales y la productividad mediante técnicas de diálogo y escucha asertiva.",
      extendedDescription: "El éxito laboral depende en gran medida de cómo nos comunicamos. En este curso aprenderás a transmitir ideas de manera asertiva, resolver malentendidos con empatía y propiciar un clima de trabajo saludable.",
      category: "Liderazgo y Habilidades Blandas",
      categorySlug: "liderazgo-y-habilidades",
      duration: "Por confirmar",
      lessons: "Por definir",
      price: "Por confirmar",
      gradient: "from-purple-600 to-indigo-700",
      fechas: "Por confirmar",
      publicado: true,
      modalidad: "En línea",
    },
    {
      slug: "manejo-de-conflictos",
      title: "Manejo de conflictos",
      description: "Aprende estrategias de negociación y resolución de diferencias en el entorno laboral de manera pacífica.",
      extendedDescription: "Transforma las tensiones del equipo en oportunidades de crecimiento. Adquiere herramientas metodológicas para mediar en situaciones complejas y facilitar consensos beneficiosos para la organización.",
      category: "Liderazgo y Habilidades Blandas",
      categorySlug: "liderazgo-y-habilidades",
      duration: "Por confirmar",
      lessons: "Por definir",
      price: "Por confirmar",
      gradient: "from-rose-600 to-orange-600",
      fechas: "Por confirmar",
      publicado: true,
      modalidad: "En línea",
    }
  ];

  const coursesWithPricing = initialCourses.map((c, i) => {
    const precios = [299, 799, 599, 699];
    return { ...c, precioMxn: precios[i] ?? null };
  });

  for (const c of coursesWithPricing) {
    await prisma.course.create({ data: c });
  }
  console.log("Cursos sembrados con éxito.");

  // 2. Seed Syllabus Modules for default courses
  const initialSyllabus = [
    { courseSlug: "curso-de-walter", contenido: "Programa en desarrollo - Información a detallar próximamente." },
    { courseSlug: "liderazgo-empresarial", contenido: "Módulo 1: Fundamentos de Gestión y Liderazgo de Equipos" },
    { courseSlug: "liderazgo-empresarial", contenido: "Módulo 2: Inteligencia Emocional y Delegación Responsable" },
    { courseSlug: "liderazgo-empresarial", contenido: "Módulo 3: Métricas de Alto Desempeño y Feedback Asertivo" },
    { courseSlug: "comunicacion-efectiva", contenido: "Módulo 1: La Escucha Activa como Base del Entendimiento" },
    { courseSlug: "comunicacion-efectiva", contenido: "Módulo 2: Canales de Comunicación Formal y Barreras Comunes" },
    { courseSlug: "comunicacion-efectiva", contenido: "Módulo 3: Expresión Asertiva en Entornos Presenciales y Virtuales" },
    { courseSlug: "manejo-de-conflictos", contenido: "Módulo 1: Identificación y Tipologías de Conflictos Laborales" },
    { courseSlug: "manejo-de-conflictos", contenido: "Módulo 2: Técnicas de Negociación Colaborativa" },
    { courseSlug: "manejo-de-conflictos", contenido: "Módulo 3: Acuerdos Sostenibles y Seguimiento de Mediación" }
  ];

  for (const m of initialSyllabus) {
    await prisma.syllabusModule.create({ data: m });
  }
  console.log("Temarios sembrados con éxito.");

  // 3. Seed users with bcrypt hashed passwords
  const initialUsers = [
    // Admins
    {
      email: "admin@ihdecaprogramas.com.mx",
      nombre: "Administrador General",
      contrasena: bcrypt.hashSync("admin_ihdeca_2026!", 10),
      rol: "ADMIN"
    },
    // Teachers
    {
      email: "walter@ihdeca.com",
      nombre: "Walter",
      contrasena: bcrypt.hashSync("walter123", 10),
      rol: "TEACHER",
      zoomLink: "https://zoom.us/j/5551112222",
      cursoAsignadoSlug: "curso-de-walter"
    },
    {
      email: "docente@ihdeca.com",
      nombre: "Dra. Elena Rostova",
      contrasena: bcrypt.hashSync("docente123", 10),
      rol: "TEACHER",
      zoomLink: "https://zoom.us/j/9998887777",
      cursoAsignadoSlug: "liderazgo-empresarial"
    },
    // Students
    {
      email: "sofia@correo.com",
      nombre: "Sofía Martínez",
      contrasena: bcrypt.hashSync("estudiante123", 10),
      rol: "STUDENT",
      cursoAsignadoSlug: "liderazgo-empresarial",
      calificacion: 92,
      comentariosDocente: "Excelente participación en los talleres grupales.",
      progreso: 100,
      estadoInscripcion: "Aceptado",
      fechaRegistro: "2026-07-10",
      empresa: "Tech Solutions"
    },
    {
      email: "alejandro@correo.com",
      nombre: "Alejandro Ruiz",
      contrasena: bcrypt.hashSync("estudiante123", 10),
      rol: "STUDENT",
      cursoAsignadoSlug: "liderazgo-empresarial",
      calificacion: null,
      comentariosDocente: null,
      progreso: 60,
      estadoInscripcion: "Aceptado",
      fechaRegistro: "2026-07-12",
      empresa: "Personal"
    },
    {
      email: "mariana@correo.com",
      nombre: "Mariana Herrera",
      contrasena: bcrypt.hashSync("estudiante123", 10),
      rol: "STUDENT",
      cursoAsignadoSlug: "comunicacion-efectiva",
      calificacion: null,
      comentariosDocente: null,
      progreso: 0,
      estadoInscripcion: "Pendiente",
      fechaRegistro: "2026-07-15",
      empresa: "Corporativo Alfa"
    }
  ];

  for (const u of initialUsers) {
    const { cursoAsignadoSlug, ...userData } = u as any;
    const created = await prisma.user.create({ data: u as any });
    if (cursoAsignadoSlug) {
      const slugs = (cursoAsignadoSlug as string).split(",").map(s => s.trim()).filter(Boolean);
      for (const slug of slugs) {
        await prisma.userCourse.upsert({
          where: { userId_courseSlug: { userId: created.id, courseSlug: slug } },
          update: {},
          create: { userId: created.id, courseSlug: slug }
        });
      }
    }
  }
  console.log("Usuarios sembrados con éxito con contraseñas encriptadas en bcrypt.");

  console.log("Siembra finalizada exitosamente.");
}

main()
  .catch((e) => {
    console.error("Error durante la siembra de base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
