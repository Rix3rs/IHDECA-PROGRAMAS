import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { courseSlug } = await request.json();

    if (!courseSlug) {
      return NextResponse.json({ error: "Slug del curso es requerido" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug }
    });

    if (!course) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    if (!course.precioMxn) {
      return NextResponse.json({ error: "Este curso aún no tiene precio definido" }, { status: 400 });
    }

    if (course.precioMxn < 10) {
      return NextResponse.json({ error: "El precio mínimo para pagar con tarjeta es $10.00 MXN" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.precioMxn * 100, // Stripe usa centavos
      currency: "mxn",
      metadata: {
        courseSlug,
        courseTitle: course.title
      },
      automatic_payment_methods: { enabled: true }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Error creando PaymentIntent:", error);
    return NextResponse.json(
      { error: "Error al crear la sesión de pago" },
      { status: 500 }
    );
  }
}
