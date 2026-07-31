"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, Users, User, BookOpen, LogOut, LayoutDashboard, 
  Award, FileText, FolderPlus, UserCog, Inbox, LinkIcon, Tags
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "docente" | "estudiante";
  activeView: string;
  onViewChange: (view: string) => void;
  userName: string;
  userEmail: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ role, activeView, onViewChange, userName, userEmail, mobileOpen, onCloseMobile }: SidebarProps) {
  const router = useRouter();

  const getRoleLabel = () => {
    switch (role) {
      case "admin": return "Administrador";
      case "docente": return "Docente";
      case "estudiante": return "Estudiante";
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case "admin": return Shield;
      case "docente": return Users;
      case "estudiante": return User;
    }
  };

  const RoleIcon = getRoleIcon();

  const menuItems = {
    admin: [
      { id: "resumen", label: "Estadísticas", icon: LayoutDashboard },
      { id: "cursos", label: "Gestionar Cursos", icon: FolderPlus },
      { id: "leads", label: "Leads de Contacto", icon: Inbox },
      { id: "categorias", label: "Categorías", icon: Tags },
      { id: "usuarios", label: "Gestionar Usuarios", icon: UserCog },
    ],
    docente: [
      { id: "cursos", label: "Mis Materias", icon: BookOpen },
      { id: "temario", label: "Temario y Objetivos", icon: FileText },
      { id: "materiales", label: "Materiales", icon: LinkIcon },
      { id: "calificaciones", label: "Calificar Alumnos", icon: Award },
    ],
    estudiante: [
      { id: "cursos", label: "Mis Cursos", icon: BookOpen },
      { id: "temarios", label: "Avance de Módulos", icon: FileText },
      { id: "calificaciones", label: "Calificaciones", icon: Award },
      { id: "perfil", label: "Mi Perfil", icon: User },
    ]
  };

  const currentMenu = menuItems[role];

  const content = (
    <>
      <div className="flex flex-col space-y-8 pt-8 px-6">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.webp" alt="IHDECA Programas" className="h-9 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105" />
          </Link>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
          <div className="w-10 h-10 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {(userName || "Usuario").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-xs font-bold truncate text-white">{userName}</span>
            <span className="text-[10px] text-slate-300 truncate font-medium">{userEmail}</span>
            <span className="inline-flex self-start items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[8px] font-bold text-accent uppercase tracking-wider">
              <RoleIcon className="w-2.5 h-2.5" />{getRoleLabel()}
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button key={item.id}
                onClick={() => { onViewChange(item.id); onCloseMobile?.(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${isActive ? "bg-accent text-white shadow-sm" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />{item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/10">
        <button onClick={() => { localStorage.removeItem("ihdeca_user"); router.push("/"); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-rose-300 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all cursor-pointer">
          <LogOut className="w-4 h-4 flex-shrink-0" />Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onCloseMobile} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col justify-between border-r border-white/10 font-sans select-none lg:hidden">
            {content}
          </aside>
        </>
      )}
      <aside className="hidden lg:flex w-64 min-w-64 flex-shrink-0 bg-primary text-white flex-col justify-between border-r border-white/10 h-screen sticky top-0 font-sans z-30 select-none">
        {content}
      </aside>
    </>
  );
}
