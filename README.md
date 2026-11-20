<div align="center">

<img src="public/sites/0noxtackore/og/Branding_0noxtackore.png" alt="0NOXTACKORE branding" width="900" />

# 0NOXTACKORE

**Built for impact.**

Independent technology studio focused on software engineering, open-source development, and practical technology solutions.

[Live site](https://0noxtackore.makes.fyi) · [GitHub](https://github.com/0noxtackore) · [YouTube](https://www.youtube.com/@0noxtackore)

</div>

---

## About

**0NOXTACKORE** is an independent technology company dedicated to the engineering, development, and evolution of software solutions, as well as the careful selection and recommendation of technology products.

We work with our own technologies and open-source projects to build tools, applications, and integrations that solve real problems, improve processes, and make technology more accessible and useful. Our approach is guided by responsible innovation, collaboration, transparency, and continuous improvement—building on existing advances and contributing meaningful improvements with purpose.

**Leadership:** Founded and led by **Angello Aponte** (Founder & CEO), 0NOXTACKORE operates as an indie technology studio with a hands-on focus on high-performance software architecture, clean engineering, and scalable systems.

## What we do

- **Software development** — Applications and tools designed around real-world use, from concept to maintainable, evolving products.
- **Open-source engineering** — Studying, adapting, and improving existing technologies while respecting licenses and authors.
- **Technologies & integrations** — Tools, SDKs, systems, and integrations that support developers and organizations.
- **Technology products** — Purpose-driven software and sustainable solutions with a clear user experience.
- **Technology recommendations & affiliation** — Independent evaluation of devices based on specifications, performance, build quality, and value for money.
- **Technical consulting & support** — Architecture, implementation guidance, and ongoing technical accompaniment.

## This repository

This repository contains the source code for the official 0NOXTACKORE website:

- **Production:** [https://0noxtackore.makes.fyi](https://0noxtackore.makes.fyi)
- **Locales:** Spanish (`/es`, default) and English (`/en`) with localized metadata, hreflang, and structured data
- **Focus:** Brand presence, philosophy, areas of activity, project showcase, and practical resources (including a laptop buying guide)

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), TypeScript (strict)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Base UI primitives), `cn()` utility
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
src/
  app/                  # Next.js App Router routes and metadata
  components/
    sites/0noxtackore/  # Site-specific components, content, and styles
    ui/                 # Shared UI primitives
  lib/                  # Utilities (i18n, helpers)
public/
  sites/0noxtackore/    # Static assets (images, media, OG/branding)
docs/                   # Research, references, and project notes
scripts/                # Maintenance scripts (e.g. IndexNow)
```

## Official channels

- Website: [0noxtackore.makes.fyi](https://0noxtackore.makes.fyi)
- GitHub: [github.com/0noxtackore](https://github.com/0noxtackore)
- YouTube: [youtube.com/@0noxtackore](https://www.youtube.com/@0noxtackore)
- Instagram: [instagram.com/0noxtackore.dev](https://www.instagram.com/0noxtackore.dev/)
- Facebook: [0noxtackore](https://www.facebook.com/people/0noxtackore/61567098773222/)

## License

This project is licensed under the [MIT License](LICENSE).
