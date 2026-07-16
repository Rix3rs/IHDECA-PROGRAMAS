"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, BookOpen, Star, ArrowLeft, Check, CheckCircle2, Send, Loader2, Info } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { courses as staticCourses, Course } from "@/app/data/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | undefined>(() => {
    return staticCourses.find((c) => c.slug === slug);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ihdeca_courses");
      if (saved) {
        const parsed: Course[] = JSON.parse(saved);
        const found = parsed.find((c) => c.slug === slug);
        setCourse(found);
      }
    }
  }, [slug]);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    empresa: "",
    mensaje: "",
    aviso: false,
    captchaAnswer: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, sum: 0 });

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ num1, num2, sum: num1 + num2 });
    setForm(prev => ({ ...prev, captchaAnswer: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !form.email || !form.mensaje) {
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

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({
        nombre: "",
        telefono: "",
        email: "",
        empresa: "",
        mensaje: "",
        aviso: false,
        captchaAnswer: "",
      });
      generateCaptcha();
    }, 1200);
  };

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-32 pb-24 text-center space-y-6 font-sans max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-inner">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Curso no encontrado</h1>
          <p className="text-sm text-slate-500">
            El curso solicitado no existe o ha sido reestructurado en nuestro catálogo actual.
          </p>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al catálogo
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-24 font-sans">
        {/* Course Header Banner */}
        <section className={`bg-gradient-to-br ${course.gradient} text-white py-16 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/cursos"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Catálogo de cursos
              </Link>
              <span className="bg-white text-primary font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-md border border-white/10 shadow-sm">
                {course.category}
              </span>
            </div>

            <h1 className="font-academic text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-4xl">
              {course.title}
            </h1>

            {/* Course Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${course.instructorColor} text-white font-bold flex items-center justify-center border border-white/20`}>
                  {course.instructorInitials}
                </div>
                <span>Instructor: <strong>{course.instructor}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span><strong>{course.rating.toFixed(1)}</strong> de valoración</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-white/80" />
                <span>Modalidad: <strong>{course.modalidad}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Detail Content Section */}
        <section className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-primary border-l-4 border-accent pl-3">
                    Descripción del curso
                  </h2>
                  <p className="text-sm text-text-slate leading-relaxed font-sans">
                    {course.extendedDescription}
                  </p>
                </div>

                {/* Objectives */}
                {course.objetivos && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-primary border-l-4 border-accent pl-3">
                      Objetivos de aprendizaje
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {course.objetivos.map((obj, i) => (
                        <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-700 font-bold">{obj}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Syllabus / Temario */}
                {course.temario && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-primary border-l-4 border-accent pl-3">
                      Temario del programa
                    </h2>
                    <div className="relative border-l border-slate-200 pl-6 space-y-6">
                      {course.temario.map((item, i) => (
                        <div key={i} className="relative">
                          {/* Timeline dot */}
                          <span className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white border-2 border-white" />
                          
                          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-1">
                            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                              Módulo {i + 1}
                            </span>
                            <h4 className="text-xs font-bold text-primary">{item}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Audience */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-primary border-l-4 border-accent pl-3">
                    ¿A quién va dirigido?
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {course.dirigidoA.map((item, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Contact & Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Sidebar Card */}
                <div className="bg-white border border-slate-200/80 rounded-[40px_40px_40px_0px] p-6 shadow-md space-y-6">
                  <h3 className="text-lg font-bold text-primary pb-3 border-b border-slate-100">
                    Ficha Técnica
                  </h3>
                  
                  <div className="space-y-4 font-sans text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500 font-semibold">Modalidad:</span>
                      <strong className="text-primary">{course.modalidad}</strong>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500 font-semibold">Fechas:</span>
                      <strong className="text-accent">{course.fechas}</strong>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500 font-semibold">Inversión:</span>
                      <strong className="text-primary">{course.price}</strong>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500 font-semibold">Duración:</span>
                      <strong className="text-primary">{course.duration}</strong>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500 font-semibold">Lecciones:</span>
                      <strong className="text-primary">{course.lessons}</strong>
                    </div>
                  </div>

                  <a
                    href="#contacto-ficha"
                    className="w-full text-center inline-block px-5 py-3 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary transition-colors cursor-pointer shadow-sm"
                  >
                    Inscríbete / Solicitar Info
                  </a>
                </div>

                {/* Contact Form pre-filled for this course */}
                <div id="contacto-ficha" className="bg-white border border-slate-200/80 rounded-[40px_40px_40px_0px] p-6 shadow-md">
                  {success ? (
                    <div className="text-center py-8 space-y-4 font-sans">
                      <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-primary">Solicitud recibida</h4>
                        <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                          Te enviaremos los detalles de inscripción al curso en menos de 24 horas hábiles.
                        </p>
                      </div>
                      <button
                        onClick={() => setSuccess(false)}
                        className="px-4 py-2 bg-primary text-white text-[9px] uppercase tracking-wider font-bold rounded-lg hover:bg-accent transition-colors"
                      >
                        Enviar otra duda
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                      <div>
                        <h4 className="text-sm font-bold text-primary">Inscríbete a este curso</h4>
                        <p className="text-[10px] text-slate-500">
                          Completa el formulario para reservar tu lugar de forma provisional.
                        </p>
                      </div>

                      {error && (
                        <div className="p-2 bg-red-50 border-l-4 border-red-500 text-[10px] font-semibold text-red-700 rounded-lg">
                          {error}
                        </div>
                      )}

                      {/* Locked course preview */}
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                        <span className="text-[8px] font-bold text-accent uppercase tracking-wider">Selección actual</span>
                        <div className="font-bold text-primary truncate">{course.title}</div>
                      </div>

                      {/* Name */}
                      <div className="space-y-1">
                        <label htmlFor="nombre-ficha" className="block text-[8px] font-bold uppercase tracking-wider text-slate-600">
                          Nombre Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="nombre-ficha"
                          required
                          placeholder="Ej. Juan Pérez"
                          value={form.nombre}
                          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label htmlFor="tel-ficha" className="block text-[8px] font-bold uppercase tracking-wider text-slate-600">
                          Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="tel-ficha"
                          required
                          placeholder="Ej. 8110330553"
                          value={form.telefono}
                          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label htmlFor="email-ficha" className="block text-[8px] font-bold uppercase tracking-wider text-slate-600">
                          Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email-ficha"
                          required
                          placeholder="Ej. juan@ejemplo.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans"
                        />
                      </div>

                      {/* Empresa */}
                      <div className="space-y-1">
                        <label htmlFor="empresa-ficha" className="block text-[8px] font-bold uppercase tracking-wider text-slate-600">
                          Empresa <span className="text-slate-400">(Opcional)</span>
                        </label>
                        <input
                          type="text"
                          id="empresa-ficha"
                          placeholder="Ej. Mi Empresa S.A."
                          value={form.empresa}
                          onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-1">
                        <label htmlFor="msg-ficha" className="block text-[8px] font-bold uppercase tracking-wider text-slate-600">
                          Mensaje <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="msg-ficha"
                          required
                          rows={2}
                          placeholder="Indícanos si tienes dudas o solicitudes..."
                          value={form.mensaje}
                          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all font-sans resize-none"
                        />
                      </div>

                      {/* Captcha */}
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <label htmlFor="cap-ficha" className="block text-[8px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-accent" />
                          Seguridad anti-spam
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-primary bg-slate-200 px-2 py-1.5 rounded-lg whitespace-nowrap">
                            {captcha.num1} + {captcha.num2} =
                          </span>
                          <input
                            type="number"
                            id="cap-ficha"
                            required
                            placeholder="Resultado"
                            value={form.captchaAnswer}
                            onChange={(e) => setForm({ ...form, captchaAnswer: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-sans"
                          />
                        </div>
                      </div>

                      {/* Privacy checkbox */}
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="aviso-ficha"
                          required
                          checked={form.aviso}
                          onChange={(e) => setForm({ ...form, aviso: e.target.checked })}
                          className="w-4.5 h-4.5 mt-0.5 border-slate-300 text-accent focus:ring-accent rounded cursor-pointer"
                        />
                        <label htmlFor="aviso-ficha" className="text-[9px] text-slate-600 leading-tight font-medium">
                          Acepto el{" "}
                          <Link href="/aviso-de-privacidad" className="text-accent hover:underline font-bold" target="_blank">
                            Aviso de Privacidad
                          </Link>
                          .
                        </label>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent hover:bg-primary text-white text-[10px] uppercase tracking-wider font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            Enviar solicitud
                            <Send className="w-3 h-3" />
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
      </main>

      <Footer />
    </>
  );
}
