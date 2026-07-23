-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "zoomLink" TEXT,
    "calificacion" INTEGER,
    "comentariosDocente" TEXT,
    "progreso" INTEGER NOT NULL DEFAULT 0,
    "estadoInscripcion" TEXT NOT NULL DEFAULT 'Pendiente',
    "fechaRegistro" TEXT,
    "empresa" TEXT,
    "cursoAsignadoSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "extendedDescription" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "lessons" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "gradient" TEXT NOT NULL DEFAULT 'from-blue-600 to-indigo-700',
    "coverUrl" TEXT,
    "coverPositionY" INTEGER NOT NULL DEFAULT 50,
    "fechas" TEXT NOT NULL DEFAULT 'Por confirmar',
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "modalidad" TEXT NOT NULL DEFAULT 'En línea',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "SyllabusModule" (
    "id" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,

    CONSTRAINT "SyllabusModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cursoAsignadoSlug_fkey" FOREIGN KEY ("cursoAsignadoSlug") REFERENCES "Course"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyllabusModule" ADD CONSTRAINT "SyllabusModule_courseSlug_fkey" FOREIGN KEY ("courseSlug") REFERENCES "Course"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
