"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("ihdeca_user");
    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(stored);
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
        const redirectMap: Record<string, string> = {
          ADMIN: "/dashboard/admin",
          TEACHER: "/dashboard/docente",
          STUDENT: "/dashboard/estudiante",
        };
        router.replace(redirectMap[user.rol] || "/login");
      }
    } catch {
      router.replace("/login");
    }
  }, [router, allowedRoles]);

  return <>{children}</>;
}
