import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const notifications = await (prisma as any).notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const unreadCount = await (prisma as any).notification.count({
      where: { read: false }
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Error al cargar notificaciones" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, readAll } = body;

    if (readAll) {
      await (prisma as any).notification.updateMany({
        where: { read: false },
        data: { read: true }
      });
      return NextResponse.json({ success: true });
    }

    if (id) {
      await (prisma as any).notification.update({
        where: { id },
        data: { read: true }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  } catch (error: any) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
