"use client";

import React, { useRef } from "react";
import { Users, Building2, Clock, Smile } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatItem {
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const StatNumber = ({ value }: { value: string }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  
  const numericPart = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const isPercent = value.includes("%");
  const isPlusAtStart = value.startsWith("+");
  const isPlusAtEnd = value.endsWith("+");
  const hasComma = value.includes(",");

  useGSAP(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericPart,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: spanRef.current,
        start: "top 92%",
        toggleActions: "play none none none"
      },
      onUpdate: () => {
        if (!spanRef.current) return;
        let formatted = Math.floor(obj.val).toString();
        
        if (hasComma) {
          formatted = Math.floor(obj.val).toLocaleString("es-MX");
        }
        
        let output = formatted;
        if (isPlusAtStart) output = "+" + output;
        if (isPlusAtEnd) output = output + "+";
        if (isPercent) output = output + "%";
        
        spanRef.current.textContent = output;
      }
    });
  }, { scope: spanRef });

  return (
    <span ref={spanRef} className="font-academic text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
      0
    </span>
  );
};

export default function Stats() {
  const statsRef = useRef<HTMLDivElement>(null);

  const stats: StatItem[] = [
    {
      number: "+5,000",
      label: "Personas capacitadas",
      icon: Users,
    },
    {
      number: "+200",
      label: "Empresas atendidas",
      icon: Building2,
    },
    {
      number: "15+",
      label: "Años de experiencia",
      icon: Clock,
    },
    {
      number: "98%",
      label: "Satisfacción del cliente",
      icon: Smile,
    },
  ];

  useGSAP(() => {
    gsap.fromTo(".stat-col",
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out"
      }
    );

    const refreshTrigger = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshTrigger);
    const timeoutId = setTimeout(refreshTrigger, 500);

    return () => {
      window.removeEventListener("load", refreshTrigger);
      clearTimeout(timeoutId);
    };
  }, { scope: statsRef });

  return (
    <section ref={statsRef} className="py-16 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary text-white p-10 sm:p-12 rounded-[40px_40px_40px_0px] shadow-lg border border-slate-200/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-[#17325D] to-[#0F223F] -z-10" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-center font-sans">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-col flex flex-col items-center space-y-3">
                  <div className="p-3 bg-white/5 rounded-2xl mb-1 text-amber-400 border border-white/5 shadow-inner">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  
                  <StatNumber value={stat.number} />
                  
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-300 font-bold">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
