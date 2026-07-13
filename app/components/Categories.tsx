"use client";

import React, { useRef } from "react";
import {
  Code,
  TrendingUp,
  Languages,
  Palette,
  HeartPulse,
  Sparkles,
  ArrowRight
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
  borderColor: string;
  count: string;
}

export default function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Explicit fromTo definition to prevent elements from getting stuck at opacity 0 on hot-reload/strict-mode
    gsap.fromTo(".category-card", 
      { opacity: 0, y: 40, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      }
    );

    // Recalculate ScrollTrigger markers after layout shifts and dynamic height updates
    const refreshTrigger = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshTrigger);
    const timeoutId = setTimeout(refreshTrigger, 500);

    return () => {
      window.removeEventListener("load", refreshTrigger);
      clearTimeout(timeoutId);
    };
  }, { scope: sectionRef });

  const categories: Category[] = [
    {
      id: "tech",
      name: "Tecnología",
      description: "Aprende desarrollo de software, inteligencia artificial, bases de datos y ciberseguridad avanzada.",
      icon: Code,
      color: "bg-blue-50/70",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      count: "12 cursos"
    },
    {
      id: "negocios",
      name: "Negocios",
      description: "Capacítate en administración de empresas, finanzas corporativas, marketing y ventas.",
      icon: TrendingUp,
      color: "bg-emerald-50/70",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-100",
      count: "15 cursos"
    },
    {
      id: "idiomas",
      name: "Idiomas",
      description: "Habla inglés, francés o alemán con soltura gracias a metodologías conversacionales.",
      icon: Languages,
      color: "bg-purple-50/70",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      count: "8 cursos"
    },
    {
      id: "diseno",
      name: "Diseño & UX",
      description: "Domina el diseño gráfico moderno, modelado 3D e interfaces de usuario UI/UX con Figma.",
      icon: Palette,
      color: "bg-rose-50/70",
      textColor: "text-rose-700",
      borderColor: "border-rose-100",
      count: "10 cursos"
    },
    {
      id: "salud",
      name: "Salud & Bienestar",
      description: "Cursos prácticos de primeros auxilios, nutrición clínica y administración hospitalaria.",
      icon: HeartPulse,
      color: "bg-teal-50/70",
      textColor: "text-teal-700",
      borderColor: "border-teal-100",
      count: "6 cursos"
    },
    {
      id: "desarrollo",
      name: "Crecimiento Personal",
      description: "Desarrolla liderazgo corporativo, técnicas de oratoria y gestión efectiva del tiempo.",
      icon: Sparkles,
      color: "bg-amber-50/70",
      textColor: "text-amber-700",
      borderColor: "border-amber-100",
      count: "9 cursos"
    }
  ];

  return (
    <section ref={sectionRef} id="categorias" className="py-24 bg-transparent border-y border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            ENCUENTRA TU ÁREA
          </span>
          <h2 className="font-academic text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            Categorías de Cursos
          </h2>
          <p className="text-base sm:text-lg text-text-slate font-sans">
            Elige el rumbo de tu formación profesional con programas adaptados a cada sector industrial.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="category-card group nicdark-card p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-[box-shadow,border-color] duration-300"
              >
                <div className="flex flex-col items-center">
                  {/* Icon Block with smaller asymmetric corners */}
                  <div className={`w-16 h-16 rounded-[16px_16px_16px_0px] flex items-center justify-center border ${category.borderColor} ${category.color} mb-6 transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`w-8 h-8 ${category.textColor}`} />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-sans text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-200">
                    {category.name}
                  </h3>
                  
                  {/* Description with high contrast */}
                  <p className="text-sm text-text-slate leading-relaxed mb-6 max-w-xs font-sans">
                    {category.description}
                  </p>
                </div>

                {/* Footer link */}
                <div className="w-full border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-sans">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">
                    {category.count}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-accent group-hover:text-primary transition-colors uppercase tracking-wider text-[10px]">
                    Explorar
                    <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
