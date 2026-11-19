import { withBasePath } from "@/lib/basePath";

export type Area = {
  title: string;
  description: string;
  image: string;
  icon: "code" | "branch" | "plug" | "package" | "laptop" | "messages";
  blur: string;
};

export type HeroSlide = {
  desktop: string;
  mobile: string;
  alt: string;
  blur: string;
};

export const heroSlides: HeroSlide[] = [
  {
    desktop: withBasePath("/sites/0noxtackore/photos/hero-section/hero_i.webp"),
    mobile: withBasePath("/sites/0noxtackore/photos/hero-section/mobile/hero_i.webp"),
    alt: "Portátil con una escultura tridimensional en pantalla",
    blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoQAAkABUB8JZQAAuuGAU+hwAD9+v2gGnsggtTIyQKbtVIkJBOhQAAA",
  },
  {
    desktop: withBasePath("/sites/0noxtackore/photos/hero-section/hero_ii.webp"),
    mobile: withBasePath("/sites/0noxtackore/photos/hero-section/mobile/hero_ii.webp"),
    alt: "Dispositivos móviles sobre un fondo gris",
    blur: "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAkABUB8JZwAArMmYBuYgAD43oV2MQ7E+ZOFLreEezsjwJ+gAA==",
  },
  {
    desktop: withBasePath("/sites/0noxtackore/photos/hero-section/hero_iii.webp"),
    mobile: withBasePath("/sites/0noxtackore/photos/hero-section/mobile/hero_iii.webp"),
    alt: "Visor de realidad virtual y controles sobre un fondo oscuro",
    blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACQAQCdASoQAAkABUB8JZwAAhoFoAAA/vDfY8oYCaklGR9ik8/01eXqPjbPgcAA",
  },
  {
    desktop: withBasePath("/sites/0noxtackore/photos/hero-section/hero_iv.webp"),
    mobile: withBasePath("/sites/0noxtackore/photos/hero-section/mobile/hero_iv.webp"),
    alt: "Torre de ordenador con ventiladores RGB sobre un fondo oscuro",
    blur: "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAkABUB8JZwAAptpzAQAAP7uoTkaADb0bUv8NjHQhQAA",
  },
];

export const brand = {
  name: "0NOXTACKORE",
  tagline: "BUILT FOR IMPACT",
  heroEyebrow: "TECNOLOGÍA CON ALMA",
  intro:
    "0noxtackore es una compañía tecnológica independiente enfocada en la ingeniería, desarrollo y evolución de soluciones de software, así como en la selección y recomendación de productos tecnológicos.",
  approach:
    "Trabajamos con tecnologías propias y proyectos de código abierto para construir herramientas, aplicaciones e integraciones que resuelvan problemas reales, mejoren procesos y hagan que la tecnología sea más accesible y útil.",
};

export const areas: Area[] = [
  {
    title: "Desarrollo de software",
    description:
      "Crear aplicaciones y herramientas que solucionen problemas cotidianos, técnicos y profesionales.",
    image: withBasePath("/sites/0noxtackore/photos/area-software.webp"),
    icon: "code",
    blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoQAAkABUB8JYwAAqHJ01LwAP5i72HoXooRcbmexz526J+maCeoOAAA",
  },
  {
    title: "Ingeniería y evolución de proyectos open source",
    description:
      "Estudiar tecnologías existentes, adaptarlas, mejorarlas y distribuir versiones con valor añadido, respetando sus licencias y autores.",
    image: withBasePath("/sites/0noxtackore/photos/area-opensource.webp"),
    icon: "branch",
    blur: "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoQAAkABUB8JZQCw7EeXRIuCIAA/Zzehuh0dwkuC+pkRMPNLajGkyHpA2nz66qAAAA=",
  },
  {
    title: "Tecnologías e integraciones",
    description:
      "Desarrollar herramientas, SDK, sistemas e integraciones que faciliten el trabajo de desarrolladores y empresas.",
    image: withBasePath("/sites/0noxtackore/photos/area-integrations.webp"),
    icon: "plug",
    blur: "data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACQAQCdASoQAAkABUB8JYwCdADC5LAA/vDfemTiWm4Jtj34wAA=",
  },
  {
    title: "Productos tecnológicos",
    description:
      "Comercializar software, ofrecer versiones especializadas y construir soluciones sostenibles.",
    image: withBasePath("/sites/0noxtackore/photos/area-products.webp"),
    icon: "package",
    blur: "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoQAAkABUB8JQBOgBxbH6tAAP7qvFcB74lxhCcqQRiopj2AAAA=",
  },
  {
    title: "Recomendación y afiliación tecnológica",
    description:
      "Seleccionar y recomendar equipos informáticos, especialmente laptops de fabricantes y proveedores chinos, evaluando sus especificaciones técnicas, rendimiento y relación calidad-precio.",
    image: withBasePath("/sites/0noxtackore/photos/area-recommendations.webp"),
    icon: "laptop",
    blur: "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAkABUB8JZwAAn/eqmg4AP7ssS6uhk3ooFamAh9FhQAA",
  },
  {
    title: "Consultoría técnica y acompañamiento",
    description:
      "Analizamos necesidades, definimos la arquitectura adecuada y acompañamos a los equipos durante la implementación y evolución de sus soluciones.",
    image: withBasePath("/sites/0noxtackore/photos/area-consultoria.webp"),
    icon: "messages",
    blur: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAQCdASoQAAkABUB8JZQAAga16RUAAPzhs/tgqd2csXWH4e6X1Z7RNCWO8sAoAAA=",
  },
];

export const philosophy = {
  paragraphs: [
    "No necesitamos inventar una tecnología completamente nueva cada vez. Podemos aprovechar los avances existentes, aprender de ellos y aportar mejoras que resuelvan necesidades reales.",
    "Creemos en la innovación responsable, la colaboración, la transparencia y la mejora continua.",
    "Nuestro objetivo no es crear tecnología por crearla, sino desarrollar y acercar soluciones que generen un impacto positivo.",
  ],
  statement: "Construimos tecnología con propósito.",
};

export const recommendation = {
  title: "Recomendación y afiliación tecnológica",
  paragraphs: [
    "Esta área busca acercar alternativas tecnológicas a entusiastas del software, estudiantes, profesionales y pequeños distribuidores interesados en equipos con características competitivas, como procesadores Intel Core i5/i7 o AMD Ryzen y configuraciones de 16 GB de RAM.",
    "A través del marketing de afiliados, facilitamos el acceso a productos disponibles en plataformas comerciales, obteniendo comisiones por compras elegibles. No actuamos como fabricantes ni vendedores directos de esos equipos.",
  ],
  highlights: ["Intel Core i5 / i7", "AMD Ryzen", "16 GB de RAM", "Relación calidad-precio"],
};

export const values = [
  {
    title: "Innovación responsable",
    description:
      "Aprovechamos lo que ya existe, respetamos licencias y autores, y aportamos mejoras con criterio.",
  },
  {
    title: "Colaboración",
    description:
      "Trabajamos con tecnologías propias y proyecto de código abierto para construir en comunidad.",
  },
  {
    title: "Mejora continua",
    description:
      "Transparencia y evolución constante: cada solución debe generar un impacto positivo real.",
  },
];

export const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Áreas de actividad", href: "#areas" },
  { label: "Filosofía", href: "#filosofia" },
  { label: "Recomendaciones", href: "#recomendaciones" },
];

export const megaGroups = [
  {
    title: "Qué hacemos",
    links: [
      { label: "Desarrollo de software", href: "#areas" },
      { label: "Ingeniería open source", href: "#areas" },
      { label: "Tecnologías e integraciones", href: "#areas" },
    ],
  },
  {
    title: "Soluciones",
    links: [
      { label: "Productos tecnológicos", href: "#areas" },
      { label: "Recomendación y afiliación", href: "#recomendaciones" },
      { label: "SDK e integraciones", href: "#areas" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Nuestra filosofía", href: "#filosofia" },
      { label: "Construimos con propósito", href: "#filosofia" },
      { label: "Contacto", href: "#contacto" },
    ],
  },
];

export const footerGroups = [
  {
    title: "Compañía",
    links: [
      { label: "Inicio", href: "#inicio" },
      { label: "Áreas de actividad", href: "#areas" },
      { label: "Nuestra filosofía", href: "#filosofia" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Desarrollo de software", href: "#areas" },
      { label: "Ingeniería open source", href: "#areas" },
      { label: "Tecnologías e integraciones", href: "#areas" },
    ],
  },
  {
    title: "Productos",
    links: [
      { label: "Productos tecnológicos", href: "#areas" },
      { label: "Recomendación y afiliación", href: "#recomendaciones" },
      { label: "Equipos y laptops", href: "#recomendaciones" },
    ],
  },
  {
    title: "Enlaces",
    links: [
      { label: "BUILT FOR IMPACT", href: "#inicio" },
      { label: "Construimos tecnología con propósito", href: "#filosofia" },
      { label: "Contacto", href: "#contacto" },
    ],
  },
];
