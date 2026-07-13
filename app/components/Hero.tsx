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
      // Set initial positions for the parallax/collapse scroll effect
      gsap.set(".hero-col-1", { x: -140 });
      gsap.set(".hero-col-2", { x: -70 });
      gsap.set(".hero-col-4", { x: 70 });
      gsap.set(".hero-col-5", { x: 140 });
      gsap.set(".hero-center-img", { opacity: 0, y: 120, scale: 0.95 });
      gsap.set(".hero-text-wrapper", { opacity: 1, scale: 1, y: 0 });

      // Entrance animation for the layout parts before scroll starts
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
          end: "+=100%", // Scroll for 100% of viewport height to complete
          scrub: 0.5, // Smooth tracking momentum
          pin: true,
          anticipatePin: 1
        }
      });

      // Collapse grid inwards, fade out text, fade in and slide up center image with linear ease
      scrollTl.to(".hero-text-wrapper", { opacity: 0, scale: 0.9, y: -50, ease: "none" });
      scrollTl.to(".hero-center-img", { opacity: 1, y: 0, scale: 1, ease: "none" }, "<");
      scrollTl.to(".hero-col-1", { x: 0, ease: "none" }, "<");
      scrollTl.to(".hero-col-2", { x: 0, ease: "none" }, "<");
      scrollTl.to(".hero-col-4", { x: 0, ease: "none" }, "<");
      scrollTl.to(".hero-col-5", { x: 0, ease: "none" }, "<");
    });

    // MOBILE & TABLET ANIMATION (below lg)
    mm.add("(max-width: 1023px)", () => {
      // Clean non-pinning layout fade-in for performance and mobile usability
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
      tl.fromTo(".hero-text-wrapper", { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: 0.2 });
      tl.fromTo(".mobile-images-grid", { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, "-=0.6");
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      
      {/* DESKTOP 5-COLUMN GRID (lg and up) */}
      <div className="hidden lg:flex w-full max-w-8xl mx-auto px-4 pt-20 items-center justify-between gap-4 select-none">
        
        {/* Col 1: Far Left */}
        <div className="hero-col-1 w-[16%] flex flex-col gap-6 flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[80px_80px_80px_0px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80"
              alt="Estudiantes"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[3/4] rounded-[80px_0px_80px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80"
              alt="Estudiantes en biblioteca"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Col 2: Mid Left */}
        <div className="hero-col-2 w-[16%] flex flex-col gap-6 flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[80px_80px_0px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
              alt="Estudiante"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[3/4] rounded-[0px_80px_80px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80"
              alt="Estudiante"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Col 3: Center Column (Houses Text Wrapper and absolute Center Image) */}
        <div className="relative w-[30%] min-h-[480px] flex items-center justify-center flex-shrink-0">
          
          {/* Central Title/Text Content */}
          <div className="hero-text-wrapper flex flex-col text-center justify-center items-center space-y-5 z-20 px-4">
            {/* Subtitle */}
            <div className="hero-badge">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                Explore our world
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title font-academic text-4xl sm:text-5xl lg:text-6xl font-black text-primary leading-[1.1] tracking-tight">
              Coaching <br />
              Skills
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
              Descubre cursos universitarios y especializados en <strong>tecnología, negocios, idiomas y diseño</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full font-sans">
              <Link
                href="#cursos"
                className="hero-cta w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-accent-orange hover:bg-accent text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Ver Cursos
              </Link>
              <Link
                href="#nosotros"
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
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                alt="Estudiantes colaborando"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
        </div>

        {/* Col 4: Mid Right */}
        <div className="hero-col-4 w-[16%] flex flex-col gap-6 flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[80px_80px_80px_0px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&auto=format&fit=crop&q=80"
              alt="Profesor de espaldas"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[3/4] rounded-[80px_0px_80px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"
              alt="Estudiante leyendo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Col 5: Far Right */}
        <div className="hero-col-5 w-[16%] flex flex-col gap-6 flex-shrink-0">
          <div className="w-full aspect-[3/4] rounded-[80px_80px_0px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80"
              alt="Realidad Virtual"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[3/4] rounded-[0px_80px_80px_80px] overflow-hidden shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80"
              alt="Estudiantes colaborando"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* MOBILE DISPLAY (stacked, no pinning) */}
      <div className="lg:hidden w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center">
        
        {/* Mobile text content */}
        <div className="hero-text-wrapper flex flex-col text-center justify-center items-center space-y-4 px-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Explore our world
          </span>
          <h1 className="font-academic text-4xl sm:text-5xl font-black text-primary leading-tight">
            Coaching <br /> Skills
          </h1>
          <svg className="w-8 h-8 text-accent-orange" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="21.7" y1="21.7" x2="78.3" y2="78.3" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-text-slate leading-relaxed font-sans max-w-sm">
            Descubre cursos universitarios y especializados en tecnología, negocios, idiomas y diseño.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full font-sans">
            <Link
              href="#cursos"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent-orange text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius shadow cursor-pointer"
            >
              Ver Cursos
            </Link>
          </div>
        </div>

        {/* Mobile Grid layout for the images below the text */}
        <div className="mobile-images-grid grid grid-cols-2 gap-4 mt-12 w-full">
          <div className="w-full aspect-[3/4] rounded-[50px_50px_50px_0px] overflow-hidden shadow-sm border border-slate-100">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80" alt="Students" className="w-full h-full object-cover" />
          </div>
          <div className="w-full aspect-[3/4] rounded-[50px_0px_50px_50px] overflow-hidden shadow-sm border border-slate-100">
            <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80" alt="VR student" className="w-full h-full object-cover" />
          </div>
          <div className="w-full aspect-[3/4] rounded-[50px_50px_0px_50px] overflow-hidden shadow-sm border border-slate-100">
            <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80" alt="Student" className="w-full h-full object-cover" />
          </div>
          <div className="w-full aspect-[3/4] rounded-[0px_50px_50px_50px] overflow-hidden shadow-sm border border-slate-100">
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80" alt="Teacher" className="w-full h-full object-cover" />
          </div>
        </div>

      </div>

    </section>
  );
}
