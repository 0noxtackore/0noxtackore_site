import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Store } from "@/components/sites/0noxtackore/Store";
import { getContent } from "@/components/sites/0noxtackore/content";
import { getPagePath, isLocale, type Locale } from "@/lib/i18n";
import { getActiveProducts } from "@/lib/store/products";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : "en";
  const content = getContent(locale);
  const meta = content.metadata.tienda;
  const canonical = getPagePath(locale, "tienda");

  return {
    title: `${meta.title} | 0NOXTACKORE`,
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        es: getPagePath("es", "tienda"),
        en: getPagePath("en", "tienda"),
        "x-default": getPagePath("es", "tienda"),
      },
    },
    openGraph: {
      type: "website",
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

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "es") redirect(getPagePath("es", "tienda"));
  const products = await getActiveProducts();
  return <Store locale="en" products={products} />;
}
