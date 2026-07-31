import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function sendEmail(to: string, subject: string, html: string) {
  return resend.emails.send({
    from: "IHDECA Programas <no-reply@ihdecaprogramas.com.mx>",
    to,
    subject,
    html,
  });
}

export function templateResetPassword(nombre: string, resetUrl: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Montserrat',Helvetica,Arial,sans-serif;background:linear-gradient(180deg,#0F2C59 0%,#1a3a6b 100%)">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
    <tr>
      <td style="padding:40px 30px 20px;text-align:center">
        <h1 style="margin:0;font-size:28px;font-weight:900;color:#E67E22;letter-spacing:-0.5px">IHDECA</h1>
        <p style="margin:4px 0 0;font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:3px">Programas de Capacitación</p>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;border-radius:32px 32px 32px 0;padding:40px 30px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding-bottom:24px">
              <div style="display:inline-block;background:#eff6ff;border-radius:50%;width:64px;height:64px;line-height:64px;margin-bottom:12px">
                <span style="font-size:32px">&#128274;</span>
              </div>
              <h2 style="margin:0;font-size:22px;font-weight:900;color:#0F2C59">Restablecer Contraseña</h2>
              <p style="margin:10px 0 0;font-size:14px;color:#64748b;line-height:1.6">
                Hola <strong style="color:#0F2C59">${nombre}</strong>, recibimos una solicitud para cambiar tu contraseña.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:28px">
              <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#E67E22,#d97706);color:#ffffff;padding:14px 40px;border-radius:14px 14px 14px 0;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;box-shadow:0 4px 15px rgba(230,126,34,0.3)">
                Cambiar Contraseña
              </a>
              <p style="margin:16px 0 0;font-size:11px;color:#94a3b8">O copia y pega este enlace en tu navegador:</p>
              <p style="margin:4px 0 0;font-size:10px;color:#94a3b8;word-break:break-all;background:#f8fafc;padding:10px 14px;border-radius:10px;border:1px solid #e2e8f0">
                ${resetUrl}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;padding:20px">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:top;width:24px;padding-top:1px">
                      <span style="color:#E67E22;font-size:16px">&#9888;</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:12px;color:#9a3412;line-height:1.6">
                        <strong style="color:#7c2d12">Importante</strong><br>
                        Este enlace expira en <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este mensaje. Tu cuenta seguirá protegida.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 30px 30px;text-align:center">
        <p style="margin:0;font-size:10px;color:#64748b;line-height:1.6">
          IHDECA Programas &middot; Cerro de Picachos 760, Monterrey, NL<br>
          <a href="mailto:Informes@ihdecaprogramas.com.mx" style="color:#E67E22;text-decoration:none">Informes@ihdecaprogramas.com.mx</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function templateConfirmacionCompra(nombre: string, curso: string, precio: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Montserrat',Helvetica,Arial,sans-serif;background:linear-gradient(180deg,#0F2C59 0%,#1a3a6b 100%)">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
    <tr>
      <td style="padding:40px 30px 20px;text-align:center">
        <h1 style="margin:0;font-size:28px;font-weight:900;color:#E67E22;letter-spacing:-0.5px">IHDECA</h1>
        <p style="margin:4px 0 0;font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:3px">Programas de Capacitación</p>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;border-radius:32px 32px 32px 0;padding:40px 30px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding-bottom:24px">
              <div style="display:inline-block;background:#ecfdf5;border-radius:50%;width:64px;height:64px;line-height:64px;margin-bottom:12px">
                <span style="font-size:32px">&#10003;</span>
              </div>
              <h2 style="margin:0;font-size:22px;font-weight:900;color:#0F2C59">¡Inscripción Confirmada!</h2>
              <p style="margin:8px 0 0;font-size:14px;color:#64748b;line-height:1.5">
                Hola <strong style="color:#0F2C59">${nombre}</strong>, tu pago fue procesado exitosamente.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 28px 0">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:20px;padding:24px">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px">
                      <span style="display:block;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:3px">Curso Adquirido</span>
                      <span style="font-size:16px;font-weight:700;color:#0F2C59">${curso}</span>
                    </td>
                    <td align="right" style="padding-bottom:12px">
                      <span style="display:block;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:3px">Inversión</span>
                      <span style="font-size:20px;font-weight:900;color:#E67E22">${precio}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div style="height:1px;background:#e2e8f0;margin:4px 0 12px"></div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span style="display:block;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:3px">Modalidad</span>
                      <span style="font-size:13px;font-weight:600;color:#475569">En línea</span>
                    </td>
                    <td align="right">
                      <span style="display:block;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:3px">Estado</span>
                      <span style="display:inline-block;background:#ecfdf5;color:#059669;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700">Activo</span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:28px">
              <a href="https://ihdecaprogramas.com.mx/dashboard/estudiante" style="display:inline-block;background:linear-gradient(135deg,#E67E22,#d97706);color:#ffffff;padding:14px 40px;border-radius:14px 14px 14px 0;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;box-shadow:0 4px 15px rgba(230,126,34,0.3)">
                Ir a mi Dashboard
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <div style="background:#f8fafc;border-radius:16px;padding:20px">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:top;width:24px;padding-top:1px">
                      <span style="color:#E67E22;font-size:16px">&#128161;</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:12px;color:#475569;line-height:1.6">
                        <strong style="color:#0F2C59">¿Qué sigue?</strong><br>
                        Accede a tu dashboard para ver el temario, materiales, y el enlace de Zoom para tus clases en vivo.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 30px 30px;text-align:center">
        <p style="margin:0;font-size:10px;color:#64748b;line-height:1.6">
          IHDECA Programas &middot; Cerro de Picachos 760, Monterrey, NL<br>
          <a href="mailto:Informes@ihdecaprogramas.com.mx" style="color:#E67E22;text-decoration:none">Informes@ihdecaprogramas.com.mx</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function templateBienvenidaDocente(nombre: string, resetUrl: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Montserrat',Helvetica,Arial,sans-serif;background:linear-gradient(180deg,#0F2C59 0%,#1a3a6b 100%)">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
    <tr>
      <td style="padding:40px 30px 20px;text-align:center">
        <h1 style="margin:0;font-size:28px;font-weight:900;color:#E67E22;letter-spacing:-0.5px">IHDECA</h1>
        <p style="margin:4px 0 0;font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:3px">Programas de Capacitación</p>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;border-radius:32px 32px 32px 0;padding:40px 30px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding-bottom:24px">
              <div style="display:inline-block;background:#fef3c7;border-radius:50%;width:64px;height:64px;line-height:64px;margin-bottom:12px">
                <span style="font-size:32px">&#127891;</span>
              </div>
              <h2 style="margin:0;font-size:22px;font-weight:900;color:#0F2C59">¡Bienvenido al equipo IHDECA!</h2>
              <p style="margin:10px 0 0;font-size:14px;color:#64748b;line-height:1.6">
                Hola <strong style="color:#0F2C59">${nombre}</strong>, has sido registrado como <strong style="color:#E67E22">docente</strong> en IHDECA Programas.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px 0">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:20px;padding:24px;text-align:center">
                <p style="margin:0 0 16px;font-size:13px;color:#475569;line-height:1.6">
                  Para comenzar, necesitas configurar tu contraseña de acceso al panel docente.
                </p>
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#E67E22,#d97706);color:#ffffff;padding:14px 40px;border-radius:14px 14px 14px 0;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;box-shadow:0 4px 15px rgba(230,126,34,0.3)">
                  Configurar Contraseña
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:20px">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:top;width:24px;padding-top:1px">
                      <span style="color:#3b82f6;font-size:16px">&#128161;</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:12px;color:#1e40af;line-height:1.6">
                        <strong>¿Qué puedes hacer en tu panel?</strong><br>
                        Gestionar temarios, calificar alumnos, subir materiales y dar seguimiento al progreso de tus grupos.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 30px 30px;text-align:center">
        <p style="margin:0;font-size:10px;color:#64748b;line-height:1.6">
          IHDECA Programas &middot; Cerro de Picachos 760, Monterrey, NL<br>
          <a href="mailto:Informes@ihdecaprogramas.com.mx" style="color:#E67E22;text-decoration:none">Informes@ihdecaprogramas.com.mx</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function templateNuevaCalificacion(nombre: string, curso: string, calificacion: number | string) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f8fafc;padding:20px">
  <div style="max-width:480px;margin:auto;background:#fff;border-radius:24px;padding:32px;border:1px solid #e2e8f0">
    <h2 style="color:#0F2C59">Nueva calificación, ${nombre}</h2>
    <p style="color:#475569;font-size:14px">Tu docente ha registrado una calificación en <strong>${curso}</strong>.</p>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;margin:16px 0;text-align:center">
      <span style="font-size:32px;font-weight:bold;color:#0F2C59">${calificacion}</span>
      <span style="font-size:14px;color:#64748b">/100</span>
    </div>
    <a href="https://ihdecaprogramas.com.mx/dashboard/estudiante" style="display:inline-block;background:#0F2C59;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:14px">
      Ver dashboard
    </a>
  </div>
</body>
</html>`;
}

export function templateMaterialNuevo(nombre: string, curso: string, materialTitulo: string) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f8fafc;padding:20px">
  <div style="max-width:480px;margin:auto;background:#fff;border-radius:24px;padding:32px;border:1px solid #e2e8f0">
    <h2 style="color:#0F2C59">Nuevo material disponible, ${nombre}</h2>
    <p style="color:#475569;font-size:14px">Tu docente ha subido un nuevo recurso al curso <strong>${curso}</strong>.</p>
    <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:16px;margin:16px 0">
      <p style="color:#92400e;font-size:14px;margin:0">${materialTitulo}</p>
    </div>
    <a href="https://ihdecaprogramas.com.mx/dashboard/estudiante" style="display:inline-block;background:#0F2C59;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:14px">
      Ver materiales
    </a>
  </div>
</body>
</html>`;
}
