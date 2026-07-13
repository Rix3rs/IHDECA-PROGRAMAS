"use client";

import React, { useRef } from "react";
import { Award, Users, Calendar, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function WhyUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Explicit fromTo definition to prevent elements from disappearing on Strict Mode double-renders
    gsap.fromTo(".why-item",
      { opacity: 0, y: 35 },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      }
    );

    const refreshTrigger = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshTrigger);
    const timeoutId = setTimeout(refreshTrigger, 500);

    return () => {
      window.removeEventListener("load", refreshTrigger);
      clearTimeout(timeoutId);
    };
  }, { scope: sectionRef });

  const features: Feature[] = [
    {
      title: "Certificación Académica",
      description: "Recibe un diploma oficial con validez institucional al egresar de cualquiera de nuestros programas de estudio.",
      icon: Award,
    },
    {
      title: "Mentores Expertos",
      description: "Aprende de especialistas activos en el sector laboral que aportan casos reales prácticos del día a día.",
      icon: Users,
    },
    {
      title: "Modalidad Flexible",
      description: "Clases grabadas y en vivo en HD. Administra tus tiempos y avanza a tu propio ritmo desde cualquier dispositivo.",
      icon: Calendar,
    },
    {
      title: "Planes Actualizados",
      description: "Mapas curriculares renovados constantemente para responder a las demandas vigentes del mercado internacional.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section ref={sectionRef} id="nosotros" className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            DIFERENCIADORES ACADÉMICOS
          </span>
          <h2 className="font-academic text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            ¿Por qué elegir IHDECA?
          </h2>
          <p className="text-base sm:text-lg text-text-slate font-sans">
            Ofrecemos una experiencia educativa de primer nivel diseñada para maximizar tu desarrollo profesional y personal.
          </p>
        </div>

        {/* Features Columns Grid with subtle dividing lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="why-item group flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 p-2 relative lg:after:absolute lg:after:top-4 lg:after:-right-4 lg:after:h-2/3 lg:after:w-[1px] lg:after:bg-slate-200/60 lg:last:after:hidden"
              >
                {/* Icon wrapper - Asymmetric Nicdark styling */}
                <div className="w-12 h-12 rounded-[16px_16px_16px_0px] bg-slate-50 border border-slate-200/80 text-primary flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-primary group-hover:text-white shadow-sm">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Feature Title */}
                <h3 className="font-sans text-lg font-bold text-primary group-hover:text-accent transition-colors duration-200">
                  {feature.title}
                </h3>

                {/* Feature Description with high contrast */}
                <p className="text-xs sm:text-sm text-text-slate leading-relaxed font-sans max-w-xs lg:max-w-none">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
