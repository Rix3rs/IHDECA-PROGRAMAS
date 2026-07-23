import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail, templateConfirmacionCompra } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const { courseSlug, nombre, email, password, paymentIntentId, amount } = await request.json();

    if (!courseSlug || !nombre || !email) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug }
    });

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } }
    });

    let user;

    if (existingUser) {
      const alreadyEnrolled = await prisma.userCourse.findUnique({
        where: { userId_courseSlug: { userId: existingUser.id, courseSlug } }
      });

      if (!alreadyEnrolled) {
        await prisma.userCourse.create({
          data: { userId: existingUser.id, courseSlug }
        });
      }

      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          cursoAsignadoSlug: existingUser.cursoAsignadoSlug
            ? (existingUser.cursoAsignadoSlug.includes(courseSlug) ? existingUser.cursoAsignadoSlug : existingUser.cursoAsignadoSlug + "," + courseSlug)
            : courseSlug,
          estadoInscripcion: existingUser.estadoInscripcion === "Aceptado" ? "Aceptado" : "Aceptado"
        }
      });
    } else {
      if (!password) {
        return NextResponse.json({ error: "Contrasena requerida para nuevos usuarios" }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          nombre,
          email: normalizedEmail,
          contrasena: hashedPassword,
          rol: "STUDENT",
          cursoAsignadoSlug: courseSlug,
          estadoInscripcion: "Aceptado",
          progreso: 0,
          empresa: "Personal"
        }
      });

      await prisma.userCourse.create({
        data: { userId: user.id, courseSlug }
      });
    }

    await prisma.pago.create({
      data: {
        amount: amount || course?.precioMxn || 0,
        currency: "mxn",
        courseSlug,
        courseTitle: course?.title || courseSlug,
        userEmail: normalizedEmail,
        userName: nombre,
        stripePaymentIntentId: paymentIntentId || null
      }
    });

    const { contrasena: _, ...safeUser } = user;

    // Send purchase confirmation email
    const precioFormateado = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount || course?.precioMxn || 0);
    try {
      await sendEmail(normalizedEmail, "Confirmacion de compra - IHDECA", templateConfirmacionCompra(nombre, course?.title || courseSlug, precioFormateado));
    } catch (emailErr) {
      console.error("Error enviando email de confirmacion:", emailErr);
    }

    createNotification("Nueva compra", `${nombre} compró "${course?.title || courseSlug}" $${amount || course?.precioMxn || 0} MXN`, "purchase", "/dashboard/admin");

    return NextResponse.json({
      success: true,
      user: safeUser,
      redirectUrl: "/dashboard/estudiante"
    });
  } catch (error: any) {
    console.error("Error al confirmar inscripcion:", error);
    return NextResponse.json(
      { error: "Error al registrar la inscripcion" },
      { status: 500 }
    );
  }
}
