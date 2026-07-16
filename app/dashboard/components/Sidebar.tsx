"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Users, 
  User, 
  BookOpen, 
  LogOut, 
  LayoutDashboard, 
  Award, 
  Clock, 
  FileText, 
  FolderPlus,
  ArrowLeft,
  UserCog
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "docente" | "estudiante";
  activeView: string;
  onViewChange: (view: string) => void;
  userName: string;
  userEmail: string;
}

export default function Sidebar({ role, activeView, onViewChange, userName, userEmail }: SidebarProps) {
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

  // Dynamic Navigation Items
  const menuItems = {
    admin: [
      { id: "resumen", label: "Estadísticas", icon: LayoutDashboard },
      { id: "cursos", label: "Gestionar Cursos", icon: FolderPlus },
      { id: "alumnos", label: "Aprobaciones", icon: Clock },
      { id: "usuarios", label: "Gestionar Usuarios", icon: UserCog },
    ],
    docente: [
      { id: "cursos", label: "Mis Materias", icon: BookOpen },
      { id: "calificaciones", label: "Calificar Alumnos", icon: Award },
    ],
    estudiante: [
      { id: "cursos", label: "Mis Cursos", icon: BookOpen },
      { id: "temarios", label: "Avance de Módulos", icon: FileText },
      { id: "calificaciones", label: "Calificaciones", icon: Award },
    ]
  };

  const currentMenu = menuItems[role];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col justify-between border-r border-white/10 h-screen sticky top-0 font-sans z-30 select-none">
      
      {/* Upper Section */}
      <div className="flex flex-col space-y-8 pt-8 px-6">
        
        {/* Brand Logo & Back to Home */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.webp"
              alt="IHDECA Programas"
              className="h-9 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105"
            />
          </Link>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cambiar Rol
          </Link>
        </div>

        {/* User Info snippet */}
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
          <div className="w-10 h-10 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-xs font-bold truncate text-white">{userName}</span>
            <span className="text-[10px] text-slate-300 truncate font-medium">{userEmail}</span>
            
            {/* Active Role badge */}
            <span className="inline-flex self-start items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[8px] font-bold text-accent uppercase tracking-wider">
              <RoleIcon className="w-2.5 h-2.5" />
              {getRoleLabel()}
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <nav className="flex flex-col gap-2">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? "bg-accent text-white shadow-sm" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Logout Action */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-rose-300 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>

    </aside>
  );
}
