"use client";

import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Lock, Mail, User, LogIn } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({
  clientSecret,
  courseTitle,
  courseSlug,
  precioMxn,
}: {
  clientSecret: string;
  courseTitle: string;
  courseSlug: string;
  precioMxn: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ihdeca_user");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.nombre) setNombre(user.nombre);
          if (user.email) {
            setEmail(user.email);
            setIsReturningUser(true);
          }
        } catch {}
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe no esta listo. Intenta de nuevo.");
      return;
    }

    if (!nombre || !email) {
      setError("Completa todos los campos personales.");
      return;
    }

    if (!isReturningUser && !password) {
      setError("Crea una contrasena para tu cuenta.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { paymentIntent, error: confirmError } =
        await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/cursos/${courseSlug}/pago`,
            payment_method_data: {
              billing_details: {
                name: nombre,
                email: email,
              },
            },
          },
          redirect: "if_required",
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        const res = await fetch("/api/stripe/confirmar-inscripcion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseSlug,
            nombre,
            email,
            password,
            paymentIntentId: paymentIntent.id,
            amount: precioMxn
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Error al registrar inscripcion");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("ihdeca_user", JSON.stringify(data.user));
        }

        setSuccess(true);
        setTimeout(() => {
          router.push(data.redirectUrl || "/dashboard/estudiante");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 space-y-6 font-sans">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-primary">Pago exitoso</h3>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            Tu inscripcion a <strong>{courseTitle}</strong> ha sido confirmada.
            Redirigiendo a tu dashboard...
          </p>
        </div>
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-accent" />
      </div>
    );
  }

  const precioFormateado = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(precioMxn);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-sans">
      {error && (
        <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-xs font-semibold text-red-700 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Datos personales
        </h4>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="Ej. Juan Perez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Correo electronico <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
          </div>
        </div>

        {!isReturningUser && (
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Contrasena <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
            </div>
          </div>
        )}

        {isReturningUser && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-700 font-medium">
            <LogIn className="w-4 h-4 flex-shrink-0" />
            Ya tienes cuenta. El nuevo curso se agregara a tu perfil actual.
          </div>
        )}

        {isReturningUser && (
          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer hover:text-accent transition-colors font-medium">
              No eres {nombre}? Haz clic aqui
            </summary>
            <button
              type="button"
              onClick={() => {
                setIsReturningUser(false);
                setNombre("");
                setEmail("");
                localStorage.removeItem("ihdeca_user");
              }}
              className="mt-2 text-accent hover:underline font-bold"
            >
              Comprar con otra cuenta
            </button>
          </details>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Datos de pago
        </h4>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Procesando pago...
          </>
        ) : (
          `Pagar ${precioFormateado}`
        )}
      </button>
    </form>
  );
}

export default function StripeCheckoutForm({
  clientSecret,
  courseTitle,
  courseSlug,
  precioMxn,
}: {
  clientSecret: string;
  courseTitle: string;
  courseSlug: string;
  precioMxn: number;
}) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#E67E22",
        colorBackground: "#ffffff",
        colorText: "#0F2C59",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "12px",
        spacingUnit: "4px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        clientSecret={clientSecret}
        courseTitle={courseTitle}
        courseSlug={courseSlug}
        precioMxn={precioMxn}
      />
    </Elements>
  );
}
