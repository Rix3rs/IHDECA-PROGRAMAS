"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import AuroraBackground from "@/app/components/AuroraBackground";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !contrasena) {
      setError("Por favor completa el correo y la contraseña.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión.");
      }

      // Save user session in localStorage
      if (typeof window !== "undefined" && data.user) {
        localStorage.setItem("ihdeca_user", JSON.stringify(data.user));
      }

      // Redirect to role dashboard
      router.push(data.redirectUrl || "/dashboard/admin");
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-primary bg-slate-50">
      <AuroraBackground />

      {/* Top Left Navigation Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-accent uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al sitio público
        </Link>
      </div>

      <div className="max-w-md w-full z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link href="/">
            <img
              src="/logo.webp"
              alt="IHDECA Programas"
              className="h-12 w-auto mx-auto object-contain transition-transform hover:scale-105"
            />
          </Link>
          <div className="space-y-1">
            <h1 className="font-academic text-2xl sm:text-3xl font-black tracking-tight text-primary">
              Iniciar Sesión
            </h1>
            <p className="text-xs text-text-slate font-medium">
              Acceso a la plataforma de IHDECA Programas.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200/80 p-8 rounded-[40px_40px_40px_0px] shadow-xl relative backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-xs font-semibold text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="usuario@ihdecaprogramas.com.mx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Contraseña <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-xl nicdark-btn-radius shadow-md transition-colors disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Ingresar al Sistema
                </>
              )}
            </button>
            <Link href="/forgot-password"
              className="block text-center text-[10px] text-slate-400 hover:text-accent font-medium mt-3 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </form>
        </div>

      </div>
    </div>
  );
}
