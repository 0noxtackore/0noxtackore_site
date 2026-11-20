<p align="center">
  <img src="public/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" width="320">
</p>

<p align="center">
  <strong>0NOXTACKORE — Built for impact.</strong><br>
  Official website source for 0NOXTACKORE, an independent technology studio focused on software engineering, open-source development, and practical technology solutions.
</p>

<p align="center">
  <a href="https://0noxtackore.makes.fyi"><img src="https://img.shields.io/badge/Live_Site-0noxtackore.makes.fyi-0078d4?style=for-the-badge" alt="Live site"></a>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
</p>

---

## About

**0NOXTACKORE** is an independent technology company dedicated to the engineering, development, and evolution of software solutions, as well as the careful selection and recommendation of technology products.

We build on existing advances, respect licenses and authors, and contribute improvements that solve real needs. Our work is guided by responsible innovation, collaboration, transparency, and continuous improvement—technology with purpose, not technology for its own sake.

**Leadership:** Founded and led by **Angello Aponte** (Founder & CEO), 0NOXTACKORE operates as an indie technology studio with a hands-on focus on high-performance software architecture, clean engineering, and scalable systems.

## What we do

- **Software development** — Applications and tools designed around real-world use, from concept to maintainable, evolving products.
- **Open-source engineering** — Studying, adapting, and improving existing technologies while respecting licenses and authors.
- **Technologies & integrations** — Tools, SDKs, systems, and integrations that support developers and organizations.
- **Technology products** — Purpose-driven software and sustainable solutions with a clear user experience.
- **Technology recommendations & affiliation** — Independent evaluation of devices based on specifications, performance, build quality, and value for money.
- **Technical consulting & support** — Architecture, implementation guidance, and ongoing technical accompaniment.

## This website

This repository contains the source code for the official 0NOXTACKORE website.

- **Production:** [https://0noxtackore.makes.fyi](https://0noxtackore.makes.fyi)
- **Locales:** Spanish (`/es`, default) and English (`/en`) with localized routes, metadata, hreflang, and structured data
- **Key pages:** Home, About (`/acerca`), and a practical laptop buying guide (`/guia`)
- **SEO & metadata:** Open Graph/Twitter cards, sitemap, robots, JSON-LD (Organization, WebSite, FAQPage, ProfilePage), and IndexNow support

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), TypeScript (strict)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Base UI primitives)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Analytics & performance:** Vercel Analytics, Vercel Speed Insights
- **Deployment:** [Vercel](https://vercel.com/)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 24+
- npm

### Install

```bash
git clone https://github.com/0noxtackore/0noxtackore_site.git
cd 0noxtackore_site
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality checks & build

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript (tsc --noEmit)
npm run build      # Production build
npm run check      # lint + typecheck + build
```

### Other scripts

```bash
npm run indexnow   # Submit URLs via IndexNow (when configured)
```

## Project structure

```text
0noxtackore_site/
├── src/
│   ├── app/                  # Next.js App Router routes, layouts, and metadata
│   ├── components/
│   │   ├── sites/0noxtackore/  # Site-specific components, content, and styles
│   │   └── ui/                 # Shared UI primitives
│   └── lib/                    # Utilities (i18n, helpers)
├── public/
│   └── sites/0noxtackore/      # Static assets (images, media, OG/branding)
├── docs/                       # Research, references, and project notes
├── scripts/                    # Maintenance scripts (e.g. IndexNow)
└── next.config.ts
```

## Official channels

- **Website:** [0noxtackore.makes.fyi](https://0noxtackore.makes.fyi)
- **GitHub:** [github.com/0noxtackore](https://github.com/0noxtackore)
- **YouTube:** [youtube.com/@0noxtackore](https://www.youtube.com/@0noxtackore)
- **Instagram:** [instagram.com/0noxtackore.dev](https://www.instagram.com/0noxtackore.dev/)
- **Facebook:** [0noxtackore](https://www.facebook.com/people/0noxtackore/61567098773222/)

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <img src="public/sites/0noxtackore/og/Branding_0noxtackore.png" alt="Branding 0noxtackore" width="100%"><br>
  <strong>This website is part of the 0noxtackore technology company.</strong>
</p>

<p align="center">
  <strong>Made with precision. Optimized for performance.</strong>
</p>
