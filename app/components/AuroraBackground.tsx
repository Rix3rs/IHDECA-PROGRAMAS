"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Check user preference for reduced motion to ensure accessibility
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Fluid continuous animation simulating waves of light
    gsap.to(".aurora-blob-1", {
      x: "15vw",
      y: "10vh",
      scale: 1.15,
      rotation: 120,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".aurora-blob-2", {
      x: "-12vw",
      y: "-15vh",
      scale: 0.9,
      rotation: -180,
      duration: 22,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".aurora-blob-3", {
      x: "8vw",
      y: "-8vh",
      scale: 1.1,
      rotation: 90,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".aurora-blob-4", {
      x: "-15vw",
      y: "12vh",
      scale: 1.05,
      rotation: -90,
      duration: 24,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden -z-20 bg-white pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Light pastel spots simulating soft aurora light on light theme */}
      <div className="aurora-blob-1 absolute top-[-10%] left-[5%] w-[55vw] h-[55vw] rounded-full bg-[#10B981]/5 blur-[120px] mix-blend-multiply" />
      <div className="aurora-blob-2 absolute bottom-[-10%] right-[5%] w-[60vw] h-[60vw] rounded-full bg-[#06B6D4]/6 blur-[130px] mix-blend-multiply" />
      <div className="aurora-blob-3 absolute top-[25%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#8B5CF6]/5 blur-[120px] mix-blend-multiply" />
      <div className="aurora-blob-4 absolute bottom-[15%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#EC4899]/3 blur-[110px] mix-blend-multiply" />
    </div>
  );
}
