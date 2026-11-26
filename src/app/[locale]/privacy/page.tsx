import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Privacy } from "@/components/sites/0noxtackore/Privacy";
import { getContent } from "@/components/sites/0noxtackore/content";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : "en";
  const page = getContent(locale).pages.privacidad;
  const canonical = locale === "en" ? "/en/privacy" : "/es/privacidad";
  return {
    title: `${page.title} | 0NOXTACKORE`,
    description: page.description,
    alternates: {
      canonical,
      languages: { es: "/es/privacidad", en: "/en/privacy", "x-default": "/es/privacidad" },
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  if (value === "es") redirect("/es/privacidad");
  return <Privacy locale="en" />;
}
