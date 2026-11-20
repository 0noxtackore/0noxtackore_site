import { siteUrl } from "@/components/sites/0noxtackore/data";

const content = `# 0NOXTACKORE

> Independent technology company focused on software engineering, development and evolution, and the recommendation of technology products. BUILT FOR IMPACT / CREADO PARA IMPACTAR.

## Español

0NOXTACKORE construye tecnología con propósito. Trabajamos con tecnologías propias y proyectos de código abierto para crear herramientas, aplicaciones e integraciones que resuelven problemas reales, respetando licencias y autores.

- [Inicio](${siteUrl}/es)
- [Guía para elegir una laptop](${siteUrl}/es/guia)
- [Acerca de](${siteUrl}/es/acerca)

## English

0NOXTACKORE builds technology with purpose. We work with our own technologies and open-source projects to create tools, applications and integrations that solve real problems, respecting licenses and authors.

- [Home](${siteUrl}/en)
- [Laptop buying guide](${siteUrl}/en/guia)
- [About](${siteUrl}/en/acerca)

## Áreas de actividad / Areas of activity

- Software development
- Open-source engineering and evolution
- Technologies and integrations
- Technology products
- Technology recommendation and affiliation
- Technical consulting and support

## Contacto / Contact

GitHub: https://github.com/0noxtackore
YouTube: https://www.youtube.com/@0noxtackore
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
