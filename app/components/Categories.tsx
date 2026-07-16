"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { TrendingUp, Award, HelpCircle, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { categories } from "@/app/data/courses";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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

    const refreshTrigger = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshTrigger);
    const timeoutId = setTimeout(refreshTrigger, 500);

    return () => {
      window.removeEventListener("load", refreshTrigger);
      clearTimeout(timeoutId);
    };
  }, { scope: sectionRef });

  // Icon mapping
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "TrendingUp":
        return TrendingUp;
      case "Award":
        return Award;
      default:
        return HelpCircle;
    }
  };

  return (
    <section ref={sectionRef} id="categorias" className="py-24 bg-transparent border-y border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Formación profesional
          </span>
          <h2 className="font-academic text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            Categorías de cursos
          </h2>
          <p className="text-base sm:text-lg text-text-slate font-sans">
            Las áreas de especialización están en proceso de definición por parte de IHDECA. A continuación se presentan las áreas preliminares de estudio.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = getIcon(category.iconName);
            return (
              <Link
                key={category.slug}
                href={`/categoria/${category.slug}`}
                className="category-card group nicdark-card p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-[box-shadow,border-color] duration-300"
              >
                <div className="flex flex-col items-center">
                  {/* Icon Block */}
                  <div className={`w-16 h-16 rounded-[16px_16px_16px_0px] flex items-center justify-center border ${category.borderColor} ${category.color} mb-6 transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`w-8 h-8 ${category.textColor}`} />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-sans text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-200">
                    {category.name}
                  </h3>
                  
                  {/* Description */}
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
              </Link>
            );
          })}

          {/* Pending Definition Placeholder Card */}
          <div className="category-card group nicdark-card p-8 flex flex-col justify-between items-center text-center border-dashed border-2 border-slate-300 bg-slate-50/50 p-8 rounded-[40px_40px_40px_0px]">
            <div className="flex flex-col items-center">
              {/* Icon Block */}
              <div className="w-16 h-16 rounded-[16px_16px_16px_0px] flex items-center justify-center border border-slate-200 bg-slate-100 mb-6 text-slate-400">
                <HelpCircle className="w-8 h-8" />
              </div>
              
              {/* Category Name */}
              <h3 className="font-sans text-xl font-bold text-slate-400 mb-3">
                Categorías por definir
              </h3>
              
              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs font-sans">
                Próximamente se integrarán nuevas áreas y programas de estudio a nuestro catálogo oficial de capacitación.
              </p>
            </div>

            {/* Footer link */}
            <div className="w-full border-t border-slate-100 pt-4 flex items-center justify-center text-xs font-sans text-slate-400 uppercase tracking-wider font-semibold">
              Próximamente
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
