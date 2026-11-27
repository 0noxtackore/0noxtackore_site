import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AreaPage } from "@/components/sites/0noxtackore/AreaPage";
import { getContent } from "@/components/sites/0noxtackore/content";
import { getAreaKey, getAreaSlug, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value, slug } = await params;
  const locale: Locale = isLocale(value) ? value : "es";
  const key = getAreaKey(slug);
  const area = key ? getContent(locale).areas.find((item) => item.slug === key) : null;
  const title = area?.title ?? (locale === "es" ? "Área" : "Area");
  const canonical = `/${locale}/areas/${key ? getAreaSlug(locale, key) : slug}`;
  return {
    title: `${title} | 0NOXTACKORE`,
    description: area?.description ?? title,
    alternates: {
      canonical,
      languages: {
        es: `/es/areas/${key ? getAreaSlug("es", key) : slug}`,
        en: `/en/areas/${key ? getAreaSlug("en", key) : slug}`,
        "x-default": `/es/areas/${key ? getAreaSlug("es", key) : slug}`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function AreaRoute({ params }: Props) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) notFound();
  const key = getAreaKey(slug);
  if (!key) notFound();
  return <AreaPage locale={value} areaSlug={key} />;
}
