import type { Metadata } from "next";
import { Playfair_Display, Gabarito } from "next/font/google";
import "./globals.css";
import AuroraBackground from "@/app/components/AuroraBackground";

const playfairDisplay = Playfair_Display({
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
  description: "Encuentra cursos profesionales de tecnología, negocios, idiomas y desarrollo personal en IHDECA. Certificaciones académicas, instructores expertos y modalidad flexible.",
  keywords: ["cursos", "tecnología", "negocios", "idiomas", "certificación", "IHDECA", "educación profesional"],
  authors: [{ name: "IHDECA" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfairDisplay.variable} ${gabarito.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col text-slate-800 bg-white">
        {/* Soft Aurora Boreal background blobs */}
        <AuroraBackground />
        {children}
      </body>
    </html>
  );
}
