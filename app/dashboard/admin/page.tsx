"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, UserCheck, AlertCircle, X, HelpCircle, FileText, Trash2, Edit2, UserCog } from "lucide-react";
import Sidebar from "@/app/dashboard/components/Sidebar";
import { initialStudents, mockAdminMetrics, MockStudent, initialTeachers, MockTeacher } from "@/app/data/dashboardData";
import { courses as initialCourses, Course } from "@/app/data/courses";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("resumen");
  const [students, setStudents] = useState<MockStudent[]>(initialStudents);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [teachers, setTeachers] = useState<MockTeacher[]>(initialTeachers);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedStudents = localStorage.getItem("ihdeca_students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    const savedCourses = localStorage.getItem("ihdeca_courses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
    const savedTeachers = localStorage.getItem("ihdeca_teachers");
    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers));
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ihdeca_students", JSON.stringify(students));
    }
  }, [students, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ihdeca_courses", JSON.stringify(courses));
    }
  }, [courses, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ihdeca_teachers", JSON.stringify(teachers));
    }
  }, [teachers, isMounted]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    extendedDescription: "",
    category: "Liderazgo y Habilidades Blandas",
    categorySlug: "liderazgo-y-habilidades",
    duration: "Por confirmar",
    lessons: "Por definir",
    instructor: "Por confirmar",
    price: "Por confirmar",
    emoji: "🎯",
    gradient: "from-blue-600 to-indigo-700"
  });

  // User Edit Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserType, setEditingUserType] = useState<"student" | "teacher">("student");
  const [editingUserId, setEditingUserId] = useState("");
  const [userForm, setUserForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    cursoSlug: ""
  });

  // Sub-tab toggle in Users Tab
  const [activeUserSubTab, setActiveUserSubTab] = useState<"student" | "teacher">("student");

  const handleOpenEditUser = (type: "student" | "teacher", id: string) => {
    setEditingUserType(type);
    setEditingUserId(id);
    if (type === "student") {
      const student = students.find(s => s.id === id);
      if (student) {
        setUserForm({
          nombre: student.nombre,
          email: student.email,
          contrasena: student.contrasena,
          cursoSlug: student.cursoSlug
        });
      }
    } else {
      const teacher = teachers.find(t => t.id === id);
      if (teacher) {
        setUserForm({
          nombre: teacher.nombre,
          email: teacher.email,
          contrasena: teacher.contrasena,
          cursoSlug: teacher.cursoSlug
        });
      }
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserType === "student") {
      setStudents(prev => 
        prev.map(st => {
          if (st.id === editingUserId) {
            const courseTitle = courses.find(c => c.slug === userForm.cursoSlug)?.title || st.cursoTitle;
            return {
              ...st,
              nombre: userForm.nombre,
              email: userForm.email,
              contrasena: userForm.contrasena,
              cursoSlug: userForm.cursoSlug,
              cursoTitle: courseTitle
            };
          }
          return st;
        })
      );
    } else {
      setTeachers(prev => 
        prev.map(t => {
          if (t.id === editingUserId) {
            const courseTitle = courses.find(c => c.slug === userForm.cursoSlug)?.title || t.cursoTitle;
            return {
              ...t,
              nombre: userForm.nombre,
              email: userForm.email,
              contrasena: userForm.contrasena,
              cursoSlug: userForm.cursoSlug,
              cursoTitle: courseTitle
            };
          }
          return t;
        })
      );
    }
    setIsUserModalOpen(false);
  };

  const handleApprove = (studentId: string) => {
    setStudents(prev => 
      prev.map(st => st.id === studentId ? { ...st, estadoInscripcion: "Aceptado" as const } : st)
    );
  };

  const handleDeleteCourse = (slug: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      setCourses(prev => prev.filter(c => c.slug !== slug));
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) return;

    const slug = newCourse.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const instructorInitials = newCourse.instructor.split(" ").map(n => n[0]).join("").toUpperCase();

    const createdCourse: Course = {
      slug,
      title: newCourse.title,
      description: newCourse.description,
      extendedDescription: newCourse.extendedDescription || newCourse.description,
      category: newCourse.category,
      categorySlug: newCourse.categorySlug,
      duration: newCourse.duration,
      lessons: newCourse.lessons,
      instructor: newCourse.instructor,
      instructorInitials,
      instructorColor: "bg-blue-600",
      rating: 5.0,
      price: newCourse.price,
      gradient: newCourse.gradient,
      emoji: newCourse.emoji,
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-700",
      modalidad: "En línea",
      fechas: "Por confirmar",
      dirigidoA: ["Personas interesadas en el tema."]
    };

    setCourses(prev => [...prev, createdCourse]);
    setIsModalOpen(false);
    setNewCourse({
      title: "",
      description: "",
      extendedDescription: "",
      category: "Liderazgo y Habilidades Blandas",
      categorySlug: "liderazgo-y-habilidades",
      duration: "Por confirmar",
      lessons: "Por definir",
      instructor: "Por confirmar",
      price: "Por confirmar",
      emoji: "🎯",
      gradient: "from-blue-600 to-indigo-700"
    });
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Cargando Panel...</span>
        </div>
      </div>
    );
  }

  // Derived metrics
  const activeStudentsCount = students.filter(s => s.estadoInscripcion === "Aceptado").length;
  const pendingApprovalsCount = students.filter(s => s.estadoInscripcion === "Pendiente").length;

  return (
    <div className="flex bg-slate-50 min-h-screen text-primary">
      <Sidebar 
        role="admin"
        activeView={activeView}
        onViewChange={setActiveView}
        userName="Admin IHDECA"
        userEmail="admin@ihdecaprogramas.com.mx"
      />

      {/* Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <div>
            <h1 className="font-academic text-2xl font-black uppercase tracking-tight">Panel del Administrador</h1>
            <p className="text-xs text-text-slate font-medium">Gestión de operaciones, inscripciones y catálogo educativo.</p>
          </div>
        </header>

        {/* VIEW 1: RESUMEN / METRICAS */}
        {activeView === "resumen" && (
          <div className="space-y-8">
            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Earnings card */}
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl border border-emerald-100">
                  <span className="text-xl font-bold">$</span>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Ingresos Mensuales</h4>
                  <span className="text-xl font-black text-primary">{mockAdminMetrics.ingresosMensuales}</span>
                </div>
              </div>

              {/* Active Students Card */}
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl border border-blue-100">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Alumnos Activos</h4>
                  <span className="text-xl font-black text-primary">{activeStudentsCount}</span>
                </div>
              </div>

              {/* Retention rate */}
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 flex items-center justify-center rounded-xl border border-purple-100">
                  <span className="text-xl font-bold">%</span>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Tasa de Retención</h4>
                  <span className="text-xl font-black text-primary">{mockAdminMetrics.retencionRate}</span>
                </div>
              </div>

              {/* Pending Approvals Card */}
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-6 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl border ${
                  pendingApprovalsCount > 0 
                    ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" 
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Pendientes Aprobación</h4>
                  <span className="text-xl font-black text-primary">{pendingApprovalsCount}</span>
                </div>
              </div>

            </div>

            {/* Simulated Chart & Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Distribution visual representation */}
              <div className="md:col-span-8 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-primary">Inscritos por Cursos</h3>
                <div className="space-y-4 font-sans text-xs">
                  {courses.map((c) => {
                    const enrolled = students.filter(s => s.cursoSlug === c.slug && s.estadoInscripcion === "Aceptado").length;
                    const max = 5;
                    const percent = Math.min((enrolled / max) * 100, 100);
                    return (
                      <div key={c.slug} className="space-y-1.5">
                        <div className="flex justify-between font-bold">
                          <span>{c.title}</span>
                          <span className="text-accent">{enrolled} Alumnos</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${percent}%` }}
                            className="bg-primary h-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info panel */}
              <div className="md:col-span-4 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-primary">Resumen Rápido</h3>
                  <p className="text-xs text-text-slate leading-relaxed font-medium">
                    El sistema se encuentra operando normalmente. Las solicitudes pendientes representan el interés registrado a través del portal público de IHDECA.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("alumnos")}
                  className="w-full text-center px-4 py-2.5 bg-accent hover:bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Ver Solicitudes
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: GESTIONAR CURSOS */}
        {activeView === "cursos" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary border-l-4 border-accent pl-3">Catálogo de Cursos ({courses.length})</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-primary hover:bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Agregar Curso
              </button>
            </div>

            {/* Courses Table */}
            <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] overflow-hidden shadow-sm">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                    <th className="p-4">Emoji</th>
                    <th className="p-4">Título</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Instructor</th>
                    <th className="p-4">Inversión</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((c) => (
                    <tr key={c.slug} className="hover:bg-slate-50/50">
                      <td className="p-4 text-xl select-none">{c.emoji}</td>
                      <td className="p-4 font-bold text-primary">{c.title}</td>
                      <td className="p-4 text-slate-500 font-semibold">{c.category}</td>
                      <td className="p-4 text-slate-700 font-bold">{c.instructor}</td>
                      <td className="p-4 text-slate-900 font-black">{c.price}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteCourse(c.slug)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          aria-label="Eliminar curso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD COURSE MODAL */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                <div className="bg-white border border-slate-200 w-full max-w-lg rounded-[40px_40px_40px_0px] shadow-2xl p-8 relative animate-scale-up font-sans text-xs">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-bold text-primary mb-2">Crear Nuevo Programa</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">Agregar curso al catálogo educativo</p>

                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Título del Curso <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Negociación Avanzada"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Breve Descripción <span className="text-red-500">*</span></label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Escribe un resumen atractivo del contenido..."
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Category */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Categoría</label>
                        <select
                          value={newCourse.categorySlug}
                          onChange={(e) => {
                            const val = e.target.value;
                            const text = val === "liderazgo-y-habilidades" ? "Liderazgo y Habilidades Blandas" : "Desarrollo Profesional";
                            setNewCourse({ ...newCourse, categorySlug: val, category: text });
                          }}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="liderazgo-y-habilidades">Liderazgo y Habilidades Blandas</option>
                          <option value="desarrollo-profesional">Desarrollo Profesional</option>
                        </select>
                      </div>

                      {/* Instructor */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Nombre Docente</label>
                        <select
                          value={newCourse.instructor}
                          onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="Por confirmar">Por confirmar</option>
                          {teachers.map((t) => (
                            <option key={t.id} value={t.nombre}>
                              {t.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Price */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Precio / Inversión</label>
                        <input
                          type="text"
                          placeholder="Ej. Por confirmar"
                          value={newCourse.price}
                          onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>

                      {/* Emoji */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Emoji Visual</label>
                        <input
                          type="text"
                          placeholder="Ej. 🎯"
                          value={newCourse.emoji}
                          onChange={(e) => setNewCourse({ ...newCourse, emoji: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-center"
                        />
                      </div>

                      {/* Gradient */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Gama Color (Gradient)</label>
                        <select
                          value={newCourse.gradient}
                          onChange={(e) => setNewCourse({ ...newCourse, gradient: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="from-blue-600 to-indigo-700">Azul Corporativo</option>
                          <option value="from-amber-500 to-orange-600">Naranja Cálido</option>
                          <option value="from-purple-500 to-indigo-700">Púrpura</option>
                          <option value="from-rose-500 to-orange-600">Rosa Coral</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-colors"
                    >
                      Publicar Curso
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: APROBACIONES */}
        {activeView === "alumnos" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-primary border-l-4 border-accent pl-3">Inscripciones pendientes ({pendingApprovalsCount})</h3>

            {pendingApprovalsCount > 0 ? (
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] overflow-hidden shadow-sm">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Estudiante</th>
                      <th className="p-4">Empresa</th>
                      <th className="p-4">Curso Solicitado</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.filter(s => s.estadoInscripcion === "Pendiente").map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="p-4 text-slate-500 font-semibold">{st.fechaRegistro}</td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-primary">{st.nombre}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{st.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-semibold">{st.empresa || "Personal"}</td>
                        <td className="p-4 text-slate-700 font-semibold">{st.cursoTitle}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleApprove(st.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            Aprobar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-[40px_40px_40px_0px] max-w-md mx-auto p-6 font-sans space-y-3">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-primary">No hay aprobaciones pendientes</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Todas las solicitudes enviadas desde el portal público de IHDECA ya han sido procesadas con éxito.
                </p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: GESTIONAR USUARIOS */}
        {activeView === "usuarios" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveUserSubTab("student")}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeUserSubTab === "student"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Estudiantes / Alumnos
                </button>
                <button
                  onClick={() => setActiveUserSubTab("teacher")}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeUserSubTab === "teacher"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Docentes / Profesores
                </button>
              </div>
            </div>

            {activeUserSubTab === "student" ? (
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] overflow-hidden shadow-sm">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">ID</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Correo</th>
                      <th className="p-4">Contraseña</th>
                      <th className="p-4">Curso Inscrito</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-500">{st.id}</td>
                        <td className="p-4 font-bold text-primary">{st.nombre}</td>
                        <td className="p-4 text-slate-600 font-semibold">{st.email}</td>
                        <td className="p-4 font-mono text-slate-800 font-semibold bg-slate-50/50">{st.contrasena}</td>
                        <td className="p-4 text-slate-500 font-semibold">{st.cursoTitle}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleOpenEditUser("student", st.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            aria-label="Editar contraseña/detalles estudiante"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] overflow-hidden shadow-sm">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">ID</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Correo</th>
                      <th className="p-4">Contraseña</th>
                      <th className="p-4">Materia Asignada</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-500">{t.id}</td>
                        <td className="p-4 font-bold text-primary">{t.nombre}</td>
                        <td className="p-4 text-slate-600 font-semibold">{t.email}</td>
                        <td className="p-4 font-mono text-slate-800 font-semibold bg-slate-50/50">{t.contrasena}</td>
                        <td className="p-4 text-slate-500 font-semibold">{t.cursoTitle}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleOpenEditUser("teacher", t.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            aria-label="Editar contraseña/detalles docente"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USER EDIT MODAL */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="bg-white border border-slate-200 w-full max-w-md rounded-[40px_40px_40px_0px] shadow-2xl p-8 relative animate-scale-up font-sans text-xs">
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-primary mb-1">Editar {editingUserType === "student" ? "Estudiante" : "Docente"}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">ID del usuario: {editingUserId}</p>

              <form onSubmit={handleSaveUser} className="space-y-4">
                {/* Nombre */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={userForm.nombre}
                    onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. juan@correo.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Contraseña */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Contraseña (Modificar / Restablecer)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contraseña del usuario..."
                    value={userForm.contrasena}
                    onChange={(e) => setUserForm({ ...userForm, contrasena: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-mono text-xs font-bold text-slate-800"
                  />
                </div>

                {/* Curso Asignado */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {editingUserType === "student" ? "Curso Matriculado" : "Materia Asignada"}
                  </label>
                  <select
                    value={userForm.cursoSlug}
                    onChange={(e) => setUserForm({ ...userForm, cursoSlug: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    {courses.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-colors mt-2"
                >
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
