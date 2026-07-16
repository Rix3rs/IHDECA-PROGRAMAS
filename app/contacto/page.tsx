"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, CheckCircle2, Send, Loader2, Info } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { courses } from "@/app/data/courses";

export default function ContactoPage() {
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

    setTimeout(() => {
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
    }, 1200);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-24 font-sans text-primary">
        {/* Page Hero */}
        <section className="bg-primary text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-[#17325D] to-[#0F223F] -z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex px-3 py-1 rounded bg-accent/20 text-accent border border-accent/30 text-[9px] font-bold uppercase tracking-widest">
              Atención Directa
            </span>
            <h1 className="font-academic text-4xl sm:text-5xl font-black tracking-tight">
              Contacto
            </h1>
          </div>
        </section>

        {/* Contact Layout */}
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
              
              {/* Left Column: Info & Map */}
              <div className="lg:col-span-6 space-y-8">
                
                {/* Intro block */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold font-academic text-primary">
                    Escríbenos
                  </h2>
                  <p className="text-sm text-text-slate leading-relaxed font-medium">
                    Estamos listos para ayudarte a encontrar la capacitación adecuada. Solicita información sobre cursos, modalidad y proceso de inscripción.
                  </p>
                </div>

                {/* Contact list cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Phone */}
                  <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 bg-accent/10 text-accent flex items-center justify-center rounded-lg">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Llámanos / WhatsApp</h4>
                      <a href="tel:8110330553" className="text-xs font-bold text-primary hover:underline">
                        81 1033 0553
                      </a>
                    </div>
                  </div>

                  {/* Mail */}
                  <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 bg-accent/10 text-accent flex items-center justify-center rounded-lg">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Envíanos un correo</h4>
                      <a href="mailto:Informes@ihdecaprogramas.com.mx" className="text-xs font-bold text-primary hover:underline block truncate">
                        Informes@ihdeca...
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 bg-accent/10 text-accent flex items-center justify-center rounded-lg">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dirección oficinas</h4>
                      <p className="text-[10px] font-bold text-primary leading-tight">
                        Col. Obispado, Monterrey, NL.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Map Wrapper */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">
                    Ubicación Oficial
                  </h4>
                  <div className="w-full h-80 rounded-[40px_40px_40px_0px] overflow-hidden border border-slate-200 shadow-md relative bg-slate-100">
                    {/* Embedded Iframe Map */}
                    <iframe
                      src="https://maps.google.com/maps?q=Cerro%20de%20Picachos%20760,%20Obispado,%20Monterrey,%20Nuevo%20Leon,%20Mexico&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      title="Mapa de ubicación IHDECA"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 pl-3">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    Cerro de Picachos 760-L-20, Col. Obispado, Monterrey, Nuevo León, C.P. 64060
                  </p>
                </div>

              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-6 w-full max-w-xl mx-auto">
                <div className="bg-white border border-slate-200/80 p-8 rounded-[40px_40px_40px_0px] shadow-lg relative">
                  {success ? (
                    <div className="text-center py-10 space-y-6">
                      <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-primary">¡Solicitud Enviada!</h3>
                        <p className="text-xs text-slate-600 max-w-xs mx-auto">
                          Gracias por contactarte. Un asesor se comunicará contigo de forma directa al teléfono o correo provisto.
                        </p>
                      </div>
                      <button
                        onClick={() => setSuccess(false)}
                        className="px-6 py-2.5 bg-primary text-white text-[10px] uppercase tracking-wider font-bold rounded-lg hover:bg-accent transition-colors"
                      >
                        Enviar otra solicitud
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-primary">Escríbenos tus dudas</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Completa el formulario y te daremos respuesta en la brevedad posible.
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
                          <label htmlFor="nombre-pag" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Nombre Completo <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="nombre-pag"
                            required
                            placeholder="Ej. Juan Pérez"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all"
                          />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                          <label htmlFor="telefono-pag" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Teléfono <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="telefono-pag"
                            required
                            placeholder="Ej. 8110330553"
                            value={form.telefono}
                            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Email */}
                        <div className="space-y-1">
                          <label htmlFor="email-pag" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Correo Electrónico <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email-pag"
                            required
                            placeholder="Ej. juan@ejemplo.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all"
                          />
                        </div>

                        {/* Empresa */}
                        <div className="space-y-1">
                          <label htmlFor="empresa-pag" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Empresa / Organización <span className="text-slate-400">(Opcional)</span>
                          </label>
                          <input
                            type="text"
                            id="empresa-pag"
                            placeholder="Ej. Mi Empresa S.A."
                            value={form.empresa}
                            onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Course Selection */}
                      <div className="space-y-1">
                        <label htmlFor="curso-pag" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                          Curso de Interés <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="curso-pag"
                          required
                          value={form.curso}
                          onChange={(e) => setForm({ ...form, curso: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                        >
                          <option value="" disabled>Selecciona una opción</option>
                          {courses.map((c) => (
                            <option key={c.slug} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                          <option value="Consulta General">Otra Consulta / General</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div className="space-y-1">
                        <label htmlFor="mensaje-pag" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600">
                          Mensaje <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="mensaje-pag"
                          required
                          rows={3}
                          placeholder="Cuéntanos más sobre tus necesidades..."
                          value={form.mensaje}
                          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent resize-none font-sans"
                        />
                      </div>

                      {/* Captcha */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <label htmlFor="captcha-pag" className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-accent" />
                          Pregunta de seguridad
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary bg-slate-200 px-3 py-2 rounded-lg">
                            ¿Cuánto es {captcha.num1} + {captcha.num2}?
                          </span>
                          <input
                            type="number"
                            id="captcha-pag"
                            required
                            placeholder="Resultado"
                            value={form.captchaAnswer}
                            onChange={(e) => setForm({ ...form, captchaAnswer: e.target.value })}
                            className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </div>
                      </div>

                      {/* Privacy checkbox */}
                      <div className="flex items-start gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="aviso-pag"
                          required
                          checked={form.aviso}
                          onChange={(e) => setForm({ ...form, aviso: e.target.checked })}
                          className="w-4.5 h-4.5 mt-0.5 border-slate-300 text-accent focus:ring-accent rounded cursor-pointer"
                        />
                        <label htmlFor="aviso-pag" className="text-[10px] text-slate-600 leading-tight font-medium">
                          Acepto que mis datos sean tratados conforme al{" "}
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
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
      </main>

      <Footer />
    </>
  );
}
