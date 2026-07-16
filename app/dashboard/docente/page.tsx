"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Award, Link as LinkIcon, UserCheck, Check, Save, ExternalLink } from "lucide-react";
import Sidebar from "@/app/dashboard/components/Sidebar";
import { initialStudents, initialTeachers, MockStudent } from "@/app/data/dashboardData";

export default function DocenteDashboard() {
  const [activeView, setActiveView] = useState("cursos");

  // Load from localStorage or defaults
  const [students, setStudents] = useState<MockStudent[]>(initialStudents);
  const [activeTeacher, setActiveTeacher] = useState(initialTeachers[0]);
  const [zoomLink, setZoomLink] = useState(initialTeachers[0].zoomLink);
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

  // Sync to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ihdeca_students", JSON.stringify(students));
    }
  }, [students, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ihdeca_zoom_link", zoomLink);
    }
  }, [zoomLink, isMounted]);

  // Grading form state
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [gradeForm, setGradeForm] = useState({
    calificacion: "",
    comentariosDocente: ""
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (selectedStudentId) {
      const st = students.find(s => s.id === selectedStudentId);
      if (st) {
        setGradeForm({
          calificacion: st.calificacion !== null ? st.calificacion.toString() : "",
          comentariosDocente: st.comentariosDocente || ""
        });
      }
    } else {
      setGradeForm({ calificacion: "", comentariosDocente: "" });
    }
  }, [selectedStudentId, students]);

  // Assign mock students to Walter's course if they want to test Walter specifically,
  // or let the teacher manage all active students in the academy for robust demo testing!
  // We'll show all students who are "Aceptado".
  const activeStudents = students.filter(s => s.estadoInscripcion === "Aceptado");

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const numGrade = gradeForm.calificacion ? parseInt(gradeForm.calificacion, 10) : null;
    
    setStudents(prev => 
      prev.map(st => st.id === selectedStudentId 
        ? { 
            ...st, 
            calificacion: numGrade, 
            comentariosDocente: gradeForm.comentariosDocente,
            progreso: numGrade !== null ? 100 : st.progreso // Automatically max progress if fully graded
          } 
        : st
      )
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
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
        role="docente"
        activeView={activeView}
        onViewChange={setActiveView}
        userName={`Prof. ${activeTeacher.nombre}`}
        userEmail={activeTeacher.email}
      />

      {/* Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <div>
            <h1 className="font-academic text-2xl font-black uppercase tracking-tight">Panel del Docente</h1>
            <p className="text-xs text-text-slate font-medium">Control de avance escolar, calificaciones de alumnos y enlaces de aulas virtuales.</p>
          </div>
        </header>

        {/* VIEW 1: MIS MATERIAS / LIVE ZOOM */}
        {activeView === "cursos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Course Card Left */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center rounded-xl border border-amber-100 font-bold select-none text-xl">
                  {activeTeacher.cursoSlug === "curso-de-walter" ? "👨‍🏫" : "🎯"}
                </div>
                <div>
                  <span className="text-[9px] font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded">Materia Asignada</span>
                  <h3 className="text-xl font-bold text-primary mt-1">{activeTeacher.cursoTitle}</h3>
                  <p className="text-xs text-slate-500 font-semibold font-sans mt-0.5">Modalidad: En línea</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-sans text-xs border-y border-slate-100 py-4">
                <div>
                  <span className="text-slate-500 font-semibold block">Alumnos Registrados:</span>
                  {/* Students matching this course */}
                  <strong className="text-primary text-base">{activeStudents.filter(s => s.cursoSlug === activeTeacher.cursoSlug).length} Alumnos</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Evaluaciones Completadas:</span>
                  <strong className="text-primary text-base">
                    {activeStudents.filter(s => s.cursoSlug === activeTeacher.cursoSlug && s.calificacion !== null).length} Evaluados
                  </strong>
                </div>
              </div>

              <p className="text-xs text-text-slate leading-relaxed font-sans font-medium">
                Como docente de IHDECA, tienes control completo del registro de tus alumnos. Puedes actualizar el material, revisar tareas entregadas y asentar las calificaciones definitivas en el apartado correspondiente.
              </p>
            </div>

            {/* Virtual Classroom Config Right */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4 font-sans">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl border border-blue-100">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-primary">Configurar Aula Virtual</h3>
                <p className="text-xs text-text-slate font-medium leading-relaxed">
                  Ingresa el enlace oficial de Zoom, Google Meet o Teams para que tus alumnos puedan unirse a la videoconferencia de la clase directamente desde sus respectivos paneles.
                </p>

                <div className="space-y-1.5 pt-2">
                  <label htmlFor="zoom-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Enlace de la Videoconferencia
                  </label>
                  <input
                    type="url"
                    id="zoom-input"
                    placeholder="https://meet.google.com/..."
                    value={zoomLink}
                    onChange={(e) => setZoomLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <a
                  href={zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow text-center px-4 py-2.5 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 hover:bg-slate-800"
                >
                  Probar Enlace
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: CALIFICACIONES / EVALUAR */}
        {activeView === "calificaciones" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Student selection list Left */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-primary">Alumnos Inscritos ({activeStudents.length})</h3>
              
              <div className="divide-y divide-slate-100 font-sans text-xs">
                {activeStudents.map((st) => (
                  <div 
                    key={st.id}
                    onClick={() => setSelectedStudentId(st.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                      selectedStudentId === st.id 
                        ? "bg-slate-100 border border-slate-200" 
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-primary">{st.nombre}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold truncate max-w-xs">{st.cursoTitle}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {st.calificacion !== null ? (
                        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-bold">
                          Nota: {st.calificacion}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded text-[9px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grading Form Panel Right */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm">
              {selectedStudentId ? (
                <form onSubmit={handleSaveGrade} className="space-y-4 font-sans text-xs">
                  <div className="pb-3 border-b border-slate-100 space-y-1">
                    <h3 className="text-base font-bold text-primary">Evaluar Alumno</h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Asienta la nota definitiva y retroalimentación para: <br />
                      <strong className="text-accent text-xs">
                        {students.find(s => s.id === selectedStudentId)?.nombre}
                      </strong>
                    </p>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-[10px] font-semibold text-emerald-700 rounded-lg flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Calificación guardada y publicada.
                    </div>
                  )}

                  {/* Grade Score */}
                  <div className="space-y-1.5">
                    <label htmlFor="calificacion-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Calificación / Nota (0 - 100) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="calificacion-input"
                      required
                      min="0"
                      max="100"
                      placeholder="Ej. 92"
                      value={gradeForm.calificacion}
                      onChange={(e) => setGradeForm({ ...gradeForm, calificacion: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-sans"
                    />
                  </div>

                  {/* Teacher comments */}
                  <div className="space-y-1.5">
                    <label htmlFor="comentarios-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Comentarios y Retroalimentación
                    </label>
                    <textarea
                      id="comentarios-input"
                      rows={4}
                      placeholder="Ej. Excelente desempeño. Muestra gran dominio de las herramientas y..."
                      value={gradeForm.comentariosDocente}
                      onChange={(e) => setGradeForm({ ...gradeForm, comentariosDocente: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-sans resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Calificación
                  </button>
                </form>
              ) : (
                <div className="text-center py-16 space-y-3 font-sans">
                  <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-primary">Ningún Alumno Seleccionado</h4>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                    Selecciona un alumno de la lista de la izquierda para ver su estado actual, ingresar sus calificaciones y escribir comentarios.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
