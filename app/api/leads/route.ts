import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

// GET /api/leads - List all leads for Admin Dashboard
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json({ error: "Error al cargar los prospectos (leads)" }, { status: 500 });
  }
}

// POST /api/leads - Create a new lead from contact forms
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, telefono, email, curso, empresa, mensaje } = body;

    if (!nombre || !telefono || !email || !curso || !mensaje) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        nombre,
        telefono,
        email,
        curso,
        empresa: empresa || null,
        mensaje,
        estado: "Nuevo",
      },
    });

    createNotification("Nuevo prospecto", `${nombre} solicitó info sobre "${curso}"`, "lead", "/dashboard/admin");

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "Error al registrar la solicitud" }, { status: 500 });
  }
}

// PATCH /api/leads - Update lead status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, estado } = body;

    if (!id || !estado) {
      return NextResponse.json({ error: "ID y estado son requeridos" }, { status: 400 });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { estado },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error("PATCH /api/leads error:", error);
    return NextResponse.json({ error: "Error al actualizar estado del lead" }, { status: 500 });
  }
}

// DELETE /api/leads - Delete a lead by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID del lead es requerido" }, { status: 400 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/leads error:", error);
    return NextResponse.json({ error: "Error al eliminar el lead" }, { status: 500 });
  }
}
