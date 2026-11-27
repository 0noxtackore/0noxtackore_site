import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { About } from "@/components/sites/0noxtackore/About";
import { getContent } from "@/components/sites/0noxtackore/content";
import { Guia } from "@/components/sites/0noxtackore/Guia";
import { Privacy } from "@/components/sites/0noxtackore/Privacy";
import { SectionPage } from "@/components/sites/0noxtackore/SectionPage";
import { sectionMeta, type SectionKey } from "@/components/sites/0noxtackore/section-meta";
import { Site } from "@/components/sites/0noxtackore/Site";
import { Store } from "@/components/sites/0noxtackore/Store";
import { getActiveProducts } from "@/lib/store/products";
import { INDEXED_LOCALES, isIndexedLocale, isSiteLocale, languageOf, sitePath, type PageKey } from "@/lib/i18n";

type Props = { params: Promise<{ page: string; siteLocale: string }> };

const PAGE_MAP: Record<string, PageKey | "home"> = {
  home: "home",
  guide: "guia",
  about: "acerca",
  store: "tienda",
  philosophy: "filosofia",
  recommendations: "recomendaciones",
  trust: "confianza",
  projects: "proyectos",
  contact: "contacto",
  privacy: "privacidad",
  areas: "areas",
};

const SECTION_MAP: Partial<Record<PageKey, SectionKey>> = {
  filosofia: "filosofia",
  recomendaciones: "recomendaciones",
  confianza: "confianza",
  proyectos: "proyectos",
  contacto: "contacto",
  areas: "areas",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: pageName, siteLocale: value } = await params;
  if (!isSiteLocale(value) || !PAGE_MAP[pageName]) return {};
  const locale = languageOf(value);
  const content = getContent(locale, value);
  const key = PAGE_MAP[pageName];
  const canonical = sitePath(key, value);

  let title = content.metadata.home.title;
  let description = content.metadata.home.description;
  if (key === "guia") { title = content.pages.guia.title; description = content.pages.guia.description; }
  if (key === "acerca") { title = content.pages.acerca.title; description = content.pages.acerca.description; }
  if (key === "tienda") { title = content.metadata.tienda.title; description = content.metadata.tienda.description; }
  if (key === "privacidad") { title = content.pages.privacidad.title; description = content.pages.privacidad.description; }
  const section = SECTION_MAP[key];
  if (section) { const meta = sectionMeta(locale, section); title = meta.title; description = meta.description; }

  return {
    title: `${title} | 0NOXTACKORE`,
    description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(INDEXED_LOCALES.map((loc) => [loc, sitePath(key, loc)])),
        "x-default": sitePath(key, "es-ve"),
      },
    },
    robots: { index: isIndexedLocale(value), follow: true },
  };
}

export default async function PageRoute({ params }: Props) {
  const { page: pageName, siteLocale: value } = await params;
  if (!isSiteLocale(value)) notFound();
  const key = PAGE_MAP[pageName];
  if (!key) notFound();
  const locale = languageOf(value);

  if (key === "home") return <Site locale={locale} siteLocale={value} />;
  if (key === "guia") return <Guia locale={locale} siteLocale={value} />;
  if (key === "acerca") return <About locale={locale} siteLocale={value} />;
  if (key === "privacidad") return <Privacy locale={locale} siteLocale={value} />;

  const section = SECTION_MAP[key];
  if (section) return <SectionPage locale={locale} section={section} siteLocale={value} />;

  if (key === "tienda") {
    const products = await getActiveProducts();
    return <Store locale={locale} products={products} siteLocale={value} />;
  }

  notFound();
}
