"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // DESKTOP ANIMATION (lg and up)
    mm.add("(min-width: 1024px)", () => {
      // Set initial positions for the collage scroll effect
      gsap.set(".hero-col-1", { x: -140 });
      gsap.set(".hero-col-2", { x: -70 });
      gsap.set(".hero-col-4", { x: 70 });
      gsap.set(".hero-col-5", { x: 140 });
      gsap.set(".hero-center-img", { opacity: 0, y: 120, scale: 0.95 });
      gsap.set(".hero-text-wrapper", { opacity: 1, scale: 1, y: 0 });

      // Entrance animation
      const entranceTl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
      entranceTl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 });
      entranceTl.fromTo(".hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.9");
      entranceTl.fromTo(".hero-asterisk", { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, ease: "back.out(1.7)" }, "-=0.8");
      entranceTl.fromTo(".hero-desc", { y: 15, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.9");
      entranceTl.fromTo(".hero-cta", { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 }, "-=0.8");

      // ScrollTrigger Pinning & Collage Collapse Timeline with smooth scrub tracking
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", // Scroll for 200% of viewport height to complete (slower, longer track)
          scrub: 1.2, // Buttery smooth momentum tracking
          pin: true,
          anticipatePin: 1
        }
      });

      scrollTl.to(".hero-text-wrapper", { opacity: 0, scale: 0.9, y: -50, ease: "none" });
      scrollTl.to(".hero-center-img", { opacity: 1, y: 0, scale: 1, ease: "none" }, "<");
      scrollTl.to(".hero-col-1", { x: 0, ease: "none" }, "<");
      scrollTl.to(".hero-col-2", { x: 0, ease: "none" }, "<");
      scrollTl.to(".hero-col-4", { x: 0, ease: "none" }, "<");
      scrollTl.to(".hero-col-5", { x: 0, ease: "none" }, "<");
    });

    // MOBILE & TABLET ANIMATION
    mm.add("(max-width: 1023px)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
      tl.fromTo(".hero-text-wrapper", { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: 0.2 });
      tl.fromTo(".mobile-images-grid", { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, "-=0.6");
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      
      {/* DESKTOP collage grid */}
      <div className="hidden lg:flex w-full max-w-8xl mx-auto px-4 pt-20 items-center justify-between gap-4 select-none">
        
        {/* Col 1 */}
        <div className="hero-col-1 w-[16%] flex flex-col gap-6 flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[80px_80px_80px_0px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80"
              alt="Taller de capacitación"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[3/4] rounded-[80px_0px_80px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80"
              alt="Sesión de coaching profesional"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Col 2 */}
        <div className="hero-col-2 w-[16%] flex flex-col gap-6 flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[80px_80px_0px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
              alt="Colaboración en oficina"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[3/4] rounded-[0px_80px_80px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=600&auto=format&fit=crop&q=80"
              alt="Espacio de trabajo colaborativo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Col 3: Center Column */}
        <div className="relative w-[30%] min-h-[480px] flex items-center justify-center flex-shrink-0">
          
          <div className="hero-text-wrapper flex flex-col text-center justify-center items-center space-y-5 z-20 px-4">
            {/* Subtitle */}
            <div className="hero-badge">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                Formación Profesional
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title font-academic text-2xl sm:text-3xl lg:text-4xl font-black text-primary leading-tight tracking-tight">
              Capacitación profesional para fortalecer habilidades laborales y de liderazgo
            </h1>

            {/* Orange 8-point asterisk symbol */}
            <div className="hero-asterisk flex justify-center py-1">
              <svg
                className="w-10 h-10 text-accent-orange"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                <line x1="21.7" y1="21.7" x2="78.3" y2="78.3" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                <line x1="78.3" y1="21.7" x2="21.7" y2="78.3" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>

            {/* Subtitle description */}
            <p className="hero-desc text-sm text-text-slate leading-relaxed font-sans max-w-sm">
              Ofrecemos cursos y capacitaciones profesionales para desarrollar habilidades prácticas, fortalecer el liderazgo y mejorar el desempeño en distintos entornos de trabajo.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full font-sans">
              <Link
                href="/cursos"
                className="hero-cta w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-accent-orange hover:bg-accent text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Ver Cursos
              </Link>
              <Link
                href="/nosotros"
                className="hero-cta w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#5296DD] hover:bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Nosotros
              </Link>
            </div>
          </div>

          {/* Absolute Center Image overlay */}
          <div className="hero-center-img absolute inset-0 w-full h-full z-10 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full rounded-[100px_100px_100px_100px] overflow-hidden shadow-lg border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80"
                alt="Capacitación corporativa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
        </div>

        {/* Col 4 */}
        <div className="hero-col-4 w-[16%] flex flex-col gap-6 flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[80px_80px_80px_0px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80"
              alt="Presentación de negocios"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[3/4] rounded-[80px_0px_80px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80"
              alt="Desarrollo de competencias"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Col 5 */}
        <div className="hero-col-5 w-[16%] flex flex-col gap-6 flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[80px_80px_0px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80"
              alt="Equipo de trabajo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[3/4] rounded-[0px_80px_80px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80"
              alt="Sesión de consultoría"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* MOBILE DISPLAY */}
      <div className="lg:hidden w-full max-w-xl mx-auto px-4 pt-24 pb-8 flex flex-col items-center">
        
        <div className="hero-text-wrapper flex flex-col text-center justify-center items-center space-y-4 px-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Formación Profesional
          </span>
          <h1 className="font-academic text-2xl sm:text-3xl font-black text-primary leading-tight">
            Capacitación profesional para fortalecer habilidades laborales y de liderazgo
          </h1>
          <svg className="w-8 h-8 text-accent-orange" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="21.7" y1="21.7" x2="78.3" y2="78.3" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-text-slate leading-relaxed font-sans max-w-sm">
            Ofrecemos cursos y capacitaciones profesionales para desarrollar habilidades prácticas, fortalecer el liderazgo y mejorar el desempeño en distintos entornos de trabajo.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full font-sans">
            <Link
              href="/cursos"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent-orange text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow cursor-pointer"
            >
              Ver Cursos
            </Link>
            <Link
              href="/nosotros"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#5296DD] text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow cursor-pointer"
            >
              Nosotros
            </Link>
          </div>
        </div>

        {/* Mobile Images Grid */}
        <div className="mobile-images-grid grid grid-cols-2 gap-4 mt-12 w-full">
          <div className="w-full aspect-[3/4] rounded-[50px_50px_50px_0px] overflow-hidden shadow-sm border border-slate-100">
            <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80" alt="Students" className="w-full h-full object-cover" />
          </div>
          <div className="w-full aspect-[3/4] rounded-[50px_0px_50px_50px] overflow-hidden shadow-sm border border-slate-100">
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80" alt="Colaboración en oficina" className="w-full h-full object-cover" />
          </div>
          <div className="w-full aspect-[3/4] rounded-[50px_50px_0px_50px] overflow-hidden shadow-sm border border-slate-100">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80" alt="Student" className="w-full h-full object-cover" />
          </div>
          <div className="w-full aspect-[3/4] rounded-[0px_50px_50px_50px] overflow-hidden shadow-sm border border-slate-100">
            <img src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=600&auto=format&fit=crop&q=80" alt="Teacher" className="w-full h-full object-cover" />
          </div>
        </div>

      </div>

    </section>
  );
}
