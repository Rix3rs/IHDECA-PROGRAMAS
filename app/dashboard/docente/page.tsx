"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Award, Link as LinkIcon, UserCheck, Check, Save, ExternalLink, Trash2, Plus, AlertCircle, Eye, Menu } from "lucide-react";
import Sidebar from "@/app/dashboard/components/Sidebar";
import MaterialesDocente from "@/app/dashboard/components/MaterialesDocente";
import { initialStudents, initialTeachers, MockStudent } from "@/app/data/dashboardData";
import { courses as initialCourses, Course } from "@/app/data/courses";

export default function DocenteDashboard() {
  const [activeView, setActiveView] = useState("cursos");

  // Load from database via APIs
  const [students, setStudents] = useState<MockStudent[]>([]);
  const [activeTeacher, setActiveTeacher] = useState<any>({});
  const [zoomLink, setZoomLink] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const stored = localStorage.getItem("ihdeca_user");
    let loggedUser: any = null;
    if (stored) {
      try { loggedUser = JSON.parse(stored); } catch {}
    }
    
    // Load courses
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(err => console.error("Error loading courses:", err));

    // Load users and find the logged-in teacher
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data.filter(u => u.rol === "STUDENT"));
          
          const teacher = data.find((u: any) => 
            loggedUser ? u.email.toLowerCase() === loggedUser.email.toLowerCase() : u.email === "walter@ihdeca.com"
          );
          if (teacher) {
            setActiveTeacher(teacher);
            setZoomLink(teacher.zoomLink || "");
          } else if (loggedUser) {
            setActiveTeacher(loggedUser);
          }
        }
      })
      .catch(err => console.error("Error loading users:", err));
  }, []);

  // Grading form state
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [gradeForm, setGradeForm] = useState({
    calificacion: "",
    comentariosDocente: ""
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [quickMode, setQuickMode] = useState(false);
  const [quickGrades, setQuickGrades] = useState<Record<string, string>>({});

  const handleQuickGrade = async (studentId: string) => {
    const grade = quickGrades[studentId];
    if (!grade) return;
    try {
      const st = students.find(s => s.id === studentId);
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: studentId, calificacion: parseInt(grade, 10), progreso: parseInt(grade, 10) >= 60 ? 100 : st?.progreso || 0 })
      });
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, calificacion: parseInt(grade, 10) } : s));
      setQuickGrades(prev => { const n = { ...prev }; delete n[studentId]; return n; });
    } catch {}
  };

  const [moduleGrades, setModuleGrades] = useState<{ [key: number]: { score: string; completed: boolean } }>({});

  useEffect(() => {
    if (selectedStudentId) {
      const st = students.find(s => s.id === selectedStudentId);
      if (st) {
        let feedbackText = st.comentariosDocente || "";
        let parsedModules: any = {};
        
        try {
          if (st.comentariosDocente && st.comentariosDocente.startsWith("{")) {
            const parsed = JSON.parse(st.comentariosDocente);
            feedbackText = parsed.feedback || "";
            parsedModules = parsed.moduleGrades || {};
          }
        } catch (e) {}

        setGradeForm({
          calificacion: st.calificacion !== null ? st.calificacion.toString() : "",
          comentariosDocente: feedbackText
        });
        setModuleGrades(parsedModules);
      }
    } else {
      setGradeForm({ calificacion: "", comentariosDocente: "" });
      setModuleGrades({});
    }
  }, [selectedStudentId, students]);

  // Find all courses taught by or assigned to this teacher
  const teacherCourses = courses.filter(c => 
    c.instructor === activeTeacher.nombre || 
    (activeTeacher.cursoSlugs && activeTeacher.cursoSlugs.includes(c.slug)) ||
    (activeTeacher.cursoAsignadoSlug && activeTeacher.cursoAsignadoSlug.split(",").map((s: string) => s.trim()).includes(c.slug))
  );

  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>("");

  useEffect(() => {
    if (teacherCourses.length > 0 && (!selectedCourseSlug || !teacherCourses.some(c => c.slug === selectedCourseSlug))) {
      setSelectedCourseSlug(teacherCourses[0].slug);
    }
  }, [teacherCourses, selectedCourseSlug]);

  const activeCourseSlug = selectedCourseSlug || activeTeacher.cursoSlug || (courses[0]?.slug || "");
  const teacherCourse = courses.find(c => c.slug === activeCourseSlug);
  const activeStudents = students.filter(s => s.estadoInscripcion === "Aceptado" && s.cursoSlug === activeCourseSlug);

  // Objectives and Target Audience State
  const [objetivosText, setObjetivosText] = useState("");
  const [dirigidoAText, setDirigidoAText] = useState("");
  const [savingObjetivos, setSavingObjetivos] = useState(false);
  const [objetivosSuccess, setObjetivosSuccess] = useState(false);

  useEffect(() => {
    if (teacherCourse) {
      setObjetivosText(
        Array.isArray(teacherCourse.objetivos)
          ? teacherCourse.objetivos.join("\n")
          : (teacherCourse.objetivos || "")
      );
      setDirigidoAText(
        Array.isArray(teacherCourse.dirigidoA)
          ? teacherCourse.dirigidoA.join("\n")
          : (teacherCourse.dirigidoA || "")
      );
    }
  }, [teacherCourse]);

  const handleSaveObjetivos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourseSlug) return;

    setSavingObjetivos(true);
    try {
      const res = await fetch(`/api/courses/${activeCourseSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objetivos: objetivosText,
          dirigidoA: dirigidoAText
        })
      });
      if (res.ok) {
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        if (Array.isArray(coursesData)) setCourses(coursesData);
        setObjetivosSuccess(true);
        setTimeout(() => setObjetivosSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Error saving objetivos:", err);
    } finally {
      setSavingObjetivos(false);
    }
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const currentTemario = teacherCourse?.temario || [];
    const totalModules = currentTemario.length || 1;

    let completedCount = 0;
    let scoreSum = 0;
    let scoredCount = 0;

    currentTemario.forEach((mod, idx) => {
      const mData = moduleGrades[idx];
      if (mData?.completed) {
        completedCount++;
      }
      if (mData?.score !== undefined && mData.score !== "") {
        const val = parseInt(mData.score, 10);
        if (!isNaN(val)) {
          scoreSum += val;
          scoredCount++;
        }
      }
    });

    const calculatedProgress = Math.min(100, Math.round((completedCount / totalModules) * 100));
    const calculatedAvgGrade = scoredCount > 0 ? Math.round(scoreSum / scoredCount) : (gradeForm.calificacion ? parseInt(gradeForm.calificacion, 10) : null);

    const serializedComments = JSON.stringify({
      feedback: gradeForm.comentariosDocente,
      moduleGrades
    });

    const userToUpdate = {
      id: selectedStudentId,
      calificacion: calculatedAvgGrade,
      comentariosDocente: serializedComments,
      progreso: calculatedProgress
    };

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToUpdate)
      });
      if (res.ok) {
        setStudents(prev => 
          prev.map(st => st.id === selectedStudentId 
            ? { 
                ...st, 
                calificacion: calculatedAvgGrade, 
                comentariosDocente: serializedComments,
                progreso: calculatedProgress
              } 
            : st
          )
        );
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Error saving grade:", err);
    }
  };

  const handleSaveZoomLink = async () => {
    if (!activeTeacher.id) return;
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeTeacher.id,
          zoomLink: zoomLink
        })
      });
      if (res.ok) {
        alert("Enlace de aula virtual guardado correctamente.");
      }
    } catch (err) {
      console.error("Error saving zoom link:", err);
    }
  };

  // Syllabus (Temario) state & handlers
  const [newModuleText, setNewModuleText] = useState("");

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleText.trim() || !activeCourseSlug) return;

    try {
      const res = await fetch("/api/syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: activeCourseSlug,
          contenido: newModuleText.trim()
        })
      });
      if (res.ok) {
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        if (Array.isArray(coursesData)) setCourses(coursesData);
        setNewModuleText("");
      }
    } catch (err) {
      console.error("Error adding syllabus module:", err);
    }
  };

  const handleDeleteModule = async (index: number) => {
    if (!activeCourseSlug) return;
    const currentCourse = courses.find(c => c.slug === activeCourseSlug);
    if (!currentCourse || !currentCourse.temario) return;
    
    const contentToDelete = currentCourse.temario[index];
    if (!contentToDelete) return;

    try {
      const res = await fetch("/api/syllabus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: activeCourseSlug,
          contenido: contentToDelete
        })
      });
      if (res.ok) {
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        if (Array.isArray(coursesData)) setCourses(coursesData);
      }
    } catch (err) {
      console.error("Error deleting syllabus module:", err);
    }
  };

  const handleTogglePublish = async () => {
    const currentCourse = courses.find(c => c.slug === activeCourseSlug);
    if (!currentCourse || !currentCourse.temario || currentCourse.temario.length === 0) return;

    try {
      const res = await fetch(`/api/courses/${activeCourseSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicado: !currentCourse.publicado
        })
      });
      if (res.ok) {
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        if (Array.isArray(coursesData)) setCourses(coursesData);
      }
    } catch (err) {
      console.error("Error toggling publish state:", err);
    }
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
        userName={activeTeacher.nombre ? `Prof. ${activeTeacher.nombre}` : "Docente"}
        userEmail={activeTeacher.email || ""}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto max-w-full">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <div>
              <h1 className="font-academic text-xl sm:text-2xl font-black uppercase tracking-tight">Panel del Docente</h1>
              <p className="text-[10px] sm:text-xs text-text-slate font-medium">Control de avance escolar, calificaciones de alumnos y gestión de materias.</p>
            </div>
          </div>

          {/* Course Selector for Teachers with multiple courses */}
          {teacherCourses.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="teacher-course-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Materia seleccionada:
              </label>
              <select
                id="teacher-course-select"
                value={activeCourseSlug}
                onChange={(e) => setSelectedCourseSlug(e.target.value)}
                className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-primary focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer shadow-sm"
              >
                {teacherCourses.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}
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
                  <strong className="text-primary text-base">{activeStudents.filter(s => s.cursoSlug === activeCourseSlug).length} Alumnos</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Evaluaciones Completadas:</span>
                  <strong className="text-primary text-base">
                    {activeStudents.filter(s => s.cursoSlug === activeCourseSlug && s.calificacion !== null).length} Evaluados
                  </strong>
                </div>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <span className="text-slate-500 font-semibold">Progreso general del grupo</span>
                {(() => {
                  const courseStudents = activeStudents.filter(s => s.cursoSlug === activeCourseSlug);
                  const avgProgress = courseStudents.length > 0
                    ? Math.round(courseStudents.reduce((sum, s) => sum + (s.progreso || 0), 0) / courseStudents.length)
                    : 0;
                  return (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-primary">{avgProgress}% promedio</span>
                        <span className="text-slate-400">{courseStudents.length} alumno{courseStudents.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${avgProgress}%` }} />
                      </div>
                    </div>
                  );
                })()}
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
                <button
                  onClick={handleSaveZoomLink}
                  className="flex-grow text-center px-4 py-2.5 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 hover:bg-orange-600 border-none outline-none"
                >
                  Guardar Enlace
                  <Save className="w-3.5 h-3.5" />
                </button>
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

        {/* VIEW 3: GESTIONAR TEMARIO */}
        {activeView === "temario" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in font-sans text-xs">
            
            {/* Left side: Syllabus List & Add Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-primary">Plan de Estudios / Temario</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Visualiza, agrega y elimina los módulos que conforman la estructura del curso.
                </p>
              </div>

              {/* Add module form */}
              <form onSubmit={handleAddModule} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Ej. Módulo 3: Estrategias de comunicación..."
                  value={newModuleText}
                  onChange={(e) => setNewModuleText(e.target.value)}
                  className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-primary hover:bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </form>

              {/* Modules list */}
              <div className="space-y-3 pt-2">
                {teacherCourse?.temario && teacherCourse.temario.length > 0 ? (
                  <div className="space-y-2.5">
                    {teacherCourse.temario.map((modulo, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                      >
                        <div className="flex gap-3 items-start min-w-0 pr-4">
                          <span className="font-bold text-accent">#{index + 1}</span>
                          <span className="font-semibold text-slate-700 leading-normal break-words">{modulo}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteModule(index)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          aria-label="Eliminar módulo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-primary">El temario está vacío</h4>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-normal">
                      Agrega tu primer módulo de aprendizaje usando el formulario superior. Se requiere al menos un módulo para poder publicar este curso en la web.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Publish options */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-6">
              <div className="space-y-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${
                  teacherCourse?.publicado 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-amber-50 text-amber-600 border-amber-100"
                }`}>
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Estado de Publicación</span>
                  <h3 className="text-base font-bold text-primary mt-0.5">Visibilidad del Curso</h3>
                </div>

                {/* Status indicator banner */}
                {teacherCourse?.publicado ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl space-y-1">
                    <h4 className="font-bold text-emerald-900 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Publicado en el Sitio Web
                    </h4>
                    <p className="text-[10px] text-slate-600 leading-normal font-medium font-sans">
                      Este curso es visible para el público en general. Los estudiantes pueden enviar solicitudes de inscripción en la web principal.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl space-y-1">
                    <h4 className="font-bold text-amber-900 flex items-center gap-1.5 font-sans">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Borrador / No publicado
                    </h4>
                    <p className="text-[10px] text-slate-600 leading-normal font-medium font-sans">
                      El curso está oculto en la página web pública. Para poder publicarlo, debes asegurarte de que el temario de estudio tenga contenido.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                {teacherCourse?.temario && teacherCourse.temario.length > 0 ? (
                  <button
                    onClick={handleTogglePublish}
                    className={`w-full text-center px-4 py-2.5 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm ${
                      teacherCourse?.publicado 
                        ? "bg-rose-600 hover:bg-rose-700" 
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {teacherCourse?.publicado ? "Pausar Publicación (Ocultar)" : "Publicar Curso (Hacer visible)"}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full text-center px-4 py-2.5 bg-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-not-allowed shadow-none"
                  >
                    Añade temario para poder publicar
                  </button>
                )}
              </div>
            </div>

            {/* Objetivos de Aprendizaje & Destinatarios Card */}
            <div className="lg:col-span-12 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-primary">Objetivos de Aprendizaje y Perfil Destinatario</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Define los objetivos principales que tus alumnos aprenderán en tu materia y a quién va dirigida la formación.
                  </p>
                </div>

                {objetivosSuccess && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                    <Check className="w-4 h-4" />
                    Objetivos guardados correctamente
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveObjetivos} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Objetivos */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Objetivos de Aprendizaje <span className="text-slate-400 font-normal">(Escribe un objetivo por línea)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ej. Dominar técnicas de comunicación asertiva&#10;Desarrollar habilidades de gestión de conflictos"
                      value={objetivosText}
                      onChange={(e) => setObjetivosText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-slate-800 resize-none font-sans"
                    />
                  </div>

                  {/* A quien va dirigido */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      ¿A quién va dirigido? <span className="text-slate-400 font-normal">(Escribe un perfil por línea)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ej. Líderes de equipo y supervisores&#10;Profesionales interesados en liderazgo"
                      value={dirigidoAText}
                      onChange={(e) => setDirigidoAText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-slate-800 resize-none font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingObjetivos}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {savingObjetivos ? "Guardando..." : "Guardar Objetivos y Perfil"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* MATERIALES */}
        {activeView === "materiales" && (
          <MaterialesDocente courseSlug={activeCourseSlug} />
        )}

        {/* VIEW 2: CALIFICACIONES / EVALUAR */}
        {activeView === "calificaciones" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Student selection list Left */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-primary">Alumnos Inscritos ({activeStudents.length})</h3>
                <button
                  onClick={() => setQuickMode(!quickMode)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${quickMode ? "bg-accent text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {quickMode ? "Modo normal" : "Calificacion rapida"}
                </button>
              </div>
              
              <div className="divide-y divide-slate-100 font-sans text-xs">
                {activeStudents.map((st) => (
                  <div 
                    key={st.id}
                    onClick={() => !quickMode && setSelectedStudentId(st.id)}
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
                      {quickMode ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Nota"
                            value={quickGrades[st.id] || ""}
                            onChange={e => setQuickGrades(prev => ({ ...prev, [st.id]: e.target.value }))}
                            className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center"
                            onClick={e => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); handleQuickGrade(st.id); }}
                            disabled={!quickGrades[st.id]}
                            className="px-2.5 py-1.5 bg-accent text-white rounded-lg text-[9px] font-bold uppercase hover:bg-primary disabled:opacity-50 cursor-pointer"
                          >
                            Guardar
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="hidden sm:block w-20">
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div className="bg-accent h-1.5 rounded-full" style={{ width: `${st.progreso || 0}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">{st.progreso || 0}%</span>
                          </div>
                          {st.calificacion !== null ? (
                            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-bold">
                              Nota: {st.calificacion}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded text-[9px] font-bold">
                              Pendiente
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation Panel Right - ULTRA PREMIUM */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-xl space-y-6">
              {selectedStudentId ? (
                <form onSubmit={handleSaveGrade} className="space-y-6 font-sans text-xs">
                  {/* Glassmorphic Dark Hero Header */}
                  <div className="bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 relative overflow-hidden flex items-center justify-between">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-1 relative z-10">
                      <span className="text-[9px] font-bold text-accent uppercase tracking-widest block">Evaluación de Alumno</span>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {students.find(s => s.id === selectedStudentId)?.nombre}
                      </h3>
                      <p className="text-[10px] text-slate-300 font-medium truncate max-w-[200px]">
                        {teacherCourse?.title || "Programa de formación"}
                      </p>
                    </div>

                    {/* Glowing Circular Score Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-inner relative z-10 shrink-0">
                      <span className="text-[7px] font-black uppercase tracking-widest text-slate-300">Nota Final</span>
                      <span className="text-lg font-black text-amber-400 leading-none mt-0.5">
                        {(() => {
                          const scores = Object.values(moduleGrades)
                            .map((m: any) => parseInt(m?.score, 10))
                            .filter((val: number) => !isNaN(val));
                          if (scores.length > 0) {
                            return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                          }
                          return gradeForm.calificacion ? gradeForm.calificacion : "--";
                        })()}
                      </span>
                    </div>
                  </div>

                  {saveSuccess && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in shadow-xs">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ¡Evaluación guardada y boleta actualizada correctamente!
                    </div>
                  )}

                  {/* Compact Matrix Table with Score Presets */}
                  {teacherCourse?.temario && teacherCourse.temario.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Desglose por Módulo</span>
                        <span className="text-accent font-extrabold bg-accent/10 px-2.5 py-0.5 rounded-lg border border-accent/20">
                          {Object.values(moduleGrades).filter((m: any) => m?.completed).length} de {teacherCourse.temario.length} Completados
                        </span>
                      </div>

                      <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs bg-slate-50/30 divide-y divide-slate-100">
                        {teacherCourse.temario.map((mod: any, idx: number) => {
                          const mData = moduleGrades[idx] || { completed: false, score: "" };
                          const title = mod.contenido || mod;

                          return (
                            <div key={idx} className="p-3.5 bg-white hover:bg-slate-50/80 transition-colors space-y-2.5">
                              <div className="flex items-center justify-between gap-3">
                                {/* Module Title */}
                                <div className="flex items-center gap-2 max-w-[210px]">
                                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                                    {idx + 1}
                                  </span>
                                  <h4 className="text-xs font-bold text-primary truncate" title={title}>
                                    {title}
                                  </h4>
                                </div>

                                {/* Status Toggle Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setModuleGrades(prev => ({
                                      ...prev,
                                      [idx]: { ...prev[idx], completed: !mData.completed }
                                    }));
                                  }}
                                  className={`px-3 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                                    mData.completed 
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20 border border-emerald-400/50" 
                                      : "bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200"
                                  }`}
                                >
                                  {mData.completed ? (
                                    <>
                                      <Check className="w-3 h-3 stroke-[3]" />
                                      Completado
                                    </>
                                  ) : (
                                    "Pendiente"
                                  )}
                                </button>
                              </div>

                              {/* Score Control Row with Quick Preset Chips */}
                              <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px]">
                                <span className="font-semibold text-slate-400">Puntaje:</span>
                                
                                <div className="flex items-center gap-2">
                                  {/* Quick Preset Buttons */}
                                  <div className="flex gap-1">
                                    {[100, 90, 80].map((preset) => (
                                      <button
                                        key={preset}
                                        type="button"
                                        onClick={() => {
                                          setModuleGrades(prev => ({
                                            ...prev,
                                            [idx]: { 
                                              ...prev[idx], 
                                              score: preset.toString(),
                                              completed: true 
                                            }
                                          }));
                                        }}
                                        className={`px-2 py-0.5 rounded text-[8px] font-bold transition-all cursor-pointer ${
                                          mData.score === preset.toString()
                                            ? "bg-primary text-white"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                        }`}
                                      >
                                        {preset}
                                      </button>
                                    ))}
                                  </div>

                                  <div className="inline-flex items-center gap-1">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="--"
                                      value={mData.score || ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setModuleGrades(prev => ({
                                          ...prev,
                                          [idx]: { 
                                            ...prev[idx], 
                                            score: val,
                                            completed: val !== "" ? true : prev[idx]?.completed 
                                          }
                                        }));
                                      }}
                                      className="w-14 text-center px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                                    />
                                    <span className="text-[10px] text-slate-400 font-bold">pts</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <label htmlFor="calificacion-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        Calificación Definitiva (0 - 100)
                      </label>
                      <input
                        type="number"
                        id="calificacion-input"
                        min="0"
                        max="100"
                        placeholder="Ej. 90"
                        value={gradeForm.calificacion}
                        onChange={(e) => setGradeForm({ ...gradeForm, calificacion: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-sans text-xs text-slate-800"
                      />
                    </div>
                  )}

                  {/* Teacher comments */}
                  <div className="space-y-1.5">
                    <label htmlFor="comentarios-input" className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Retroalimentación General para el Alumno
                    </label>
                    <textarea
                      id="comentarios-input"
                      rows={3}
                      placeholder="Escribe comentarios u observaciones sobre el desempeño del alumno..."
                      value={gradeForm.comentariosDocente}
                      onChange={(e) => setGradeForm({ ...gradeForm, comentariosDocente: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-sans text-xs text-slate-800 resize-none"
                    />
                  </div>

                  {/* Premium Action CTA */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-accent via-orange-500 to-accent hover:from-primary hover:to-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-accent/20 transition-all duration-300"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Evaluación Completa
                  </button>
                </form>
              ) : (
                <div className="text-center py-16 space-y-3 font-sans">
                  <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-primary">Ningún Alumno Seleccionado</h4>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                    Selecciona un alumno de la lista de la izquierda para desplegar su matriz de evaluación y asentar sus calificaciones.
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
