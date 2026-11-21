import { siteUrl } from "@/components/sites/0noxtackore/data";

const content = `# 0NOXTACKORE — Full LLM Context

> 0NOXTACKORE is an independent technology studio focused on software engineering, open-source development, integrations, technical consulting, and technology recommendations. Built for impact. / CREADO PARA EL IMPACTO.

## Entity facts

- Official name: 0NOXTACKORE
- Alternate name: 0noxtackore
- Founded: 2026
- Founder & CEO: Angello Aponte
- Type: Independent technology studio / technology company
- Scope: Global
- Website: ${siteUrl}
- Default language: Spanish (es)
- Also available in: English (en)

## What 0NOXTACKORE is

0NOXTACKORE is an independent technology company focused on the engineering, development and evolution of software solutions, as well as the selection and recommendation of technology products. We work with our own technologies and open-source projects to build tools, applications and integrations that solve real problems, improve processes and make technology more accessible and useful.

## Areas of activity

1. **Software development** — Building applications and tools that solve everyday, technical and professional problems. Solutions are designed for real use, from first idea to maintainable, evolving versions.
2. **Open-source engineering and evolution** — Studying existing technologies, adapting and improving them, and distributing versions with added value while respecting licenses and authors.
3. **Technologies and integrations** — Developing tools, SDKs, systems and integrations that make the work of developers and companies easier.
4. **Technology products** — Commercializing software, offering specialized versions and building sustainable solutions with clear purpose and careful user experience.
5. **Technology recommendation and affiliation** — Selecting and recommending computer equipment by evaluating technical specifications, performance, build quality and value for money. Recommendations are independent; we are not manufacturers or direct sellers.
6. **Technical consulting and support** — Analyzing needs, defining the right architecture and supporting teams during implementation and evolution.

## Leadership

- **Angello Aponte** — Founder & CEO. Software engineer focused on solving real problems with real solutions. Leads, codes and designs at 0NOXTACKORE, with a focus on high-performance software architecture, scalability and clean engineering.

## Official channels

- Website: ${siteUrl}
- GitHub: https://github.com/0noxtackore
- YouTube: https://www.youtube.com/@0noxtackore
- Facebook: https://www.facebook.com/people/0noxtackore/61567098773222/
- Instagram: https://www.instagram.com/0noxtackore.dev/

## Key URLs

- [Home (ES)](${siteUrl}/es)
- [Home (EN)](${siteUrl}/en)
- [About (ES)](${siteUrl}/es/acerca)
- [About (EN)](${siteUrl}/en/about)
- [Laptop buying guide (ES)](${siteUrl}/es/guia)
- [Laptop buying guide (EN)](${siteUrl}/en/guide)
- [Sitemap](${siteUrl}/sitemap.xml)
- [LLMs summary](${siteUrl}/llms.txt)

## Open-source projects

- Fluxckore — Windows cleaning and optimization utility: https://github.com/0noxtackore/Fluxckore
- Netckore — Windows network diagnostics and optimization tool: https://github.com/0noxtackore/Netckore

## Notes

- This file is intended for AI systems and LLM crawlers to better understand 0NOXTACKORE's identity, services, and official resources.
- For the latest content, use the canonical website URLs above.
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
