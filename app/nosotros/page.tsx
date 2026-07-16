import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Award, Target, Users, BookOpen, ArrowRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Nosotros | IHDECA Programas",
  description: "Somos una institución dedicada a la capacitación profesional y consultoría. Conoce nuestra misión, objetivos y enfoque de formación laboral y de liderazgo.",
  keywords: ["IHDECA", "misión", "capacitación", "desarrollo profesional", "liderazgo"],
};

export default function NosotrosPage() {
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
              Institucional
            </span>
            <h1 className="font-academic text-4xl sm:text-5xl font-black tracking-tight">
              Nosotros
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans">
              Somos una institución dedicada a la capacitación profesional y consultoría.
            </p>
          </div>
        </section>

        {/* Bienvenido a IHDECA Section */}
        <section className="py-20 bg-transparent">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              
              <div className="md:col-span-7 space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Bienvenido a IHDECA
                </span>
                <h2 className="font-academic text-2xl sm:text-3xl font-bold leading-tight">
                  Institución dedicada a la capacitación profesional y consultoría
                </h2>
                <p className="text-sm text-text-slate leading-relaxed font-sans">
                  IHDECA es una institución enfocada en la capacitación profesional y la consultoría. Nuestro propósito es contribuir al desarrollo de habilidades que fortalezcan el desempeño de personas, equipos y organizaciones.
                </p>
                <p className="text-sm text-text-slate leading-relaxed font-sans">
                  Trabajamos con un enfoque serio, práctico y profesional, orientado a generar aprendizaje útil para distintos entornos laborales.
                </p>
              </div>

              {/* Decorative Brand Card */}
              <div className="md:col-span-5">
                <div className="nicdark-card p-8 bg-slate-50 border border-slate-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-125" />
                  
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-[12px_12px_12px_0px]">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Capacitación de Excelencia</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Comprometidos con la generación de programas prácticos y directamente aplicables al desarrollo de tu carrera.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Mission and Objectives (2-column visual grid) */}
        <section className="py-16 bg-slate-50 border-y border-slate-200/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Mision Card */}
              <div className="bg-white border border-slate-200 rounded-[40px_40px_40px_0px] p-8 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 text-accent flex items-center justify-center rounded-[12px_12px_12px_0px]">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-academic text-xl font-bold">Misión</h3>
                  <p className="text-xs text-text-slate leading-relaxed font-sans font-medium">
                    Contribuir al desarrollo profesional de personas, equipos y organizaciones mediante programas de capacitación que fortalezcan habilidades clave para el liderazgo, la comunicación, la colaboración y el desempeño laboral.
                  </p>
                </div>
              </div>

              {/* Objetivo Card */}
              <div className="bg-white border border-slate-200 rounded-[40px_40px_40px_0px] p-8 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 text-accent flex items-center justify-center rounded-[12px_12px_12px_0px]">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-academic text-xl font-bold">Objetivo</h3>
                  <p className="text-xs text-text-slate leading-relaxed font-sans font-medium">
                    Brindar formación práctica y accesible que ayude a los participantes a mejorar sus competencias profesionales y a las organizaciones a fortalecer el talento de sus equipos.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Audience Section */}
        <section className="py-20 bg-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Público objetivo</span>
              <h2 className="font-academic text-2xl sm:text-3xl font-bold">¿A quién va dirigida nuestra formación?</h2>
            </div>
            
            <div className="p-8 bg-slate-50 border border-slate-200/80 rounded-[40px_40px_40px_0px] text-left shadow-inner space-y-6">
              <p className="text-sm text-text-slate leading-relaxed font-sans">
                Nuestros cursos están dirigidos a personas, empresas, líderes, equipos de trabajo, mandos medios, áreas administrativas, personal operativo y profesionales que buscan desarrollar nuevas habilidades para mejorar su comunicación, liderazgo, toma de decisiones y capacidad de colaboración.
              </p>
              <p className="text-sm text-text-slate leading-relaxed font-sans">
                También ofrecemos opciones para quienes buscan fortalecer su perfil profesional mediante capacitación en línea.
              </p>

              {/* Profiles tags */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                {[
                  "Líderes", "Empresas", "Mandos medios", "Equipos de trabajo", 
                  "Personal operativo", "Administradores", "Profesionales"
                ].map((tag, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Block Section */}
        <section className="py-20 bg-slate-100 border-t border-slate-200/60 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 font-sans">
            <h2 className="font-academic text-2xl sm:text-3xl font-bold leading-tight">
              Impulsa tu desarrollo con capacitación profesional
            </h2>
            <p className="text-sm text-text-slate max-w-xl mx-auto font-medium">
              Solicita información sobre nuestros cursos, modalidad disponible y opciones de capacitación.
            </p>
            <div className="pt-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer shadow-md"
              >
                Inscríbete
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
