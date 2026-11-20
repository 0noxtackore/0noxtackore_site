import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { About } from "@/components/sites/0noxtackore/About";
import { getContent } from "@/components/sites/0noxtackore/content";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : "es";
  const content = getContent(locale);
  const meta = content.metadata.acerca;

  return {
    title: `${meta.title} | 0NOXTACKORE`,
    description: meta.description,
    alternates: {
      canonical: `/${locale}/acerca`,
      languages: { es: "/es/acerca", en: "/en/acerca", "x-default": "/es/acerca" },
    },
    openGraph: {
      type: "profile",
      title: `${meta.title} | 0NOXTACKORE`,
      description: meta.description,
      url: `/${locale}/acerca`,
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

export default async function AcercaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <About locale={locale} />;
}
