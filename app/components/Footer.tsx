import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-white/10 text-white pt-20 pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand details */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <svg
                className="w-9 h-9 text-white"
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
                <span className="font-sans text-xl font-extrabold tracking-wider text-white leading-tight">
                  IHDECA
                </span>
                <span className="text-[8px] uppercase tracking-[0.25em] text-accent font-bold leading-none">
                  Instituto Académico
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-sm">
              Institución enfocada en el desarrollo de programas prácticos y certificaciones especializadas para potenciar la inserción laboral de profesionales modernos.
            </p>
            {/* Social handles */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: FacebookIcon, href: "https://facebook.com" },
                { icon: InstagramIcon, href: "https://instagram.com" },
                { icon: LinkedinIcon, href: "https://linkedin.com" },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:text-accent hover:border-accent hover:-translate-y-0.5 shadow-sm flex items-center justify-center transition-all duration-300 cursor-pointer"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links block */}
          <div className="lg:col-span-3 space-y-5 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
              {[
                { name: "Cursos y Áreas", href: "#cursos" },
                { name: "Sobre Nosotros", href: "#nosotros" },
                { name: "Testimonios", href: "#testimonios" },
                { name: "Contacto / Admisiones", href: "#contacto" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-accent transition-colors cursor-pointer">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-5 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Información de Contacto
            </h4>
            <ul className="space-y-4 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <li className="flex gap-3 items-start normal-case font-normal text-slate-300">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-xs font-medium font-sans">
                  Paseo de la Reforma #300, Col. Juárez, C.P. 06600, Ciudad de México, CDMX.
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+525512345678" className="hover:text-accent transition-colors">
                  +52 (55) 1234-5678
                </a>
              </li>
              <li className="flex gap-3 items-center lowercase font-normal">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:info@ihdeca.edu.mx" className="hover:text-accent transition-colors font-medium">
                  info@ihdeca.edu.mx
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer base bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <span className="text-[11px] text-slate-400 font-semibold">
            © {new Date().getFullYear()} IHDECA. Todos los derechos reservados.
          </span>
          <span className="text-[11px] text-slate-400 font-semibold flex gap-4">
            <Link href="#contacto" className="hover:underline hover:text-accent">Aviso de Privacidad</Link>
            <Link href="#contacto" className="hover:underline hover:text-accent">Términos de Servicio</Link>
          </span>
        </div>

      </div>
    </footer>
  );
}
