export interface Course {
  slug: string;
  title: string;
  description: string;
  extendedDescription: string;
  category: string;
  categorySlug: string;
  duration: string;
  lessons: string;
  instructor: string;
  instructorInitials: string;
  instructorColor: string;
  rating: number;
  price: string;
  originalPrice?: string;
  precioMxn?: number | null;
  gradient: string;
  emoji?: string;
  badgeBg: string;
  badgeText: string;
  modalidad: string;
  fechas: string;
  dirigidoA: string[];
  temario?: string[];
  objetivos?: string[];
  coverUrl?: string;
  coverPositionY?: number;
  coverAlt?: string;
  publicado?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  textColor: string;
  borderColor: string;
  count: string;
}

export const categories: Category[] = [
  {
    slug: "liderazgo-y-habilidades",
    name: "Liderazgo y Habilidades Blandas",
    description: "Desarrolla competencias clave como liderazgo, comunicación efectiva y resolución pacífica de conflictos.",
    iconName: "TrendingUp",
    color: "bg-blue-50/70",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    count: "3 cursos"
  },
  {
    slug: "desarrollo-profesional",
    name: "Desarrollo Profesional",
    description: "Programas de capacitación complementarios y especializados para potenciar tu desempeño.",
    iconName: "Award",
    color: "bg-amber-50/70",
    textColor: "text-amber-700",
    borderColor: "border-amber-100",
    count: "1 curso"
  }
];

export const courses: Course[] = [
  {
    slug: "curso-de-walter",
    title: "Curso de Walter",
    description: "Programa en desarrollo. Próximamente se compartirá más información sobre el contenido y proceso de inscripción.",
    extendedDescription: "Este programa de formación está en fase de desarrollo. El temario, objetivos y estructura definitiva del curso serán comunicados oficialmente por el equipo directivo de IHDECA.",
    category: "Desarrollo Profesional",
    categorySlug: "desarrollo-profesional",
    duration: "Por confirmar",
    lessons: "Por definir",
    instructor: "Walter",
    instructorInitials: "W",
    instructorColor: "bg-amber-600",
    rating: 5.0,
    price: "Por confirmar",
    gradient: "from-amber-500 to-orange-600",
    emoji: "👨‍🏫",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    modalidad: "En línea",
    fechas: "Por confirmar",
    dirigidoA: [
      "Personas, equipos y organizaciones interesadas en fortalecer sus habilidades profesionales."
    ],
    temario: [
      "Programa en desarrollo - Información a detallar próximamente."
    ],
    objetivos: [
      "Potenciar destrezas clave según la especialidad del instructor.",
      "Adaptar los conocimientos prácticos al ámbito laboral actual."
    ]
  },
  {
    slug: "liderazgo-empresarial",
    title: "Liderazgo empresarial",
    description: "Fortalece habilidades de liderazgo, comunicación y toma de decisiones para guiar equipos de trabajo con mayor claridad y enfoque.",
    extendedDescription: "Domina herramientas de liderazgo moderno y aprende a gestionar el talento humano. Este curso te enseñará a guiar equipos de trabajo con mayor claridad, responsabilidad y un fuerte enfoque en resultados.",
    category: "Liderazgo y Habilidades Blandas",
    categorySlug: "liderazgo-y-habilidades",
    duration: "Por confirmar",
    lessons: "Por definir",
    instructor: "Por confirmar",
    instructorInitials: "LE",
    instructorColor: "bg-blue-600",
    rating: 4.9,
    price: "Por confirmar",
    precioMxn: 799,
    gradient: "from-blue-600 to-indigo-700",
    emoji: "🎯",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    modalidad: "En línea",
    fechas: "Por confirmar",
    dirigidoA: [
      "Líderes",
      "Coordinadores",
      "Gerentes",
      "Mandos medios",
      "Responsables de equipo",
      "Profesionales en proceso de desarrollo"
    ],
    temario: [
      "Fundamentos del Liderazgo Moderno",
      "Comunicación y Dirección de Equipos",
      "Toma de Decisiones Estratégicas",
      "Gestión del Cambio y Responsabilidad Corporativa"
    ],
    objetivos: [
      "Desarrollar habilidades de dirección para conducir equipos al éxito.",
      "Aprender a tomar decisiones informadas en entornos bajo presión.",
      "Fomentar una cultura de responsabilidad y comunicación clara."
    ]
  },
  {
    slug: "comunicacion-efectiva",
    title: "Comunicación efectiva y asertiva en el trabajo",
    description: "Aprende a comunicar ideas, necesidades y acuerdos de manera clara, respetuosa y efectiva dentro del entorno profesional.",
    extendedDescription: "La comunicación es la base del éxito laboral. En este curso aprenderás técnicas prácticas para comunicar tus ideas, necesidades y acuerdos de manera clara, respetuosa, asertiva y sumamente efectiva en cualquier entorno profesional.",
    category: "Liderazgo y Habilidades Blandas",
    categorySlug: "liderazgo-y-habilidades",
    duration: "Por confirmar",
    lessons: "Por definir",
    instructor: "Por confirmar",
    instructorInitials: "CA",
    instructorColor: "bg-purple-600",
    rating: 4.8,
    price: "Por confirmar",
    precioMxn: 599,
    gradient: "from-purple-500 to-indigo-700",
    emoji: "💬",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    modalidad: "En línea",
    fechas: "Por confirmar",
    dirigidoA: [
      "Personas y equipos de trabajo",
      "Líderes",
      "Áreas administrativas",
      "Personal operativo",
      "Profesionales que buscan mejorar su comunicación laboral"
    ],
    temario: [
      "Principios de la Comunicación Asertiva",
      "Escucha Activa y Empatía en el Trabajo",
      "Expresión Clara de Ideas y Necesidades",
      "Manejo de Conversaciones Difíciles"
    ],
    objetivos: [
      "Identificar y superar las barreras comunes de la comunicación.",
      "Expresar ideas y opiniones con seguridad y sin agresividad.",
      "Establecer límites profesionales y resolver dudas de manera clara."
    ]
  },
  {
    slug: "manejo-de-conflictos",
    title: "Manejo de conflictos",
    description: "Desarrolla herramientas para identificar, abordar y resolver conflictos dentro del entorno laboral de forma estratégica.",
    extendedDescription: "Adquiere la capacidad de transformar los desacuerdos en oportunidades de crecimiento. Desarrolla herramientas prácticas para identificar, abordar y resolver conflictos dentro del entorno laboral de forma profesional, estratégica y constructiva.",
    category: "Liderazgo y Habilidades Blandas",
    categorySlug: "liderazgo-y-habilidades",
    duration: "Por confirmar",
    lessons: "Por definir",
    instructor: "Por confirmar",
    instructorInitials: "MC",
    instructorColor: "bg-rose-600",
    rating: 4.9,
    price: "Por confirmar",
    precioMxn: 699,
    gradient: "from-rose-500 to-orange-600",
    emoji: "🤝",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    modalidad: "En línea",
    fechas: "Por confirmar",
    dirigidoA: [
      "Personas y equipos",
      "Líderes",
      "Mandos medios",
      "Profesionales que buscan mejorar la gestión de conflictos en su entorno de trabajo"
    ],
    temario: [
      "Análisis de las Fuentes de Conflicto",
      "Estilos de Resolución de Conflictos",
      "Técnicas de Negociación y Mediación",
      "Creación de Acuerdos Sostenibles"
    ],
    objetivos: [
      "Diagnosticar las causas raíz de las disputas en la oficina.",
      "Aplicar técnicas de mediación neutrales y constructivas.",
      "Negociar soluciones ganar-ganar que fortalezcan la colaboración."
    ]
  }
];
