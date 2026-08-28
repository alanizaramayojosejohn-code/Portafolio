import type { Project } from './models';

export const PROJECTS: Project[] = [
  {
    slug: 'asistencia-mma',
    title: 'Sistema de Asistencia MMA',
    description:
      'Aplicación para registrar asistencia y gestionar clases en una academia de artes marciales. Incluye control de horarios, seguimiento de estudiantes y reportes de asistencia.',
    longDescription:
      'Flujo diario de check-in, vistas para instructores y reportes básicos para administración. Prioriza claridad en pantallas táctiles y carga rápida.',
    technologies: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
    link: 'https://github.com/JoseJ57/Helluz',
    image: 'images/proyectos/Helluz.webp',
    headerGradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)',
    category: 'Gestión',
  },
  {
    slug: 'pokeplace',
    title: 'PokePlace - Cafetería Temática',
    description:
      'Sistema de ventas y gestión de inventario para cafetería temática PokePlace. Control de pedidos, menú digital, administración de stock y reportes de ventas.',
    longDescription:
      'Plataforma integral para cafetería temática: punto de venta, gestión de inventario en tiempo real, menú interactivo y panel administrativo. Diseñado para optimizar operaciones diarias y mejorar la experiencia del cliente.',
    technologies: ['Firebase', 'Angular', 'Tailwind CSS', 'Angular Material', 'Claude Code', 'Pencil'],
    link: '',
    image: 'images/proyectos/PokePlace.webp',
    headerGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
    category: 'E-commerce & Gestión',
  },
  {
    slug: 'pr-gym-app',
    title: 'PR - App de Entrenamiento',
    description:
      'Aplicación móvil para controlar rutinas y progreso en el gimnasio. Seguimiento de ejercicios, gráficos de progreso, control de rachas y artículos para principiantes.',
    longDescription:
      'App completa para entusiastas del fitness: creación de rutinas personalizadas, registro de ejercicios con historial, visualización de progreso con gráficos interactivos, sistema de rachas para mantener motivación, y sección educativa con artículos para principiantes.',
    technologies: ['Flutter', 'Supabase', 'Claude Code', 'Pencil', 'Canva'],
    link: '',
    image: 'images/proyectos/PR.webp',
    headerGradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
    category: 'Fitness & Salud',
  },
  {
    slug: 'findme',
    title: 'FindMe - Búsqueda de Mascotas Perdidas',
    description:
      'PWA para el reporte y búsqueda de mascotas extraviadas y halladas. Avistamientos, casos cercanos a tu ubicación y salas de búsqueda grupal donde los usuarios marcan sus rutas en el mapa para descartar zonas ya revisadas.',
    longDescription:
      'Aplicación web progresiva construida con Angular y Firebase, integrada con OpenStreetMap y Leaflet.js para mapas interactivos. Permite reportar mascotas perdidas o halladas, registrar avistamientos, ver casos cercanos por geolocalización, y coordinar búsquedas grupales en salas donde cada participante traza su recorrido en tiempo real para evitar duplicar zonas de búsqueda.',
    technologies: ['Angular', 'Firebase', 'Leaflet.js', 'OpenStreetMap', 'PWA'],
    link: 'https://zfind-me.web.app/',
    image: 'images/proyectos/FindMe.webp',
    headerGradient: 'linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #14b8a6 100%)',
    category: 'Comunidad & Mascotas',
  },
  {
    slug: 'inventario-mantenimiento',
    title: 'Sistema de Inventario y Mantenimiento',
    description:
      'Sistema web para controlar equipos y reportes de mantenimiento en laboratorios de programación. Permite registrar activos, historial de reparaciones y alertas de mantenimiento.',
    longDescription:
      'Enfocado en laboratorios: registro de equipos, historial de mantenimiento y alertas para reducir tiempo muerto. Stack orientado a entrega rápida y operación en entornos académicos.',
    technologies: ['C#', 'SQLite', 'HTML/CSS', 'Bootstrap', 'JavaScript'],
    link: 'https://github.com/JoseJ57/vicu2/tree/Jose',
    image: '',
    headerGradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0891b2 100%)',
    category: 'Sistema Web',
  },
  {
    slug: 'membresias-helluz',
    title: 'Control de Asistencia y Membresías',
    description:
      'Sistema web para el control de membresías y asistencia de la academia Helluz. Gestión de planes, pagos, renovaciones y seguimiento de miembros activos e inactivos.',
    longDescription:
      'Cubre ciclo de membresía: altas, renovaciones y asistencia recurrente. Pensado para reducir trabajo manual del staff y evitar errores en cobros.',
    technologies: ['C#', 'SQLite', 'HTML/CSS', 'Bootstrap', 'Scrum'],
    link: 'https://github.com/JoseJ57/vicu2/tree/Jose',
    image: '',
    headerGradient: 'linear-gradient(135deg, #2e1065 0%, #6d28d9 50%, #7c3aed 100%)',
    category: 'Membresías',
  },
  {
    slug: 'ventas-sucursales',
    title: 'Sistema de Ventas con Sucursales',
    description:
      'Colaboré en un sistema de ventas con múltiples sucursales y un almacén general. Integración de módulos, API REST y sincronización de inventarios entre sucursales en tiempo real.',
    longDescription:
      'Participación en módulos de inventario y consumo de API REST. Enfoque en consistencia de datos entre sucursales y experiencia usable para operadores.',
    technologies: ['Laravel', 'React', 'PHP', 'MySQL', 'CSS'],
    link: '',
    image: '',
    headerGradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
    category: 'E-commerce',
  },

];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const PROJECT_SLUGS: string[] = PROJECTS.map((p) => p.slug);
