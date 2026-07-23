import type { Metadata } from "next";
import { Montserrat, Gabarito } from "next/font/google";
import "./globals.css";
import AuroraBackground from "@/app/components/AuroraBackground";
import WhatsAppButton from "@/app/components/WhatsAppButton";

const montserrat = Montserrat({
  variable: "--font-academic",
  subsets: ["latin"],
  display: "swap",
});

const gabarito = Gabarito({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IHDECA | Cursos Profesionales y Capacitación de Calidad",
  description: "Encuentra cursos profesionales de liderazgo, comunicación asertiva, resolución de conflictos y capacitación laboral en IHDECA. Modalidad en línea y enfoque práctico.",
  keywords: ["cursos", "liderazgo", "comunicación asertiva", "manejo de conflictos", "capacitación", "IHDECA", "educación profesional"],
  authors: [{ name: "IHDECA" }],
};

import SmoothScrollProvider from "@/app/components/SmoothScrollProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${gabarito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-800 bg-white">
        <SmoothScrollProvider>
          {/* Soft Aurora Boreal background blobs */}
          <AuroraBackground />
          {children}
          <WhatsAppButton />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
