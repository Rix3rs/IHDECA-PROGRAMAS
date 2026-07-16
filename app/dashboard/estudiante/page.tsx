"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Award, CheckCircle, ExternalLink, Calendar, AlertTriangle, CheckSquare, Square } from "lucide-react";
import Sidebar from "@/app/dashboard/components/Sidebar";
import { initialStudents, initialTeachers, MockStudent } from "@/app/data/dashboardData";
import { courses } from "@/app/data/courses";

export default function EstudianteDashboard() {
  const [activeView, setActiveView] = useState("cursos");

  // Load from localStorage or defaults
  const [students, setStudents] = useState<MockStudent[]>(initialStudents);
  const [activeStudentId, setActiveStudentId] = useState("EST-001");
  const [zoomLink, setZoomLink] = useState(initialTeachers[1].zoomLink);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedStudents = localStorage.getItem("ihdeca_students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    const savedZoom = localStorage.getItem("ihdeca_zoom_link");
    if (savedZoom) {
      setZoomLink(savedZoom);
    }
  }, []);

  // Sync back to local storage on changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ihdeca_students", JSON.stringify(students));
    }
  }, [students, isMounted]);

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];
  const courseData = courses.find(c => c.slug === activeStudent.cursoSlug);

  // Toggle syllabus modules to dynamically recalculate progress
  const handleToggleModule = (index: number, totalModules: number) => {
    // Basic progression logic: toggle updates local progress state
    // Let's mock module checkbox checking
    const baseProgress = Math.round(((index + 1) / totalModules) * 100);
    
    // We update student progress in local state
    setStudents(prev => 
      prev.map(st => st.id === activeStudentId 
        ? { 
            ...st, 
            progreso: st.progreso === baseProgress ? Math.max(0, baseProgress - Math.round(100/totalModules)) : baseProgress 
          } 
        : st
      )
    );
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

  return (
    <div className="flex bg-slate-50 min-h-screen text-primary">
      <Sidebar 
        role="estudiante"
        activeView={activeView}
        onViewChange={setActiveView}
        userName={activeStudent.nombre}
        userEmail={activeStudent.email}
      />

      {/* Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Top Header with Simulator Selector */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4 font-sans text-xs">
          <div>
            <h1 className="font-academic text-2xl font-black uppercase tracking-tight">Panel del Estudiante</h1>
            <p className="text-xs text-text-slate font-medium">Visualiza tus materias inscritas, tu avance académico y calificaciones.</p>
          </div>

          {/* SIMULATOR SWITCHER */}
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Simular Estudiante:</span>
            <select
              value={activeStudentId}
              onChange={(e) => setActiveStudentId(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer text-primary focus:outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} ({s.estadoInscripcion})
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* VIEW 1: MIS CURSOS / LIVE CLASS */}
        {activeView === "cursos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Enrollment Status & Course Card Left */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Approval status banner */}
              {activeStudent.estadoInscripcion === "Pendiente" ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-2xl flex gap-3.5 items-start shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 font-sans text-xs">
                    <h4 className="font-bold text-amber-900">Inscripción Pendiente de Aprobación</h4>
                    <p className="font-medium text-slate-600">
                      Tu solicitud de ingreso está siendo revisada por el departamento de administración de IHDECA. Te notificaremos por correo electrónico una vez aprobada.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl flex gap-3.5 items-start shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 font-sans text-xs">
                    <h4 className="font-bold text-emerald-900">Inscripción Activa y Aprobada</h4>
                    <p className="font-medium text-slate-600">
                      ¡Tu cuenta está activa! Tienes acceso completo al material de estudio, avance de módulos y clases en vivo.
                    </p>
                  </div>
                </div>
              )}

              {/* Course Detail Card */}
              {courseData && (
                <div className="bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${courseData.gradient} text-white flex items-center justify-center rounded-xl font-bold select-none text-xl`}>
                      {courseData.emoji}
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Curso Inscrito</span>
                      <h3 className="text-xl font-bold text-primary mt-0.5">{courseData.title}</h3>
                      <p className="text-xs text-text-slate font-semibold mt-0.5">Instructor: <strong>{courseData.instructor}</strong></p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2 border-t border-slate-100 pt-5">
                    <div className="flex justify-between text-xs font-bold font-sans">
                      <span className="text-slate-500">Progreso del Curso:</span>
                      <span className="text-accent">{activeStudent.progreso}% Completado</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${activeStudent.progreso}%` }}
                        className="bg-primary h-full transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live virtual class sidebar Right */}
            {activeStudent.estadoInscripcion === "Aceptado" && (
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4 font-sans text-xs">
                  <div className="w-10 h-10 bg-accent/10 text-accent flex items-center justify-center rounded-xl border border-accent/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-primary">Aula de Clases</h3>
                  <p className="text-text-slate leading-relaxed font-medium">
                    Accede a las clases en vivo programadas para tu materia. Haz clic en el botón inferior para unirte directamente a la videoconferencia virtual.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center px-4 py-2.5 bg-accent hover:bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Unirse a clase en vivo
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: AVANCE DE MODULOS */}
        {activeView === "temarios" && (
          <div className="max-w-4xl bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-8 shadow-sm space-y-6 font-sans">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-primary">Temario de la Materia</h3>
              <p className="text-xs text-slate-500 font-medium">
                Haz clic en las casillas conforme vayas completando cada tema para actualizar tu progreso acumulado en tiempo real.
              </p>
            </div>

            {courseData?.temario ? (
              <div className="space-y-4 text-xs">
                {courseData.temario.map((modulo, i) => {
                  // Calculate mock progress threshold to check if it's checked
                  const stepPercent = Math.round(((i + 1) / courseData.temario!.length) * 100);
                  const isChecked = activeStudent.progreso >= stepPercent;

                  return (
                    <div 
                      key={i} 
                      onClick={() => handleToggleModule(i, courseData.temario!.length)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isChecked 
                          ? "bg-emerald-50/40 border-emerald-100 text-emerald-900" 
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <button className="flex-shrink-0 mt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 fill-current bg-white" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 bg-white rounded" />
                        )}
                      </button>
                      
                      <div className="space-y-1">
                        <span className={`text-[8px] font-bold uppercase tracking-wider ${isChecked ? "text-emerald-700" : "text-slate-400"}`}>
                          Módulo {i + 1}
                        </span>
                        <h4 className="text-xs font-bold">{modulo}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Temario no disponible para este programa.</p>
            )}
          </div>
        )}

        {/* VIEW 3: CALIFICACIONES */}
        {activeView === "calificaciones" && (
          <div className="max-w-xl bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-8 shadow-sm space-y-6 font-sans text-xs">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-primary">Boleta Académica</h3>
              <p className="text-xs text-slate-500 font-medium">Revisa las notas y comentarios oficiales provistos por tu docente.</p>
            </div>

            {activeStudent.calificacion !== null ? (
              <div className="space-y-6">
                {/* Grade display widget */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center justify-between shadow-inner">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Nota Definitiva</span>
                    <strong className="text-primary text-xl font-bold">{activeStudent.cursoTitle}</strong>
                  </div>
                  <div className="w-20 h-20 bg-white border-2 border-emerald-500 rounded-full flex flex-col justify-center items-center shadow">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Score</span>
                    <span className="text-2xl font-black text-emerald-600 leading-none mt-1">{activeStudent.calificacion}</span>
                  </div>
                </div>

                {/* Feedback */}
                {activeStudent.comentariosDocente && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-accent" />
                      Retroalimentación del Profesor:
                    </h4>
                    <p className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 italic leading-relaxed font-medium">
                      "{activeStudent.comentariosDocente}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 border border-slate-200/80 rounded-[24px_24px_24px_0px] p-6 space-y-3">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-primary">Calificación en Proceso</h4>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Tu examen o actividad final no ha sido calificada aún por el docente. Una vez que asiente la nota, la verás reflejada inmediatamente aquí.
                </p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
