"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Clock, BookOpen, Star, SlidersHorizontal, Eye } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { courses, categories } from "@/app/data/courses";

export default function CursosPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedModalidad, setSelectedModalidad] = useState("all");

  // Dynamic filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.categorySlug === selectedCategory;
    const matchesModalidad = selectedModalidad === "all" || course.modalidad.toLowerCase() === selectedModalidad.toLowerCase();

    return matchesSearch && matchesCategory && matchesModalidad;
  });

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Page Hero */}
        <section className="bg-primary text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-[#17325D] to-[#0F223F] -z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex px-3 py-1 rounded bg-accent/20 text-accent border border-accent/30 text-[9px] font-bold uppercase tracking-widest">
              Catálogo Oficial
            </span>
            <h1 className="font-academic text-4xl sm:text-5xl font-black tracking-tight">
              Nuestros cursos
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans">
              Conoce nuestras opciones de capacitación profesional para fortalecer habilidades laborales, liderazgo, comunicación y desarrollo profesional.
            </p>
          </div>
        </section>

        {/* Filters and Search Bar Section */}
        <section className="py-8 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Search input */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar curso por título o descripción..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-sans placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Filters dropdowns */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  Filtrar por:
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent shadow-sm"
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Modalidad Filter */}
                <select
                  value={selectedModalidad}
                  onChange={(e) => setSelectedModalidad(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent shadow-sm"
                >
                  <option value="all">Todas las Modalidades</option>
                  <option value="en línea">En línea</option>
                </select>

                {/* Area filter placeholder */}
                <select
                  disabled
                  className="px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl text-xs font-sans cursor-not-allowed text-slate-400 shadow-sm"
                >
                  <option>Área de formación (Por definir)</option>
                </select>

                {/* Price filter placeholder */}
                <select
                  disabled
                  className="px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl text-xs font-sans cursor-not-allowed text-slate-400 shadow-sm"
                >
                  <option>Precio (Por confirmar)</option>
                </select>
              </div>

            </div>
          </div>
        </section>

        {/* Catalog Grid Section */}
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCourses.map((course) => (
                  <div
                    key={course.slug}
                    className="group flex flex-col nicdark-card overflow-hidden transition-[box-shadow,border-color] duration-300"
                  >
                    {/* Gradient Header */}
                    <div className={`relative h-40 w-full bg-gradient-to-br ${course.gradient} flex items-center justify-center p-6 text-white`}>
                      <span className="text-5xl transform transition-transform duration-500 group-hover:scale-110 select-none">
                        {course.emoji}
                      </span>
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

                      {/* Title */}
                      <h3 className="font-sans text-base font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-text-slate leading-relaxed line-clamp-3 font-sans">
                        {course.description}
                      </p>

                      {/* Meta information */}
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

                      {/* Footer */}
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
              <div className="text-center py-16 bg-slate-50 rounded-[40px_40px_40px_0px] border border-slate-200 max-w-xl mx-auto p-8 font-sans space-y-4">
                <h3 className="text-lg font-bold text-primary">No se encontraron cursos</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Prueba ajustando los filtros o realizando otra búsqueda con palabras clave distintas.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setSelectedModalidad("all");
                  }}
                  className="px-5 py-2 bg-primary text-white text-[10px] uppercase tracking-wider font-bold rounded-lg hover:bg-accent transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
