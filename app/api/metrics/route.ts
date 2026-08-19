import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireSession(["ADMIN"]);
  if (auth.error) return auth.error;
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const pagosDelMes = await prisma.pago.findMany({
      where: {
        createdAt: { gte: startOfMonth }
      }
    });

    const ingresosMensuales = pagosDelMes.reduce(
      (sum: number, p: any) => sum + p.amount,
      0
    );

    const alumnosAceptados = await prisma.user.count({
      where: { estadoInscripcion: "Aceptado", rol: "STUDENT" }
    });

    const solicitudesPendientes = await prisma.user.count({
      where: { estadoInscripcion: "Pendiente", rol: "STUDENT" }
    });

    const totalEstudiantes = await prisma.user.count({
      where: { rol: "STUDENT" }
    });

    const retencionRate = totalEstudiantes > 0
      ? Math.round((alumnosAceptados / totalEstudiantes) * 100)
      : 0;

    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    });

    return NextResponse.json({
      ingresosMensuales: formatter.format(ingresosMensuales),
      ingresosMensualesRaw: ingresosMensuales,
      alumnosActivos: alumnosAceptados,
      retencionRate: `${retencionRate}%`,
      solicitudesPendientesCount: solicitudesPendientes,
      pagosDelMes: pagosDelMes.length,
    });
  } catch (error: any) {
    console.error("GET /api/metrics error:", error);
    return NextResponse.json(
      { error: "Error al obtener metricas" },
      { status: 500 }
    );
  }
}
