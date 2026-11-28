import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AreaPage } from "@/components/sites/0noxtackore/AreaPage";
import { getContent } from "@/components/sites/0noxtackore/content";
import { ProductDetail } from "@/components/sites/0noxtackore/ProductDetail";
import { getActiveProductById, getActiveProducts } from "@/lib/store/products";
import { defaultSiteLocale, INDEXED_LOCALES, getAreaKey, isIndexedLocale, isSiteLocale, languageOf, siteAreaPath, siteProductPath } from "@/lib/i18n";

type Props = { params: Promise<{ page: string; siteLocale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page, siteLocale: value, slug } = await params;
  if (!isSiteLocale(value)) return {};
  const locale = languageOf(value);

  if (page === "store") {
    if (value !== "es-ve" && value !== "en-us") return {};
    const product = await getActiveProductById(slug);
    if (!product) return {};
    const name = locale === "es" ? product.nameEs : product.nameEn;
    const canonical = siteProductPath(slug, value);
    return {
      title: `${name} | 0NOXTACKORE`,
      description: locale === "es" ? product.descriptionEs : product.descriptionEn,
      alternates: {
        canonical,
        languages: {
          "es-VE": siteProductPath(slug, "es-ve"),
          "en-US": siteProductPath(slug, "en-us"),
          "x-default": siteProductPath(slug, "es-ve"),
        },
      },
      robots: { index: isIndexedLocale(value), follow: true },
    };
  }

  if (page === "areas") {
    const key = getAreaKey(slug);
    const area = key ? getContent(locale, value).areas.find((item) => item.slug === key) : null;
    if (!area || !key) return {};
    const canonical = siteAreaPath(key, value);
    return {
      title: `${area.title} | 0NOXTACKORE`,
      description: area.description,
      alternates: {
        canonical,
        languages: {
          ...Object.fromEntries(INDEXED_LOCALES.map((loc) => [loc, siteAreaPath(key, loc)])),
          "x-default": siteAreaPath(key, "es-ve"),
        },
      },
      robots: { index: isIndexedLocale(value), follow: true },
    };
  }

  return {};
}

export default async function DetailRoute({ params }: Props) {
  const { page, siteLocale: value, slug } = await params;
  if (!isSiteLocale(value)) notFound();
  const locale = languageOf(value);

  if (page === "store") {
    if (value !== "es-ve" && value !== "en-us") {
      redirect(siteProductPath(slug, defaultSiteLocale[languageOf(value)]));
    }
    const product = await getActiveProductById(slug);
    if (!product) notFound();
    const products = await getActiveProducts();
    const similar = products.filter((p) => p.id !== slug && p.category === product.category).slice(0, 8);
    return <ProductDetail locale={locale} product={product} similar={similar} siteLocale={value} />;
  }

  if (page === "areas") {
    const key = getAreaKey(slug);
    if (!key) notFound();
    return <AreaPage locale={locale} areaSlug={key} siteLocale={value} />;
  }

  notFound();
}
