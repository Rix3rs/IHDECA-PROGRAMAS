"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
    
    // Explicit fromTo to handle React Strict Mode double-trigger safely
    tl.fromTo(".logo-anim", 
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, delay: 0.2 }
    );
    
    tl.fromTo(".nav-link-anim", 
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1 }, 
      "-=0.7"
    );

    tl.fromTo(".nav-cta-anim", 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1 }, 
      "-=0.5"
    );
  }, { scope: headerRef });

  const navLinks = [
    { name: "Cursos", href: "#cursos" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Testimonios", href: "#testimonios" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/50 py-3.5"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="logo-anim flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-1">
            <svg
              className="w-9 h-9 text-primary transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 12 L82 22 V55 C82 76 50 88 50 88 C50 88 18 76 18 55 V22 L50 12 Z"
                fill="currentColor"
                fillOpacity="0.08"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <path
                d="M33 38 C30 42 30 48 33 51 M30 49 C27 53 27 59 30 62 M34 60 C31 64 31 70 34 73"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M67 38 C70 42 70 48 67 51 M70 49 C73 53 73 59 70 62 M66 60 C69 64 69 70 66 73"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M50 30 L53 38 L61 38 L55 43 L57 51 L50 46 L43 51 L45 43 L39 38 L47 38 Z"
                fill="#E67E22"
              />
              <path
                d="M38 52 C42 50 48 50 50 54 C52 50 58 50 62 52 V66 C58 64 52 64 50 68 C48 64 42 64 38 66 V52 Z"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M50 54 V68"
                stroke="currentColor"
                strokeWidth="3.5"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-sans text-xl font-extrabold tracking-wider text-primary leading-tight">
                IHDECA
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-accent font-bold leading-none">
                Instituto Académico
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="nav-link-anim text-primary font-bold transition-colors duration-200 hover:text-accent focus:outline-none text-xs uppercase tracking-widest relative py-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="#contacto"
              className="nav-cta-anim inline-flex items-center justify-center px-5 py-2.5 bg-accent text-white font-sans font-bold uppercase tracking-wider text-[11px] rounded-lg nicdark-btn-radius transition-all duration-300 hover:bg-primary cursor-pointer shadow-sm hover:shadow-[0_4px_10px_rgba(230,126,34,0.15)]"
            >
              Inscríbete
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded text-primary hover:text-accent hover:bg-slate-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-3 bg-white border-t border-slate-100 mt-3 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded text-xs font-bold text-primary hover:text-accent hover:bg-slate-50 uppercase tracking-widest transition-colors cursor-pointer"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 px-3">
            <Link
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="w-full text-center inline-flex items-center justify-center px-5 py-3 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg nicdark-btn-radius hover:bg-primary transition-colors cursor-pointer"
            >
              Inscríbete
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
