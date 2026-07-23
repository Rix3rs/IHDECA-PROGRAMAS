"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Clock, BookOpen, Star, SlidersHorizontal, Eye, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { courses as staticCourses, categories as staticCategories, Course } from "@/app/data/courses";
import { usePurchasedCourses } from "@/app/hooks/usePurchasedCourses";

export default function CursosPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedModalidad, setSelectedModalidad] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>(staticCategories);
  const { hasPurchased } = usePurchasedCourses();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCoursesList(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading courses:", err);
        setLoading(false);
      });

    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  // Dynamic filter logic
  const filteredCourses = coursesList.filter((course) => {
    const isPublished = course.publicado !== false;
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.categorySlug === selectedCategory;
    const matchesModalidad = selectedModalidad === "all" || course.modalidad.toLowerCase() === selectedModalidad.toLowerCase();

    return isPublished && matchesSearch && matchesCategory && matchesModalidad;
  }).sort((a, b) => {
    if (priceSort === "asc") return (a.precioMxn || 0) - (b.precioMxn || 0);
    if (priceSort === "desc") return (b.precioMxn || 0) - (a.precioMxn || 0);
    return 0;
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

                {/* Price sort */}
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent shadow-sm"
                >
                  <option value="default">Ordenar por precio</option>
                  <option value="asc">Menor a mayor</option>
                  <option value="desc">Mayor a menor</option>
                </select>
              </div>

            </div>
          </div>
        </section>

        {/* Catalog Grid Section */}
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
                <p className="text-sm text-slate-500 mt-4">Cargando cursos...</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCourses.map((course) => (
                  <div
                    key={course.slug}
                    className="group flex flex-col nicdark-card overflow-hidden transition-[box-shadow,border-color] duration-300"
                  >
                    {/* Cover Header */}
                    <div className="relative h-40 w-full overflow-hidden flex items-center justify-center text-white bg-slate-100">
                      {course.coverUrl ? (
                        <img
                          src={course.coverUrl}
                          alt={course.coverAlt || course.title}
                          style={{ objectPosition: `center ${course.coverPositionY !== undefined ? course.coverPositionY : 50}%` }}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient}`} />
                          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110">
                            <BookOpen className="w-7 h-7 text-white/90" />
                          </div>
                        </>
                      )}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-primary font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-100 shadow-sm z-10">
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
                          {course.precioMxn
                            ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(course.precioMxn)
                            : course.price}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {hasPurchased(course.slug) ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold rounded-lg">
                              <CheckCircle2 className="w-3 h-3" />
                              Ya inscrito
                            </span>
                          ) : (
                            <>
                              <Link
                                href={`/cursos/${course.slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-accent text-accent hover:bg-accent hover:text-white uppercase tracking-wider text-[9px] font-bold rounded-lg transition-all duration-300 cursor-pointer shadow-sm"
                              >
                                <Eye className="w-3 h-3" />
                                Ver curso
                              </Link>
                              {course.precioMxn && (
                                <Link
                                  href={`/cursos/${course.slug}/pago`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white hover:bg-primary uppercase tracking-wider text-[9px] font-bold rounded-lg nicdark-btn-radius transition-all duration-300 cursor-pointer shadow-sm"
                                >
                                  Pagar
                                </Link>
                              )}
                            </>
                          )}
                        </div>
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
