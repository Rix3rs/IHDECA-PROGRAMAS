"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ihdeca_user");
    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(stored);
      const expectedPrefix: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        TEACHER: "/dashboard/docente",
        STUDENT: "/dashboard/estudiante",
      };

      if (pathname.startsWith(expectedPrefix[user.rol])) {
        setAuthorized(true);
      } else {
        const redirect = expectedPrefix[user.rol] || "/login";
        router.replace(redirect);
      }
    } catch {
      router.replace("/login");
    }

    setChecking(false);
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
