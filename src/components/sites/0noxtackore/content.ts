import type { Locale } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n";

import { siteUrl } from "./data";

type Link = { label: string; href: string };
type LinkGroup = { title: string; links: Link[] };
type TextBlock = { title: string; description: string };
type Faq = { question: string; answer: string };
type Project = {
  name: string;
  description: string;
  status: string;
  updated: string;
  tech: string[];
  url: string;
};

export type Content = {
  locale: Locale;
  baseUrl: string;
  brand: {
    name: string;
    tagline: string;
    heroEyebrow: string;
    intro: string;
    approach: string;
  };
  heroSlides: { desktop: string; mobile: string; alt: string; blur: string }[];
  areas: (TextBlock & { slug: string; image: string; icon: string; blur: string })[];
  philosophy: { paragraphs: string[]; statement: string };
  recommendation: { title: string; paragraphs: string[]; highlights: string[] };
  values: TextBlock[];
  trust: TextBlock[];
  faqs: Faq[];
  navLinks: Link[];
  megaGroups: LinkGroup[];
  footerGroups: LinkGroup[];
  testimonials: { quote: string; name: string; role: string }[];
  projects: Project[];
  ogImage: string;
  ui: Record<string, string>;
  share: {
    defaultText: string;
    labels: Record<string, string>;
  };
  pages: {
    guia: {
      title: string;
      description: string;
      kicker: string;
      readingTime: string;
      tocTitle: string;
      sections: { id: string; title: string }[];
      body: string[];
      checklist: string[];
      checklistIntro: string;
      criteriaIntro: string;
      criteriaNote: string;
      storeTitle: string;
      storeText: string;
      storeCta: string;
      shareHeading: string;
      shareText: string;
      back: string;
      captions: Record<string, string>;
    };
    acerca: {
      title: string;
      description: string;
      kicker: string;
      lead: string;
      back: string;
      tocTitle: string;
      toc: { label: string; href: string }[];
      whoTitle: string;
      whoParagraphs: string[];
      buildTitle: string;
      buildIntro: string;
      projects: { name: string; description: string; url: string }[];
      philosophyTitle: string;
      philosophyText: string;
      officialTitle: string;
      officialText: string;
    };
  };
  metadata: {
    home: { title: string; description: string };
    guia: { title: string; description: string };
    acerca: { title: string; description: string };
  };
};

const uiEs: Record<string, string> = {
  announce: "Conoce nuestra filosofía →",
  all: "Todo",
  contact: "Contacto",
  heroExplore: "Explorar áreas",
  heroPhilosophy: "Nuestra filosofía",
  areasKicker: "Qué hacemos",
  areasTitle: "Áreas de actividad",
  philosophyKicker: "Cómo pensamos",
  philosophyTitle: "Nuestra filosofía",
  quoteLabel: "Frase destacada",
  recKicker: "Tecnología útil",
  readGuide: "Leer la guía completa",
  recImageAlt: "Portátil con gráficas de análisis en pantalla",
  disclaimer:
    "Somos afiliados: podemos recibir una comisión por compras elegibles a través de nuestros enlaces, sin coste adicional para ti. No fabricamos ni vendemos directamente los equipos.",
  valuesKicker: "Principios",
  valuesTitle: "Lo que nos guía",
  trustKicker: "Transparencia",
  trustTitlePrefix: "Por qué confiar en",
  trustIntro:
    "Construimos tecnología con propósito, con criterios claros y una forma de trabajar abierta y responsable.",
  faqKicker: "Preguntas frecuentes",
  faqTitle: "Resuelve tus dudas",
  faqCta: "¿Quieres conocernos mejor? Encuentra nuestras redes y síguenos para estar al tanto.",
  shareKicker: "Difunde",
  shareTitle: "¿Te resultó útil? Compártelo",
  shareText:
    "Si conoces a alguien interesado en tecnología con propósito, ayúdanos a llegar hasta él.",
  socialTitle: "Síguenos",
  footerClaim: "Construimos tecnología con propósito.",
  testimonialsKicker: "Lo que dicen",
  testimonialsTitle: "Experiencias reales",
  projectsKicker: "Lo que construimos",
  projectsTitle: "Proyectos y soluciones",
  projectsText:
    "Productos y proyectos de código abierto que ya están disponibles públicamente. Cada uno resuelve un problema concreto y mantiene su código, licencia y evolución a la vista de todos.",
  projectsUpdated: "Actualizado",
  projectsVisit: "Ver repositorio",
};

const uiEn: Record<string, string> = {
  announce: "Learn about our philosophy →",
  all: "All",
  contact: "Contact",
  heroExplore: "Explore areas",
  heroPhilosophy: "Our philosophy",
  areasKicker: "What we do",
  areasTitle: "Areas of activity",
  philosophyKicker: "How we think",
  philosophyTitle: "Our philosophy",
  quoteLabel: "Featured quote",
  recKicker: "Useful technology",
  readGuide: "Read the full guide",
  recImageAlt: "Laptop displaying analysis charts on screen",
  disclaimer:
    "We are affiliates: we may earn a commission on eligible purchases through our links, at no extra cost to you. We do not manufacture or directly sell the devices.",
  valuesKicker: "Principles",
  valuesTitle: "What guides us",
  trustKicker: "Transparency",
  trustTitlePrefix: "Why trust",
  trustIntro:
    "We build technology with purpose, with clear criteria and an open, responsible way of working.",
  faqKicker: "Frequently asked questions",
  faqTitle: "Answers to your questions",
  faqCta: "Want to get to know us better? Find us on social media and follow along.",
  shareKicker: "Spread the word",
  shareTitle: "Found it useful? Share it",
  shareText: "If you know someone interested in technology with purpose, help us reach them.",
  socialTitle: "Follow us",
  footerClaim: "We build technology with purpose.",
  testimonialsKicker: "What people say",
  testimonialsTitle: "Real experiences",
  projectsKicker: "What we build",
  projectsTitle: "Projects and solutions",
  projectsText:
    "Open-source products and projects that are already publicly available. Each one solves a specific problem and keeps its code, license and evolution open for everyone to see.",
  projectsUpdated: "Updated",
  projectsVisit: "View repository",
};

const es: Content = {
  locale: "es",
  baseUrl: siteUrl,
  brand: {
    name: "0NOXTACKORE",
    tagline: "CREADO PARA IMPACTAR",
    heroEyebrow: "TECNOLOGÍA CON ALMA",
    intro:
      "0noxtackore es una compañía tecnológica independiente enfocada en la ingeniería, desarrollo y evolución de soluciones de software, así como en la selección y recomendación de productos tecnológicos.",
    approach:
      "Trabajamos con tecnologías propias y proyectos de código abierto para construir herramientas, aplicaciones e integraciones que resuelvan problemas reales, mejoren procesos y hagan que la tecnología sea más accesible y útil.",
  },
  heroSlides: [
    { desktop: "/sites/0noxtackore/photos/hero-section/hero_i.webp", mobile: "/sites/0noxtackore/photos/hero-section/mobile/hero_i.webp", alt: "Portátil con una escultura tridimensional en pantalla", blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoQAAkABUB8JZQAAuuGAU+hwAD9+v2gGnsggtTIyQKbtVIkJBOhQAAA" },
    { desktop: "/sites/0noxtackore/photos/hero-section/hero_ii.webp", mobile: "/sites/0noxtackore/photos/hero-section/mobile/hero_ii.webp", alt: "Dispositivos móviles sobre un fondo gris", blur: "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAkABUB8JZwAArMmYBuYgAD43oV2MQ7E+ZOFLreEezsjwJ+gAA==" },
    { desktop: "/sites/0noxtackore/photos/hero-section/hero_iii.webp", mobile: "/sites/0noxtackore/photos/hero-section/mobile/hero_iii.webp", alt: "Visor de realidad virtual y controles sobre un fondo oscuro", blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACQAQCdASoQAAkABUB8JZwAAhoFoAAA/vDfY8oYCaklGR9ik8/01eXqPjbPgcAA" },
    { desktop: "/sites/0noxtackore/photos/hero-section/hero_iv.webp", mobile: "/sites/0noxtackore/photos/hero-section/mobile/hero_iv.webp", alt: "Torre de ordenador con ventiladores RGB sobre un fondo oscuro", blur: "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAkABUB8JZwAAptpzAQAAP7uoTkaADb0bUv8NjHQhQAA" },
  ],
  areas: [
    { slug: "desarrollo-de-software", title: "Desarrollo de software", description: "Crear aplicaciones y herramientas que solucionen problemas cotidianos, técnicos y profesionales. Diseñamos cada solución pensando en su uso real, desde la primera idea hasta una versión que se mantiene y evoluciona con el tiempo.", image: "/sites/0noxtackore/photos/area-software.webp", icon: "code", blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoQAAkABUB8JYwAAqHJ01LwAP5i72HoXooRcbmexz526J+maCeoOAAA" },
    { slug: "ingenieria-open-source", title: "Ingeniería y evolución de proyectos open source", description: "Estudiar tecnologías existentes, adaptarlas, mejorarlas y distribuir versiones con valor añadido, respetando sus licencias y autores.", image: "/sites/0noxtackore/photos/area-opensource.webp", icon: "branch", blur: "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoQAAkABUB8JZQCw7EeXRIuCIAA/Zzehuh0dwkuC+pkRMPNLajGkyHpA2nz66qAAAA=" },
    { slug: "tecnologias-e-integraciones", title: "Tecnologías e integraciones", description: "Desarrollar herramientas, SDKs, sistemas e integraciones que faciliten el trabajo de desarrolladores y empresas.", image: "/sites/0noxtackore/photos/area-integrations.webp", icon: "plug", blur: "data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACQAQCdASoQAAkABUB8JYwCdADC5LAA/vDfemTiWm4Jtj34wAA=" },
    { slug: "productos-tecnologicos", title: "Productos tecnológicos", description: "Comercializar software, ofrecer versiones especializadas y construir soluciones sostenibles. Buscamos que cada producto tenga un propósito claro, una experiencia cuidada y un modelo que pueda mantenerse a largo plazo.", image: "/sites/0noxtackore/photos/area-products.webp", icon: "package", blur: "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoQAAkABUB8JQBOgBxbH6tAAP7qvFcB74lxhCcqQRiopj2AAAA=" },
    { slug: "recomendacion-y-afiliacion", title: "Recomendación y afiliación tecnológica", description: "Seleccionar y recomendar equipos informáticos evaluando sus características técnicas, rendimiento, calidad de construcción y relación calidad-precio. Analizamos modelos concretos para identificar alternativas que ofrezcan valor real a estudiantes, profesionales, entusiastas de la tecnología y empresas.", image: "/sites/0noxtackore/photos/area-recommendations.webp", icon: "laptop", blur: "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAkABUB8JZwAAn/eqmg4AP7ssS6uhk3ooFamAh9FhQAA" },
    { slug: "consultoria-tecnica", title: "Consultoría técnica y acompañamiento", description: "Analizamos necesidades, definimos la arquitectura adecuada y acompañamos a los equipos durante la implementación y evolución de sus soluciones.", image: "/sites/0noxtackore/photos/area-consultoria.webp", icon: "messages", blur: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAQCdASoQAAkABUB8JZQAAga16RUAAPzhs/tgqd2csXWH4e6X1Z7RNCWO8sAoAAA=" },
  ],
  philosophy: {
    paragraphs: [
      "No necesitamos inventar una tecnología completamente nueva cada vez. Podemos aprovechar los avances existentes, aprender de ellos y aportar mejoras que resuelvan necesidades reales.",
      "Creemos en la innovación responsable, la colaboración, la transparencia y la mejora continua.",
      "Nuestro objetivo no es crear tecnología por crearla, sino desarrollar y acercar soluciones que generen un impacto positivo.",
    ],
    statement: "Construimos tecnología con propósito.",
  },
  recommendation: {
    title: "Recomendación y afiliación tecnológica",
    paragraphs: [
      "Seleccionamos y recomendamos equipos informáticos mediante la evaluación de sus características técnicas, rendimiento, calidad de construcción y relación calidad-precio. Analizamos modelos concretos para identificar alternativas que ofrezcan valor real a estudiantes, profesionales, entusiastas de la tecnología y empresas, independientemente de su fabricante o procedencia.",
      "A través del marketing de afiliados, facilitamos el acceso a productos disponibles en plataformas comerciales y podemos recibir comisiones por compras elegibles. No actuamos como fabricantes ni vendedores directos de los equipos.",
    ],
    highlights: [
      "Modelo y generación del procesador",
      "Memoria RAM y ampliación",
      "Almacenamiento SSD",
      "Pantalla, batería y refrigeración",
      "Calidad de construcción",
      "Garantía y reputación del vendedor",
      "Precio y alternativas comparables",
    ],
  },
  values: [
    { title: "Innovación responsable", description: "Aprovechamos lo que ya existe, respetamos licencias y autores, y aportamos mejoras con criterio." },
    { title: "Colaboración", description: "Trabajamos con tecnologías propias y proyectos de código abierto para construir mediante la colaboración y el intercambio de conocimientos." },
    { title: "Mejora continua", description: "Transparencia y evolución constante: cada solución debe generar un impacto positivo real." },
  ],
  trust: [
    { title: "Independencia tecnológica", description: "Somos una compañía tecnológica independiente enfocada en la ingeniería, desarrollo y evolución de soluciones de software." },
    { title: "Código abierto con responsabilidad", description: "Estudiamos tecnologías existentes, las adaptamos y mejoramos, y distribuimos versiones con valor añadido respetando sus licencias y autores." },
    { title: "Transparencia comercial", description: "No actuamos como fabricantes ni vendedores directos de los equipos. Solo seleccionamos y recomendamos productos disponibles en plataformas comerciales." },
    { title: "Impacto y mejora continua", description: "Transparencia y evolución constante: cada solución debe generar un impacto positivo real. Construimos tecnología con propósito." },
  ],
  faqs: [
    { question: "¿Qué es 0NOXTACKORE?", answer: "0noxtackore es una compañía tecnológica independiente enfocada en la ingeniería, desarrollo y evolución de soluciones de software, así como en la selección y recomendación de productos tecnológicos." },
    { question: "¿En qué áreas de actividad trabajan?", answer: "Desarrollo de software, ingeniería y evolución de proyectos open source, tecnologías e integraciones, productos tecnológicos, recomendación y afiliación tecnológica, y consultoría técnica y acompañamiento." },
    { question: "¿Trabajan con proyectos de código abierto?", answer: "Estudiamos tecnologías existentes, las adaptamos y mejoramos, y distribuimos versiones con valor añadido, respetando siempre las licencias y reconociendo el trabajo de sus autores." },
    { question: "¿Venden equipos informáticos directamente?", answer: "No actuamos como fabricantes ni vendedores directos de los equipos. Solo seleccionamos y recomendamos productos disponibles en plataformas comerciales." },
    { question: "¿Cómo puedo contactar con 0NOXTACKORE?", answer: "Puedes encontrarnos en nuestro canal de YouTube (youtube.com/@0noxtackore), en Facebook (facebook.com/people/0noxtackore/61567098773222/) y en Instagram (instagram.com/0noxtackore.dev/)." },
  ],
  navLinks: [
    { label: "Inicio", href: localizedHref("es", "/") },
    { label: "Áreas de actividad", href: localizedHref("es", "/areas") },
    { label: "Filosofía", href: localizedHref("es", "/filosofia") },
    { label: "Recomendaciones", href: localizedHref("es", "/recomendaciones") },
  ],
  megaGroups: [
    { title: "Qué hacemos", links: [
      { label: "Desarrollo de software", href: localizedHref("es", "/areas/desarrollo-de-software") },
      { label: "Ingeniería open source", href: localizedHref("es", "/areas/ingenieria-open-source") },
      { label: "Tecnologías e integraciones", href: localizedHref("es", "/areas/tecnologias-e-integraciones") },
    ] },
    { title: "Soluciones", links: [
      { label: "Productos tecnológicos", href: localizedHref("es", "/areas/productos-tecnologicos") },
      { label: "Recomendación y afiliación", href: localizedHref("es", "/areas/recomendacion-y-afiliacion") },
      { label: "SDKs e integraciones", href: localizedHref("es", "/areas/tecnologias-e-integraciones") },
    ] },
    { title: "Compañía", links: [
      { label: "Proyectos y soluciones", href: localizedHref("es", "/proyectos") },
      { label: "Nuestra filosofía", href: localizedHref("es", "/filosofia") },
      { label: "Construimos con propósito", href: localizedHref("es", "/confianza") },
      { label: "Contacto", href: localizedHref("es", "/contacto") },
    ] },
  ],
  footerGroups: [
    { title: "Compañía", links: [
      { label: "Inicio", href: localizedHref("es", "/") },
      { label: "Áreas de actividad", href: localizedHref("es", "/areas") },
      { label: "Nuestra filosofía", href: localizedHref("es", "/filosofia") },
      { label: "Acerca de", href: localizedHref("es", "/acerca") },
    ] },
    { title: "Servicios", links: [
      { label: "Desarrollo de software", href: localizedHref("es", "/areas/desarrollo-de-software") },
      { label: "Ingeniería open source", href: localizedHref("es", "/areas/ingenieria-open-source") },
      { label: "Tecnologías e integraciones", href: localizedHref("es", "/areas/tecnologias-e-integraciones") },
    ] },
    { title: "Productos", links: [
      { label: "Productos tecnológicos", href: localizedHref("es", "/areas/productos-tecnologicos") },
      { label: "Recomendación y afiliación", href: localizedHref("es", "/recomendaciones") },
      { label: "Equipos y laptops", href: localizedHref("es", "/recomendaciones") },
    ] },
    { title: "Enlaces", links: [
      { label: "CREADO PARA IMPACTAR", href: localizedHref("es", "/") },
      { label: "Proyectos y soluciones", href: localizedHref("es", "/proyectos") },
      { label: "Construimos tecnología con propósito", href: localizedHref("es", "/confianza") },
      { label: "Contacto", href: localizedHref("es", "/contacto") },
    ] },
  ],
  // Add real testimonials here when available. Never fabricate them.
  testimonials: [],
  projects: [
    {
      name: "Fluxckore",
      description:
        "Utilidad ligera de limpieza y optimización para Windows: libera memoria y reduce los cuellos de botella del sistema con asignación dinámica de recursos.",
      status: "Activo",
      updated: "Nov 2026",
      tech: ["Python", "MIT"],
      url: "https://github.com/0noxtackore/Fluxckore",
    },
    {
      name: "Netckore",
      description:
        "Herramienta de diagnóstico y optimización de red para Windows: analiza la conectividad, resuelve problemas y monitoriza el rendimiento de la conexión.",
      status: "Activo",
      updated: "Nov 2026",
      tech: ["Python"],
      url: "https://github.com/0noxtackore/Netckore",
    },
    {
      name: "Aguickore",
      description:
        "Protocolo estándar de interacción agente-usuario: desacopla la lógica de tu agente de IA del frontend mediante streaming de eventos en tiempo real y sincronización de estado.",
      status: "Activo",
      updated: "Nov 2026",
      tech: ["TypeScript", "MIT"],
      url: "https://github.com/0noxtackore/Aguickore",
    },
    {
      name: "File-Host",
      description:
        "Aplicación web ligera de alojamiento y compartición de archivos en la nube, optimizada para un despliegue rápido.",
      status: "Activo",
      updated: "Sep 2026",
      tech: ["JavaScript", "MIT"],
      url: "https://github.com/0noxtackore/File-Host",
    },
    {
      name: "Ebenezer-Screen",
      description:
        "Aplicación web para el control de pantallas y la gestión de contenido multimedia, desplegada en Netlify.",
      status: "Estable",
      updated: "Ene 2026",
      tech: ["JavaScript"],
      url: "https://github.com/0noxtackore/Ebenezer-Screen",
    },
  ],
  ui: uiEs,
  share: {
    defaultText: "Construimos tecnología con propósito. Descubre qué hacemos en 0NOXTACKORE.",
    labels: { whatsapp: "WhatsApp", x: "X", linkedin: "LinkedIn", facebook: "Facebook", copy: "Copiar enlace", copied: "¡Enlace copiado!", shareOn: "Compartir en" },
  },
  pages: {
    guia: {
      title: "Cómo elegir una laptop con buena relación calidad-precio",
      description: "Guía práctica para evaluar procesador, memoria RAM, almacenamiento y batería antes de comprar una laptop, con criterios claros y sin promesas vacías.",
      kicker: "Recomendación tecnológica",
      readingTime: "Lectura de 4 min",
      tocTitle: "En esta guía",
      sections: [
        { id: "uso", title: "1. Empieza por tu uso real" },
        { id: "procesador", title: "2. Procesador: Intel Core i5/i7 o AMD Ryzen" },
        { id: "ram", title: "3. Memoria RAM: 16 GB como base" },
        { id: "pantalla", title: "4. Pantalla, almacenamiento y batería" },
        { id: "checklist", title: "5. Checklist antes de comprar" },
        { id: "criterios", title: "6. Cómo evaluamos las recomendaciones" },
      ],
      body: [
        "Antes de mirar cifras, define para qué necesitas el equipo: estudiar y ofimática, desarrollo de software, o diseño y edición. El mismo presupuesto rinde muy distinto según el caso, y comprar lo más potente casi nunca es la mejor decisión.",
        "Para la mayoría de tareas, un Core i5 o un Ryzen 5 actuales son más que suficientes. Los Core i7 y Ryzen 7 tienen sentido cuando compilas con frecuencia, usas máquinas virtuales o editas vídeo.",
        "Con 8 GB te quedas corto en cuanto multitareas. 16 GB es el punto dulce para desarrollo, navegación con muchas pestañas y herramientas modernas. Si tu trabajo es muy pesado, valora 32 GB.",
        "Un SSD NVMe marca más diferencia percibida que cualquier otro componente: busca al menos 512 GB. Prefiere paneles IPS y elige una batería acorde a cuántas horas estarás lejos del enchufe.",
      ],
      checklistIntro: "Una revisión rápida evita compras que no se ajustan a tu uso.",
      checklist: [
        "Uso principal definido (estudio, desarrollo o edición).",
        "Procesador Intel Core i5/i7 o AMD Ryzen equivalente.",
        "16 GB de RAM o más.",
        "SSD NVMe de 512 GB o más.",
        "Pantalla IPS y batería acorde a tu movilidad.",
        "Garantía clara y vendedor de confianza.",
      ],
      criteriaIntro: "No actuamos como fabricantes ni vendedores directos de los equipos. Solo seleccionamos y recomendamos productos disponibles en plataformas comerciales, evaluando sus especificaciones técnicas, rendimiento y relación calidad-precio. Si compras a través de enlaces de afiliación podemos recibir una comisión, sin coste adicional para ti.",
      criteriaNote: "Transparencia: nuestra recomendación depende de criterios técnicos, no de qué producto nos deje mayor comisión.",
      storeTitle: "Próximamente: tienda de equipos seleccionados",
      storeText: "Estamos preparando una sección para que puedas ver directamente los equipos que cumplen estos criterios. Mientras tanto, puedes seguirnos para enterarte del lanzamiento.",
      storeCta: "Ver recomendaciones en la web",
      shareHeading: "¿Te sirvió la guía? Compártela",
      shareText: "Puede ayudar a alguien que está a punto de comprar un equipo y no sabe por dónde empezar.",
      back: "← Volver al inicio",
      captions: {},
    },
    acerca: {
      title: "Acerca de 0NOXTACKORE",
      description: "Conoce a 0NOXTACKORE: estudio tecnológico indie y arquitectura de software de alto rendimiento. Quién hay detrás, qué construimos y nuestros canales oficiales.",
      kicker: "Sobre la marca",
      lead: "Un estudio tecnológico independiente y una marca construida desde cero, con una sola persona al frente: diseñar, programar y liderar al mismo tiempo.",
      back: "← Volver al inicio",
      tocTitle: "En esta página",
      toc: [
        { label: "Por qué confiar en la marca", href: localizedHref("es", "/#confianza") },
        { label: "Preguntas frecuentes", href: localizedHref("es", "/#faq") },
        { label: "Guía para elegir una laptop", href: localizedHref("es", "/guia") },
      ],
      whoTitle: "Quién hay detrás",
      whoParagraphs: [
        "0noxtackore es un estudio tecnológico indie fundado por un único desarrollador con una visión clara: una persona que lidera, programa y diseña al mismo tiempo. Como arquitecto de software, el foco está en construir sistemas de alto rendimiento desde la base, priorizando la escalabilidad y una ingeniería limpia.",
        "Esta web es el hogar oficial de la marca: aquí reunimos lo que hacemos, nuestra filosofía y los productos y proyectos que desarrollamos. La tecnología con propósito no es un eslogan: es la forma en que abordamos cada proyecto.",
      ],
      buildTitle: "Qué construimos",
      buildIntro: "Parte de nuestro trabajo son productos y proyectos de código abierto que ya están disponibles públicamente:",
      projects: [
        { name: "Fluxckore", description: "Utilidad de limpieza y optimización para Windows, construida con una interfaz ligera y sin dependencias pesadas.", url: "https://github.com/0noxtackore/Fluxckore" },
        { name: "Netckore", description: "Herramienta de diagnóstico y reparación de conexión a internet, con interfaz autónoma y soporte multilenguaje.", url: "https://github.com/0noxtackore/Netckore" },
        { name: "Aguickore", description: "Protocolo y ecosistema de SDK para conectar agentes de IA con aplicaciones, mantenido como una evolución hardening de AG-UI.", url: "https://github.com/0noxtackore/Aguickore" },
        { name: "Ebenezer-Screen", description: "Aplicación web para el control de pantallas y gestión de contenido multimedia, desplegada en Netlify.", url: "https://github.com/0noxtackore/Ebenezer-Screen" },
        { name: "File-Host", description: "Aplicación ligera de alojamiento y compartición de archivos en la nube, optimizada para despliegue rápido.", url: "https://github.com/0noxtackore/File-Host" },
      ],
      philosophyTitle: "Filosofía",
      philosophyText: "No necesitamos inventar una tecnología completamente nueva cada vez. Aprovechamos los avances existentes, aprendemos de ellos y aportamos mejoras que resuelven necesidades reales, respetando siempre licencias y autores. Innovación responsable, colaboración, transparencia y mejora continua.",
      officialTitle: "Presencia oficial",
      officialText: "Puedes encontrarnos y seguir nuestro trabajo en estos canales oficiales:",
    },
  },
  ogImage: "/sites/0noxtackore/og/og-en.jpg",
  metadata: {
    home: {
      title: "0NOXTACKORE: software a medida, open source y consultoría",
      description: "0NOXTACKORE: desarrollo de software, ingeniería open source, integraciones, consultoría y recomendación de laptops. Construimos tecnología con propósito.",
    },
    guia: { title: "Guía para elegir una laptop con buena relación calidad-precio", description: "Guía práctica para evaluar procesador, memoria RAM, almacenamiento y batería antes de comprar una laptop." },
    acerca: { title: "Acerca de 0NOXTACKORE", description: "Conoce a 0NOXTACKORE: estudio tecnológico indie y arquitectura de software de alto rendimiento." },
  },
};

const en: Content = {
  locale: "en",
  baseUrl: `${siteUrl}/en`,
  brand: {
    name: "0NOXTACKORE",
    tagline: "BUILT FOR IMPACT",
    heroEyebrow: "TECHNOLOGY WITH SOUL",
    intro:
      "0noxtackore is an independent technology company focused on the engineering, development and evolution of software solutions, as well as the selection and recommendation of technology products.",
    approach:
      "We work with our own technologies and open-source projects to build tools, applications and integrations that solve real problems, improve processes and make technology more accessible and useful.",
  },
  heroSlides: [
    { desktop: "/sites/0noxtackore/photos/hero-section/hero_i.webp", mobile: "/sites/0noxtackore/photos/hero-section/mobile/hero_i.webp", alt: "Laptop displaying a three-dimensional sculpture", blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoQAAkABUB8JZQAAuuGAU+hwAD9+v2gGnsggtTIyQKbtVIkJBOhQAAA" },
    { desktop: "/sites/0noxtackore/photos/hero-section/hero_ii.webp", mobile: "/sites/0noxtackore/photos/hero-section/mobile/hero_ii.webp", alt: "Mobile devices on a gray background", blur: "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAkABUB8JZwAArMmYBuYgAD43oV2MQ7E+ZOFLreEezsjwJ+gAA==" },
    { desktop: "/sites/0noxtackore/photos/hero-section/hero_iii.webp", mobile: "/sites/0noxtackore/photos/hero-section/mobile/hero_iii.webp", alt: "Virtual reality headset and controllers on a dark background", blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACQAQCdASoQAAkABUB8JZwAAhoFoAAA/vDfY8oYCaklGR9ik8/01eXqPjbPgcAA" },
    { desktop: "/sites/0noxtackore/photos/hero-section/hero_iv.webp", mobile: "/sites/0noxtackore/photos/hero-section/mobile/hero_iv.webp", alt: "Computer tower with RGB fans on a dark background", blur: "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAkABUB8JZwAAptpzAQAAP7uoTkaADb0bUv8NjHQhQAA" },
  ],
  areas: [
    { slug: "desarrollo-de-software", title: "Software development", description: "Building applications and tools that solve everyday, technical and professional problems. We design every solution with its real use in mind, from the first idea to a version that is maintained and evolves over time.", image: "/sites/0noxtackore/photos/area-software.webp", icon: "code", blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoQAAkABUB8JYwAAqHJ01LwAP5i72HoXooRcbmexz526J+maCeoOAAA" },
    { slug: "ingenieria-open-source", title: "Open-source engineering and evolution", description: "Studying existing technologies, adapting and improving them, and distributing versions with added value while respecting their licenses and authors.", image: "/sites/0noxtackore/photos/area-opensource.webp", icon: "branch", blur: "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoQAAkABUB8JZQCw7EeXRIuCIAA/Zzehuh0dwkuC+pkRMPNLajGkyHpA2nz66qAAAA=" },
    { slug: "tecnologias-e-integraciones", title: "Technologies and integrations", description: "Developing tools, SDKs, systems and integrations that make the work of developers and companies easier.", image: "/sites/0noxtackore/photos/area-integrations.webp", icon: "plug", blur: "data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACQAQCdASoQAAkABUB8JYwCdADC5LAA/vDfemTiWm4Jtj34wAA=" },
    { slug: "productos-tecnologicos", title: "Technology products", description: "Commercializing software, offering specialized versions and building sustainable solutions. We want every product to have a clear purpose, a carefully crafted experience and a model that can last.", image: "/sites/0noxtackore/photos/area-products.webp", icon: "package", blur: "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoQAAkABUB8JQBOgBxbH6tAAP7qvFcB74lxhCcqQRiopj2AAAA=" },
    { slug: "recomendacion-y-afiliacion", title: "Technology recommendation and affiliation", description: "Selecting and recommending computer equipment by evaluating its technical specifications, performance, build quality and value for money. We analyze specific models to identify alternatives that offer real value to students, professionals, technology enthusiasts and businesses.", image: "/sites/0noxtackore/photos/area-recommendations.webp", icon: "laptop", blur: "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAkABUB8JZwAAn/eqmg4AP7ssS6uhk3ooFamAh9FhQAA" },
    { slug: "consultoria-tecnica", title: "Technical consulting and support", description: "We analyze needs, define the right architecture and support teams throughout the implementation and evolution of their solutions.", image: "/sites/0noxtackore/photos/area-consultoria.webp", icon: "messages", blur: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAQCdASoQAAkABUB8JZQAAga16RUAAPzhs/tgqd2csXWH4e6X1Z7RNCWO8sAoAAA=" },
  ],
  philosophy: {
    paragraphs: [
      "We don't need to invent a completely new technology every time. We can build on existing advances, learn from them and contribute improvements that solve real needs.",
      "We believe in responsible innovation, collaboration, transparency and continuous improvement.",
      "Our goal is not to create technology for its own sake, but to develop and deliver solutions that generate a positive impact.",
    ],
    statement: "We build technology with purpose.",
  },
  recommendation: {
    title: "Technology recommendation and affiliation",
    paragraphs: [
      "We select and recommend computer equipment by evaluating its technical specifications, performance, build quality and value for money. We analyze specific models to identify alternatives that offer real value to students, professionals, technology enthusiasts and businesses, regardless of their manufacturer or origin.",
      "Through affiliate marketing, we make it easier to access products available on commercial platforms and may earn commissions on eligible purchases. We are not the manufacturers or direct sellers of those devices.",
    ],
    highlights: [
      "Processor model and generation",
      "Memory RAM and expandability",
      "SSD storage",
      "Screen, battery and cooling",
      "Build quality",
      "Warranty and seller reputation",
      "Price and comparable alternatives",
    ],
  },
  values: [
    { title: "Responsible innovation", description: "We build on what already exists, respect licenses and authors, and contribute improvements with sound judgment." },
    { title: "Collaboration", description: "We work with our own technologies and open-source projects to build in community." },
    { title: "Continuous improvement", description: "Transparency and constant evolution: every solution should generate a real positive impact." },
  ],
  trust: [
    { title: "Technological independence", description: "We are an independent technology company focused on the engineering, development and evolution of software solutions." },
    { title: "Responsible open source", description: "We study existing technologies, adapt and improve them, and distribute versions with added value while respecting their licenses and authors." },
    { title: "Commercial transparency", description: "We are not the manufacturers or direct sellers of the devices. We only select and recommend products available on commercial platforms." },
    { title: "Impact and continuous improvement", description: "Transparency and constant evolution: every solution should generate a real positive impact. We build technology with purpose." },
  ],
  faqs: [
    { question: "What is 0NOXTACKORE?", answer: "0noxtackore is an independent technology company focused on the engineering, development and evolution of software solutions, as well as the selection and recommendation of technology products." },
    { question: "What areas of activity do you cover?", answer: "Software development, open-source engineering and evolution, technologies and integrations, technology products, technology recommendation and affiliation, and technical consulting and support." },
    { question: "Do you work with open-source projects?", answer: "We study existing technologies, adapt and improve them, and distribute versions with added value while respecting their licenses and authors." },
    { question: "Do you sell computer equipment directly?", answer: "We are not the manufacturers or direct sellers of the devices. We only select and recommend products available on commercial platforms." },
    { question: "How can I contact 0NOXTACKORE?", answer: "You can find us on our YouTube channel (youtube.com/@0noxtackore), on Facebook (facebook.com/people/0noxtackore/61567098773222/) and on Instagram (instagram.com/0noxtackore.dev/)." },
  ],
  navLinks: [
    { label: "Home", href: localizedHref("en", "/") },
    { label: "Areas of activity", href: localizedHref("en", "/areas") },
    { label: "Philosophy", href: localizedHref("en", "/filosofia") },
    { label: "Recommendations", href: localizedHref("en", "/recomendaciones") },
  ],
  megaGroups: [
    { title: "What we do", links: [
      { label: "Software development", href: localizedHref("en", "/areas/desarrollo-de-software") },
      { label: "Open-source engineering", href: localizedHref("en", "/areas/ingenieria-open-source") },
      { label: "Technologies and integrations", href: localizedHref("en", "/areas/tecnologias-e-integraciones") },
    ] },
    { title: "Solutions", links: [
      { label: "Technology products", href: localizedHref("en", "/areas/productos-tecnologicos") },
      { label: "Recommendation and affiliation", href: localizedHref("en", "/areas/recomendacion-y-afiliacion") },
      { label: "SDKs and integrations", href: localizedHref("en", "/areas/tecnologias-e-integraciones") },
    ] },
    { title: "Company", links: [
      { label: "Projects and solutions", href: localizedHref("en", "/proyectos") },
      { label: "Our philosophy", href: localizedHref("en", "/filosofia") },
      { label: "Built with purpose", href: localizedHref("en", "/confianza") },
      { label: "Contact", href: localizedHref("en", "/contacto") },
    ] },
  ],
  footerGroups: [
    { title: "Company", links: [
      { label: "Home", href: localizedHref("en", "/") },
      { label: "Areas of activity", href: localizedHref("en", "/areas") },
      { label: "Our philosophy", href: localizedHref("en", "/filosofia") },
      { label: "About", href: localizedHref("en", "/acerca") },
    ] },
    { title: "Services", links: [
      { label: "Software development", href: localizedHref("en", "/areas/desarrollo-de-software") },
      { label: "Open-source engineering", href: localizedHref("en", "/areas/ingenieria-open-source") },
      { label: "Technologies and integrations", href: localizedHref("en", "/areas/tecnologias-e-integraciones") },
    ] },
    { title: "Products", links: [
      { label: "Technology products", href: localizedHref("en", "/areas/productos-tecnologicos") },
      { label: "Recommendation and affiliation", href: localizedHref("en", "/recomendaciones") },
      { label: "Devices and laptops", href: localizedHref("en", "/recomendaciones") },
    ] },
    { title: "Links", links: [
      { label: "BUILT FOR IMPACT", href: localizedHref("en", "/") },
      { label: "Projects and solutions", href: localizedHref("en", "/proyectos") },
      { label: "We build technology with purpose", href: localizedHref("en", "/confianza") },
      { label: "Contact", href: localizedHref("en", "/contacto") },
    ] },
  ],
  testimonials: [],
  projects: [
    {
      name: "Fluxckore",
      description:
        "Lightweight Windows cleanup and optimization utility: frees memory and reduces system bottlenecks with dynamic resource allocation.",
      status: "Active",
      updated: "Nov 2026",
      tech: ["Python", "MIT"],
      url: "https://github.com/0noxtackore/Fluxckore",
    },
    {
      name: "Netckore",
      description:
        "Windows network diagnostics and optimization tool: analyzes connectivity, troubleshoots issues and monitors connection performance.",
      status: "Active",
      updated: "Nov 2026",
      tech: ["Python"],
      url: "https://github.com/0noxtackore/Netckore",
    },
    {
      name: "Aguickore",
      description:
        "Standard agent-user interaction protocol: decouples your AI agent logic from the frontend through real-time event streaming and state synchronization.",
      status: "Active",
      updated: "Nov 2026",
      tech: ["TypeScript", "MIT"],
      url: "https://github.com/0noxtackore/Aguickore",
    },
    {
      name: "File-Host",
      description:
        "Lightweight cloud file hosting and sharing web application, optimized for fast deployment.",
      status: "Active",
      updated: "Sep 2026",
      tech: ["JavaScript", "MIT"],
      url: "https://github.com/0noxtackore/File-Host",
    },
    {
      name: "Ebenezer-Screen",
      description:
        "Web application for screen control and multimedia content management, deployed on Netlify.",
      status: "Stable",
      updated: "Jan 2026",
      tech: ["JavaScript"],
      url: "https://github.com/0noxtackore/Ebenezer-Screen",
    },
  ],
  ui: uiEn,
  share: {
    defaultText: "We build technology with purpose. Discover what we do at 0NOXTACKORE.",
    labels: { whatsapp: "WhatsApp", x: "X", linkedin: "LinkedIn", facebook: "Facebook", copy: "Copy link", copied: "Link copied!", shareOn: "Share on" },
  },
  pages: {
    guia: {
      title: "How to choose a laptop with good value for money",
      description: "A practical guide to evaluating processor, RAM, storage and battery before buying a laptop, with clear criteria and no empty promises.",
      kicker: "Technology recommendation",
      readingTime: "4 min read",
      tocTitle: "In this guide",
      sections: [
        { id: "uso", title: "1. Start with your real use case" },
        { id: "procesador", title: "2. Processor: Intel Core i5/i7 or AMD Ryzen" },
        { id: "ram", title: "3. RAM: 16 GB as a baseline" },
        { id: "pantalla", title: "4. Screen, storage and battery" },
        { id: "checklist", title: "5. Checklist before buying" },
        { id: "criterios", title: "6. How we evaluate recommendations" },
      ],
      body: [
        "Before looking at numbers, define what you need the device for: studying and office work, software development, or design and editing. The same budget performs very differently depending on the case, and buying the most powerful option is almost never the best decision.",
        "For most tasks, a current Core i5 or Ryzen 5 is more than enough. Core i7 and Ryzen 7 make sense when you compile frequently, use virtual machines or edit video.",
        "With 8 GB you will run short as soon as you multitask. 16 GB is the sweet spot for development, browsing with many tabs and modern tools. If your work is very demanding, consider 32 GB.",
        "An NVMe SSD makes more perceivable difference than any other component: look for at least 512 GB. Prefer IPS panels and choose a battery that matches how many hours you will be away from a plug.",
      ],
      checklistIntro: "A quick review prevents purchases that don't fit your use case.",
      checklist: [
        "Main use defined (study, development or editing).",
        "Intel Core i5/i7 processor or equivalent AMD Ryzen.",
        "16 GB of RAM or more.",
        "512 GB NVMe SSD or more.",
        "IPS screen and battery suited to your mobility.",
        "Clear warranty and trustworthy seller.",
      ],
      criteriaIntro: "We are not the manufacturers or direct sellers of the devices. We only select and recommend products available on commercial platforms, evaluating their technical specifications, performance and value for money. If you buy through affiliate links we may earn a commission, at no extra cost to you.",
      criteriaNote: "Transparency: our recommendation depends on technical criteria, not on which product pays the highest commission.",
      storeTitle: "Coming soon: store with selected devices",
      storeText: "We are preparing a section where you can directly see the devices that meet these criteria. In the meantime, follow us to hear about the launch.",
      storeCta: "See recommendations on the site",
      shareHeading: "Did the guide help? Share it",
      shareText: "It may help someone who is about to buy a device and doesn't know where to start.",
      back: "← Back to home",
      captions: {
        hero: "We evaluate real specifications, not just the design of the device.",
        display: "The screen and graphics performance matter as much as the processor.",
        checklist: "A quick review prevents purchases that don't fit your use case.",
      },
    },
    acerca: {
      title: "About 0NOXTACKORE",
      description: "Meet 0NOXTACKORE: an indie technology studio and high-performance software architecture. Who is behind it, what we build and our official channels.",
      kicker: "About the brand",
      lead: "An independent technology studio and a brand built from scratch, with one person at the helm: designing, coding and leading at the same time.",
      back: "← Back to home",
      tocTitle: "On this page",
      toc: [
        { label: "Why trust the brand", href: localizedHref("en", "/#confianza") },
        { label: "Frequently asked questions", href: localizedHref("en", "/#faq") },
        { label: "Laptop buying guide", href: localizedHref("en", "/guia") },
      ],
      whoTitle: "Who is behind it",
      whoParagraphs: [
        "0noxtackore is an indie technology studio founded by a single developer with a clear vision: one person who leads, codes and designs at the same time. As a software architect, the focus is on building high-performance systems from the ground up, prioritizing scalability and clean engineering.",
        "This site is the official home of the brand: here we bring together what we do, our philosophy and the products and projects we develop. Technology with purpose is not a slogan: it is how we approach every project.",
      ],
      buildTitle: "What we build",
      buildIntro: "Part of our work consists of products and open-source projects that are already publicly available:",
      projects: [
        { name: "Fluxckore", description: "Windows cleaning and optimization utility, built with a lightweight interface and no heavy dependencies.", url: "https://github.com/0noxtackore/Fluxckore" },
        { name: "Netckore", description: "Internet connection diagnostics and repair tool, with a standalone interface and multi-language support.", url: "https://github.com/0noxtackore/Netckore" },
        { name: "Aguickore", description: "Protocol and SDK ecosystem for connecting AI agents to applications, maintained as a hardened evolution of AG-UI.", url: "https://github.com/0noxtackore/Aguickore" },
        { name: "Ebenezer-Screen", description: "Web application for screen control and multimedia content management, deployed on Netlify.", url: "https://github.com/0noxtackore/Ebenezer-Screen" },
        { name: "File-Host", description: "Lightweight cloud file hosting and sharing application, optimized for fast deployment.", url: "https://github.com/0noxtackore/File-Host" },
      ],
      philosophyTitle: "Philosophy",
      philosophyText: "We don't need to invent a completely new technology every time. We build on existing advances, learn from them and contribute improvements that solve real needs, always respecting licenses and authors. Responsible innovation, collaboration, transparency and continuous improvement.",
      officialTitle: "Official presence",
      officialText: "You can find us and follow our work on these official channels:",
    },
  },
  ogImage: "/sites/0noxtackore/og/og-en.jpg",
  metadata: {
    home: {
      title: "0NOXTACKORE: Custom software, open source and consulting",
      description: "0NOXTACKORE: software development, open-source engineering, integrations, consulting and laptop recommendations. We build technology with purpose.",
    },
    guia: { title: "How to choose a laptop with good value for money", description: "A practical guide to evaluating processor, RAM, storage and battery before buying a laptop." },
    acerca: { title: "About 0NOXTACKORE", description: "Meet 0NOXTACKORE: an indie technology studio and high-performance software architecture." },
  },
};

export function getContent(locale: Locale): Content {
  return locale === "en" ? en : es;
}
