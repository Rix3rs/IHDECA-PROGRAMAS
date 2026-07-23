export interface MockStudent {
  id: string;
  nombre: string;
  email: string;
  contrasena: string;
  cursoSlug: string;
  cursoTitle: string;
  progreso: number; // 0 to 100
  calificacion: number | null; // 0 to 100 or null
  tareaEntregada: boolean;
  comentariosDocente: string;
  estadoInscripcion: "Aceptado" | "Pendiente";
  fechaRegistro: string;
  empresa?: string;
}

export interface MockTeacher {
  id: string;
  nombre: string;
  email: string;
  contrasena: string;
  cursoSlug: string;
  cursoTitle: string;
  zoomLink: string;
}

export interface AdminMetrics {
  ingresosMensuales: string;
  alumnosActivos: number;
  retencionRate: string;
  solicitudesPendientesCount: number;
}

export const initialStudents: MockStudent[] = [
  {
    id: "EST-001",
    nombre: "Alejandro Ruiz",
    email: "alejandro.ruiz@gmail.com",
    contrasena: "ruiz2026",
    cursoSlug: "liderazgo-empresarial",
    cursoTitle: "Liderazgo empresarial",
    progreso: 65,
    calificacion: 85,
    tareaEntregada: true,
    comentariosDocente: "Excelente participación en el módulo de comunicación de equipos.",
    estadoInscripcion: "Aceptado",
    fechaRegistro: "2026-06-15",
    empresa: "Tech Solutions"
  },
  {
    id: "EST-002",
    nombre: "Mariana Gómez",
    email: "mariana.gomez@hotmail.com",
    contrasena: "gomez2026",
    cursoSlug: "comunicacion-efectiva",
    cursoTitle: "Comunicación efectiva y asertiva en el trabajo",
    progreso: 90,
    calificacion: 95,
    tareaEntregada: true,
    comentariosDocente: "Gran dominio de la escucha activa en entornos retadores.",
    estadoInscripcion: "Aceptado",
    fechaRegistro: "2026-06-20",
    empresa: "Retail Corp"
  },
  {
    id: "EST-003",
    nombre: "David Kahan",
    email: "david.kahan@outlook.com",
    contrasena: "kahan2026",
    cursoSlug: "manejo-de-conflictos",
    cursoTitle: "Manejo de conflictos",
    progreso: 40,
    calificacion: null,
    tareaEntregada: false,
    comentariosDocente: "Pendiente entregar la actividad práctica del Módulo 2.",
    estadoInscripcion: "Aceptado",
    fechaRegistro: "2026-07-01",
  },
  {
    id: "EST-004",
    nombre: "Laura Peralta",
    email: "laura.peralta@gmail.com",
    contrasena: "peralta2026",
    cursoSlug: "liderazgo-empresarial",
    cursoTitle: "Liderazgo empresarial",
    progreso: 10,
    calificacion: null,
    tareaEntregada: false,
    comentariosDocente: "",
    estadoInscripcion: "Pendiente",
    fechaRegistro: "2026-07-14",
    empresa: "EHSA Consultores"
  },
  {
    id: "EST-005",
    nombre: "Roberto Castillo",
    email: "roberto.castillo@yahoo.com",
    contrasena: "castillo2026",
    cursoSlug: "comunicacion-efectiva",
    cursoTitle: "Comunicación efectiva y asertiva en el trabajo",
    progreso: 0,
    calificacion: null,
    tareaEntregada: false,
    comentariosDocente: "",
    estadoInscripcion: "Pendiente",
    fechaRegistro: "2026-07-15",
  }
];

export const initialTeachers: MockTeacher[] = [
  {
    id: "DOC-001",
    nombre: "Walter",
    email: "walter.docente@ihdecaprogramas.com.mx",
    contrasena: "walter2026",
    cursoSlug: "curso-de-walter",
    cursoTitle: "Curso de Walter",
    zoomLink: "https://zoom.us/j/9876543210"
  },
  {
    id: "DOC-002",
    nombre: "Dra. Sofía Altamirano",
    email: "sofia.altamirano@ihdecaprogramas.com.mx",
    contrasena: "sofia2026",
    cursoSlug: "liderazgo-empresarial",
    cursoTitle: "Liderazgo empresarial",
    zoomLink: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "DOC-003",
    nombre: "Mtro. Carlos Mendoza",
    email: "carlos.mendoza@ihdecaprogramas.com.mx",
    contrasena: "carlos2026",
    cursoSlug: "comunicacion-efectiva",
    cursoTitle: "Comunicación efectiva y asertiva en el trabajo",
    zoomLink: "https://meet.google.com/xyz-uvwx-yza"
  },
  {
    id: "DOC-004",
    nombre: "Mtra. Elena Rossi",
    email: "elena.rossi@ihdecaprogramas.com.mx",
    contrasena: "elena2026",
    cursoSlug: "manejo-de-conflictos",
    cursoTitle: "Manejo de conflictos",
    zoomLink: "https://zoom.us/j/0123456789"
  }
];

export const mockAdminMetrics: AdminMetrics = {
  ingresosMensuales: "$4,500 USD",
  alumnosActivos: 3, // Aceptados
  retencionRate: "96.5%",
  solicitudesPendientesCount: 2 // Pendientes
};
