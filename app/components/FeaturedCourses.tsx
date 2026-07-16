"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Clock, BookOpen, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { courses } from "@/app/data/courses";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedCourses() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".course-card",
      { opacity: 0, y: 45, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.15,
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

  return (
    <section ref={sectionRef} id="cursos" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Capacitación en línea
            </span>
            <h2 className="font-academic text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
              Cursos destacados
            </h2>
            <p className="text-base sm:text-lg text-text-slate font-sans leading-relaxed">
              Programas de formación diseñados para fortalecer habilidades prácticas en el ámbito profesional y laboral.
            </p>
          </div>
          
          <div className="flex justify-center flex-shrink-0">
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white text-xs uppercase tracking-wider font-bold rounded-lg nicdark-btn-radius transition-all duration-300 cursor-pointer shadow-sm"
            >
              Ver catálogo completo
            </Link>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.slug}
              className="course-card group flex flex-col nicdark-card overflow-hidden transition-[box-shadow,border-color] duration-300"
            >
              {/* Image Block */}
              <div className={`relative h-44 w-full bg-gradient-to-br ${course.gradient} flex items-center justify-center p-6 text-white`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:12px_12px]" />
                
                {/* Visual Accent */}
                <span className="text-5xl transform transition-transform duration-500 group-hover:scale-110 select-none">
                  {course.emoji}
                </span>
                
                {/* Category Badge overlay */}
                <div className="absolute top-4 left-4 bg-white text-primary font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-100 shadow-sm">
                  {course.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-grow p-6 space-y-3.5">
                {/* Author Info */}
                <div className="flex items-center justify-between text-xs text-text-slate font-sans">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${course.instructorColor} text-white font-bold text-[9px] flex items-center justify-center`}>
                      {course.instructorInitials}
                    </div>
                    <span className="font-semibold text-slate-700">{course.instructor}</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-700 font-bold">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    {course.rating.toFixed(1)}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="font-sans text-lg font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                  {course.title}
                </h3>

                {/* Course Description */}
                <p className="text-xs sm:text-sm text-text-slate leading-relaxed line-clamp-3 font-sans">
                  {course.description}
                </p>

                {/* Meta details list */}
                <div className="flex items-center gap-4 text-[11px] text-slate-600 font-semibold pt-2.5 border-t border-slate-100 font-sans">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    {course.lessons}
                  </span>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 font-sans">
                  <div className="flex flex-col">
                    {course.originalPrice && (
                      <span className="text-[10px] line-through text-slate-500 font-medium">
                        {course.originalPrice}
                      </span>
                    )}
                    <span className="text-base font-bold text-primary leading-none">
                      {course.price}
                    </span>
                  </div>
                  
                  <Link
                    href={`/cursos/${course.slug}`}
                    className="inline-flex items-center gap-1 px-4 py-2 border-2 border-accent text-accent hover:bg-accent hover:text-white uppercase tracking-wider text-[10px] font-bold rounded-lg nicdark-btn-radius transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_4px_10px_rgba(230,126,34,0.15)]"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
