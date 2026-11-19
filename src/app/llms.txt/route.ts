import { siteUrl } from "@/components/sites/0noxtackore/data";

const content = `# 0NOXTACKORE

> Compañía tecnológica independiente enfocada en la ingeniería, desarrollo y evolución de soluciones de software, y en la selección y recomendación de productos tecnológicos. BUILT FOR IMPACT.

0NOXTACKORE construye tecnología con propósito. Trabajamos con tecnologías propias y proyectos de código abierto para crear herramientas, aplicaciones e integraciones que resuelven problemas reales, respetando licencias y autores. También seleccionamos y recomendamos equipos informáticos evaluando especificaciones técnicas, rendimiento y relación calidad-precio, sin actuar como fabricantes ni vendedores directos.

## Áreas de actividad

- Desarrollo de software: aplicaciones y herramientas para problemas cotidianos, técnicos y profesionales.
- Ingeniería y evolución de proyectos open source: adaptar, mejorar y distribuir versiones con valor añadido respetando licencias y autores.
- Tecnologías e integraciones: herramientas, SDK, sistemas e integraciones para desarrolladores y empresas.
- Productos tecnológicos: software, versiones especializadas y soluciones sostenibles.
- Recomendación y afiliación tecnológica: laptops y equipos evaluados por especificaciones, rendimiento y calidad-precio.
- Consultoría técnica y acompañamiento: análisis de necesidades, arquitectura e implementación.

## Páginas principales

- [Inicio](${siteUrl}/):Areas de actividad, filosofía, recomendaciones, valores y contacto.
- [Guía para elegir una laptop](${siteUrl}/guia): criterios de procesador, memoria RAM, almacenamiento y checklist de compra.

## Filosofía

No necesitamos inventar una tecnología completamente nueva cada vez. Aprovechamos los avances existentes, aprendemos de ellos y aportamos mejoras que resuelven necesidades reales. Innovación responsable, colaboración, transparencia y mejora continua.

## Contacto

Facebook: https://www.facebook.com/people/0noxtackore/61567098773222/
Instagram: https://www.instagram.com/0noxtackore.dev/
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
