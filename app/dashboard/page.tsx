"use client";

import React from "react";
import Link from "next/link";
import { Shield, Users, User, ArrowLeft } from "lucide-react";
import AuroraBackground from "@/app/components/AuroraBackground";

export default function DashboardPortal() {
  const roles = [
    {
      id: "admin",
      title: "Administrador",
      description: "Supervisa las métricas globales, aprueba solicitudes de inscripción, edita el catálogo de cursos y asigna profesores.",
      icon: Shield,
      href: "/dashboard/admin",
      color: "bg-blue-50 border-blue-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)]",
    },
    {
      id: "docente",
      title: "Docente / Instructor",
      description: "Visualiza tus cursos asignados, califica tareas entregadas, añade retroalimentación a tus alumnos y comparte enlaces de Zoom.",
      icon: Users,
      href: "/dashboard/docente",
      color: "bg-amber-50 border-amber-200 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
      hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)]",
    },
    {
      id: "estudiante",
      title: "Estudiante / Alumno",
      description: "Revisa tus cursos matriculados, lleva el control del avance de los temas, entra a tus clases en vivo y visualiza tus calificaciones.",
      icon: User,
      href: "/dashboard/estudiante",
      color: "bg-rose-50 border-rose-200 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
      hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)]",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-primary">
      {/* Soft background */}
      <AuroraBackground />

      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-accent uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al sitio público
        </Link>
      </div>

      <div className="max-w-4xl w-full z-10 space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-4">
          <img
            src="/logo.webp"
            alt="IHDECA Programas"
            className="h-12 w-auto mx-auto object-contain"
          />
          <div className="space-y-2">
            <h1 className="font-academic text-3xl sm:text-4xl font-black tracking-tight leading-none text-primary">
              Portal del Estudiante y Docente
            </h1>
            <p className="text-sm text-text-slate max-w-md mx-auto font-medium">
              Selecciona tu perfil de acceso para ingresar a la demostración interactiva de los paneles administrativos.
            </p>
          </div>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.id}
                href={role.href}
                className={`group bg-white border border-slate-200 p-8 rounded-[40px_40px_40px_0px] flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 shadow-sm ${role.hoverShadow}`}
              >
                <div className="flex flex-col items-center space-y-6">
                  {/* Icon Block */}
                  <div className={`w-16 h-16 rounded-[16px_16px_16px_0px] flex items-center justify-center border transition-colors duration-300 ${role.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors duration-300">
                      {role.title}
                    </h3>
                    <p className="text-xs text-text-slate leading-relaxed font-medium">
                      {role.description}
                    </p>
                  </div>
                </div>

                <div className="w-full border-t border-slate-100 pt-6 mt-8 flex justify-center text-xs font-bold uppercase tracking-wider text-accent group-hover:text-primary transition-colors">
                  Ingresar al panel
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
