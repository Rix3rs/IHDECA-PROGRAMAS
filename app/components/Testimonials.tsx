"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  course: string;
  rating: number;
  text: string;
  initials: string;
  bgColor: string;
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Alejandro Ruiz",
      role: "Desarrollador Frontend Junior",
      course: "Desarrollo Web Full Stack",
      rating: 5,
      text: "El diplomado superó por completo mis expectativas. El enfoque 100% práctico y el acompañamiento constante de los asesores me permitieron cambiar de carrera e insertarme en el mercado tecnológico en menos de seis meses.",
      initials: "AR",
      bgColor: "bg-blue-600",
    },
    {
      id: 2,
      name: "Mariana Gómez",
      role: "Coordinadora de Relaciones Públicas",
      course: "Inglés Corporativo Avanzado",
      rating: 5,
      text: "Las clases conversacionales son sumamente dinámicas. La calidad de los docentes y la flexibilidad horaria me dieron la soltura técnica y la confianza necesarias para negociar con clientes extranjeros en mi trabajo actual.",
      initials: "MG",
      bgColor: "bg-purple-600",
    },
    {
      id: 3,
      name: "David Kahan",
      role: "Emprendedor y Fundador de Retailer",
      course: "Marketing Digital & Growth",
      rating: 5,
      text: "Gracias a las herramientas prácticas de este curso, logré reestructurar toda la estrategia digital de mi marca, duplicando nuestra adquisición de clientes orgánicos en el primer trimestre posgraduación.",
      initials: "DK",
      bgColor: "bg-emerald-600",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Section entry animation
  useGSAP(() => {
    // Explicit fromTo definition to prevent the carousel from staying hidden
    gsap.fromTo(".testimonial-card-container",
      { opacity: 0, scale: 0.95, y: 30 },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
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

  // Slide transition animation on active index change
  useGSAP(() => {
    gsap.fromTo(
      ".testimonial-anim-target",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [activeIndex]);

  return (
    <section ref={sectionRef} id="testimonios" className="py-24 bg-transparent overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            OPINIONES DE ALUMNOS
          </span>
          <h2 className="font-academic text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            Casos de Éxito
          </h2>
          <p className="text-base sm:text-lg text-text-slate font-sans">
            Conoce las experiencias y metas logradas por miembros graduados de nuestra comunidad educativa.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="testimonial-card-container relative max-w-4xl mx-auto px-4 sm:px-12">
          
          {/* Main Card with Nicdark Asymmetric border radius and clean white background */}
          <div ref={cardRef} className="bg-white border border-slate-200 rounded-[40px_40px_40px_0px] p-8 md:p-12 relative min-h-[320px] flex flex-col justify-between shadow-md overflow-hidden group select-none">
            {/* Quote Icon overlay */}
            <div className="absolute top-6 right-8 text-slate-100 select-none pointer-events-none">
              <Quote className="w-20 h-20 fill-current" />
            </div>

            <div className="testimonial-anim-target space-y-5">
              {/* Ratings */}
              <div className="flex gap-0.5">
                {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote block */}
              <blockquote className="font-academic text-lg sm:text-xl lg:text-2xl text-primary font-medium italic leading-relaxed">
                "{testimonials[activeIndex].text}"
              </blockquote>
            </div>

            {/* Author info */}
            <div className="testimonial-anim-target flex items-center gap-4 mt-8 border-t border-slate-100 pt-6 font-sans">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm ${testimonials[activeIndex].bgColor}`}>
                {testimonials[activeIndex].initials}
              </div>
              
              <div className="flex flex-col">
                <span className="text-base font-bold text-primary">
                  {testimonials[activeIndex].name}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {testimonials[activeIndex].role}
                </span>
                
                {/* Course Tag */}
                <span className="inline-block self-start mt-2 px-2.5 py-0.5 rounded-lg text-[9px] font-bold bg-primary-light text-primary uppercase tracking-wider">
                  {testimonials[activeIndex].course}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-8 px-2 font-sans">
            {/* Navigation Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex ? "bg-accent w-5" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Ir al testimonio ${i + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-lg border border-slate-200 hover:border-primary bg-white text-primary hover:text-accent flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-lg border border-slate-200 hover:border-primary bg-white text-primary hover:text-accent flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
