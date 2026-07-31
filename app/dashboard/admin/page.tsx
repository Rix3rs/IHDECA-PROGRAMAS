"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, UserCheck, AlertCircle, X, HelpCircle, FileText, Trash2, Edit2, UserCog, BookOpen, Download, Inbox, Mail, Key, RefreshCw, Search, Tags, Menu } from "lucide-react";
import Sidebar from "@/app/dashboard/components/Sidebar";
import NotificationBell from "@/app/dashboard/components/NotificationBell";
import { initialStudents, MockStudent, initialTeachers, MockTeacher } from "@/app/data/dashboardData";
import { courses as initialCourses, Course } from "@/app/data/courses";

interface Metrics {
  ingresosMensuales: string;
  alumnosActivos: number;
  retencionRate: string;
  solicitudesPendientesCount: number;
  pagosDelMes: number;
}

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("resumen");
  const [students, setStudents] = useState<MockStudent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<MockTeacher[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    ingresosMensuales: "$0 MXN",
    alumnosActivos: 0,
    retencionRate: "0%",
    solicitudesPendientesCount: 0,
    pagosDelMes: 0,
  });

  // Create User Modal State
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    rol: "STUDENT",
    cursoSlug: "",
    empresa: ""
  });

  useEffect(() => {
    setIsMounted(true);
    
    // Load courses from database
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(err => console.error("Error loading courses:", err));

    // Load users from database
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data.filter(u => u.rol === "STUDENT"));
          setTeachers(data.filter(u => u.rol === "TEACHER"));
        }
      })
      .catch(err => console.error("Error loading users:", err));

    // Load leads from database
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch(err => console.error("Error loading leads:", err));

    // Load real metrics
    fetch("/api/metrics")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setMetrics(data);
      })
      .catch(err => console.error("Error loading metrics:", err));

    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    iconName: "BookOpen",
    color: "bg-blue-50/70",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    imageUrl: ""
  });

  // Price formatting helper
  const formatPriceMXN = (val: string) => {
    if (!val) return "";
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) return "Por confirmar";
    const num = parseInt(clean, 10);
    const formatted = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
    return `${formatted} MXN`;
  };

  // Export Leads to CSV
  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert("No hay prospectos para exportar.");
      return;
    }
    const headers = ["ID", "Fecha", "Nombre", "Teléfono", "Email", "Curso", "Empresa", "Mensaje", "Estado"];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleString("es-MX").replace(/"/g, '""')}"`,
      `"${(l.nombre || "").replace(/"/g, '""')}"`,
      `"${(l.telefono || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.curso || "").replace(/"/g, '""')}"`,
      `"${(l.empresa || "").replace(/"/g, '""')}"`,
      `"${(l.mensaje || "").replace(/"/g, '""')}"`,
      `"${(l.estado || "Nuevo").replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_ihdeca_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateLeadStatus = async (id: string, estado: string) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, estado } : l));
      }
    } catch (err) {
      console.error("Error updating lead status:", err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este prospecto?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(prev => [...prev, data.category]);
        setIsCategoryModalOpen(false);
        setCategoryForm({ name: "", description: "", iconName: "BookOpen", color: "bg-blue-50/70", textColor: "text-blue-600", borderColor: "border-blue-100", imageUrl: "" });
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (!confirm("¿Eliminar esta categoria? Los cursos asociados no se borraran.")) return;
    try {
      const res = await fetch(`/api/categories?slug=${slug}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.slug !== slug));
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Modal State for Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    extendedDescription: "",
    category: "",
    categorySlug: "",
    duration: "Por confirmar",
    lessons: "Por definir",
    instructor: "Por confirmar",
    price: "Por confirmar",
    precioMxn: "",
    gradient: "from-blue-600 to-indigo-700",
    coverUrl: "",
    coverPositionY: 50,
    coverAlt: "",
    fechas: "Por confirmar",
    objetivos: "",
    dirigidoA: ""
  });

  // Modal State for Editing Course
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourseSlug, setEditingCourseSlug] = useState<string | null>(null);
  const [editCourseForm, setEditCourseForm] = useState({
    title: "",
    description: "",
    extendedDescription: "",
    category: "",
    categorySlug: "",
    duration: "Por confirmar",
    lessons: "Por definir",
    instructor: "Por confirmar",
    price: "Por confirmar",
    precioMxn: "",
    coverUrl: "",
    coverPositionY: 50,
    coverAlt: "",
    fechas: "Por confirmar",
    objetivos: "",
    dirigidoA: ""
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.success && data.url) {
        setNewCourse(prev => ({ ...prev, coverUrl: data.url }));
      } else {
        // Fallback to base64 for demo purposes
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewCourse(prev => ({ ...prev, coverUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      // Fallback to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCourse(prev => ({ ...prev, coverUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
      console.warn("R2 Upload error, using base64 fallback:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.success && data.url) {
        setEditCourseForm(prev => ({ ...prev, coverUrl: data.url }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditCourseForm(prev => ({ ...prev, coverUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditCourseForm(prev => ({ ...prev, coverUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
      console.warn("R2 Upload error during edit, using base64 fallback:", err);
    } finally {
      setUploading(false);
    }
  };

  // User Edit Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserType, setEditingUserType] = useState<"student" | "teacher">("student");
  const [editingUserId, setEditingUserId] = useState("");
  const [userForm, setUserForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    cursoSlug: "",
    progreso: 0
  });

  // Sub-tab toggle in Users Tab
  const [activeUserSubTab, setActiveUserSubTab] = useState<"student" | "teacher">("student");

  const handleOpenEditUser = (type: "student" | "teacher", id: string) => {
    setEditingUserType(type);
    setEditingUserId(id);

    if (type === "student") {
      const student = students.find(st => st.id === id);
      if (student) {
        setUserForm({
          nombre: student.nombre,
          email: student.email,
          contrasena: "",
          cursoSlug: student.cursoSlug,
          progreso: student.progreso !== undefined ? student.progreso : 0
        });
      }
    } else {
      const teacher = teachers.find(t => t.id === id);
      if (teacher) {
        setUserForm({
          nombre: teacher.nombre,
          email: teacher.email,
          contrasena: "",
          cursoSlug: teacher.cursoSlug,
          progreso: 0
        });
      }
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    const userToUpdate = {
      id: editingUserId,
      nombre: userForm.nombre,
      email: userForm.email,
      contrasena: userForm.contrasena,
      rol: editingUserType === "student" ? "STUDENT" : "TEACHER",
      cursoSlug: userForm.cursoSlug,
      progreso: Number(userForm.progreso)
    };

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToUpdate)
      });
      if (res.ok) {
        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json();
        if (Array.isArray(usersData)) {
          setStudents(usersData.filter(u => u.rol === "STUDENT"));
          setTeachers(usersData.filter(u => u.rol === "TEACHER"));
        }
        setIsUserModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar cambios del usuario.");
      }
    } catch (err: any) {
      console.error("Error updating user:", err);
      alert("Ocurrió un error al actualizar los datos del usuario.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario permanentemente?")) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
        setTeachers(prev => prev.filter(t => t.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar usuario.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error al intentar eliminar el usuario.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.nombre || !newUserForm.email) {
      alert("Por favor completa nombre y email.");
      return;
    }
    if (!newUserForm.contrasena && newUserForm.rol !== "TEACHER") {
      alert("La contrasena es requerida para estudiantes.");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm)
      });
      const data = await res.json();
      if (res.ok) {
        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json();
        if (Array.isArray(usersData)) {
          setStudents(usersData.filter(u => u.rol === "STUDENT"));
          setTeachers(usersData.filter(u => u.rol === "TEACHER"));
        }
        setIsCreateUserModalOpen(false);
        setNewUserForm({
          nombre: "",
          email: "",
          contrasena: "",
          rol: "STUDENT",
          cursoSlug: "",
          empresa: ""
        });
      } else {
        alert(data.error || "Error al crear usuario.");
      }
    } catch (err: any) {
      console.error("Error creating user:", err);
      alert("Error al intentar crear el usuario.");
    }
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let pass = "ihdeca_";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUserForm(prev => ({ ...prev, contrasena: pass }));
  };

  const generateRandomPasswordForNew = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let pass = "ihdeca_";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserForm(prev => ({ ...prev, contrasena: pass }));
  };

  const handleDeleteCourse = async (slug: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este curso?")) return;

    try {
      const res = await fetch(`/api/courses/${slug}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCourses(prev => prev.filter(c => c.slug !== slug));
      }
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) return;

    const slug = newCourse.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const createdCourse = {
      slug,
      title: newCourse.title,
      description: newCourse.description,
      extendedDescription: newCourse.extendedDescription || newCourse.description,
      category: newCourse.category,
      categorySlug: newCourse.categorySlug,
      duration: newCourse.duration,
      lessons: newCourse.lessons,
      instructor: newCourse.instructor,
      price: newCourse.price,
      precioMxn: newCourse.precioMxn ? Number(newCourse.precioMxn) : null,
      gradient: newCourse.gradient,
      coverUrl: newCourse.coverUrl || undefined,
      coverPositionY: newCourse.coverUrl ? newCourse.coverPositionY : undefined,
      coverAlt: newCourse.coverAlt || newCourse.title,
      fechas: newCourse.fechas || "Por confirmar",
      objetivos: newCourse.objetivos,
      dirigidoA: newCourse.dirigidoA
    };

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdCourse)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        if (Array.isArray(coursesData)) setCourses(coursesData);

        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json();
        if (Array.isArray(usersData)) {
          setStudents(usersData.filter(u => u.rol === "STUDENT"));
          setTeachers(usersData.filter(u => u.rol === "TEACHER"));
        }

        setIsModalOpen(false);
        setNewCourse({
          title: "",
          description: "",
          extendedDescription: "",
          category: "",
          categorySlug: "",
          duration: "Por confirmar",
          lessons: "Por definir",
          instructor: "Por confirmar",
          price: "Por confirmar",
          precioMxn: "",
          gradient: "from-blue-600 to-indigo-700",
          coverUrl: "",
          coverPositionY: 50,
          coverAlt: "",
          fechas: "Por confirmar",
          objetivos: "",
          dirigidoA: ""
        });
      } else {
        alert("Error al crear el curso: " + (data.error || "No se pudo agregar el nuevo programa."));
      }
    } catch (err: any) {
      console.error("Error creating course:", err);
      alert("Error al crear curso: " + (err?.message || "Ocurrió un error inesperado."));
    }
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourseSlug(course.slug);
    setEditCourseForm({
      title: course.title,
      description: course.description,
      extendedDescription: course.extendedDescription || "",
      category: course.category,
      categorySlug: course.categorySlug,
      duration: course.duration,
      lessons: course.lessons,
      instructor: course.instructor || "Por confirmar",
      price: course.price,
      precioMxn: course.precioMxn != null ? String(course.precioMxn) : "",
      coverUrl: course.coverUrl || "",
      coverPositionY: course.coverPositionY || 50,
      coverAlt: (course as any).coverAlt || course.title,
      fechas: course.fechas || "Por confirmar",
      objetivos: Array.isArray(course.objetivos) ? course.objetivos.join("\n") : (course.objetivos || ""),
      dirigidoA: Array.isArray(course.dirigidoA) ? course.dirigidoA.join("\n") : (course.dirigidoA || "")
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseSlug) return;

    const courseToUpdate = {
      title: editCourseForm.title,
      description: editCourseForm.description,
      extendedDescription: editCourseForm.extendedDescription || editCourseForm.description,
      category: editCourseForm.category,
      categorySlug: editCourseForm.categorySlug,
      duration: editCourseForm.duration,
      lessons: editCourseForm.lessons,
      instructor: editCourseForm.instructor,
      price: editCourseForm.price,
      precioMxn: editCourseForm.precioMxn ? Number(editCourseForm.precioMxn) : null,
      coverUrl: editCourseForm.coverUrl || undefined,
      coverPositionY: editCourseForm.coverUrl ? editCourseForm.coverPositionY : undefined,
      coverAlt: editCourseForm.coverAlt,
      fechas: editCourseForm.fechas,
      objetivos: editCourseForm.objetivos,
      dirigidoA: editCourseForm.dirigidoA
    };

    try {
      const res = await fetch(`/api/courses/${editingCourseSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseToUpdate)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        if (Array.isArray(coursesData)) setCourses(coursesData);

        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json();
        if (Array.isArray(usersData)) {
          setStudents(usersData.filter(u => u.rol === "STUDENT"));
          setTeachers(usersData.filter(u => u.rol === "TEACHER"));
        }

        setIsEditModalOpen(false);
        setEditingCourseSlug(null);
      } else {
        alert("Error al actualizar el curso: " + (data.error || "No se pudieron guardar los cambios."));
      }
    } catch (err: any) {
      console.error("Error updating course:", err);
      alert("Error al guardar cambios: " + (err?.message || "Ocurrió un error inesperado."));
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
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto max-w-full">
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <div>
              <h1 className="font-academic text-xl sm:text-2xl font-black uppercase tracking-tight">Panel del Administrador</h1>
              <p className="text-[10px] sm:text-xs text-text-slate font-medium">Gestión de operaciones, inscripciones y catálogo educativo.</p>
            </div>
          </div>
          <NotificationBell />
        </header>

        {/* VIEW 1: RESUMEN / METRICAS */}
        {activeView === "resumen" && (
          <div className="space-y-8">
            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Earnings card */}
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl border border-emerald-100">
                  <span className="text-xl font-bold">$</span>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Ingresos Mensuales</h4>
                  <span className="text-xl font-black text-primary">{metrics.ingresosMensuales}</span>
                </div>
              </div>

              {/* Active Students Card */}
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl border border-blue-100">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Alumnos Activos</h4>
                  <span className="text-xl font-black text-primary">{metrics.alumnosActivos}</span>
                </div>
              </div>

              {/* Retention rate */}
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 flex items-center justify-center rounded-xl border border-purple-100">
                  <span className="text-xl font-bold">%</span>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Tasa de Retención</h4>
                  <span className="text-xl font-black text-primary">{metrics.retencionRate}</span>
                </div>
              </div>

              {/* Pending Approvals Card */}
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-6 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl border ${
                  metrics.solicitudesPendientesCount > 0 
                    ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" 
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Pendientes Aprobación</h4>
                  <span className="text-xl font-black text-primary">{metrics.solicitudesPendientesCount}</span>
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
             <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                    <th className="p-4">Portada</th>
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
                      <td className="p-4">
                        <div className="w-10 h-7 rounded overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                          {c.coverUrl ? (
                            <img src={c.coverUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-4 h-4" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-primary">{c.title}</td>
                      <td className="p-4 text-slate-500 font-semibold">{c.category}</td>
                      <td className="p-4 text-slate-700 font-bold">{c.instructor}</td>
                      <td className="p-4 text-slate-900 font-black">
                        {c.precioMxn != null
                          ? `$${c.precioMxn.toLocaleString("es-MX")} MXN`
                          : c.price}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditCourse(c)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            aria-label="Editar curso"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.slug)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            aria-label="Eliminar curso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD COURSE MODAL */}
            {isModalOpen && (
              <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div data-lenis-prevent className="bg-white border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[36px_36px_36px_0px] shadow-2xl relative animate-scale-up font-sans text-xs overflow-hidden">
                  
                  {/* Fixed Header */}
                  <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 relative shrink-0">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-bold text-primary mb-1">Crear Nuevo Programa</h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Agregar curso al catálogo educativo</p>
                  </div>

                  {/* Scrollable Form Body */}
                  <div data-lenis-prevent className="p-6 sm:p-8 pt-6 overflow-y-auto flex-1">
                    <form onSubmit={handleCreateCourse} className="space-y-5">
                      {/* Title */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Título del Curso <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Negociación Avanzada"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Breve Descripción <span className="text-red-500">*</span></label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Escribe un resumen atractivo del contenido..."
                          value={newCourse.description}
                          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none text-xs text-slate-800"
                        />
                      </div>

                      {/* A quien va dirigido */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          ¿A quién va dirigido? <span className="text-slate-400 font-normal">(un perfil por línea)</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Ej. Profesionales de recursos humanos&#10;Líderes de equipo y gerentes"
                          value={newCourse.dirigidoA}
                          onChange={(e) => setNewCourse({ ...newCourse, dirigidoA: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800 font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Categoría</label>
                          <select
                            required
                            value={newCourse.categorySlug}
                            onChange={(e) => {
                              const val = e.target.value;
                              const cat = categories.find(c => c.slug === val);
                              setNewCourse({ ...newCourse, categorySlug: val, category: cat?.name || "" });
                            }}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs text-slate-800"
                          >
                            <option value="" disabled>Selecciona una categoria</option>
                            {categories.map((cat: any) => (
                              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Instructor */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Nombre Docente</label>
                          <select
                            value={newCourse.instructor}
                            onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs text-slate-800"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Fecha de Inicio */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Fecha de Inicio</label>
                          <input
                            type="text"
                            placeholder="Ej. 15 de Septiembre, 2026"
                            value={newCourse.fechas}
                            onChange={(e) => setNewCourse({ ...newCourse, fechas: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800"
                          />
                        </div>

                        {/* Precio MXN */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Precio (MXN)</label>
                          <input
                            type="number"
                            placeholder="Ej. 1000"
                            value={newCourse.precioMxn}
                            onChange={(e) => setNewCourse({ ...newCourse, precioMxn: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Cover Upload, Alt Tag and Position Adjustments */}
                      <div className="border-t border-slate-100 pt-4 space-y-4 font-sans text-xs">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Texto ALT de la Imagen (Para Indexación Google / SEO)
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Taller de capacitación en liderazgo IHDECA"
                            value={newCourse.coverAlt}
                            onChange={(e) => setNewCourse({ ...newCourse, coverAlt: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Imagen de Portada (Recomendado: 800x500px)
                          </span>
                          {uploading && (
                            <span className="text-xs font-bold text-accent animate-pulse uppercase tracking-wider">
                              Subiendo...
                            </span>
                          )}
                        </div>

                        <div className="flex gap-4 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-primary hover:file:bg-slate-200 cursor-pointer"
                          />
                        </div>

                        {/* Repositioning Preview & Range Slider */}
                        {newCourse.coverUrl && (
                          <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                              Ajustar posición vertical (Vista Previa)
                            </span>
                            
                            {/* Image card preview box */}
                            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                              <img
                                src={newCourse.coverUrl}
                                alt={newCourse.coverAlt || "Course Cover Preview"}
                                style={{ objectPosition: `center ${newCourse.coverPositionY}%` }}
                                className="w-full h-full object-cover transition-all"
                              />
                              <div className="absolute inset-0 bg-black/10 flex items-center justify-center select-none pointer-events-none text-[9px] text-white font-bold tracking-widest uppercase">
                                Ajuste de Recorte
                              </div>
                            </div>

                            {/* Slider control */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                                <span>Posición vertical</span>
                                <span>{newCourse.coverPositionY}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={newCourse.coverPositionY}
                                onChange={(e) => setNewCourse({ ...newCourse, coverPositionY: parseInt(e.target.value, 10) })}
                                className="w-full accent-accent h-1.5 bg-slate-200 rounded-lg cursor-row-resize"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center px-4 py-3.5 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-colors"
                      >
                        Publicar Curso
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT COURSE MODAL */}
            {isEditModalOpen && (
              <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div data-lenis-prevent className="bg-white border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[36px_36px_36px_0px] shadow-2xl relative animate-scale-up font-sans text-xs overflow-hidden">
                  
                  {/* Fixed Header */}
                  <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 relative shrink-0">
                    <button 
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingCourseSlug(null);
                      }}
                      className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-bold text-primary mb-1">Modificar Programa</h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Actualizar detalles del curso</p>
                  </div>

                  {/* Scrollable Form Body */}
                  <div data-lenis-prevent className="p-6 sm:p-8 pt-6 overflow-y-auto flex-1">
                    <form onSubmit={handleUpdateCourse} className="space-y-5">
                      {/* Title */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Título del Curso <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Liderazgo moderno"
                          value={editCourseForm.title}
                          onChange={(e) => setEditCourseForm({ ...editCourseForm, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Breve Descripción <span className="text-red-500">*</span></label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Escribe un resumen atractivo del contenido..."
                          value={editCourseForm.description}
                          onChange={(e) => setEditCourseForm({ ...editCourseForm, description: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent resize-none text-xs text-slate-800"
                        />
                      </div>

                      {/* A quien va dirigido */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          ¿A quién va dirigido? <span className="text-slate-400 font-normal">(un perfil por línea)</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Ej. Profesionales de recursos humanos&#10;Líderes de equipo y gerentes"
                          value={editCourseForm.dirigidoA}
                          onChange={(e) => setEditCourseForm({ ...editCourseForm, dirigidoA: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800 font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Categoría</label>
                          <select
                            required
                            value={editCourseForm.categorySlug}
                            onChange={(e) => {
                              const val = e.target.value;
                              const cat = categories.find(c => c.slug === val);
                              setEditCourseForm({ ...editCourseForm, categorySlug: val, category: cat?.name || "" });
                            }}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs text-slate-800"
                          >
                            <option value="" disabled>Selecciona una categoria</option>
                            {categories.map((cat: any) => (
                              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Instructor */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Nombre Docente</label>
                          <select
                            value={editCourseForm.instructor}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, instructor: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs text-slate-800"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Fecha de Inicio */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Fecha de Inicio</label>
                          <input
                            type="text"
                            placeholder="Ej. 15 de Septiembre, 2026"
                            value={editCourseForm.fechas}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, fechas: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800"
                          />
                        </div>

                        {/* Precio MXN */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Precio (MXN)</label>
                          <input
                            type="number"
                            placeholder="Ej. 1000"
                            value={editCourseForm.precioMxn}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, precioMxn: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Cover Upload, Alt Tag and Position Adjustments */}
                      <div className="border-t border-slate-100 pt-4 space-y-4 font-sans text-xs">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Texto ALT de la Imagen (Para Indexación Google / SEO)
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Taller de capacitación en liderazgo IHDECA"
                            value={editCourseForm.coverAlt}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, coverAlt: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-slate-800"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Imagen de Portada (Recomendado: 800x500px)
                          </span>
                          {uploading && (
                            <span className="text-xs font-bold text-accent animate-pulse uppercase tracking-wider">
                              Subiendo...
                            </span>
                          )}
                        </div>

                        <div className="flex gap-4 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditFileChange}
                            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-primary hover:file:bg-slate-200 cursor-pointer"
                          />
                        </div>

                        {/* Repositioning Preview & Range Slider */}
                        {editCourseForm.coverUrl && (
                          <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                              Ajustar posición vertical (Vista Previa)
                            </span>
                            
                            {/* Image card preview box */}
                            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                              <img
                                src={editCourseForm.coverUrl}
                                alt={editCourseForm.coverAlt || "Course Cover Preview"}
                                style={{ objectPosition: `center ${editCourseForm.coverPositionY}%` }}
                                className="w-full h-full object-cover transition-all"
                              />
                              <div className="absolute inset-0 bg-black/10 flex items-center justify-center select-none pointer-events-none text-[9px] text-white font-bold tracking-widest uppercase">
                                Ajuste de Recorte
                              </div>
                            </div>

                            {/* Slider control */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                                <span>Posición vertical</span>
                                <span>{editCourseForm.coverPositionY}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={editCourseForm.coverPositionY}
                                onChange={(e) => setEditCourseForm({ ...editCourseForm, coverPositionY: parseInt(e.target.value, 10) })}
                                className="w-full accent-accent h-1.5 bg-slate-200 rounded-lg cursor-row-resize"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center px-4 py-3.5 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-colors"
                      >
                        Guardar Cambios
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: LEADS DE CONTACTO */}
        {activeView === "leads" && (
          <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-primary border-l-4 border-accent pl-3">
                  Leads de Contacto ({leads.length})
                </h3>
                <p className="text-xs text-slate-500 font-medium ml-4 mt-0.5">
                  Prospectos registrados desde los formularios de contacto y consulta de cursos.
                </p>
              </div>

              <button
                onClick={exportLeadsToCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                Exportar a CSV
              </button>
            </div>

            {leads.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Contacto</th>
                      <th className="p-4">Curso de Interés</th>
                      <th className="p-4">Empresa</th>
                      <th className="p-4">Mensaje</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50">
                        <td className="p-4 text-slate-500 font-semibold text-[11px]">
                          {new Date(lead.createdAt).toLocaleDateString("es-MX", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-primary text-xs">{lead.nombre}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{lead.email}</span>
                            <span className="text-[10px] text-accent font-bold">{lead.telefono}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-800 text-xs">
                          {lead.curso}
                        </td>
                        <td className="p-4 text-slate-600 font-medium text-xs">
                          {lead.empresa || "Personal"}
                        </td>
                        <td className="p-4 text-slate-600 font-sans text-xs max-w-xs">
                          <p className="line-clamp-2" title={lead.mensaje}>{lead.mensaje}</p>
                        </td>
                        <td className="p-4">
                          <select
                            value={lead.estado}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                              lead.estado === "Nuevo"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : lead.estado === "Contactado"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            <option value="Nuevo">Nuevo</option>
                            <option value="Contactado">Contactado</option>
                            <option value="Atendido">Atendido</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-12 text-center space-y-3 shadow-sm">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-primary">No hay prospectos registrados</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Los datos enviados a través del formulario de contacto y las fichas de cursos aparecerán automáticamente aquí.
                </p>
              </div>
            )}
          </div>
        )}

        {/* VIEW CATEGORÍAS */}
        {activeView === "categorias" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary border-l-4 border-accent pl-3">Categorías de cursos</h3>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg nicdark-btn-radius hover:bg-primary transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nueva categoría
              </button>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat: any) => (
                  <div key={cat.slug} className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] p-5 shadow-sm flex items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <span className="text-xs font-bold text-primary block truncate">{cat.name}</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{cat.description}</p>
                      <span className="inline-block text-[9px] text-slate-400 font-bold uppercase">{cat.slug}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.slug)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                      aria-label="Eliminar categoria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-[24px_24px_24px_0px] border border-slate-200 space-y-3">
                <Tags className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400">No hay categorias creadas</p>
              </div>
            )}
          </div>
        )}

        {/* Modal Crear Categoría */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px_40px_40px_0px] p-8 w-full max-w-md shadow-xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">Nueva Categoría</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateCategory} className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Nombre</label>
                  <input type="text" required placeholder="Ej. Marketing Digital" value={categoryForm.name}
                    onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Descripción</label>
                  <textarea rows={2} placeholder="Descripción breve..." value={categoryForm.description}
                    onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Imagen URL (opcional)</label>
                  <input type="url" placeholder="https://..." value={categoryForm.imageUrl}
                    onChange={e => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs" />
                </div>
                <button type="submit"
                  className="w-full px-4 py-2.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg nicdark-btn-radius hover:bg-primary transition-colors cursor-pointer">
                  Crear categoría
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: GESTIONAR USUARIOS */}
        {activeView === "usuarios" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveUserSubTab("student")}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeUserSubTab === "student"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Estudiantes / Alumnos ({students.length})
                </button>
                <button
                  onClick={() => setActiveUserSubTab("teacher")}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeUserSubTab === "teacher"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Docentes / Profesores ({teachers.length})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent w-48 sm:w-60 font-sans"
                  />
                </div>
                <button
                  onClick={() => {
                    setNewUserForm({
                      nombre: "",
                      email: "",
                      contrasena: "",
                      rol: activeUserSubTab === "student" ? "STUDENT" : "TEACHER",
                      cursoSlug: "",
                      empresa: ""
                    });
                    setIsCreateUserModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Crear {activeUserSubTab === "student" ? "Alumno" : "Docente"}
                </button>
              </div>
            </div>

            {activeUserSubTab === "student" ? (
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">ID</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Correo</th>
                      <th className="p-4">Curso Inscrito</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students
                      .filter(st => 
                        !searchTerm || 
                        st.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        st.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        st.cursoTitle.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-500">{st.id}</td>
                        <td className="p-4 font-bold text-primary">{st.nombre}</td>
                        <td className="p-4 text-slate-600 font-semibold">{st.email}</td>
                        <td className="p-4 text-slate-500 font-semibold">{st.cursoTitle}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditUser("student", st.id)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar usuario"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(st.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-[24px_24px_24px_0px] overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">ID</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Correo</th>
                      <th className="p-4">Materia Asignada</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teachers
                      .filter(t => 
                        !searchTerm || 
                        t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.cursoTitle.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-500">{t.id}</td>
                        <td className="p-4 font-bold text-primary">{t.nombre}</td>
                        <td className="p-4 text-slate-600 font-semibold">{t.email}</td>
                        <td className="p-4 text-slate-500 font-semibold">{t.cursoTitle}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditUser("teacher", t.id)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar usuario"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(t.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                  <div className="flex items-center justify-between">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Nueva Contraseña (Opcional)</label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="inline-flex items-center gap-1 text-[9px] font-bold text-accent hover:text-primary transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Generar Aleatoria
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Dejar en blanco para conservar la actual..."
                    value={userForm.contrasena}
                    onChange={(e) => setUserForm({ ...userForm, contrasena: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-mono text-xs text-slate-800 font-bold"
                  />
                  {userForm.contrasena && (
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">
                      ⚠️ Recuerda copiar esta clave antes de guardar para compartirla con el usuario.
                    </p>
                  )}
                </div>

                {/* Cursos / Materias Asignadas (Multi-selección) */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {editingUserType === "student" ? "Cursos Matriculados (Selecciona uno o más)" : "Materias Asignadas (Selecciona una o más)"}
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    {courses.map((c) => {
                      const currentSlugs = userForm.cursoSlug ? userForm.cursoSlug.split(",").map(s => s.trim()) : [];
                      const isChecked = currentSlugs.includes(c.slug);

                      return (
                        <label key={c.slug} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 hover:text-primary">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let updated = [...currentSlugs];
                              if (e.target.checked) {
                                if (!updated.includes(c.slug)) updated.push(c.slug);
                              } else {
                                updated = updated.filter(s => s !== c.slug);
                              }
                              setUserForm({ ...userForm, cursoSlug: updated.join(",") });
                            }}
                            className="w-3.5 h-3.5 text-accent rounded border-slate-300 focus:ring-accent cursor-pointer"
                          />
                          <span className="truncate">{c.title}</span>
                        </label>
                      );
                    })}
                  </div>
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

        {/* CREATE USER MODAL */}
        {isCreateUserModalOpen && (
          <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div data-lenis-prevent className="bg-white border border-slate-200 w-full max-w-md rounded-[40px_40px_40px_0px] shadow-2xl p-8 relative animate-scale-up font-sans text-xs">
              <button 
                onClick={() => setIsCreateUserModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-primary mb-1">
                Alta de Nuevo {newUserForm.rol === "STUDENT" ? "Estudiante" : "Docente"}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-6">
                Registra un nuevo usuario para otorgarle acceso a la plataforma.
              </p>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {/* Rol */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Rol del Usuario</label>
                  <select
                    value={newUserForm.rol}
                    onChange={(e) => setNewUserForm({ ...newUserForm, rol: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-sans text-slate-800"
                  >
                    <option value="STUDENT">Estudiante / Alumno</option>
                    <option value="TEACHER">Docente / Profesor</option>
                  </select>
                </div>

                {/* Nombre */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Nombre Completo <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={newUserForm.nombre}
                    onChange={(e) => setNewUserForm({ ...newUserForm, nombre: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-slate-800"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Correo Electrónico <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@correo.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-slate-800"
                  />
                </div>

                {/* Contraseña */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Contraseña de Acceso {newUserForm.rol === "TEACHER" ? <span className="text-slate-400">(opcional)</span> : <span className="text-red-500">*</span>}
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPasswordForNew}
                      className="inline-flex items-center gap-1 text-[9px] font-bold text-accent hover:text-primary transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Generar Aleatoria
                    </button>
                  </div>
                  <input
                    type="text"
                    required={newUserForm.rol !== "TEACHER"}
                    placeholder={newUserForm.rol === "TEACHER" ? "Se enviara enlace al docente..." : "Escribe o genera una clave..."}
                    value={newUserForm.contrasena}
                    onChange={(e) => setNewUserForm({ ...newUserForm, contrasena: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-mono text-xs font-bold text-slate-800"
                  />
                  {newUserForm.rol === "TEACHER" && !newUserForm.contrasena ? (
                    <p className="text-[10px] text-blue-600 font-semibold mt-1">
                      Se enviara un enlace al docente para que configure su propia contraseña.
                    </p>
                  ) : newUserForm.contrasena && (
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">
                      Copia esta clave antes de crear el usuario.
                    </p>
                  )}
                </div>

                {/* Cursos / Materias Asignadas (Multi-selección) */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {newUserForm.rol === "STUDENT" ? "Cursos a Matricular (Selecciona uno o más)" : "Materias a Asignar (Selecciona una o más)"}
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    {courses.map((c) => {
                      const currentSlugs = newUserForm.cursoSlug ? newUserForm.cursoSlug.split(",").map(s => s.trim()) : [];
                      const isChecked = currentSlugs.includes(c.slug);

                      return (
                        <label key={c.slug} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 hover:text-primary">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let updated = [...currentSlugs];
                              if (e.target.checked) {
                                if (!updated.includes(c.slug)) updated.push(c.slug);
                              } else {
                                updated = updated.filter(s => s !== c.slug);
                              }
                              setNewUserForm({ ...newUserForm, cursoSlug: updated.join(",") });
                            }}
                            className="w-3.5 h-3.5 text-accent rounded border-slate-300 focus:ring-accent cursor-pointer"
                          />
                          <span className="truncate">{c.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-4 py-3.5 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-colors mt-2"
                >
                  Crear y Dar de Alta
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
