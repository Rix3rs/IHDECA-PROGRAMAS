import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | IHDECA Programas",
  description: "Consulta el aviso de privacidad de IHDECA Programas / EHSA Programas y conoce el tratamiento de tus datos personales.",
  keywords: ["Aviso de privacidad", "IHDECA", "datos personales", "privacidad", "legal"],
};

export default function AvisoPrivacidadPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow pt-24 font-sans text-primary">
        {/* Page Hero */}
        <section className="bg-primary text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-[#17325D] to-[#0F223F] -z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex px-3 py-1 rounded bg-accent/20 text-accent border border-accent/30 text-[9px] font-bold uppercase tracking-widest">
              Legal
            </span>
            <h1 className="font-academic text-3xl sm:text-4xl font-black tracking-tight">
              Aviso de privacidad
            </h1>
          </div>
        </section>

        {/* Legal Text Section */}
        <section className="py-16 bg-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-accent uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>

            {/* Document Body */}
            <div className="bg-white border border-slate-200/80 rounded-[40px_40px_40px_0px] p-8 md:p-12 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700 font-sans">
              
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <ShieldAlert className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-primary">EHSA Programas / IHDECA Programas</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aviso de Privacidad Integral</p>
                </div>
              </div>

              <p>
                <strong>EHSA Programas</strong>, en lo sucesivo “El Responsable”, con domicilio en Cerro de Picachos 760-L-20, Col. Obispado, Monterrey, Nuevo León, C.P. 64060, es responsable del tratamiento de los datos personales que recabe a través del sitio web de IHDECA Programas, formularios digitales, medios de contacto, WhatsApp, correo electrónico, llamadas telefónicas, redes sociales o cualquier otro canal de atención relacionado con sus servicios de capacitación y consultoría.
              </p>
              
              <p>
                El presente Aviso de Privacidad tiene como finalidad informarle de manera clara cómo recabamos, usamos, almacenamos, protegemos y, en su caso, compartimos sus datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y demás disposiciones aplicables.
              </p>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">1. Datos personales que podemos recabar</h3>
                <p>
                  Para atender sus solicitudes de información, inscripción, seguimiento o contratación de servicios, podemos recabar los siguientes datos personales:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nombre completo.</li>
                  <li>Teléfono.</li>
                  <li>Correo electrónico.</li>
                  <li>Curso o capacitación de interés.</li>
                  <li>Empresa u organización a la que pertenece, en caso de aplicar.</li>
                  <li>Mensaje o comentarios enviados a través de formularios, WhatsApp, correo electrónico u otros medios de contacto.</li>
                </ul>
                <p>
                  En caso de que posteriormente se habiliten procesos de inscripción, facturación, emisión de constancias o pagos, podremos solicitar datos adicionales estrictamente necesarios para dichas finalidades, como datos fiscales, información de facturación, datos laborales o datos requeridos para la emisión de documentos relacionados con la capacitación.
                </p>
                <p>
                  IHDECA Programas no está dirigido a menores de edad. Nuestros servicios están pensados para personas mayores de edad, profesionales, equipos de trabajo, empresas y organizaciones.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">2. Finalidades primarias del tratamiento</h3>
                <p>Sus datos personales serán utilizados para las siguientes finalidades necesarias:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Atender solicitudes de información sobre cursos, capacitaciones, fechas, modalidades y servicios.</li>
                  <li>Dar seguimiento a mensajes recibidos por formulario web, WhatsApp, correo electrónico, teléfono o redes sociales.</li>
                  <li>Gestionar procesos de inscripción, registro o participación en cursos y capacitaciones.</li>
                  <li>Brindar atención a personas, equipos, empresas u organizaciones interesadas en nuestros servicios.</li>
                  <li>Coordinar comunicaciones relacionadas con cursos, capacitaciones, consultoría, atención comercial o seguimiento administrativo.</li>
                  <li>Elaborar cotizaciones, propuestas o información personalizada cuando sea solicitado.</li>
                  <li>Mantener registros internos de atención, seguimiento y operación.</li>
                  <li>Cumplir obligaciones legales, administrativas o contractuales que resulten aplicables.</li>
                </ul>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">3. Finalidades secundarias</h3>
                <p>
                  De manera adicional, sus datos personales podrán utilizarse para finalidades que no son indispensables para prestar el servicio solicitado, pero que nos permiten mejorar nuestra comunicación y operación:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Enviar información sobre nuevos cursos, capacitaciones, fechas disponibles, contenidos, eventos o promociones.</li>
                  <li>Realizar seguimiento comercial posterior a una solicitud de información.</li>
                  <li>Enviar encuestas de satisfacción o solicitar retroalimentación sobre nuestros servicios.</li>
                  <li>Realizar análisis internos, medición de interés, estadísticas de contacto y mejora de nuestros procesos de atención.</li>
                  <li>Crear audiencias o mediciones publicitarias mediante herramientas digitales, cuando aplique.</li>
                </ul>
                <p>
                  Si no desea que sus datos sean utilizados para estas finalidades secundarias, puede solicitarlo enviando un correo a <a href="mailto:Informes@ihdecaprogramas.com.mx" className="text-accent font-bold hover:underline">Informes@ihdecaprogramas.com.mx</a>.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">4. Uso de WhatsApp y medios digitales</h3>
                <p>
                  Al contactarnos por WhatsApp, formularios web, correo electrónico, redes sociales o cualquier otro medio digital, usted acepta que utilicemos los datos proporcionados para responder a su solicitud, dar seguimiento a su interés y mantener comunicación relacionada con los cursos, capacitaciones o servicios solicitados.
                </p>
                <p>El contacto principal para atención será:</p>
                <p className="pl-4 border-l-2 border-slate-200">
                  <strong>Correo:</strong> <a href="mailto:Informes@ihdecaprogramas.com.mx" className="text-accent hover:underline">Informes@ihdecaprogramas.com.mx</a> <br />
                  <strong>Teléfono / WhatsApp:</strong> 81 1033 0553
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">5. Uso de herramientas de análisis, publicidad y cookies</h3>
                <p>
                  El sitio web podrá utilizar cookies, píxeles, etiquetas, herramientas de analítica, medición de conversiones y tecnologías similares para conocer el comportamiento de navegación, mejorar la experiencia del usuario, medir campañas publicitarias y optimizar nuestros servicios.
                </p>
                <p>Estas herramientas pueden recabar información como:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Dirección IP.</li>
                  <li>Tipo de navegador y dispositivo utilizado.</li>
                  <li>Páginas visitadas dentro del sitio y tiempo de navegación.</li>
                  <li>Fuente de llegada al sitio e interacciones con formularios, botones o enlaces.</li>
                  <li>Conversiones o acciones realizadas dentro del sitio.</li>
                </ul>
                <p>
                  Estas tecnologías podrán incluir herramientas como Google Analytics, Google Ads, Meta Pixel u otras plataformas de medición y publicidad digital que se habiliten en el sitio.
                </p>
                <p>
                  Usted puede desactivar o limitar el uso de cookies desde la configuración de su navegador. Sin embargo, algunas funciones del sitio podrían no operar correctamente si las cookies se deshabilitan por completo.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">6. Transferencia y comunicación de datos personales</h3>
                <p>
                  Sus datos personales podrán ser compartidos con empresas, marcas, áreas internas, proveedores o aliados relacionados con EHSA Programas, IHDECA Programas y EHSA Proyectos, únicamente cuando sea necesario para atender su solicitud, brindar seguimiento, administrar servicios, coordinar capacitaciones, realizar análisis internos o cumplir obligaciones derivadas de la relación con usted.
                </p>
                <p>
                  También podremos compartir datos personales con proveedores que nos apoyen en servicios tecnológicos, hospedaje web, formularios, correo electrónico, CRM, plataformas de comunicación, analítica, publicidad digital, almacenamiento, administración o soporte operativo.
                </p>
                <p>
                  En caso de que en el futuro se habiliten pagos en línea, el procesamiento de pagos podrá realizarse mediante plataformas externas. En ese supuesto, los datos de pago serán tratados conforme a los términos y políticas de la plataforma correspondiente. De momento, la integración de pagos se encuentra pendiente de definir.
                </p>
                <p>No venderemos, rentaremos ni comercializaremos sus datos personales con terceros.</p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">7. Medidas de seguridad</h3>
                <p>
                  El Responsable adoptará medidas administrativas, técnicas y físicas razonables para proteger los datos personales contra daño, pérdida, alteración, destrucción, uso, acceso o tratamiento no autorizado.
                </p>
                <p>
                  El acceso a los datos personales estará limitado a las personas, áreas o proveedores que necesiten conocerlos para cumplir las finalidades descritas en este aviso.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">8. Derechos ARCO y revocación del consentimiento</h3>
                <p>
                  Usted puede ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición al tratamiento de sus datos personales, así como revocar el consentimiento otorgado para su tratamiento.
                </p>
                <p>
                  Para ejercer estos derechos, deberá enviar una solicitud al correo: <a href="mailto:Informes@ihdecaprogramas.com.mx" className="text-accent font-bold hover:underline">Informes@ihdecaprogramas.com.mx</a>.
                </p>
                <p>La solicitud deberá incluir:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nombre completo del titular.</li>
                  <li>Medio de contacto para responder la solicitud.</li>
                  <li>Descripción clara del derecho que desea ejercer.</li>
                  <li>Datos personales respecto de los cuales solicita el ejercicio de sus derechos.</li>
                  <li>Documento que acredite su identidad o, en su caso, la representación legal correspondiente.</li>
                </ul>
                <p>
                  El Responsable atenderá la solicitud conforme a los plazos y procedimientos establecidos por la legislación aplicable.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">9. Limitación del uso o divulgación de datos</h3>
                <p>
                  Si desea dejar de recibir comunicaciones promocionales, comerciales o informativas, puede solicitarlo enviando un correo a: <a href="mailto:Informes@ihdecaprogramas.com.mx" className="text-accent font-bold hover:underline">Informes@ihdecaprogramas.com.mx</a>. En el asunto puede indicar: “Baja de comunicaciones” o “Limitación de uso de datos”.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">10. Cambios al aviso de privacidad</h3>
                <p>
                  El presente Aviso de Privacidad podrá modificarse o actualizarse por cambios legales, ajustes operativos, nuevas finalidades, incorporación de herramientas tecnológicas, cambios en servicios o necesidades internas del Responsable.
                </p>
                <p>
                  Cualquier cambio será publicado en el sitio web de IHDECA Programas, en la sección correspondiente al Aviso de Privacidad.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">11. Contacto</h3>
                <p>
                  Para cualquier duda relacionada con este Aviso de Privacidad o el tratamiento de sus datos personales, puede comunicarse a:
                </p>
                <p className="pl-4 border-l-2 border-slate-200">
                  <strong>EHSA Programas / IHDECA Programas</strong><br />
                  <strong>Domicilio:</strong> Cerro de Picachos 760-L-20, Col. Obispado, Monterrey, Nuevo León, C.P. 64060<br />
                  <strong>Correo:</strong> <a href="mailto:Informes@ihdecaprogramas.com.mx" className="text-accent hover:underline">Informes@ihdecaprogramas.com.mx</a><br />
                  <strong>Teléfono / WhatsApp:</strong> 81 1033 0553
                </p>
                <p className="text-[10px] text-slate-400 pt-4 font-bold">
                  Última actualización: Julio de 2026.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
