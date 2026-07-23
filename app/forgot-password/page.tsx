"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import AuroraBackground from "@/app/components/AuroraBackground";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Ingresa tu correo."); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) setSent(true);
      else setError("Error al enviar el enlace.");
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
      <AuroraBackground />
      <div className="max-w-md w-full z-10 bg-white border border-slate-200 p-8 rounded-[32px_32px_32px_0px] shadow-lg space-y-6">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-accent uppercase tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-primary">Revisa tu correo</h2>
            <p className="text-xs text-slate-500">Si el email está registrado, recibirás un enlace para restablecer tu contraseña.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <div className="text-center space-y-2">
              <Mail className="w-8 h-8 text-accent mx-auto" />
              <h2 className="text-lg font-bold text-primary">Recuperar contraseña</h2>
              <p className="text-slate-500">Ingresa tu correo y te enviaremos un enlace.</p>
            </div>
            {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg font-semibold">{error}</div>}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-600">Correo electrónico</label>
              <input type="email" required placeholder="usuario@ejemplo.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg nicdark-btn-radius hover:bg-primary transition-colors disabled:opacity-50 cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Enviar enlace"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
