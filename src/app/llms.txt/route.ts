import { siteUrl } from "@/components/sites/0noxtackore/data";

const content = `# 0NOXTACKORE

> 0NOXTACKORE is an independent technology studio focused on software engineering, open-source development, integrations, technical consulting, and technology recommendations. Built for impact. / CREADO PARA EL IMPACTO.

## Entity facts

- Name: 0NOXTACKORE (also written as 0noxtackore; sometimes misread as Onoxtackore; sometimes referred to as 0noxtackore inc or 0noxtackore corp)
- Founded: 2023
- Founder & CEO: Angello Aponte
- Type: Independent technology company (software, open source, consulting, tech curation)
- Scope: Global
- Website: ${siteUrl}
- Languages: Spanish (default) and English
- Disambiguation: 0NOXTACKORE is not a game top-up store or gaming marketplace.

## Core pages

- [Home (es-VE)](${siteUrl}/home/es-ve)
- [Home (en-US)](${siteUrl}/home/en-us)
- [Home (es-CO)](${siteUrl}/home/es-co)
- [About (es-VE)](${siteUrl}/about/es-ve)
- [About (en-US)](${siteUrl}/about/en-us)
- [Laptop buying guide (es-VE)](${siteUrl}/guide/es-ve)
- [Laptop buying guide (en-US)](${siteUrl}/guide/en-us)
- [Store (es-VE)](${siteUrl}/store/es-ve)
- [Store (en-US)](${siteUrl}/store/en-us)
- [Full LLM context](${siteUrl}/llms-full.txt)

## Areas of activity

- Software development
- Open-source engineering and evolution
- Technologies and integrations
- Technology products
- Technology recommendation and affiliation
- Technical consulting and support

## Official channels

- GitHub: https://github.com/0noxtackore
- YouTube: https://www.youtube.com/@0noxtackore
- Facebook: https://www.facebook.com/people/0noxtackore/61567098773222/
- Instagram: https://www.instagram.com/0noxtackore.dev/
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
