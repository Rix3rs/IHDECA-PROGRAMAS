"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, BookOpen, Star, ArrowLeft, Eye } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { courses, categories } from "@/app/data/courses";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = categories.find((c) => c.slug === slug);
  const categoryCourses = courses.filter((c) => c.categorySlug === slug);

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-32 pb-24 text-center space-y-6 font-sans max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-inner">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Categoría no encontrada</h1>
          <p className="text-sm text-slate-500">
            La categoría de cursos solicitada no está configurada aún en nuestro sistema.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs uppercase tracking-wider font-bold rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-24 font-sans">
        {/* Page Hero */}
        <section className="bg-primary text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-[#17325D] to-[#0F223F] -z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="flex justify-center">
              <Link
                href="/cursos"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Catálogo completo
              </Link>
            </div>
            <h1 className="font-academic text-4xl sm:text-5xl font-black tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans">
              {category.description}
            </p>
          </div>
        </section>

        {/* Category Courses Grid */}
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-primary">
                Programas en esta área ({categoryCourses.length})
              </h2>
            </div>

            {categoryCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categoryCourses.map((course) => (
                  <div
                    key={course.slug}
                    className="group flex flex-col nicdark-card overflow-hidden transition-[box-shadow,border-color] duration-300"
                  >
                    {/* Header */}
                    <div className={`relative h-40 w-full bg-gradient-to-br ${course.gradient} flex items-center justify-center p-6 text-white`}>
                      <span className="text-5xl transform transition-transform duration-500 group-hover:scale-110 select-none">
                        {course.emoji}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-grow p-6 space-y-3.5">
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

                      <h3 className="font-sans text-base font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-xs text-text-slate leading-relaxed line-clamp-3 font-sans">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-[10px] text-slate-600 font-semibold pt-2.5 border-t border-slate-100 font-sans">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          {course.lessons}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 font-sans">
                        <span className="text-sm font-bold text-primary leading-none">
                          {course.price}
                        </span>
                        
                        <Link
                          href={`/cursos/${course.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-accent text-accent hover:bg-accent hover:text-white uppercase tracking-wider text-[9px] font-bold rounded-lg transition-all duration-300 cursor-pointer shadow-sm"
                        >
                          <Eye className="w-3 h-3" />
                          Ver curso
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto p-6">
                <p className="text-xs text-slate-500">
                  Próximamente se integrarán cursos específicos para esta categoría.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
