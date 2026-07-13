"use client";

import React, { useState, useRef } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTAForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    curso: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const cursosDisponibles = [
    "Desarrollo Web Full Stack Moderno",
    "Marketing Digital & Estrategias de Growth",
    "Inglés Corporativo Avanzado & Negocios",
    "Diseño de Interfaces & Experiencia de Usuario (UI/UX)",
    "Otro Curso / Consulta General",
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(".cta-left-anim",
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power2.out" }
    );

    tl.fromTo(".cta-right-anim",
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );

    const refreshTrigger = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshTrigger);
    const timeoutId = setTimeout(refreshTrigger, 500);

    return () => {
      window.removeEventListener("load", refreshTrigger);
      clearTimeout(timeoutId);
    };
  }, { scope: containerRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.curso) {
      setError("Por favor, completa todos los campos del formulario.");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate API Response
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ nombre: "", email: "", curso: "" });
    }, 1200);
  };

  return (
    <section ref={containerRef} id="contacto" className="py-24 bg-transparent text-primary relative overflow-hidden border-t border-slate-200/60">
      {/* Background Graphic Lines adapted to light styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Form Info Left */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="cta-left-anim inline-flex px-3 py-1 rounded bg-accent/10 text-accent border border-accent/20 text-[9px] font-bold uppercase tracking-widest">
              Admisiones Abiertas
            </span>
            <h2 className="cta-left-anim font-academic text-3xl sm:text-4xl lg:text-5xl font-black text-primary leading-tight">
              Comienza tu Ruta <br className="hidden sm:inline" />
              de Aprendizaje
            </h2>
            <p className="cta-left-anim text-base sm:text-lg text-text-slate leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
              Registra tus datos hoy mismo y recibe asesoría académica sobre planes curriculares, opciones de becas por desempeño y fechas de matriculación.
            </p>

            {/* List items */}
            <div className="cta-left-anim space-y-4 max-w-lg mx-auto lg:mx-0 pt-4 text-left font-sans">
              {[
                "Orientación curricular gratuita y sin compromiso.",
                "Programas de apoyo económico y financiamiento educativo.",
                "Fechas de convocatorias y accesos a la plataforma de demostración.",
              ].map((text, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 font-bold">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Container Right */}
          <div className="cta-right-anim lg:col-span-5 w-full max-w-md mx-auto">
            <div className="cta-card bg-white border border-slate-200/80 p-8 rounded-[40px_40px_40px_0px] shadow-lg relative">
              {success ? (
                /* Success Layout */
                <div className="text-center py-10 space-y-6 font-sans">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary">
                      ¡Registro Recibido!
                    </h3>
                    <p className="text-xs text-slate-600">
                      Hemos registrado tu interés. Un asesor académico se comunicará contigo por correo electrónico en las próximas 24 horas.
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-primary text-white text-[10px] uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius hover:bg-accent transition-colors cursor-pointer"
                  >
                    Nueva Consulta
                  </button>
                </div>
              ) : (
                /* Main Form Layout */
                <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                  <div className="text-center lg:text-left space-y-1">
                    <h3 className="text-xl font-bold text-primary">
                      Solicitud de Información
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Completa tus datos para recibir asesoramiento personalizado.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 text-xs font-semibold text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="nombre" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      placeholder="Ej. Juan Pérez"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans placeholder-slate-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Ej. juan@ejemplo.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans placeholder-slate-500"
                    />
                  </div>

                  {/* Course dropdown */}
                  <div className="space-y-1.5">
                    <label htmlFor="curso" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Curso de Interés
                    </label>
                    <select
                      id="curso"
                      value={form.curso}
                      onChange={(e) => setForm({ ...form, curso: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans cursor-pointer text-slate-800"
                    >
                      <option value="" disabled className="text-slate-500">Selecciona una opción</option>
                      {cursosDisponibles.map((c, i) => (
                        <option key={i} value={c} className="text-slate-800">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Enviar Solicitud
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
