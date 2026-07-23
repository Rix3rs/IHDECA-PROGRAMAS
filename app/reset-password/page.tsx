"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AuroraBackground from "@/app/components/AuroraBackground";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
        <AuroraBackground />
        <div className="max-w-md w-full z-10 bg-white border border-slate-200 p-8 rounded-[32px_32px_32px_0px] shadow-lg text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-primary">Enlace inválido</h2>
          <p className="text-xs text-slate-500">Solicita un nuevo enlace desde la página de inicio de sesión.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-xs font-bold rounded-lg uppercase hover:bg-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
      <AuroraBackground />
      <div className="max-w-md w-full z-10 bg-white border border-slate-200 p-8 rounded-[32px_32px_32px_0px] shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <Lock className="w-8 h-8 text-accent mx-auto" />
          <h2 className="text-lg font-bold text-primary">Nueva contraseña</h2>
          <p className="text-xs text-slate-500">Ingresa tu nueva contraseña para continuar.</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm text-slate-700 font-medium">Contraseña actualizada correctamente.</p>
            <Link href="/login" className="inline-flex px-5 py-2.5 bg-accent text-white text-xs font-bold rounded-lg uppercase hover:bg-primary transition-colors">
              Iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg font-semibold">{error}</div>}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-600">Nueva contraseña</label>
              <input type="password" required minLength={6} placeholder="Mínimo 6 caracteres"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-600">Confirmar contraseña</label>
              <input type="password" required minLength={6} placeholder="Repite tu contraseña"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg nicdark-btn-radius hover:bg-primary transition-colors disabled:opacity-50 cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Cambiar contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
