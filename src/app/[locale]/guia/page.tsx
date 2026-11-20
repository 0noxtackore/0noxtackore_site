import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Guia } from "@/components/sites/0noxtackore/Guia";
import { getContent } from "@/components/sites/0noxtackore/content";
import { getPagePath, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : "es";
  const content = getContent(locale);
  const meta = content.metadata.guia;
  const canonical = getPagePath(locale, "guia");

  return {
    title: `${meta.title} | 0NOXTACKORE`,
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        es: getPagePath("es", "guia"),
        en: getPagePath("en", "guia"),
        "x-default": getPagePath("es", "guia"),
      },
    },
    openGraph: {
      type: "article",
      title: `${meta.title} | 0NOXTACKORE`,
      description: meta.description,
      url: canonical,
      siteName: "0NOXTACKORE",
      images: [{ url: content.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | 0NOXTACKORE`,
      description: meta.description,
      images: [content.ogImage],
    },
  };
}

export default async function GuiaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "en") redirect(getPagePath("en", "guia"));
  return <Guia locale="es" />;
}
