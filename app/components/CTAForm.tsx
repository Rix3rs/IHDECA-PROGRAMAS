"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Send, Loader2, Info } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { courses } from "@/app/data/courses";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTAForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    curso: "",
    empresa: "",
    mensaje: "",
    aviso: false,
    captchaAnswer: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, sum: 0 });

  const [courseList, setCourseList] = useState<any[]>(courses);

  // Generate arithmetic captcha and fetch dynamic courses from DB
  useEffect(() => {
    generateCaptcha();

    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCourseList(data);
        }
      })
      .catch(err => console.error("Error loading courses in CTAForm:", err));
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ num1, num2, sum: num1 + num2 });
    setForm(prev => ({ ...prev, captchaAnswer: "" }));
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(".cta-left-anim",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "power3.out" }
    );

    tl.fromTo(".cta-right-anim",
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !form.email || !form.curso || !form.mensaje) {
      setError("Por favor, completa los campos requeridos.");
      return;
    }

    if (!form.aviso) {
      setError("Debes aceptar el Aviso de Privacidad.");
      return;
    }

    if (parseInt(form.captchaAnswer, 10) !== captcha.sum) {
      setError("La respuesta a la pregunta de seguridad es incorrecta.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          telefono: form.telefono,
          email: form.email,
          curso: form.curso,
          empresa: form.empresa,
          mensaje: form.mensaje
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al enviar la solicitud");
      }

      setLoading(false);
      setSuccess(true);
      setForm({
        nombre: "",
        telefono: "",
        email: "",
        curso: "",
        empresa: "",
        mensaje: "",
        aviso: false,
        captchaAnswer: "",
      });
      generateCaptcha();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "No se pudo enviar la solicitud. Intenta de nuevo.");
    }
  };

  return (
    <section ref={containerRef} id="contacto" className="py-24 bg-transparent text-primary relative overflow-hidden border-t border-slate-200/60">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Form Info Left */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="cta-left-anim inline-flex px-3 py-1 rounded bg-accent/10 text-accent border border-accent/20 text-[9px] font-bold uppercase tracking-widest">
              Solicita información
            </span>
            <h2 className="cta-left-anim font-academic text-3xl sm:text-4xl lg:text-5xl font-black text-primary leading-tight">
              Comienza tu formación <br className="hidden sm:inline" />
              con IHDECA
            </h2>
            <p className="cta-left-anim text-base sm:text-lg text-text-slate leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
              Registra tus datos y nos pondremos en contacto contigo para compartir información sobre cursos, modalidad y proceso de inscripción.
            </p>

            {/* List items */}
            <div className="cta-left-anim space-y-4 max-w-lg mx-auto lg:mx-0 pt-4 text-left font-sans">
              {[
                { title: "Desarrollo Profesional", text: "Cursos orientados al desarrollo profesional y laboral." },
                { title: "Flexibilidad Total", text: "Modalidad en línea para facilitar el acceso a la formación." },
                { title: "Atención Especializada", text: "Atención directa para personas, equipos y organizaciones." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-primary">{item.title}</h4>
                    <p className="text-xs text-slate-600 font-medium">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Container Right */}
          <div className="cta-right-anim lg:col-span-6 w-full max-w-xl mx-auto">
            <div className="cta-card bg-white border border-slate-200/80 p-8 rounded-[40px_40px_40px_0px] shadow-lg relative">
              {success ? (
                /* Success Layout */
                <div className="text-center py-10 space-y-6 font-sans">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary">
                      ¡Solicitud Enviada!
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      Hemos recibido tu información. Un coordinador se comunicará contigo en breve para brindarte todos los detalles.
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-primary text-white text-[10px] uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius hover:bg-accent transition-colors cursor-pointer"
                  >
                    Hacer otra consulta
                  </button>
                </div>
              ) : (
                /* Main Form Layout */
                <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                  <div className="text-center lg:text-left space-y-1">
                    <h3 className="text-xl font-bold text-primary">
                      Formulario de Inscripción / Consulta
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Completa los siguientes campos para ser atendido de forma personalizada.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 text-xs font-semibold text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label htmlFor="nombre" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Nombre Completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        placeholder="Ej. Juan Pérez"
                        required
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans placeholder-slate-400"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="telefono" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        placeholder="Ej. 8110330553"
                        required
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Correo Electrónico <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Ej. juan@ejemplo.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans placeholder-slate-400"
                      />
                    </div>

                    {/* Empresa */}
                    <div className="space-y-1">
                      <label htmlFor="empresa" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Empresa / Organización <span className="text-slate-400">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        id="empresa"
                        placeholder="Ej. Mi Empresa S.A."
                        value={form.empresa}
                        onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Course dropdown */}
                  <div className="space-y-1">
                    <label htmlFor="curso" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      Curso de Interés <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="curso"
                      required
                      value={form.curso}
                      onChange={(e) => setForm({ ...form, curso: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans cursor-pointer text-slate-800"
                    >
                      <option value="" disabled className="text-slate-400">Selecciona una opción</option>
                      {courseList.map((c: any) => (
                        <option key={c.slug} value={c.title} className="text-slate-800">
                          {c.title}
                        </option>
                      ))}
                      <option value="Consulta General" className="text-slate-800">Otra Consulta / General</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label htmlFor="mensaje" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      Mensaje / Dudas específicas <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      rows={3}
                      placeholder="Escribe aquí tus comentarios o preguntas..."
                      required
                      value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Captcha */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label htmlFor="captcha" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-accent" />
                      Pregunta de seguridad (Evitar Spam)
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-primary bg-slate-200 px-3 py-2 rounded-lg">
                        ¿Cuánto es {captcha.num1} + {captcha.num2}?
                      </span>
                      <input
                        type="number"
                        id="captcha"
                        required
                        placeholder="Respuesta"
                        value={form.captchaAnswer}
                        onChange={(e) => setForm({ ...form, captchaAnswer: e.target.value })}
                        className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Privacy Checkbox */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="aviso"
                      required
                      checked={form.aviso}
                      onChange={(e) => setForm({ ...form, aviso: e.target.checked })}
                      className="w-4.5 h-4.5 mt-0.5 border-slate-300 text-accent focus:ring-accent rounded cursor-pointer"
                    />
                    <label htmlFor="aviso" className="text-[10px] text-slate-600 leading-tight font-medium">
                      Acepto que mis datos sean tratados conforme al{" "}
                      <Link href="/aviso-de-privacidad" className="text-accent hover:underline font-bold" target="_blank">
                        Aviso de Privacidad
                      </Link>
                      .
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Enviar solicitud
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
