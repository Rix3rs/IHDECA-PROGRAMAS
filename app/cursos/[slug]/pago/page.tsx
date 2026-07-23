"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StripeCheckoutForm from "@/app/components/StripeCheckoutForm";

export default function PagoCursoPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [course, setCourse] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((c: any) => c.slug === slug);
          if (!found) {
            setError("Curso no encontrado.");
            setLoading(false);
            return;
          }
          setCourse(found);

          if (!found.precioMxn) {
            setError("Este curso aun no tiene precio definido.");
            setLoading(false);
            return;
          }

          const piRes = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseSlug: slug }),
          });

          const piData = await piRes.json();
          if (!piRes.ok) {
            throw new Error(piData.error || "Error al iniciar el pago");
          }

          setClientSecret(piData.clientSecret);
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar el curso.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [slug]);

  const precioFormateado = course?.precioMxn
    ? new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(course.precioMxn)
    : "...";

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-28 pb-20 font-sans text-primary bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={`/cursos/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-accent uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al curso
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
              <p className="text-sm text-slate-600 font-medium">
                Preparando el pago...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white border border-slate-200/80 p-8 rounded-[40px_40px_40px_0px] shadow-sm text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h2 className="text-lg font-bold text-primary">Error</h2>
              <p className="text-sm text-slate-600">{error}</p>
              <Link
                href="/cursos"
                className="inline-flex items-center px-6 py-2.5 bg-accent text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius hover:bg-primary transition-colors cursor-pointer"
              >
                Ver todos los cursos
              </Link>
            </div>
          ) : (
            <div>
              <div className="bg-white border border-slate-200/80 rounded-[40px_40px_40px_0px] p-6 mb-6 shadow-sm">
                <h1 className="font-academic text-xl sm:text-2xl font-bold text-primary">
                  {course?.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Completa el formulario para inscribirte y realizar el pago.
                </p>
                <div className="mt-3 inline-flex px-3 py-1 rounded bg-accent/10 text-accent text-xs font-bold">
                  {precioFormateado} MXN
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[40px_40px_40px_0px] shadow-sm">
                {clientSecret && (
                  <StripeCheckoutForm
                    clientSecret={clientSecret}
                    courseTitle={course?.title}
                    courseSlug={slug}
                    precioMxn={course?.precioMxn}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
