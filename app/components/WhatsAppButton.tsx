"use client";

import React, { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const phoneNumber = "528110330553";
  const message = encodeURIComponent("Hola, me gustaría solicitar información sobre los cursos de capacitación de IHDECA.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      setNearFooter(docHeight - scrollBottom < 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Show mobile tooltip periodically every 6 seconds for 3.5 seconds
    const interval = setInterval(() => {
      setShowMobileTooltip(true);
      setTimeout(() => {
        setShowMobileTooltip(false);
      }, 3000);
    }, 60000);

    // Initial delay trigger for mobile
    const initialTimer = setTimeout(() => {
      setShowMobileTooltip(true);
      setTimeout(() => setShowMobileTooltip(false), 3500);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <div className={`fixed right-6 z-50 flex items-center transition-all duration-300 ${nearFooter ? "bottom-40" : "bottom-6"}`}>
      {/* DESKTOP VERSION (Always visible text) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] group font-sans cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulse animation ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping -z-10 group-hover:animate-none pointer-events-none" />

        {/* WhatsApp Custom SVG */}
        <svg
          className="w-6 h-6 fill-current flex-shrink-0"
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>

        {/* Always visible text on Desktop */}
        <span className="text-xs font-bold tracking-wide select-none">
          ¿Dudas? ¡Escríbenos!
        </span>
      </a>

      {/* MOBILE VERSION (Circular button with periodic pop-up) */}
      <div className="sm:hidden relative flex items-center">
        {/* Mobile Periodic Pop-up Tooltip */}
        <div
          className={`absolute bottom-16 right-0 bg-slate-900 text-white text-[11px] font-sans font-bold py-2 px-3.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap transition-all duration-500 pointer-events-none ${
            showMobileTooltip ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
          }`}
        >
          <span>¿Tienes dudas? ¡Escríbenos!</span>
          {/* Arrow */}
          <div className="absolute -bottom-1 right-5 w-2.5 h-2.5 bg-slate-900 transform rotate-45 border-r border-b border-slate-700" />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg active:scale-95 focus:outline-none cursor-pointer"
          aria-label="Contactar por WhatsApp"
        >
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
