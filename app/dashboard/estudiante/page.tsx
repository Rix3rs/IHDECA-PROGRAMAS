"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Award, CheckCircle, ExternalLink, Calendar, AlertTriangle, Clock, Printer, Download, X, User, Lock, FileText, Link2, Video, Menu } from "lucide-react";
import Sidebar from "@/app/dashboard/components/Sidebar";
import { initialStudents, initialTeachers, MockStudent } from "@/app/data/dashboardData";
import { courses } from "@/app/data/courses";

export default function EstudianteDashboard() {
  const [activeView, setActiveView] = useState("cursos");

  const [students, setStudents] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [activeStudentId, setActiveStudentId] = useState<string>("");
  const [zoomLink, setZoomLink] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ nombre: "", password: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);

    let loggedUserEmail = "";
    const savedUser = localStorage.getItem("ihdeca_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.email) loggedUserEmail = parsed.email.toLowerCase();
      } catch (err) {}
    }

    // Load courses from database
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCoursesList(data);
      })
      .catch(err => console.error("Error loading courses:", err));

    // Load users from database
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const studentUsers = data.filter(u => u.rol === "STUDENT");
          setStudents(studentUsers);

          const matched = studentUsers.find(s => s.email.toLowerCase() === loggedUserEmail);
          if (matched) {
            setActiveStudentId(matched.id);
            if (matched.zoomLink) setZoomLink(matched.zoomLink);
          } else if (studentUsers.length > 0) {
            setActiveStudentId(studentUsers[0].id);
          }
        }
      })
      .catch(err => console.error("Error loading users:", err));
  }, []);

  const activeStudent = students.find(s => s.id === activeStudentId) || {};

  useEffect(() => {
    setProfileForm({ nombre: activeStudent.nombre || "", password: "", confirmPassword: "" });
  }, [activeStudent.nombre, activeView]);

  useEffect(() => {
    if (!activeStudent.cursoSlug) return;
    fetch(`/api/materials?courseSlug=${activeStudent.cursoSlug}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMaterials(d); })
      .catch(() => {});
  }, [activeStudent.cursoSlug]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      setProfileMsg("Las contrasenas no coinciden");
      return;
    }
    try {
      const body: any = { id: activeStudentId, nombre: profileForm.nombre };
      if (profileForm.password) body.contrasena = profileForm.password;
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setProfileMsg("Perfil actualizado correctamente");
        setShowProfileModal(false);
      } else {
        const d = await res.json();
        setProfileMsg(d.error || "Error al actualizar");
      }
    } catch {
      setProfileMsg("Error de conexion");
    }
  };

  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>("");

  const studentCourseSlugs = activeStudent.cursoSlug
    ? activeStudent.cursoSlug.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  const studentCourses = coursesList.filter(c => studentCourseSlugs.includes(c.slug));

  useEffect(() => {
    if (studentCourses.length > 0 && (!selectedCourseSlug || !studentCourses.some(c => c.slug === selectedCourseSlug))) {
      setSelectedCourseSlug(studentCourses[0].slug);
    }
  }, [studentCourses, selectedCourseSlug]);

  const activeCourseSlug = selectedCourseSlug || studentCourseSlugs[0] || activeStudent.cursoSlug;
  const courseData = coursesList.find(c => c.slug === activeCourseSlug) || studentCourses[0];

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
        userName={activeStudent.nombre || "Estudiante"}
        userEmail={activeStudent.email || ""}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto max-w-full">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-4 font-sans text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <div>
              <h1 className="font-academic text-xl sm:text-2xl font-black uppercase tracking-tight">Panel del Estudiante</h1>
              <p className="text-[10px] sm:text-xs text-text-slate font-medium">Visualiza tus materias inscritas, tu avance académico y calificaciones.</p>
            </div>
          </div>

          {/* Multiple Course Switcher for Students */}
          {studentCourses.length > 1 && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs shrink-0">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Materia Activa:</span>
              <select
                value={activeCourseSlug}
                onChange={(e) => setSelectedCourseSlug(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-primary cursor-pointer focus:outline-none"
              >
                {studentCourses.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}
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
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 relative">
                      {courseData.coverUrl ? (
                        <img src={courseData.coverUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-primary" />
                      )}
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

        {/* Materials Section - full width */}
        {activeView === "cursos" && activeStudent.estadoInscripcion === "Aceptado" && materials.length > 0 && (
          <div className="mt-8 max-w-4xl bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-4 font-sans text-xs">
            <h3 className="text-base font-bold text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Materiales del curso
            </h3>
            <div className="divide-y divide-slate-100">
              {materials.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {m.type === "pdf" ? <FileText className="w-4 h-4 text-rose-500" /> :
                     m.type === "video" ? <Video className="w-4 h-4 text-blue-500" /> :
                     <Link2 className="w-4 h-4 text-emerald-500" />}
                    <span className="font-bold text-primary">{m.title}</span>
                  </div>
                  <a href={m.url} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-accent text-white rounded-lg text-[10px] font-bold uppercase hover:bg-primary transition-colors inline-flex items-center gap-1">
                    Abrir <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: AVANCE DE MODULOS */}
        {activeView === "temarios" && (
          <div className="max-w-4xl bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-8 shadow-sm space-y-6 font-sans">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-primary">Temario de la Materia</h3>
              <p className="text-xs text-slate-500 font-medium">
                Visualiza los módulos que componen este programa y el estado de avance asignado por tu docente.
              </p>
            </div>

            {courseData?.temario ? (
              <div className="space-y-4 text-xs">
                {courseData.temario.map((modulo: any, i: number) => {
                  let parsedFeedback = activeStudent.comentariosDocente || "";
                  let parsedModuleGrades: any = {};
                  try {
                    if (activeStudent.comentariosDocente && activeStudent.comentariosDocente.startsWith("{")) {
                      const parsed = JSON.parse(activeStudent.comentariosDocente);
                      parsedModuleGrades = parsed.moduleGrades || {};
                    }
                  } catch (e) {}

                  const mData = parsedModuleGrades[i];
                  const isChecked = mData?.completed !== undefined 
                    ? mData.completed 
                    : activeStudent.progreso >= Math.round(((i + 1) / courseData.temario!.length) * 100);

                  return (
                    <div 
                      key={i} 
                      className={`flex items-start gap-4 p-4.5 rounded-2xl border transition-all ${
                        isChecked 
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isChecked ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${isChecked ? "text-emerald-700" : "text-slate-400"}`}>
                            Módulo {i + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            {mData?.score && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2.5 py-0.5 rounded-md">
                                Nota: {mData.score}/100
                              </span>
                            )}
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                              isChecked ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                            }`}>
                              {isChecked ? "Completado" : "En desarrollo"}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-primary">{modulo.contenido || modulo}</h4>
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

                {/* Certificate Download Callout */}
                {activeStudent.progreso >= 100 && (
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-sm">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary text-sm">Constancia Oficial Disponible</h4>
                        <p className="text-[10px] text-slate-600 font-medium">¡Felicidades! Has completado el 100% de los módulos con calificación aprobatoria.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm"
                    >
                      <Award className="w-4 h-4" />
                      Ver / Imprimir Constancia Oficial
                    </button>
                  </div>
                )}

                {/* Feedback */}
                {activeStudent.comentariosDocente && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-accent" />
                      Retroalimentación del Profesor:
                    </h4>
                    <p className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 italic leading-relaxed font-medium">
                      "{(() => {
                        try {
                          if (activeStudent.comentariosDocente.startsWith("{")) {
                            const parsed = JSON.parse(activeStudent.comentariosDocente);
                            if (parsed.feedback && parsed.feedback.trim()) return parsed.feedback;
                            if (parsed.moduleGrades && Object.keys(parsed.moduleGrades).length > 0) return "Calificacion por modulos. Sin comentarios adicionales.";
                            return "Sin comentarios del docente.";
                          }
                        } catch (e) {}
                        return activeStudent.comentariosDocente;
                      })()}"
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

        {/* VIEW PERFIL */}
        {activeView === "perfil" && (
          <div className="max-w-lg bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-8 shadow-sm space-y-6 font-sans text-xs">
            <h3 className="text-lg font-bold text-primary border-l-4 border-accent pl-3">Editar Perfil</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={profileForm.nombre} placeholder={activeStudent.nombre || "Tu nombre"}
                    onChange={e => setProfileForm({ ...profileForm, nombre: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600">Nueva contrasena (dejar vacio para no cambiar)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="password" value={profileForm.password} placeholder="Minimo 6 caracteres"
                    onChange={e => setProfileForm({ ...profileForm, password: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>
              {profileForm.password && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-600">Confirmar contrasena</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input type="password" value={profileForm.confirmPassword} placeholder="Repite la contrasena"
                      onChange={e => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
              )}
              {profileMsg && (
                <div className={`p-3 rounded-xl text-[11px] font-semibold ${profileMsg.includes("correctamente") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {profileMsg}
                </div>
              )}
              <button type="submit"
                className="w-full py-2.5 bg-accent text-white rounded-lg nicdark-btn-radius text-xs font-bold uppercase hover:bg-primary transition-colors cursor-pointer">
                Guardar cambios
              </button>
            </form>
          </div>
        )}

        {/* CERTIFICATE DIPLOMA MODAL */}
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
            <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-[32px] shadow-2xl p-8 sm:p-12 relative animate-scale-up text-primary overflow-hidden">
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors cursor-pointer print:hidden"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Printable Certificate Layout */}
              <div className="border-8 border-double border-primary/20 p-8 sm:p-10 rounded-2xl space-y-8 text-center relative bg-gradient-to-b from-white via-slate-50/50 to-white">
                {/* Header Logo */}
                <div className="space-y-2">
                  <img src="/logo.webp" alt="IHDECA Programas" className="h-14 w-auto mx-auto object-contain" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 block">Instituto de Habilidades y Desarrollo Académico</span>
                </div>

                <div className="space-y-2 pt-2">
                  <h2 className="font-academic text-2xl sm:text-3xl font-black text-primary uppercase tracking-widest">
                    Constancia de Acreditación
                  </h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Se otorga el presente reconocimiento a:</p>
                </div>

                {/* Student Name */}
                <div className="py-2 border-b-2 border-accent/40 max-w-md mx-auto">
                  <h3 className="font-academic text-2xl sm:text-3xl font-bold text-primary">
                    {activeStudent.nombre}
                  </h3>
                </div>

                {/* Details */}
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed font-medium">
                  Por haber concluido satisfactoriamente con mención sobresaliente el programa de formación profesional en:
                </p>

                <h4 className="text-lg sm:text-xl font-bold text-accent uppercase tracking-wide">
                  "{activeStudent.cursoTitle}"
                </h4>

                <div className="flex justify-around items-center pt-8 border-t border-slate-200 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Calificación Obtenida</span>
                    <span className="text-base font-black text-emerald-600">{activeStudent.calificacion} / 100</span>
                  </div>
                  <div className="w-20 h-20 rounded-full border-2 border-amber-400/60 flex items-center justify-center p-1 bg-amber-50/50">
                    <div className="w-full h-full rounded-full border border-dashed border-amber-500 flex items-center justify-center text-[8px] font-black uppercase text-amber-700 tracking-tighter text-center">
                      SELLO OFICIAL IHDECA
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Fecha de Emisión</span>
                    <span className="text-xs font-bold text-slate-700">{new Date().toLocaleDateString("es-MX", { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / Guardar en PDF
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
