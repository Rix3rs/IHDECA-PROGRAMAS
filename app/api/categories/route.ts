import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await (prisma as any).category.findMany({
      orderBy: { name: "asc" }
    });

    const courses = await prisma.course.findMany({
      where: { publicado: true }
    });

    const countMap: Record<string, number> = {};
    for (const c of courses) {
      countMap[c.categorySlug] = (countMap[c.categorySlug] || 0) + 1;
    }

    const withCounts = categories.map((cat: any) => ({
      ...cat,
      count: `${countMap[cat.slug] || 0} curso${(countMap[cat.slug] || 0) !== 1 ? "s" : ""}`
    }));

    return NextResponse.json(withCounts);
  } catch (error: any) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Error al cargar categorias" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, iconName, color, textColor, borderColor, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const exists = await (prisma as any).category.findUnique({ where: { slug } });
    if (exists) {
      return NextResponse.json({ error: "Ya existe una categoria con ese nombre" }, { status: 409 });
    }

    const category = await (prisma as any).category.create({
      data: {
        slug,
        name,
        description: description || "",
        iconName: iconName || "HelpCircle",
        color: color || "bg-blue-50/70",
        textColor: textColor || "text-blue-600",
        borderColor: borderColor || "border-blue-100",
        imageUrl: imageUrl || null,
        count: "0 cursos"
      }
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Error al crear categoria" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, name, description, iconName, color, textColor, borderColor, imageUrl } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug requerido" }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (iconName !== undefined) updateData.iconName = iconName;
    if (color !== undefined) updateData.color = color;
    if (textColor !== undefined) updateData.textColor = textColor;
    if (borderColor !== undefined) updateData.borderColor = borderColor;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;

    const category = await (prisma as any).category.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("PUT /api/categories error:", error);
    return NextResponse.json({ error: "Error al actualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug requerido" }, { status: 400 });
    }

    await (prisma as any).category.delete({ where: { slug } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json({ error: "Error al eliminar categoria" }, { status: 500 });
  }
}
