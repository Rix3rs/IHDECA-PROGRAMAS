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
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.webp"
                alt="IHDECA Programas"
                className="h-10 w-auto object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-sm">
              IHDECA es una institución dedicada a la capacitación profesional y consultoría. Ofrecemos formación orientada al desarrollo de habilidades laborales, liderazgo, comunicación y crecimiento profesional para personas, equipos y organizaciones.
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
          <div className="lg:col-span-2 space-y-5 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
              {[
                { name: "Inicio", href: "/" },
                { name: "Cursos", href: "/cursos" },
                { name: "Nosotros", href: "/nosotros" },
                { name: "Contacto", href: "/contacto" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-accent transition-colors cursor-pointer">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Brands block */}
          <div className="lg:col-span-2 space-y-5 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Nuestras Marcas
            </h4>
            <ul className="space-y-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <li>
                <span className="text-slate-300 block">EHSA Programas</span>
              </li>
              <li>
                <span className="text-slate-300 block">EHSA Proyectos</span>
              </li>
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
                  Cerro de Picachos 760-L-20, Col. Obispado, Monterrey, Nuevo León, C.P. 64060
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:8110330553" className="hover:text-accent transition-colors">
                  81 1033 0553
                </a>
              </li>
              <li className="flex gap-3 items-center lowercase font-normal">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:Informes@ihdecaprogramas.com.mx" className="hover:text-accent transition-colors font-medium">
                  Informes@ihdecaprogramas.com.mx
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
            <Link href="/aviso-de-privacidad" className="hover:underline hover:text-accent">Aviso de Privacidad</Link>
            <Link href="/terminos-y-condiciones" className="hover:underline hover:text-accent">Términos y Condiciones</Link>
          </span>
        </div>

      </div>
    </footer>
  );
}
