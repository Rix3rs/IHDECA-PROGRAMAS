import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Scale } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Términos y Condiciones | IHDECA Programas",
  description: "Consulta los términos y condiciones que regulan el uso de nuestro sitio web, inscripciones y participación en los cursos de IHDECA Programas.",
  keywords: ["Términos y condiciones", "IHDECA", "inscripción", "capacitación", "legal"],
};

export default function TerminosPage() {
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
              Términos y Condiciones
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
                <Scale className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-primary">IHDECA Programas</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Términos y Condiciones de Uso</p>
                </div>
              </div>

              <p>
                Los presentes Términos y Condiciones regulan el uso del sitio web de IHDECA Programas, así como la solicitud de información, inscripción, contratación o participación en cursos, capacitaciones, programas de formación y servicios relacionados.
              </p>
              
              <p>
                Al navegar en este sitio web, enviar formularios, solicitar información, inscribirse a un curso o contratar cualquiera de nuestros servicios, usted acepta los presentes Términos y Condiciones.
              </p>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">1. Identidad del responsable</h3>
                <p>
                  El sitio web de IHDECA Programas es operado por <strong>EHSA Programas</strong>, en lo sucesivo “El Responsable”, con domicilio en Cerro de Picachos 760-L-20, Col. Obispado, Monterrey, Nuevo León, C.P. 64060.
                </p>
                <p>
                  IHDECA Programas forma parte del ecosistema de marcas relacionadas con EHSA Programas y EHSA Proyectos, enfocadas en capacitación, formación, consultoría y servicios profesionales.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">2. Servicios ofrecidos</h3>
                <p>
                  IHDECA Programas ofrece cursos, capacitaciones, programas de formación y servicios relacionados con el desarrollo de habilidades profesionales, laborales, de liderazgo, comunicación, consultoría y temas afines.
                </p>
                <p>
                  Los servicios podrán estar dirigidos a personas, equipos de trabajo, empresas u organizaciones, según las características de cada curso o programa.
                </p>
                <p>
                  La información publicada en el sitio web tiene fines informativos y podrá actualizarse conforme se definan nuevos cursos, fechas, modalidades, precios, temarios o condiciones de inscripción.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">3. Uso del sitio web</h3>
                <p>
                  El usuario se compromete a utilizar el sitio web de forma lícita, responsable y conforme a los presentes Términos y Condiciones.
                </p>
                <p>Queda prohibido:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Usar el sitio web para fines ilegales o no autorizados.</li>
                  <li>Enviar información falsa, incompleta o que pertenezca a terceros sin autorización.</li>
                  <li>Intentar afectar la seguridad, funcionamiento o disponibilidad del sitio.</li>
                  <li>Copiar, reproducir o utilizar contenidos del sitio sin autorización previa.</li>
                  <li>Realizar acciones que puedan dañar la imagen, operación o derechos de IHDECA Programas, EHSA Programas o marcas relacionadas.</li>
                </ul>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">4. Información de cursos y capacitaciones</h3>
                <p>
                  La información de cada curso podrá incluir nombre, descripción, modalidad, duración, fecha, precio, temario, cupo, requisitos, instructor, forma de pago y condiciones específicas.
                </p>
                <p>
                  Cuando algún dato aparezca como “por confirmar”, se entenderá que dicha información aún no es definitiva y será comunicada al usuario antes de formalizar la inscripción o contratación.
                </p>
                <p>
                  IHDECA Programas podrá modificar, actualizar o ajustar la información de cursos y capacitaciones cuando sea necesario, procurando comunicar los cambios relevantes a las personas interesadas o inscritas.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">5. Inscripciones</h3>
                <p>
                  La inscripción a un curso o capacitación podrá realizarse mediante formulario web, WhatsApp, correo electrónico, llamada telefónica u otro medio autorizado por IHDECA Programas.
                </p>
                <p>
                  Para procesar una solicitud de inscripción, el usuario deberá proporcionar información veraz, completa y actualizada.
                </p>
                <p>
                  El envío de una solicitud de información o formulario no garantiza automáticamente la inscripción, reserva de lugar o confirmación de participación. La inscripción quedará sujeta a confirmación por parte de IHDECA Programas.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">6. Modalidad de los cursos</h3>
                <p>
                  Los cursos podrán impartirse en modalidad en línea, presencial, híbrida o bajo formato específico para empresas u organizaciones, según se indique en cada programa.
                </p>
                <p>
                  De momento, la modalidad principal prevista para los cursos de IHDECA Programas es en línea, salvo que se indique expresamente una modalidad distinta.
                </p>
                <p>
                  El usuario será responsable de contar con los medios técnicos necesarios para participar en cursos en línea, como conexión a internet, dispositivo compatible, correo electrónico y acceso a la plataforma que se indique.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">7. Fechas, cupos y cambios de programación</h3>
                <p>
                  Las fechas, horarios y cupos de los cursos estarán sujetos a disponibilidad y confirmación.
                </p>
                <p>
                  IHDECA Programas podrá reprogramar, posponer o cancelar cursos por causas operativas, técnicas, administrativas, falta de cupo mínimo, fuerza mayor o cualquier otra circunstancia que impida su correcta realización.
                </p>
                <p>
                  En caso de cambio relevante en una fecha confirmada, IHDECA Programas procurará informar a los participantes por los medios de contacto proporcionados.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">8. Precios y pagos</h3>
                <p>
                  Los precios de cursos, capacitaciones o servicios serán informados antes de confirmar la contratación o inscripción correspondiente.
                </p>
                <p>
                  Cuando un curso no tenga precio publicado, el usuario deberá solicitar información para conocer las condiciones aplicables.
                </p>
                <p>
                  La integración de pagos en línea mediante Stripe u otra plataforma se encuentra pendiente de definir. En caso de habilitarse pagos en línea, las condiciones de pago, confirmación, comprobantes y políticas aplicables serán informadas al usuario antes de realizar la operación.
                </p>
                <p>
                  IHDECA Programas no almacenará datos completos de tarjetas bancarias cuando el pago sea procesado por plataformas externas.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">9. Cancelaciones, cambios y reembolsos</h3>
                <p>
                  Las políticas de cancelación, cambio de fecha, sustitución de participante o reembolso podrán variar según el curso, modalidad o tipo de contratación.
                </p>
                <p>
                  Cuando existan condiciones específicas para un curso o capacitación, estas serán informadas antes de confirmar la inscripción o pago.
                </p>
                <p>
                  En términos generales, cualquier solicitud de cancelación, cambio o aclaración deberá realizarse por escrito al correo <a href="mailto:Informes@ihdecaprogramas.com.mx" className="text-accent font-bold hover:underline">Informes@ihdecaprogramas.com.mx</a> o por el canal oficial de atención indicado por IHDECA Programas.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">10. Constancias, diplomas o documentos de participación</h3>
                <p>
                  La entrega de constancias, diplomas, reconocimientos, documentos DC-3, avales o cualquier documento relacionado con la participación en un curso dependerá de las características específicas de cada programa.
                </p>
                <p>
                  Ningún curso deberá entenderse como certificado, avalado, registrado o con validez específica salvo que dicha condición se indique expresamente en la información oficial del curso correspondiente.
                </p>
                <p>
                  Cuando aplique la emisión de algún documento, el participante deberá cumplir con los requisitos establecidos, tales como asistencia, participación, evaluación, entrega de información o pago correspondiente.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">11. Obligaciones del participante</h3>
                <p>El participante se compromete a:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Proporcionar información veraz y actualizada.</li>
                  <li>Revisar la información del curso antes de confirmar su inscripción.</li>
                  <li>Cumplir con los requisitos de participación indicados.</li>
                  <li>Conectarse puntualmente en cursos en línea.</li>
                  <li>Mantener una conducta respetuosa durante las sesiones.</li>
                  <li>No grabar, reproducir, distribuir o compartir materiales sin autorización.</li>
                  <li>No compartir accesos, enlaces, claves o materiales de uso personal.</li>
                </ul>
                <p>
                  IHDECA Programas podrá limitar la participación de usuarios que incumplan estas condiciones o afecten el desarrollo adecuado del curso.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">12. Materiales y propiedad intelectual</h3>
                <p>
                  Los contenidos, textos, imágenes, materiales, presentaciones, documentos, diseños, videos, grabaciones, marcas, logotipos y demás elementos relacionados con IHDECA Programas son propiedad de EHSA Programas, IHDECA Programas, sus marcas relacionadas o terceros autorizados.
                </p>
                <p>
                  El usuario no adquiere derechos de propiedad intelectual sobre dichos materiales por el hecho de acceder al sitio, solicitar información o participar en un curso.
                </p>
                <p>
                  Queda prohibida la reproducción, distribución, venta, publicación, modificación o uso comercial de los materiales sin autorización previa y por escrito.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">13. Grabaciones y sesiones en línea</h3>
                <p>
                  En caso de que un curso, sesión o capacitación sea grabada, IHDECA Programas lo informará a los participantes cuando corresponda.
                </p>
                <p>
                  Las grabaciones, si existen, podrán utilizarse para fines internos, académicos, operativos, de seguimiento o mejora de servicios, conforme al Aviso de Privacidad aplicable.
                </p>
                <p>
                  El participante no podrá grabar, transmitir o difundir sesiones sin autorización expresa.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">14. Comunicación con el usuario</h3>
                <p>
                  IHDECA Programas podrá contactar al usuario por correo electrónico, teléfono, WhatsApp u otros medios proporcionados por el propio usuario para dar seguimiento a solicitudes, inscripciones, cursos, pagos, aclaraciones, cambios de fecha o información relacionada con servicios.
                </p>
                <p>El canal principal de contacto será:</p>
                <p className="pl-4 border-l-2 border-slate-200">
                  <strong>Correo:</strong> <a href="mailto:Informes@ihdecaprogramas.com.mx" className="text-accent hover:underline">Informes@ihdecaprogramas.com.mx</a><br />
                  <strong>Teléfono / WhatsApp:</strong> 81 1033 0553
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">15. Sitios, herramientas y plataformas de terceros</h3>
                <p>
                  El sitio web podrá contener enlaces, integraciones o herramientas de terceros, como plataformas de pago, videoconferencia, analítica, publicidad, formularios, mapas, redes sociales o servicios tecnológicos.
                </p>
                <p>
                  El uso de dichas plataformas estará sujeto a sus propios términos, condiciones y políticas de privacidad. IHDECA Programas no será responsable por fallas, interrupciones, cambios, políticas o condiciones atribuibles directamente a plataformas externas.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">16. Privacidad y protección de datos</h3>
                <p>
                  El tratamiento de datos personales se realizará conforme al Aviso de Privacidad de EHSA Programas / IHDECA Programas, disponible en el sitio web.
                </p>
                <p>
                  Al enviar información mediante formularios, WhatsApp, correo electrónico u otros medios de contacto, el usuario acepta que sus datos sean tratados conforme a dicho aviso.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">17. Limitación de responsabilidad</h3>
                <p>
                  IHDECA Programas procurará que la información publicada en el sitio sea clara, actualizada y correcta. Sin embargo, puede existir información pendiente de confirmación, sujeta a cambios o actualizaciones.
                </p>
                <p>IHDECA Programas no será responsable por:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Errores derivados de información incorrecta proporcionada por el usuario.</li>
                  <li>Fallas de conexión, equipo o acceso atribuibles al usuario.</li>
                  <li>Interrupciones de plataformas externas.</li>
                  <li>Uso indebido de materiales por parte de participantes.</li>
                  <li>Expectativas no expresamente ofrecidas en la información oficial del curso.</li>
                  <li>Daños derivados del uso no autorizado del sitio o sus contenidos.</li>
                </ul>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">18. Modificaciones a los Términos y Condiciones</h3>
                <p>
                  IHDECA Programas podrá modificar los presentes Términos y Condiciones cuando sea necesario por cambios legales, operativos, tecnológicos, comerciales o de servicios.
                </p>
                <p>
                  Las modificaciones serán publicadas en el sitio web y entrarán en vigor desde su publicación, salvo que se indique una fecha distinta. Se recomienda revisar esta sección periódicamente.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">19. Legislación aplicable</h3>
                <p>
                  Los presentes Términos y Condiciones se regirán por las leyes aplicables en los Estados Unidos Mexicanos.
                </p>
                <p>
                  Cualquier controversia relacionada con el uso del sitio web, solicitud de información, inscripción, contratación o participación en cursos será atendida preferentemente por los canales de contacto de IHDECA Programas, sin perjuicio de los derechos que correspondan al usuario conforme a la legislación aplicable.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h3 className="text-base font-bold text-primary">20. Contacto</h3>
                <p>
                  Para dudas, aclaraciones, solicitudes o comentarios relacionados con estos Términos y Condiciones, puede comunicarse a:
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
