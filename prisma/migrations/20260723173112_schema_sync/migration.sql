-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cursoAsignadoSlug_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "coverAlt" TEXT,
ADD COLUMN     "dirigidoA" TEXT,
ADD COLUMN     "instructor" TEXT DEFAULT 'Por confirmar',
ADD COLUMN     "objetivos" TEXT,
ADD COLUMN     "precioMxn" INTEGER;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "empresa" TEXT,
    "mensaje" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Nuevo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
