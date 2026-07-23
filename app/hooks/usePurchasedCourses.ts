"use client";

import { useState, useEffect } from "react";

export function usePurchasedCourses() {
  const [purchasedSlugs, setPurchasedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("ihdeca_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.id && user.email) {
          fetch("/api/users")
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data)) {
                const currentUser = data.find((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
                if (currentUser?.cursoSlugs?.length > 0) {
                  setPurchasedSlugs(new Set(currentUser.cursoSlugs));
                }
              }
            })
            .catch(() => {});
        }
        if (user.cursoAsignadoSlug) {
          const slugs = user.cursoAsignadoSlug
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
          setPurchasedSlugs(new Set(slugs));
        }
      } catch {}
    }
  }, []);

  return { purchasedSlugs, hasPurchased: (slug: string) => purchasedSlugs.has(slug) };
}
