import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionPage } from "./SectionPage";
import { sectionMeta, type SectionKey } from "./section-meta";
import { getPageSlug, isLocale, type Locale } from "@/lib/i18n";

type PageKey = "filosofia" | "recomendaciones" | "confianza" | "proyectos" | "contacto" | "areas";

type Props = { params: Promise<{ locale: string }> };

export function makeSectionRoute(section: SectionKey, pageKey: PageKey) {
  return {
    generateMetadata: async ({ params }: Props): Promise<Metadata> => {
      const { locale: value } = await params;
      const locale: Locale = isLocale(value) ? value : "es";
      const meta = sectionMeta(locale, section);
      const canonical = `/${locale}/${getPageSlug(locale, pageKey)}`;
      return {
        title: `${meta.title} | 0NOXTACKORE`,
        description: meta.description,
        alternates: {
          canonical,
          languages: {
            es: `/es/${getPageSlug("es", pageKey)}`,
            en: `/en/${getPageSlug("en", pageKey)}`,
            "x-default": `/es/${getPageSlug("es", pageKey)}`,
          },
        },
        robots: { index: true, follow: true },
      };
    },
    default: async ({ params }: Props) => {
      const { locale: value } = await params;
      if (!isLocale(value)) notFound();
      return <SectionPage locale={value} section={section} />;
    },
  };
}
