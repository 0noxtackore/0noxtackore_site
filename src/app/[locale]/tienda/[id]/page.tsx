import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ProductDetail } from "@/components/sites/0noxtackore/ProductDetail";
import { getContent } from "@/components/sites/0noxtackore/content";
import { getPagePath, isLocale, type Locale } from "@/lib/i18n";
import { getActiveProducts } from "@/lib/store/products";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value, id } = await params;
  const locale: Locale = isLocale(value) ? value : "es";
  const content = getContent(locale);
  const products = await getActiveProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return { title: content.pages.tienda.title };
  const name = locale === "es" ? product.nameEs : product.nameEn;
  const description = locale === "es" ? product.descriptionEs : product.descriptionEn;
  const canonical = `${getPagePath(locale, "tienda")}/${id}`;
  return {
    title: `${name} | 0NOXTACKORE`,
    description,
    alternates: {
      canonical,
      languages: {
        es: `${getPagePath("es", "tienda")}/${id}`,
        en: `${getPagePath("en", "tienda")}/${id}`,
        "x-default": `${getPagePath("es", "tienda")}/${id}`,
      },
    },
    openGraph: {
      type: "website",
      title: `${name} | 0NOXTACKORE`,
      description,
      url: canonical,
      siteName: "0NOXTACKORE",
      images: [{ url: product.imageUrl || content.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | 0NOXTACKORE`,
      description,
      images: [product.imageUrl || content.ogImage],
    },
  };
}

export default async function TiendaDetailPage({ params }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "en") redirect(`${getPagePath("en", "tienda")}/${id}`);
  const products = await getActiveProducts();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  const similar = products.filter((p) => p.id !== id && p.category === product.category).slice(0, 4);
  return <ProductDetail locale="es" product={product} similar={similar} />;
}
