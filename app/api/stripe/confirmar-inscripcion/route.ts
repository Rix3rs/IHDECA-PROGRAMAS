import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth";
import { getSession } from "@/lib/api-auth";
import { sendEmail, templateConfirmacionCompra } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const { courseSlug, nombre, email, password, paymentIntentId } = await request.json();
    if (!courseSlug || !nombre || !email || !paymentIntentId) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course?.precioMxn) {
      return NextResponse.json({ error: "Curso o precio no válido" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(String(paymentIntentId));
    const expectedAmount = course.precioMxn * 100;
    if (
      paymentIntent.status !== "succeeded" ||
      paymentIntent.currency !== "mxn" ||
      paymentIntent.amount_received !== expectedAmount ||
      paymentIntent.metadata.courseSlug !== courseSlug
    ) {
      return NextResponse.json({ error: "El pago no pudo ser verificado" }, { status: 400 });
    }

    const existingPayment = await prisma.pago.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id }
    });
    if (existingPayment && existingPayment.userEmail !== normalizedEmail) {
      return NextResponse.json({ error: "Este pago ya fue utilizado" }, { status: 409 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } }
    });
    if (!existingUser && (!password || String(password).length < 6)) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const user = await prisma.$transaction(async (tx) => {
      let enrolledUser = existingUser;
      if (!enrolledUser) {
        enrolledUser = await tx.user.create({
          data: {
            nombre: String(nombre).trim(),
            email: normalizedEmail,
            contrasena: await bcrypt.hash(String(password), 10),
            rol: "STUDENT",
            cursoAsignadoSlug: courseSlug,
            estadoInscripcion: "Aceptado",
            progreso: 0,
            empresa: "Personal"
          }
        });
      }

      await tx.userCourse.upsert({
        where: { userId_courseSlug: { userId: enrolledUser.id, courseSlug } },
        update: {},
        create: { userId: enrolledUser.id, courseSlug }
      });

      const currentSlugs = enrolledUser.cursoAsignadoSlug
        ? enrolledUser.cursoAsignadoSlug.split(",").map((slug) => slug.trim()).filter(Boolean)
        : [];
      if (!currentSlugs.includes(courseSlug)) currentSlugs.push(courseSlug);

      enrolledUser = await tx.user.update({
        where: { id: enrolledUser.id },
        data: { cursoAsignadoSlug: currentSlugs.join(","), estadoInscripcion: "Aceptado" }
      });

      if (!existingPayment) {
        await tx.pago.create({
          data: {
            amount: course.precioMxn!,
            currency: "mxn",
            courseSlug,
            courseTitle: course.title,
            userEmail: normalizedEmail,
            userName: String(nombre).trim(),
            stripePaymentIntentId: paymentIntent.id
          }
        });
      }
      return enrolledUser;
    });

    if (!existingPayment) {
      const price = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(course.precioMxn);
      try {
        await sendEmail(normalizedEmail, "Confirmacion de compra - IHDECA", templateConfirmacionCompra(String(nombre), course.title, price));
      } catch (emailError) {
        console.error("Error enviando email de confirmacion:", emailError);
      }
      void createNotification("Nueva compra", `${nombre} compró "${course.title}" ${price}`, "purchase", "/dashboard/admin");
    }

    const { contrasena: _password, ...safeUser } = user;
    const session = await getSession();
    const canAuthenticate = !existingUser || session?.id === user.id;
    const response = NextResponse.json({
      success: true,
      user: safeUser,
      redirectUrl: canAuthenticate ? "/dashboard/estudiante" : "/login"
    });

    if (canAuthenticate) {
      const token = await signJWT({ id: user.id, email: user.email, nombre: user.nombre, rol: user.rol });
      response.cookies.set("ihdeca_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 86400,
        path: "/"
      });
    }
    return response;
  } catch (error: unknown) {
    console.error("Error al confirmar inscripcion:", error);
    return NextResponse.json({ error: "Error al verificar y registrar la inscripción" }, { status: 500 });
  }
}
